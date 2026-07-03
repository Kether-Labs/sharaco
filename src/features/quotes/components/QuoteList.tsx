// components/quotes/QuoteList.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    Filter,
    ChevronDown,
    CalendarDays,
    MoreVertical,
    ArrowUpRight,
    Plus,
    FileText,
    FileCheck,
    Eye,
    CreditCard,
    Ban,
    Trash2,
    Loader2
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Document, DocumentStatus } from "../types"
import { formatCurrency } from "../lib/formatCurrency"
import Link from "next/link"
import { DocumentPreview } from "./DocumentPreview"
import { quotesApi } from "../api/quotesApi"
import { useDeleteDocument } from "../hooks/useDeleteDocument"

interface QuoteListProps {
    quotes: Document[],
    onDeleteSuccess?: () => void
}

const statusConfig: Record<DocumentStatus, { bg: string, border: string, text: string, dot: string, label: string, icon: any }> = {
    PAID: {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-700 dark:text-emerald-400",
        dot: "bg-emerald-500",
        label: "Payé",
        icon: CreditCard
    },
    CANCELLED: {
        bg: "bg-rose-500/10",
        border: "border-rose-500/30",
        text: "text-rose-700 dark:text-rose-400",
        dot: "bg-rose-500",
        label: "Annulé",
        icon: Ban
    },
    SENT: {
        bg: "bg-sky-500/10",
        border: "border-sky-500/30",
        text: "text-sky-700 dark:text-sky-400",
        dot: "bg-sky-500",
        label: "Envoyé",
        icon: FileCheck
    },
    VIEWED: {
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        text: "text-amber-700 dark:text-amber-400",
        dot: "bg-amber-500",
        label: "Consulté",
        icon: Eye
    },
    DRAFT: {
        bg: "bg-slate-500/10",
        border: "border-slate-500/30",
        text: "text-slate-700 dark:text-slate-400",
        dot: "bg-slate-500",
        label: "Brouillon",
        icon: FileText
    }
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
}

export function QuoteList({ quotes, onDeleteSuccess }: QuoteListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const { deleteDocument, isDeleting } = useDeleteDocument({
        onSuccess: () => {
            onDeleteSuccess?.()
            setDeletingId(null)
        },
    })

    const handleDelete = async (quote: Document) => {
        setDeletingId(quote.id)
        await deleteDocument(quote.id, quote.number)
    }

    const filteredQuotes = quotes.filter(quote =>
        quote.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.number?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    console.log(quotes)
    const handleDownloadPdf = async (id: string, number?: string) => {
        try {
            await quotesApi.downloadPdf(id, `${number || 'devis'}.pdf`)
        } catch (error) {
            console.error('Erreur téléchargement PDF:', error)
        }
    }

    if (quotes.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-12 md:p-24 text-center bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl"
            >
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                    <div className="relative w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                        <Plus className="h-12 w-12 text-emerald-500" />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Aucun devis pour le moment</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-10 text-lg leading-relaxed">
                    Commencez par créer votre premier devis professionnel en quelques clics.
                </p>
                <Link href="/dashboard/quotes/create">
                    <Button className="bg-sky-600 cursor-pointer hover:bg-sky-700 text-white shadow-lg shadow-sky-500/25 border-0 transition-all active:scale-95 group">
                        <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-semibold tracking-wide">Créer un nouveau devis</span>
                    </Button>
                </Link>
            </motion.div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Filtering Header */}


            {/* Quote Cards */}
            {filteredQuotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-center">
                    <Search className="h-12 w-12 text-slate-300 mb-4" />
                    <h4 className="text-xl font-semibold">Aucun résultat</h4>
                    <p className="text-slate-500">Essayez d'ajuster vos filtres de recherche.</p>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredQuotes.map((quote) => {
                            const config = statusConfig[quote.status]
                            const StatusIcon = config.icon
                            const isBeingDeleted = deletingId === quote.id
                            return (
                                <motion.div
                                    key={quote.id}
                                    variants={cardVariants}
                                    layout
                                    className={`group relative bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300 ${isBeingDeleted ? 'opacity-50 pointer-events-none' : ''
                                        }`}
                                >
                                    {/* Preview Image */}
                                    <div className="relative">
                                        <DocumentPreview
                                            documentId={quote.id}
                                            layoutStyle={quote.layout_style}
                                        />

                                        {/* Status Badge Overlay */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <Badge
                                                variant="outline"
                                                className={`rounded-xl px-3 py-1 text-[10px] uppercase font-bold tracking-tight backdrop-blur-sm ${config.bg} ${config.text} ${config.border}`}
                                            >
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {config.label}
                                            </Badge>
                                        </div>

                                        {/* Action Menu */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="rounded-full h-8 w-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-600 hover:bg-white dark:hover:bg-slate-900"
                                                        disabled={isBeingDeleted}
                                                    >
                                                        {isBeingDeleted ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <MoreVertical className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/quotes/${quote.id}`} className="cursor-pointer">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Voir le devis
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDownloadPdf(quote.id, quote.number)}
                                                        className="cursor-pointer"
                                                    >
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        Télécharger PDF
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(quote)}
                                                        className="text-rose-500 focus:text-rose-500 focus:bg-rose-500/10 cursor-pointer"
                                                        disabled={isDeleting}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Supprimer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                <span>{quote.number || `DEV-${quote.id.slice(0, 4)}`}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                                                {quote.client?.name || "Client Inconnu"}
                                            </h3>
                                        </div>

                                        <div className="pt-2">
                                            <p className="text-3xl font-black text-slate-900 dark:text-white">
                                                {formatCurrency(quote.grand_total_cents || 0)}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                                            <div className="flex items-center text-xs font-medium text-slate-500">
                                                <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                                                {new Date(quote.created_at).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "short"
                                                })}
                                            </div>
                                            <div className="flex items-center text-xs font-medium text-slate-400">
                                                <FileText className="mr-1.5 h-3.5 w-3.5" />
                                                {quote.layout_style || 'classic'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Overlay Link */}
                                    <Link
                                        href={`/dashboard/quotes/${quote.id}`}
                                        className="absolute inset-0 z-0 cursor-pointer"
                                    />

                                    {/* Hover Arrow */}
                                    <div className="absolute right-6 bottom-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all z-20 pointer-events-none">
                                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                            <ArrowUpRight className="h-5 w-5" />
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    )
}