import { api } from '@/lib/api';
import type { Document, DocumentCreate, DocumentStatus } from '@/features/quotes/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const invoicesApi = {
    getAll: async (): Promise<Document[]> => {
        return api.get<Document[]>('/api/v1/documents?type=FACTURE');
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

    getPreview: async (id: string): Promise<string> => {
        return api.get<string>(`/api/v1/documents/${id}/preview`);
    },

    getPdfUrl: (id: string): string => {
        return `${API_URL}/api/v1/documents/${id}/pdf`;
    },
};