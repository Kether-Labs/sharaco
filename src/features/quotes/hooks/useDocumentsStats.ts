// features/quotes/hooks/useDocumentsStats.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface DocumentStats {
    by_status: Record<string, {
        count: number;
        total_cents: number;
    }>;
    total_documents: number;
    total_revenue_cents: number;
    conversion_rate: number;
}

export function useDocumentsStats() {
    return useQuery({
        queryKey: ['documents-stats'],
        queryFn: () => api.get<DocumentStats>('/api/v1/documents/stats'),
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 60 * 1000, // Refresh toutes les minutes
    });
}