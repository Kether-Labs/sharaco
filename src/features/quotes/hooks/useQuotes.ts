// features/quotes/hooks/useQuotes.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { quotesApi } from '../api/quotesApi';
import { DocumentType } from '../types';

export function useQuotes(params?: {
    type?: DocumentType;
    project_id?: string;  // ✅ NOUVEAU
}) {
    return useQuery({
        queryKey: ['documents', params],
        queryFn: () => quotesApi.getAll(params),
        staleTime: 5 * 60 * 1000,
    });
}