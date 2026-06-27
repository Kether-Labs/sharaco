// app/dashboard/quotes/create/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TemplateSelector } from "@/features/templates/components/TemplateSelector";

import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { quotesApi } from "@/features/quotes/api/quotesApi";

function QuoteBuilderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    
    const isChoosing = searchParams.has('choose-template');
    const [isCreating, setIsCreating] = useState(false);

    // Redirection initiale si aucun paramètre
    if (!isChoosing) {
        return <TemplateSelector onSelect={handleSelectTemplate} />;
    }

    async function handleSelectTemplate(layoutStyle: string) {
        setIsCreating(true);
        
        try {
            // ✅ Créer le document avec le layout_style choisi
            const document = await quotesApi.create({
                type: "DEVIS",
                layout_style: layoutStyle, // ← Layout choisi par l'utilisateur
                items: [{
                    description: "",
                    quantity: 1,
                    unit_price_cents: 0,
                    tax_rate: 20
                }],
                notes: ""
            });
            
            // ✅ Rediriger vers l'éditeur avec le VRAI ID du document
            router.push(`/dashboard/quotes/${document.id}`);
            
        } catch (error: any) {
            console.error("❌ Erreur création:", error);
            
            const errorMessage = error.response?.data?.detail || "Impossible de créer le devis.";
            
            toast({
                title: "Erreur",
                description: errorMessage,
                variant: "destructive",
            });
            
            setIsCreating(false);
        }
    }

    if (isCreating) {
        return (
            <div className="flex h-[100dvh] w-screen items-center justify-center bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
                    <p className="text-zinc-400 font-medium">Création du devis...</p>
                </div>
            </div>
        );
    }

    return <TemplateSelector onSelect={handleSelectTemplate} />;
}

export default function LiveQuoteBuilderPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white">
                Chargement...
            </div>
        }>
            <QuoteBuilderContent />
        </Suspense>
    );
}