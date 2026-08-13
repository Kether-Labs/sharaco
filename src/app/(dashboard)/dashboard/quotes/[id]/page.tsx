// app/dashboard/quotes/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { quotesApi } from "@/features/quotes/api/quotesApi";
import { PaymentTimeline } from "@/features/quotes/components/PaymentTimeline";
import { Loader2, ArrowLeft, FileText, Mail, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/features/quotes/lib/formatCurrency";
import { cn } from "@/lib/utils";

export default function QuoteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const quoteId = params.id as string;
    
    const [quote, setQuote] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadQuote = async () => {
        try {
            const data = await quotesApi.getById(quoteId);
            setQuote(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (quoteId) loadQuote();
    }, [quoteId]);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-72px)] items-center justify-center">
                <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="flex h-[calc(100vh-72px)] items-center justify-center">
                <p className="text-zinc-500">Devis introuvable</p>
            </div>
        );
    }

    const hasSchedule = quote.payment_schedule && quote.payment_schedule.length > 0 &&
        !(quote.payment_schedule.length === 1 && quote.payment_schedule[0].percent === 100);

    const isAccepted = quote.status === "ACCEPTED";

    return (
        <div className="min-h-[calc(100vh-72px)] bg-black text-white p-6 lg:p-10">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push("/dashboard/quotes")}
                            className="hover:bg-white/10"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-black text-white">
                                Devis {quote.number}
                            </h1>
                            <p className="text-sm text-zinc-500 mt-1">
                                {quote.client_name || "Client"} • {new Date(quote.created_at).toLocaleDateString("fr-FR")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="border-white/10">
                            <Download className="mr-2 h-4 w-4" />
                            PDF
                        </Button>
                        <Button variant="outline" className="border-white/10">
                            <Mail className="mr-2 h-4 w-4" />
                            Envoyer
                        </Button>
                    </div>
                </div>

                {/* Statut + Total */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5">
                        <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">
                            Statut
                        </div>
                        <div className={cn(
                            "flex items-center gap-2 text-lg font-bold",
                            quote.status === "ACCEPTED" && "text-emerald-400",
                            quote.status === "SENT" && "text-sky-400",
                            quote.status === "DRAFT" && "text-zinc-400",
                        )}>
                            <CheckCircle2 className="h-5 w-5" />
                            {quote.status}
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5">
                        <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">
                            Montant total
                        </div>
                        <div className="text-2xl font-black text-white">
                            {formatCurrency(quote.grand_total_cents)}
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5">
                        <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">
                            Mode de paiement
                        </div>
                        <div className="text-lg font-bold text-white">
                            {hasSchedule ? `${quote.payment_schedule.length} tranches` : "Paiement simple"}
                        </div>
                    </div>
                </div>

                {/* Échéancier (si devis accepté + échéancier présent) */}
                {isAccepted && hasSchedule && (
                    <div className="mb-8">
                        <PaymentTimeline
                            quoteId={quoteId}
                            quoteNumber={quote.number}
                            milestones={quote.payment_schedule}
                            quoteStatus={quote.status}
                            onUpdate={loadQuote}
                        />
                    </div>
                )}

                {/* Items du devis */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Prestations</h2>
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-zinc-500 uppercase tracking-wider border-b border-white/5">
                                <th className="text-left py-3 font-bold">Description</th>
                                <th className="text-right py-3 font-bold">Qté</th>
                                <th className="text-right py-3 font-bold">P.U.</th>
                                <th className="text-right py-3 font-bold">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quote.items.map((item: any, idx: number) => (
                                <tr key={idx} className="border-b border-white/5 last:border-0">
                                    <td className="py-4 text-sm text-white">{item.description}</td>
                                    <td className="py-4 text-sm text-zinc-400 text-right">{item.quantity}</td>
                                    <td className="py-4 text-sm text-zinc-400 text-right">
                                        {formatCurrency(item.unit_price_cents)}
                                    </td>
                                    <td className="py-4 text-sm text-white font-bold text-right">
                                        {formatCurrency(item.unit_price_cents * item.quantity)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}