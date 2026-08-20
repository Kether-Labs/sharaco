// features/projects/components/ProjectQuoteGrid.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProjectTreeResponse } from "../types"
import { QuoteCardWithInvoices } from "./QuoteCardWithInvoices"
import { FolderCard } from "./FolderCard"
import { InvoiceGrid } from "./InvoiceGrid"

interface ProjectQuoteGridProps {
    tree: ProjectTreeResponse;
    projectId: string;
    onRefresh?: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } }
}

export function ProjectQuoteGrid({ tree, projectId, onRefresh }: ProjectQuoteGridProps) {
    const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);

    // Vue factures (quand un dossier est ouvert)
    const expandedQuote = tree.quotes.find(q => q.id === expandedQuoteId);

    if (expandedQuote) {
        return (
            <InvoiceGrid
                quote={expandedQuote}
                onBack={() => setExpandedQuoteId(null)}
                onRefresh={onRefresh}
            />
        );
    }
    console.log(tree)
    return (
        <div className="space-y-6">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-4 md:gap-6"
            >
                {/* ═══════════ Nouveau Devis Card ═══════════ */}
                <motion.div variants={cardVariants} className="h-full">
                    <Link
                        href={`/dashboard/quotes/create?project_id=${projectId}`}
                        className="group flex flex-col h-full w-full"
                    >
                        <div className="w-full aspect-[4/5] rounded-2xl bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 flex flex-col items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-white/[0.05] group-hover:border-violet-500/30 group-hover:shadow-xl group-hover:shadow-violet-500/10 group-hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center text-white mb-3 shadow-[0_4px_15px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Nouveau devis
                            </span>
                        </div>
                        <div className="mt-3 opacity-0">
                            <h4 className="text-sm font-bold">X</h4>
                            <div className="text-[11px]">X</div>
                        </div>
                    </Link>
                </motion.div>

                {/* ═══════════ Devis + Dossiers Factures ═══════════ */}
                <AnimatePresence mode="popLayout">
                    {tree.quotes.map((quote) => {
                        const paidCount = quote.invoices.filter(i => i.status === "PAID").length;
                        const overdueCount = quote.invoices.filter(
                            i => i.status === "OVERDUE" || (i.days_late && i.days_late > 0)
                        ).length;

                        return (
                            <div key={quote.id} className="contents">
                                {/* Carte devis (preview PNG) */}
                                <QuoteCardWithInvoices
                                    quote={quote}
                                    variants={cardVariants}
                                    onExpand={() => setExpandedQuoteId(quote.id)}
                                />

                                {/* 📁 Dossier factures (si le devis a des factures) */}
                                {quote.invoices.length > 0 && (
                                    <FolderCard
                                        title={`Factures ${quote.number || ""}`}
                                        subtitle={tree.client_name || "Client"}
                                        invoiceCount={quote.invoices.length}
                                        paidCount={paidCount}
                                        overdueCount={overdueCount}
                                        onClick={() => setExpandedQuoteId(quote.id)}
                                        variants={cardVariants}
                                    />
                                )}
                            </div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {/* ═══════════ Factures standalone ═══════════ */}
            {tree.standalone_invoices.length > 0 && (
                <div className="mt-12">
                    <div className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase mb-4">
                        Factures hors devis ({tree.standalone_invoices.length})
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
                        {/* 📁 Dossier unique pour les factures standalone */}
                        <FolderCard
                            title="Factures hors devis"
                            subtitle="Sans devis parent"
                            invoiceCount={tree.standalone_invoices.length}
                            paidCount={tree.standalone_invoices.filter(i => i.status === "PAID").length}
                            overdueCount={tree.standalone_invoices.filter(i => i.status === "OVERDUE" || (i.days_late && i.days_late > 0)).length}
                            onClick={() => {
                                // Optionnel : ouvrir une vue spéciale standalone
                                // Pour l'instant, on peut juste linker vers /dashboard/invoices
                            }}
                            variants={cardVariants}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}