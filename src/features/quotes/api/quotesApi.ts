import { api } from '@/lib/api';
import type { Document, DocumentCreate, DocumentStatus } from '../types';
import { DocumentPreviewRequest } from '@/features/templates/types';

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
        const token = localStorage.getItem('sharaco_token');
        const res = await fetch(`${API_URL}/api/v1/documents/${id}/preview`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erreur aperçu document');
        return res.text();
    },

    // 🔴 NOUVEAU — Live preview (éditeur temps réel)
    previewDocument: async (data: DocumentPreviewRequest): Promise<string> => {
        const token = localStorage.getItem('sharaco_token');
        const res = await fetch(`${API_URL}/api/v1/documents/preview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Erreur aperçu live');
        return res.text();
    },

    getPdfUrl: (id: string): string => {
        return `${API_URL}/api/v1/documents/${id}/pdf`;
    },

   downloadPreviewPdf: async (id: string, filename?: string): Promise<void> => {
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
};