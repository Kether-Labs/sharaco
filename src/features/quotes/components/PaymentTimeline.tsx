// features/quotes/components/PaymentTimeline.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle2, Clock, Circle, Loader2, FileText,
    AlertTriangle, Receipt, CreditCard
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
    onUpdate: () => void; // callback pour recharger après action
}

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
                // Vérifier que la précédente est payée
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
    const allPaid = milestones.every(m => m.status === "PAID");
    const isQuoteAccepted = quoteStatus === "ACCEPTED";

    const handleGenerateNext = async () => {
        if (!nextMilestone) return;
        
        setIsGenerating(true);
        try {
            const result = await quotesApi.generateNextInvoice(quoteId);
            toast({
                title: "✅ Facture créée",
                description: `${result.invoice_number} — ${result.milestone_title} (${result.milestone_percent}%)`,
            });
            onUpdate(); // Recharger les données
            
            // Rediriger vers la facture créée après un court délai
            setTimeout(() => {
                router.push(`/dashboard/invoices/${result.invoice_id}`);
            }, 800);
        } catch (err: any) {
            toast({
                title: "Erreur",
                description: err.message || "Impossible de générer la facture",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PAID":
                return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
            case "INVOICED":
                return <Receipt className="h-5 w-5 text-sky-400" />;
            case "PENDING":
                return <Clock className="h-5 w-5 text-zinc-500" />;
            default:
                return <Circle className="h-5 w-5 text-zinc-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const config = {
            PAID: { label: "Payée", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
            INVOICED: { label: "Facturée", bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/30" },
            PENDING: { label: "En attente", bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/30" },
            CANCELLED: { label: "Annulée", bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
        }[status] || { label: status, bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/30" };
        
        return (
            <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider", config.bg, config.text, config.border)}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-sky-400" />
                        Échéancier de paiement
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                        {milestones.length} tranche{milestones.length > 1 ? "s" : ""} • {formatCurrency(totalAmount)}
                    </p>
                </div>
                
                {isQuoteAccepted && nextMilestone && (
                    <Button
                        onClick={handleGenerateNext}
                        disabled={isGenerating}
                        className="bg-sky-500 hover:bg-sky-400 text-black font-bold shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Génération...
                            </>
                        ) : (
                            <>
                                <FileText className="mr-2 h-4 w-4" />
                                Facturer "{nextMilestone.title}"
                            </>
                        )}
                    </Button>
                )}
                
                {allPaid && isQuoteAccepted && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            Tout est payé
                        </span>
                    </div>
                )}
            </div>

            {/* Barre de progression */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-medium mb-2">
                    <span className="text-zinc-400">Progression</span>
                    <span className="text-emerald-400 font-bold">
                        {formatCurrency(totalPaidAmount)} / {formatCurrency(totalAmount)}
                    </span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Liste des milestones */}
            <div className="relative">
                {/* Ligne verticale de connexion */}
                <div className="absolute left-[18px] top-2 bottom-2 w-px bg-zinc-800" />
                
                <div className="space-y-3">
                    {sortedMilestones.map((milestone, idx) => (
                        <motion.div
                            key={milestone.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative flex items-start gap-4 group"
                        >
                            {/* Icône statut */}
                            <div className={cn(
                                "relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all",
                                milestone.status === "PAID" && "bg-emerald-500/10 border-emerald-500/50",
                                milestone.status === "INVOICED" && "bg-sky-500/10 border-sky-500/50",
                                milestone.status === "PENDING" && "bg-zinc-900 border-zinc-700",
                            )}>
                                {getStatusIcon(milestone.status)}
                            </div>

                            {/* Contenu */}
                            <div className="flex-1 bg-zinc-950/50 border border-white/5 rounded-xl p-4 group-hover:border-white/10 transition-colors">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                                Étape {milestone.sequence}
                                            </span>
                                            {getStatusBadge(milestone.status)}
                                        </div>
                                        <h4 className="text-sm font-bold text-white">
                                            {milestone.title}
                                        </h4>
                                        {milestone.description && (
                                            <p className="text-xs text-zinc-500 mt-1 italic">
                                                {milestone.description}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="text-right">
                                        <div className="text-base font-black text-white">
                                            {formatCurrency(milestone.amount_cents)}
                                        </div>
                                        <div className="text-xs text-zinc-500 font-bold">
                                            {milestone.percent}%
                                        </div>
                                    </div>
                                </div>

                                {/* Métadonnées */}
                                <div className="flex items-center gap-3 text-xs text-zinc-500 pt-2 border-t border-white/5">
                                    {milestone.trigger_date && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(milestone.trigger_date).toLocaleDateString("fr-FR")}
                                        </span>
                                    )}
                                    {milestone.invoiced_at && (
                                        <span>Facturée le {new Date(milestone.invoiced_at).toLocaleDateString("fr-FR")}</span>
                                    )}
                                    {milestone.paid_at && (
                                        <span className="text-emerald-400">
                                            Payée le {new Date(milestone.paid_at).toLocaleDateString("fr-FR")}
                                        </span>
                                    )}
                                    {milestone.invoice_id && (
                                        <button
                                            onClick={() => router.push(`/dashboard/invoices/${milestone.invoice_id}`)}
                                            className="text-sky-400 hover:text-sky-300 font-medium underline-offset-2 hover:underline"
                                        >
                                            Voir facture →
                                        </button>
                                    )}
                                </div>

                                {/* Highlight si c'est la prochaine à facturer */}
                                {nextMilestone?.id === milestone.id && (
                                    <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-500/10 border border-sky-500/30">
                                        <AlertTriangle className="h-3.5 w-3.5 text-sky-400" />
                                        <span className="text-xs font-bold text-sky-400">
                                            Prête à être facturée
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}