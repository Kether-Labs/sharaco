// app/dashboard/quotes/create/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TemplateSelector } from "@/features/templates/components/TemplateSelector";
import { quotesApi } from "@/features/quotes/api/quotesApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "@/features/projects/api/projectsApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function QuoteBuilderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();

    const isChoosing = searchParams.has('choose-template');
    const [isCreating, setIsCreating] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");

    // Charger les projets
    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: () => projectsApi.getAll(),
    });

    if (!isChoosing) {
        return <TemplateSelector onSelect={handleSelectTemplate} />;
    }

    async function handleSelectTemplate(layoutStyle: string) {
        setIsCreating(true);

        try {
            // ✅ Créer le document avec le projet sélectionné
            const document = await quotesApi.create({
                type: "DEVIS",
                layout_style: layoutStyle,
                project_id: selectedProjectId || undefined, // ← Projet optionnel
                items: [{
                    description: "",
                    quantity: 1,
                    unit_price_cents: 0,
                    tax_rate: 20
                }],
                notes: ""
            });

            router.push(`/dashboard/quotes/${document.id}`);

        } catch (error: any) {
            console.error("❌ Erreur création:", error);

            toast({
                title: "Erreur",
                description: error.response?.data?.detail || "Impossible de créer le devis.",
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

    return (
        <div className="min-h-screen bg-zinc-950 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Sélecteur de projet */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Projet associé (optionnel)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label className="text-zinc-400 mb-2 block">Sélectionner un projet</Label>
                        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                <SelectValue placeholder="Aucun projet" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                                <SelectItem value="">Aucun projet</SelectItem>
                                {projects.map((project) => (
                                    <SelectItem key={project.id} value={project.id}>
                                        {project.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-zinc-500 mt-2">
                            Si vous sélectionnez un projet, le client sera automatiquement récupéré.
                        </p>
                    </CardContent>
                </Card>

                {/* Sélecteur de template */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Choisir un modèle</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TemplateSelector onSelect={handleSelectTemplate} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
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