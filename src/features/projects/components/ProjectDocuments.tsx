// features/projects/components/ProjectDocuments.tsx
"use client"

import { useProjectDocuments } from "../hooks/useProjectDocuments"
import { QuoteList } from "@/features/quotes/components/QuoteList"
import { Loader2, Folder } from "lucide-react"

interface ProjectDocumentsProps {
    projectId: string;
}

export function ProjectDocuments({ projectId }: ProjectDocumentsProps) {
    const { data: documents = [], isLoading, refetch } = useProjectDocuments(projectId);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center min-h-[300px]">
                <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center opacity-60 pointer-events-none select-none h-full min-h-[400px]">
                <Folder className="w-24 h-24 mb-4 text-slate-300" strokeWidth={1} />
                <span className="text-lg font-bold tracking-wide text-slate-100">
                    Le projet est vide
                </span>
            </div>
        );
    }

    return (
        <QuoteList 
            quotes={documents} 
            onDeleteSuccess={refetch} 
            projectId={projectId} 
        />
    );
}