'use client';

import { useQuery } from '@tanstack/react-query';
import { quotesApi } from '../api/quotesApi';
import { DocumentType } from '../types';

export function useQuotes(type?: DocumentType) {
    return useQuery({
        queryKey: ['documents', type],
        queryFn: () => quotesApi.getAll(type ? { type } : undefined),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
