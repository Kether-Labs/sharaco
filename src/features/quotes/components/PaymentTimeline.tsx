// features/quotes/components/PaymentTimeline.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2, Clock, Circle, Loader2, FileText,
    AlertTriangle, Receipt, CreditCard, ArrowRight, Calendar,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { quotesApi } from "@/features/quotes/api/quotesApi";
import { formatCurrency } from "@/features/quotes/lib/formatCurrency";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Milestone {
    id: string;
    sequence: number;
    title: string;
    percent: number;
    amount_cents: number;
    description?: string;
    trigger_date?: string;
    status: "PENDING" | "INVOICED" | "PAID" | "CANCELLED";
    invoice_id?: string;
    invoiced_at?: string;
    paid_at?: string;
}

interface PaymentTimelineProps {
    quoteId: string;
    quoteNumber: string;
    milestones: Milestone[];
    quoteStatus: string;
    onUpdate: () => void;
}

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date(dateString));
};

export function PaymentTimeline({
    quoteId,
    quoteNumber,
    milestones,
    quoteStatus,
    onUpdate,
}: PaymentTimelineProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const sortedMilestones = [...milestones].sort((a, b) => a.sequence - b.sequence);
    
    // Calcul de la progression
    const paidMilestones = milestones.filter(m => m.status === "PAID");
    const totalPaidAmount = paidMilestones.reduce((sum, m) => sum + m.amount_cents, 0);
    const totalAmount = milestones.reduce((sum, m) => sum + m.amount_cents, 0);
    const progressPercent = totalAmount > 0 ? (totalPaidAmount / totalAmount) * 100 : 0;

    // Trouver la prochaine milestone facturable
    const getNextFacturableMilestone = (): Milestone | null => {
        for (const milestone of sortedMilestones) {
            if (milestone.status === "PENDING") {
                const prevIndex = milestone.sequence - 2;
                if (prevIndex >= 0) {
                    const prev = sortedMilestones[prevIndex];
                    if (prev.status !== "PAID") return null;
                }
                return milestone;
            }
        }
        return null;
    };

    const nextMilestone = getNextFacturableMilestone();
    const allPaid = milestones.length > 0 && milestones.every(m => m.status === "PAID");
    const isQuoteAccepted = quoteStatus === "ACCEPTED";

    const handleGenerateNext = async () => {
        if (!nextMilestone) return;
        
        setIsGenerating(true);
        try {
            const result = await quotesApi.generateNextInvoice(quoteId);
            toast({
                title: "✅ Facture créée avec succès",
                description: `${result.invoice_number} — ${result.milestone_title} (${result.milestone_percent}%)`,
            });
            onUpdate();
            
            setTimeout(() => {
                router.push(`/dashboard/invoices/${result.invoice_id}`);
            }, 800);
        } catch (err: any) {
            toast({
                title: "Erreur de génération",
                description: err.message || "Impossible de générer la facture.",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PAID": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case "INVOICED": return <Receipt className="h-4 w-4 text-sky-500" />;
            case "PENDING": return <Clock className="h-4 w-4 text-slate-400" />;
            default: return <Circle className="h-4 w-4 text-slate-300" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const config = {
            PAID: { label: "Payée", bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200/60 dark:border-emerald-500/30" },
            INVOICED: { label: "Facturée", bg: "bg-sky-50 dark:bg-sky-500/10", text: "text-sky-700 dark:text-sky-400", border: "border-sky-200/60 dark:border-sky-500/30" },
            PENDING: { label: "En attente", bg: "bg-slate-100 dark:bg-slate-800/50", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200/60 dark:border-slate-700/50" },
            CANCELLED: { label: "Annulée", bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-700 dark:text-rose-400", border: "border-rose-200/60 dark:border-rose-500/30" },
        }[status] || { label: status, bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" };
        
        return (
            <span className={cn("px-2.5 py-1 text-[10px] font-medium rounded-md border tracking-wide", config.bg, config.text, config.border)}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] backdrop-blur-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-sky-500" />
                        Échéancier de facturation
                    </h3>
                    <p className="text-sm text-slate-500 mt-1.5">
                        {milestones.length} tranche{milestones.length > 1 ? "s" : ""} • Total: <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">{formatCurrency(totalAmount)}</span>
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    {allPaid && isQuoteAccepted && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                Totalité réglée
                            </span>
                        </div>
                    )}

                    {isQuoteAccepted && nextMilestone && (
                        <Button
                            onClick={handleGenerateNext}
                            disabled={isGenerating}
                            size="sm"
                            className="h-9 bg-sky-600 hover:bg-sky-700 text-white font-medium shadow-sm transition-all rounded-lg px-4"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Création...
                                </>
                            ) : (
                                <>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Facturer l'étape {nextMilestone.sequence}
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {/* Barre de progression */}
            <div className="mb-8">
                <div className="flex items-center justify-between text-sm font-medium mb-2.5">
                    <span className="text-slate-600 dark:text-slate-400">Montant encaissé</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-base tabular-nums">
                            {formatCurrency(totalPaidAmount)}
                        </span>
                        <span className="text-slate-400 text-xs font-normal">/ {formatCurrency(totalAmount)}</span>
                    </div>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Liste des factures / milestones */}
            <div className="relative mt-4">
                {/* Ligne verticale de connexion (dynamique) */}
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-full" />
                
                <div className="space-y-5">
                    <AnimatePresence>
                        {sortedMilestones.map((milestone, idx) => {
                            const isNext = nextMilestone?.id === milestone.id;
                            
                            return (
                                <motion.div
                                    key={milestone.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.08, ease: "easeOut" }}
                                    className="relative flex items-start gap-4 group"
                                >
                                    {/* Icône statut sur la timeline */}
                                    <div className={cn(
                                        "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-[3px] transition-all shrink-0 bg-white dark:bg-[#0A0A0A]",
                                        milestone.status === "PAID" ? "border-emerald-100 dark:border-emerald-500/20" :
                                        milestone.status === "INVOICED" ? "border-sky-100 dark:border-sky-500/20" :
                                        isNext ? "border-sky-200 dark:border-sky-700/50 shadow-[0_0_0_4px_rgba(14,165,233,0.1)]" :
                                        "border-slate-100 dark:border-slate-800"
                                    )}>
                                        {getStatusIcon(milestone.status)}
                                    </div>

                                    {/* Carte Milestone */}
                                    <div className={cn(
                                        "flex-1 bg-white dark:bg-slate-950 border rounded-xl overflow-hidden transition-all duration-200",
                                        isNext ? "border-sky-200/80 dark:border-sky-800 shadow-sm ring-1 ring-sky-100 dark:ring-sky-900/30" : "border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
                                    )}>
                                        <div className="p-4 sm:p-5">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                            Étape {milestone.sequence}
                                                        </span>
                                                        {isNext && (
                                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400">
                                                                <AlertTriangle className="h-3 w-3" />
                                                                À facturer
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                                                        {milestone.title}
                                                    </h4>
                                                    {milestone.description && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                                                            {milestone.description}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start">
                                                    <div className="text-base font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                                                        {formatCurrency(milestone.amount_cents)}
                                                    </div>
                                                    <div className="text-xs text-slate-400 font-medium mt-0.5 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                                        {milestone.percent}% du total
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer de la carte (Statut & Actions) */}
                                        <div className="bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800/60 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center gap-4">
                                                {getStatusBadge(milestone.status)}
                                                
                                                {/* Affichage des dates selon le statut */}
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {milestone.paid_at ? (
                                                        <span>Réglé le {formatDate(milestone.paid_at)}</span>
                                                    ) : milestone.invoiced_at ? (
                                                        <span>Facturé le {formatDate(milestone.invoiced_at)}</span>
                                                    ) : milestone.trigger_date ? (
                                                        <span>Prévu pour le {formatDate(milestone.trigger_date)}</span>
                                                    ) : (
                                                        <span>Date non définie</span>
                                                    )}
                                                </div>
                                            </div>

                                            {milestone.invoice_id && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.push(`/dashboard/invoices/${milestone.invoice_id}`)}
                                                    className="h-8 text-xs font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:text-sky-300 dark:hover:bg-sky-500/10 px-3 transition-colors"
                                                >
                                                    Voir la facture
                                                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}