"use client"

import { Eye, Check, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useLayouts } from "@/features/templates/hooks/useTemplates"
import type { Layout } from "@/features/templates/types"
import { LayoutPreview } from "./LayoutPreview"
import { useRouter } from "next/navigation"

interface TemplateSelectorProps {
    onSelect: (layoutId: string) => void
}

function TemplateItem({ layout, onSelect }: {
    layout: Layout
    onSelect: (id: string) => void
}) {
    const router = useRouter()

    return (
        <div className="group relative flex flex-col gap-3">
            {/* Preview Area */}
            <div className="relative w-full aspect-[1/1.414] bg-white border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all duration-200 group-hover:border-sky-500/50 group-hover:shadow-md">
                <LayoutPreview
                    layoutId={layout.id as "classic" | "modern" | "minimal"}
                    className="w-full h-full  border-0 pointer-events-none"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3">
                    <Button
                        onClick={() => router.push(`/dashboard/templates/preview/${layout.id}`)}
                        size="sm"
                        className="w-32 bg-white text-slate-900 hover:bg-slate-100 font-semibold"
                    >
                        <Eye className="h-4 w-4 mr-2" /> Prévisualiser
                    </Button>
                    <Button
                        onClick={() => onSelect(layout.id)}
                        size="sm"
                        className="w-32 bg-sky-600 text-white hover:bg-sky-700 font-semibold"
                    >
                        <Check className="h-4 w-4 mr-2" /> Utiliser
                    </Button>
                </div>
            </div>

            {/* Label */}
            <div className="flex flex-col">
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                    {layout.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {layout.description}
                </p>
            </div>
        </div>
    )
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
    const { data: layouts, isLoading, error } = useLayouts()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 md:p-12 overflow-y-auto">
            <div className="w-full max-w-6xl flex flex-col gap-10 py-12">
                {/* Title */}
                <div className="text-center space-y-2">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Choisissez votre modèle
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Survolez un document pour le prévisualiser ou le sélectionner.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {isLoading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="w-full aspect-[1/1.414] rounded-none" />
                                <Skeleton className="h-5 w-1/2 rounded-none" />
                                <Skeleton className="h-4 w-full rounded-none" />
                            </div>
                        ))
                    ) : error ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-4">
                            <p className="text-rose-500 font-bold text-xl">Une erreur est survenue.</p>
                            <Button onClick={() => window.location.reload()} variant="outline">Réessayer</Button>
                        </div>
                    ) : (
                        layouts?.map((layout) => (
                            <TemplateItem
                                key={layout.id}
                                layout={layout}
                                onSelect={onSelect}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
