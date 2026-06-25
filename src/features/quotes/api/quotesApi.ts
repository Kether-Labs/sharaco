// features/quotes/api/quotesApi.ts
import { api } from '@/lib/api';
import type { Document, DocumentCreate, DocumentStatus, DocumentPreviewRequest } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const quotesApi = {
    getAll: async (params?: { type?: string }): Promise<Document[]> => {
        const query = params?.type ? `?type=${params.type}` : '';
        return api.get<Document[]>(`/api/v1/documents${query}`);
    },

    getById: async (id: string): Promise<Document> => {
        return api.get<Document>(`/api/v1/documents/${id}`);
    },

    create: async (data: DocumentCreate): Promise<Document> => {
        return api.post<Document>('/api/v1/documents', data);
    },

    update: async (id: string, data: unknown): Promise<Document> => {
        return api.put<Document>(`/api/v1/documents/${id}`, data);
    },

    delete: async (id: string): Promise<void> => {
        return api.delete<void>(`/api/v1/documents/${id}`);
    },

    updateStatus: async (id: string, status: DocumentStatus): Promise<Document> => {
        return api.patch<Document>(`/api/v1/documents/${id}/status`, { status });
    },

    convertToInvoice: async (id: string): Promise<Document> => {
        return api.post<Document>(`/api/v1/documents/${id}/convert`);
    },

    getPreview: async (id: string): Promise<string> => {
        return api.get<string>(`/api/v1/documents/${id}/preview`);
    },

    /**
     * Récupère la preview PNG d'un document avec authentification.
     * Retourne un Blob URL utilisable dans <img src="...">.
     * ⚠️ IMPORTANT : L'appelant doit appeler URL.revokeObjectURL() pour libérer la mémoire.
     */
    getPreviewPngBlob: async (id: string): Promise<string> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('sharaco_token') : null;
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}/api/v1/documents/${id}/preview.png`, { 
            headers,
            cache: 'force-cache',
        });

        if (!res.ok) {
            throw new Error(`Erreur preview PNG (${res.status})`);
        }

        // Convertir en blob et créer un object URL
        const blob = await res.blob();
        return URL.createObjectURL(blob);
    },

    getPdfUrl: (id: string): string => {
        return `${API_URL}/api/v1/documents/${id}/pdf`;
    },

    downloadPdf: async (id: string, filename?: string): Promise<void> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('sharaco_token') : null;
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}/api/v1/documents/${id}/pdf`, { headers });

        if (!res.ok) {
            throw new Error(`Erreur lors du téléchargement du PDF (${res.status})`);
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `devis-${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },

    downloadPreviewPdf: async (previewData: DocumentPreviewRequest): Promise<Blob> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('sharaco_token') : null;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const cacheBuster = `_t=${Date.now()}`;

        const res = await fetch(`${API_URL}/api/v1/documents/preview/pdf?${cacheBuster}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(previewData),
        });

        if (!res.ok) {
            const errorText = await res.text().catch(() => '');
            throw new Error(`Erreur lors de la génération du PDF (${res.status}): ${errorText}`);
        }

        return res.blob();
    },
};