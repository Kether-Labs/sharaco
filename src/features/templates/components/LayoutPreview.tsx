'use client';

import { useQuery } from '@tanstack/react-query';
import { templatesApi } from '../api/templatesApi';


interface LayoutPreviewProps {
    layoutId: 'classic' | 'modern' | 'minimal';
    className?: string;
}

export function LayoutPreview({ layoutId, className }: LayoutPreviewProps) {
    const { data: html, isLoading } = useQuery({
        queryKey: ['layout-preview', layoutId],
        queryFn: () => templatesApi.getLayoutPreview(layoutId),
        staleTime: 1000 * 60 * 10, // cache 10 min (le HTML ne change pas souvent)
    });

    if (isLoading) {
        return (
            <div className={`${className} flex items-center justify-center bg-slate-50 dark:bg-slate-900`}>
                <span className="text-slate-400 text-xs font-medium">Chargement du modèle...</span>
            </div>
        );
    }

    return (
        <iframe
            srcDoc={html}
            className={className}
            sandbox=""           // sécurité : pas de scripts, pas de navigation
            title={`Aperçu ${layoutId}`}
        />
    );
}