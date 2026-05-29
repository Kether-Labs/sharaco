"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Editor } from "@/features/quotes/components/QuoteBuilder/Editor"
import { TemplateSelector } from "@/features/templates/components/TemplateSelector"

function QuoteBuilderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isChoosing = searchParams.has('choose-template');
    const templateId = searchParams.get('template-id');

    useEffect(() => {
        // Redirection initiale si aucun paramètre n'est présent
        if (!isChoosing && !templateId) {
            router.replace('/dashboard/quotes/create?choose-template');
        }
    }, [isChoosing, templateId, router]);

    const handleSelectTemplate = (id: string) => {
        router.push(`/dashboard/quotes/create?template-id=${id}`);
    };

    if (isChoosing) {
        return <TemplateSelector onSelect={handleSelectTemplate} />;
    }

    if (templateId) {
        return (
            <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-950 font-sans">
                <Editor templateId={templateId} />
            </div>
        );
    }

    return null; // En cours de redirection ou état transitoire
}

export default function LiveQuoteBuilderPage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white">Chargement de l'éditeur...</div>}>
            <QuoteBuilderContent />
        </Suspense>
    )
}
