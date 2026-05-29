"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Monitor, Smartphone, Tablet, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { LayoutPreview } from "./LayoutPreview"
import { useLayouts } from "../hooks/useTemplates"

interface TemplateVisualizerProps {
    layoutId: string
    onSelect: (id: string) => void
}

export function TemplateVisualizer({ layoutId, onSelect }: TemplateVisualizerProps) {
    const router = useRouter()
    const { data: layouts } = useLayouts()
    const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")

    const currentLayout = layouts?.find(l => l.id === layoutId)

    if (!currentLayout) return null

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.back()}
                        className="text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Retour
                    </Button>
                    <div className="h-6 w-px bg-slate-700" />
                    <h1 className="text-white font-semibold">{currentLayout.name}</h1>
                </div>

                {/* View Switcher */}
                <div className="hidden md:flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700">
                    <Button
                        variant={viewMode === "desktop" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("desktop")}
                        className="rounded-md"
                    >
                        <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "tablet" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("tablet")}
                        className="rounded-md"
                    >
                        <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "mobile" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("mobile")}
                        className="rounded-md"
                    >
                        <Smartphone className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => onSelect(layoutId)}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6"
                    >
                        <Check className="h-4 w-4 mr-2" /> Utiliser ce modèle
                    </Button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-slate-950 overflow-auto p-8 flex justify-center items-start">
                <div 
                    className={`bg-white shadow-2xl transition-all duration-300 origin-top ${
                        viewMode === "desktop" ? "w-[1000px]" : 
                        viewMode === "tablet" ? "w-[768px]" : "w-[375px]"
                    }`}
                    style={{ aspectRatio: "1 / 1.414" }}
                >
                    <LayoutPreview 
                        layoutId={layoutId as any} 
                        className="w-full h-full border-0" 
                    />
                </div>
            </div>
        </div>
    )
}
