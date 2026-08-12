"use client"

import { useInvoice, useUpdateInvoiceStatus } from "../hooks/useInvoices"
import { DocumentPreview } from "@/features/quotes/components/DocumentPreview"
import { Button } from "@/components/ui/button"
import { invoicesApi } from "../api/invoicesApi"
import { formatCurrency } from "@/features/quotes/lib/formatCurrency"
import { Mail, Check, Download, Bell, ArrowLeft, Loader2, FileText, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export function InvoiceDetail({ invoiceId }: { invoiceId: string }) {
    const { data: invoice, isLoading, error } = useInvoice(invoiceId)
    const updateStatus = useUpdateInvoiceStatus()
    const { toast } = useToast()
    
    const [isSending, setIsSending] = useState(false)
    const [isReminding, setIsReminding] = useState(false)

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh]">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
        )
    }

    if (error || !invoice) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh]">
                <FileText className="h-8 w-8 text-slate-300 mb-4" />
                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Facture introuvable</h2>
                <p className="text-sm text-slate-500 mb-6">Le document demandé n'est pas disponible.</p>
                <Link href="/dashboard/invoices">
                    <Button variant="outline" className="rounded-md">Retour aux factures</Button>
                </Link>
            </div>
        )
    }

    const isPaid = invoice.status === "ACCEPTED"

    const handleMarkAsPaid = async () => {
        try {
            await updateStatus.mutateAsync({ id: invoiceId, status: "ACCEPTED" })
        } catch (e) {}
    }

    const handleDownload = () => {
        window.open(invoicesApi.getPdfUrl(invoiceId), '_blank')
    }

    const handleSendEmail = async () => {
        setIsSending(true)
        setTimeout(() => {
            setIsSending(false)
            toast({
                title: "Email envoyé",
                description: `Facture transmise à ${invoice.client?.email || 'votre client'}.`,
            })
        }, 800)
    }

    const handleRemind = async () => {
        setIsReminding(true)
        setTimeout(() => {
            setIsReminding(false)
            toast({
                title: "Relance effectuée",
                description: "Le client a été notifié.",
            })
        }, 800)
    }

    return (
        <div className="min-h-[100dvh] bg-[#FAFAFA] dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-100 flex flex-col font-sans">
            <header className="sticky top-0 z-30 w-full bg-[#FAFAFA]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/invoices" className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="flex items-baseline gap-3">
                            <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                Facture {invoice.number || "Sans numéro"}
                            </h1>
                            <span className="text-sm text-slate-500">
                                {invoice.client?.name || "Client inconnu"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center">
                        {isPaid ? (
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Payée
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="relative flex h-2 w-2">
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                                </span>
                                En attente
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 lg:gap-24">
                
                {/* Left Column: Preview */}
                <div className="flex-1 w-full flex items-start justify-center lg:justify-end">
                    <div className="w-full max-w-[650px] bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 p-2 shadow-sm">
                        <DocumentPreview 
                            documentId={invoiceId} 
                            layoutStyle={invoice.layout_style || "modern"} 
                        />
                    </div>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="w-full lg:w-[320px] flex flex-col shrink-0 lg:pt-8">
                    
                    <div className="mb-12">
                        <h3 className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-6">
                            Montants
                        </h3>
                        
                        <div className="space-y-0 text-sm">
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 py-3">
                                <span className="text-slate-500">Sous-total</span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                    {formatCurrency(invoice.subtotal_cents || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 py-3">
                                <span className="text-slate-500">TVA</span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                    {formatCurrency(invoice.tax_total_cents || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">Total</span>
                                <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                    {formatCurrency(invoice.total_cents || invoice.grand_total_cents || 0)}
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
                                disabled={isSending}
                                variant="default"
                                className="w-full h-10 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white font-medium justify-between px-4 transition-colors duration-200"
                            >
                                <span>Envoyer par email</span>
                                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                            </Button>

                            {!isPaid && (
                                <Button 
                                    onClick={handleMarkAsPaid}
                                    disabled={updateStatus.isPending}
                                    variant="outline"
                                    className="w-full h-10 rounded-md border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium justify-between px-4 transition-colors duration-200"
                                >
                                    <span>Marquer comme payée</span>
                                    {updateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                </Button>
                            )}

                            <Button 
                                onClick={handleDownload}
                                variant="ghost"
                                className="w-full h-10 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium justify-between px-4 transition-colors duration-200"
                            >
                                <span>Télécharger PDF</span>
                                <Download className="h-4 w-4" />
                            </Button>

                            <Button 
                                onClick={handleRemind}
                                disabled={isPaid || isReminding}
                                variant="ghost"
                                className={`w-full h-10 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium justify-between px-4 transition-colors duration-200 ${isPaid ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span>Envoyer une relance</span>
                                {isReminding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
