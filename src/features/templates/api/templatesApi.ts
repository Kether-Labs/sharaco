import { api } from '@/lib/api';
import type { DocumentTemplate, TemplateCreate, TemplateUpdate } from '../types';

export const templatesApi = {
    getAll: async (): Promise<DocumentTemplate[]> => {
        return api.get<DocumentTemplate[]>('/api/v1/templates');
    },

    getById: async (id: string): Promise<DocumentTemplate> => {
        return api.get<DocumentTemplate>(`/api/v1/templates/${id}`);
    },

    getDefault: async (): Promise<DocumentTemplate> => {
        return api.get<DocumentTemplate>('/api/v1/templates/default');
    },

    getPreview: async (id: string): Promise<string> => {
        return api.get<string>(`/api/v1/templates/${id}/preview`);
    },

    create: async (data: TemplateCreate): Promise<DocumentTemplate> => {
        return api.post<DocumentTemplate>('/api/v1/templates', data);
    },

    update: async (id: string, data: TemplateUpdate): Promise<DocumentTemplate> => {
        return api.put<DocumentTemplate>(`/api/v1/templates/${id}`, data);
    },

    delete: async (id: string): Promise<void> => {
        return api.delete<void>(`/api/v1/templates/${id}`);
    },
};