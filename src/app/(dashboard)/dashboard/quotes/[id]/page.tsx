// app/dashboard/quotes/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { quotesApi } from "@/features/quotes/api/quotesApi";
import { DocumentPreview } from "@/features/quotes/components/DocumentPreview";
import { PaymentTimeline } from "@/features/quotes/components/PaymentTimeline";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/features/quotes/lib/formatCurrency";
import { useSendEmail } from "@/features/quotes/hooks/useSendEmail";
import { useDeleteDocument } from "@/features/quotes/hooks/useDeleteDocument";
import { Mail, Edit, Download, Trash2, ArrowLeft, Loader2, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function QuoteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const quoteId = params.id as string;
    
    const [quote, setQuote] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const sendEmail = useSendEmail();
    const { deleteDocument, isDeleting } = useDeleteDocument({
        onSuccess: () => router.push("/dashboard/quotes")
    });

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

    const handleDownload = () => {
        window.open(quotesApi.getPdfUrl(quoteId), '_blank');
    };

    const handleSendEmail = () => {
        sendEmail.mutate({ documentId: quoteId, data: {} });
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
                <p className="text-sm text-slate-500 mb-6">Le document demandé n'est pas disponible.</p>
                <Link href="/dashboard/quotes">
                    <Button variant="outline" className="rounded-md">Retour aux devis</Button>
                </Link>
            </div>
        );
    }

    const isAccepted = quote.status === "ACCEPTED";
    const hasSchedule = quote.payment_schedule && quote.payment_schedule.length > 0 &&
        !(quote.payment_schedule.length === 1 && quote.payment_schedule[0].percent === 100);
    console.log(quote)
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

                    <div className="flex items-center">
                        {isAccepted ? (
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                Accepté
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

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 lg:gap-24">
                
                {/* Left Column: Preview */}
                <div className="flex-1 w-full flex flex-col items-center lg:items-end">
                    <div className="w-full max-w-[500px] bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 p-2 shadow-sm mb-8">
                        <DocumentPreview 
                            documentId={quoteId} 
                            layoutStyle={quote.layout_style || "modern"} 
                        />
                    </div>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="w-full lg:w-[500px] flex flex-col shrink-0 lg:pt-8">
                    
                    <div className="mb-12">
                        <h3 className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-6">
                            Montants
                        </h3>
                        
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

                    <div>
                        <h3 className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-6">
                            Actions
                        </h3>

                        <div className="flex flex-col gap-2">
                            <Button 
                                onClick={handleSendEmail} 
                                disabled={sendEmail.isPending}
                                variant="default"
                                className="w-full h-10 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white font-medium justify-between px-4 transition-colors duration-200"
                            >
                                <span>Envoyer par email</span>
                                {sendEmail.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                            </Button>

                            <Button 
                                onClick={handleDownload}
                                variant="outline"
                                className="w-full h-10 rounded-md border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium justify-between px-4 transition-colors duration-200"
                            >
                                <span>Télécharger PDF</span>
                                <Download className="h-4 w-4" />
                            </Button>
                            
                            <Button
                                asChild
                                variant="ghost"
                                className="w-full h-10 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium justify-between px-4 transition-colors duration-200"
                            >
                                <Link href={`/dashboard/quotes/create/${quoteId}`}>
                                    <span>Modifier le devis</span>
                                    <Edit className="h-4 w-4" />
                                </Link>
                            </Button>

                            <Button 
                                onClick={handleDelete}
                                disabled={isDeleting}
                                variant="ghost"
                                className="w-full h-10 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium justify-between px-4 transition-colors duration-200 mt-2"
                            >
                                <span>Supprimer le devis</span>
                                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

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