import { useState } from 'react';

import type { DocumentPreviewRequest } from '../types';
import { quotesApi } from '@/features/quotes/api/quotesApi';

/**
 * Hook pour télécharger le PDF d'un devis.
 * - Si le document est sauvegardé → GET /documents/{id}/pdf
 * - Si pas sauvegardé → POST /documents/preview/pdf (sans sauvegarde)
 */
export function useDownloadPdf() {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadPdf = async (
        previewData: DocumentPreviewRequest,
        documentId?: string | null,
        filename?: string
    ) => {
        setIsDownloading(true);
        try {
            let blob: Blob;

            if (documentId) {
                // Document sauvegardé → GET /pdf
                const token = localStorage.getItem('sharaco_token');
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${API_URL}/api/v1/documents/${documentId}/pdf`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Erreur téléchargement PDF');
                blob = await res.blob();
            } else {
                // Document non sauvegardé → POST /preview/pdf
                blob = await quotesApi.downloadPreviewPdf(previewData);
            }

            // Déclencher le téléchargement dans le navigateur
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || 'devis.pdf';
            document.body.appendChild(link);
            link.click();

            // Nettoyage
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            throw error;
        } finally {
            setIsDownloading(false);
        }
    };

    return { downloadPdf, isDownloading };
}