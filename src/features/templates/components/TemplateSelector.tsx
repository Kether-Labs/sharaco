"use client"

import * as React from "react"
import { Eye, Check, X, Sparkles, Layout as LayoutIcon, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useLayouts } from "@/features/templates/hooks/useTemplates"
import type { Layout } from "@/features/templates/types"
import { LayoutPreview } from "./LayoutPreview"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface TemplateSelectorProps {
    onSelect: (layoutId: string) => void
    onClose?: () => void
}

/**
 * Isolated Client Component for the Template Card to ensure high performance
 * and perpetual micro-interactions without parent re-renders.
 */
const TemplateCard = React.memo(({ 
    layout, 
    onSelect, 
    index 
}: { 
    layout: Layout
    onSelect: (id: string) => void
    index: number 
}) => {
    const router = useRouter()
    
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                show: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        delay: index * 0.1
                    }
                }
            }}
            whileHover={{ y: -8 }}
            className="group relative flex flex-col gap-6"
        >
            {/* Visual Label (Above the card for Bento 2.0 style) */}
            <div className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 mb-1">
                        Layout Style
                    </span>
                    <h3 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors duration-300">
                        {layout.name}
                    </h3>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200/50 dark:border-white/5">
                    <LayoutIcon className="h-4 w-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
                </div>
            </div>

            {/* Premium Container Area */}
            <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-slate-200/50 dark:border-white/5 bg-white dark:bg-slate-950 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] group-hover:shadow-2xl transition-all duration-500">
                {/* Perpetual Motion Background Glow */}
                <motion.div 
                    animate={{ 
                        opacity: [0.1, 0.2, 0.1],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-indigo-500/10 pointer-events-none"
                />

                <div className="absolute inset-4 overflow-hidden border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20">
                    <img
                        src={`http://localhost:8000/api/v1/templates/${layout.id}/preview.png`}
                        alt={`Template ${layout.id}`}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Hover Reveal Interface */}
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 gap-4 translate-y-4 group-hover:translate-y-0">
                    <div className="p-4 rounded-full bg-white/10 border border-white/20 mb-2">
                        <Sparkles className="h-6 w-6 text-sky-400" />
                    </div>
                    
                    <p className="text-white text-center text-sm font-medium max-w-[200px] mb-4">
                        {layout.description}
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <Button
                            onClick={() => onSelect(layout.id)}
                            className="w-full h-12 bg-sky-500 hover:bg-sky-400 text-white font-black rounded-2xl shadow-lg shadow-sky-500/30 transition-all active:scale-95 group/btn"
                        >
                            <Check className="h-4 w-4 mr-2" /> 
                            <span>Sélectionner</span>
                            <ArrowRight className="h-4 w-4 ml-auto opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                        </Button>
                        <Button
                            onClick={() => router.push(`/dashboard/templates/preview/${layout.id}`)}
                            variant="ghost"
                            className="w-full h-12 text-white hover:bg-white/10 font-bold rounded-2xl transition-all"
                        >
                            <Eye className="h-4 w-4 mr-2" /> Preview
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
})

TemplateCard.displayName = "TemplateCard"

export function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
    const { data: layouts, isLoading, error } = useLayouts()

    return (
        <div className="fixed inset-0 z-[60]  flex justify-center bg-slate-950/50 backdrop-blur-sm">
            {/* Main Scrollable Container */}
            <div className="w-full  h-[100vh] overflow-y-auto overflow-x-hidden py-12 md:py-24 px-4 md:px-8">
                {/* Close Button - Premium Glass Style */}
                {onClose && (
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="icon"
                        className="fixed top-8 right-8 z-[70] h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all active:scale-90"
                    >
                        <X className="h-6 w-6" />
                    </Button>
                )}

                <div className="flex mx-44  flex-col  gap-16">
                    {/* Title Section - Deterministic Typography */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-500 font-black text-[10px] uppercase tracking-[0.2em]"
                        >
                            <Sparkles className="h-3 w-3" />
                            <span>Professional Design</span>
                        </motion.div>
                        
                        <motion.h2 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                            className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-none max-w-4xl"
                        >
                            Choisissez votre <span className="text-sky-500">modèle.</span>
                        </motion.h2>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium tracking-tight max-w-2xl"
                        >
                            Survolez un document pour le prévisualiser ou le sélectionner. Tous nos modèles sont optimisés pour l'impression.
                        </motion.p>
                    </div>

                    {/* Grid - Staggered Orchestration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {isLoading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="space-y-6">
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-20 rounded-full" />
                                        <Skeleton className="h-8 w-48 rounded-xl" />
                                    </div>
                                    <Skeleton className="w-full aspect-[3/4] rounded-[2.5rem]" />
                                </div>
                            ))
                        ) : error ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full flex flex-col items-center justify-center py-24 text-center gap-6 glass-dark rounded-[3rem] p-12"
                            >
                                <div className="h-16 w-16 rounded-3xl bg-rose-500/10 flex items-center justify-center">
                                    <X className="h-8 w-8 text-rose-500" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white font-black text-2xl tracking-tighter">Échec de la récupération</p>
                                    <p className="text-slate-400 font-medium">Nous n'avons pas pu charger les modèles de documents.</p>
                                </div>
                                <Button 
                                    onClick={() => window.location.reload()} 
                                    className="h-12 px-8 rounded-2xl bg-white text-black font-black hover:bg-slate-200 transition-all active:scale-95"
                                >
                                    Réessayer
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial="hidden"
                                animate="show"
                                variants={{
                                    show: {
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                                className="contents"
                            >
                                {layouts?.map((layout, index) => (
                                    <TemplateCard
                                        key={layout.id}
                                        layout={layout}
                                        onSelect={onSelect}
                                        index={index}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </div>
                    
                    {/* Footer Tip */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex items-center justify-center gap-3 pt-8 pb-12"
                    >
                        <div className="h-px w-12 bg-slate-200 dark:white/10" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
                            Design Engine v2.0
                        </p>
                        <div className="h-px w-12 bg-slate-200 dark:bg-white/10" />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}