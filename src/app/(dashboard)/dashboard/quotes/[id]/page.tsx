// app/dashboard/quotes/[id]/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { quotesApi } from "@/features/quotes/api/quotesApi";
import { DocumentPreview } from "@/features/quotes/components/DocumentPreview";
import { PaymentTimeline } from "@/features/quotes/components/PaymentTimeline";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/features/quotes/lib/formatCurrency";
import { useDeleteDocument } from "@/features/quotes/hooks/useDeleteDocument";
import { Mail, Edit, Download, Trash2, ArrowLeft, Loader2, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SendEmailModal } from "@/features/quotes/components/sendEmailModal";
import { useToast } from "@/hooks/use-toast";

interface QuoteDetail {
    id?: string;
    number?: string;
    status?: string;
    client?: { name?: string };
    client_name?: string;
    client_email?: string;
    layout_style?: string;
    subtotal_cents?: number;
    tax_total_cents?: number;
    total_cents?: number;
    grand_total_cents?: number;
    payment_schedule?: Array<{
        id?: string;
        sequence?: number;
        title?: string;
        percent?: number;
        amount_cents?: number;
        status?: string;
    }>;
}

export default function QuoteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const quoteId = params.id as string;

    const [quote, setQuote] = useState<QuoteDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const { deleteDocument, isDeleting } = useDeleteDocument({
        onSuccess: () => router.push("/dashboard/quotes")
    });

    const loadQuote = useCallback(async () => {
        try {
            const data = await quotesApi.getById(quoteId);
            setQuote(data as QuoteDetail);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [quoteId]);

    useEffect(() => {
        if (quoteId) loadQuote();
    }, [quoteId, loadQuote]);

    const handleDownload = () => {
        window.open(quotesApi.getPdfUrl(quoteId), '_blank');
    };

    const handleSendEmail = () => {
        setIsEmailModalOpen(true);
    };

    const handleEmailSent = () => {
        setIsEmailModalOpen(false);
    };

    const handleDelete = () => {
        deleteDocument(quoteId, quote?.number);
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh]">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh]">
                <FileText className="h-8 w-8 text-slate-300 mb-4" />
                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Devis introuvable</h2>
                <p className="text-sm text-slate-500 mb-6">Le document demandé n&apos;est pas disponible.</p>
                <Link href="/dashboard/quotes">
                    <Button variant="outline" className="rounded-md">Retour aux devis</Button>
                </Link>
            </div>
        );
    }

    const isAccepted = quote.status === "ACCEPTED";
    const sortedMilestones = [...(quote.payment_schedule || [])].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
    const getNextFacturableMilestone = () => {
        for (const milestone of sortedMilestones) {
            if (milestone.status === "PENDING") {
                const prevIndex = (milestone.sequence ?? 1) - 2;
                if (prevIndex >= 0) {
                    const prev = sortedMilestones[prevIndex];
                    if (prev?.status !== "PAID") return null;
                }
                return milestone;
            }
        }
        return null;
    };
    const nextMilestone = getNextFacturableMilestone();
    const hasSchedule = quote.payment_schedule && quote.payment_schedule.length > 0 &&
        !(quote.payment_schedule.length === 1 && quote.payment_schedule[0].percent === 100);

    const handleGenerateNext = async () => {
        if (!nextMilestone) return;

        setIsGenerating(true);
        try {
            const result = await quotesApi.generateNextInvoice(quoteId);
            toast({
                title: "✅ Facture créée",
                description: `${result.invoice_number} — ${result.milestone_title} (${result.milestone_percent}%)`,
            });
            await loadQuote();
            setTimeout(() => {
                router.push(`/dashboard/invoices/${result.invoice_id}`);
            }, 600);
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

    return (
        <div className="min-h-[100dvh] bg-[#FAFAFA] dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-100 flex flex-col font-sans">
            <header className="sticky top-0 z-30 w-full bg-[#FAFAFA]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/quotes" className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="flex items-baseline gap-3">
                            <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                Devis {quote.number || "Sans numéro"}
                            </h1>
                            <span className="text-sm text-slate-500">
                                {quote.client?.name || quote.client_name || "Client inconnus"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        
                        {isAccepted ? (
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                Payé
                            </div>
                        ) : quote.status === "SENT" ? (
                            <div className="flex items-center gap-2 text-xs font-medium text-sky-500">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Envoyé
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="relative flex h-2 w-2">
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                                </span>
                                Brouillon
                            </div>
                        )}
                       
                    </div>
                </div>
                
            </header>

            <main className="relative flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-6 py-8 lg:px-8 xl:px-10 flex flex-col xl:flex-row gap-6 xl:gap-8">
                

                {/* Left Column: Preview */}
                <div className="flex-1 w-full flex flex-col items-center xl:items-start">
                    <div className="w-full max-w-[900px] xl:max-w-none bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 p-2 shadow-sm mb-8">
                        <DocumentPreview 
                            documentId={quoteId} 
                            layoutStyle={quote.layout_style || "modern"} 
                        />
                    </div>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="w-full xl:w-[460px] 2xl:w-[690px] flex flex-col shrink-0 xl:pt-2">
                    
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-6">
                            Montants
                        </h3>

                             {isAccepted && nextMilestone && (
                    <div className=" z-20 hidden xl:block">
                        <Button
                            onClick={handleGenerateNext}
                            disabled={isGenerating}
                            className="h-10 px-4 cursor-pointer rounded-xl bg-[#2563EB] text-white font-medium shadow-[0_10px_20px_-10px_rgba(14,165,233,0.7)] transition-all"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Génération...
                                </>
                            ) : (
                                <>
                                    
                                    Générer la facture suivante
                                </>
                            )}
                        </Button>
                    </div>
                )}

                        </div>
                        
                        
                        <div className="space-y-0 text-sm">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 py-3">
                                <span className="text-slate-500">Sous-total</span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                    {formatCurrency(quote.subtotal_cents || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 py-3">
                                <span className="text-slate-500">TVA</span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                    {formatCurrency(quote.tax_total_cents || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">Total</span>
                                <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                    {formatCurrency(quote.total_cents || quote.grand_total_cents || 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/60 p-3.5 shadow-[0_1px_0_rgba(15,23,42,0.03),0_8px_20px_rgba(15,23,42,0.04)] backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-[0.14em] uppercase">
                                Actions
                            </h3>
                            <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 text-[9px] font-medium text-slate-600 dark:text-slate-300">
                                rapide
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            <Button
                                onClick={handleSendEmail}
                                className="group h-11 justify-between rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                            >
                                <span className="font-medium text-xs">Email</span>
                                <Mail className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                            </Button>

                            <Button
                                onClick={handleDownload}
                                variant="outline"
                                className="h-11 justify-between rounded-xl border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                            >
                                <span className="font-medium text-xs">PDF</span>
                                <Download className="h-4 w-4" />
                            </Button>

                            <Button
                                asChild
                                variant="ghost"
                                className="h-11 justify-between rounded-xl border border-transparent bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 col-span-2"
                            >
                                <Link href={`/dashboard/quotes/create/${quoteId}`} className="inline-flex w-full items-center justify-between">
                                    <span className="font-medium text-xs">Modifier le devis</span>
                                    <Edit className="h-4 w-4" />
                                </Link>
                            </Button>

                            <Button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                variant="ghost"
                                className="h-11 justify-between rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:opacity-60 col-span-2"
                            >
                                <span className="font-medium text-xs">Supprimer le devis</span>
                                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <SendEmailModal
                        open={isEmailModalOpen}
                        onOpenChange={setIsEmailModalOpen}
                        documentId={quoteId}
                        documentNumber={quote.number || ""}
                        clientEmail={quote.client_email || ""}
                        clientName={quote.client?.name || quote.client_name || "Client"}
                        onSent={handleEmailSent}
                    />

                    {/* Échéancier (si devis accepté + échéancier présent) */}
                    {isAccepted && hasSchedule && (
                        <div className="mt-12">
                            <PaymentTimeline
                                quoteId={quoteId}
                                quoteNumber={quote.number}
                                milestones={quote.payment_schedule}
                                quoteStatus={quote.status}
                                onUpdate={loadQuote}
                            />
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}