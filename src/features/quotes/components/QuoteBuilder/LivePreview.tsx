"use client";

import { QuoteDraft } from "../../types/QuoteBuilder";
import { useQuoteTotal } from "../../hooks/useQuoteTotal";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
    draft: QuoteDraft;
}

export function LivePreview({ draft }: LivePreviewProps) {
    const { subTotal, discountAmount, totalTax, grandTotal } = useQuoteTotal(
        draft.items, 
        draft.hasVat, 
        draft.discountRate, 
        draft.isTaxExempt
    );

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'EUR',
            minimumFractionDigits: 2 
        }).format(amount);

    return (
        <div className="w-full flex justify-center py-10">
            {/* The A4 Paper Simulator */}
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[800px] bg-white min-h-[1131px] shadow-[0_0_1px_rgba(0,0,0,0.1),0_20px_40px_-10px_rgba(0,0,0,0.05),0_40px_80px_-20px_rgba(0,0,0,0.05)] rounded-sm overflow-hidden flex flex-col relative text-zinc-900 font-sans"
            >
                {/* Brand Accent Bar */}
                <div 
                    className="h-1.5 w-full transition-colors duration-500"
                    style={{ backgroundColor: draft.brandColor || "#0ea5e9" }}
                />

                <div className="p-16 flex-1 flex flex-col">
                    {/* Top Section: Branding & Reference */}
                    <div className="flex justify-between items-start mb-20">
                        <div className="space-y-6">
                            {draft.logoUrl ? (
                                <div className="h-12 flex items-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={draft.logoUrl} alt="Logo" className="max-h-full max-w-[180px] object-contain" />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-500 shadow-sm"
                                        style={{ backgroundColor: draft.brandColor || "#0ea5e9" }}
                                    >
                                        <span className="text-white font-black text-xl tracking-tighter">S</span>
                                    </div>
                                    <span className="text-xl font-black tracking-tighter text-zinc-900 uppercase">Sharaco</span>
                                </div>
                            )}
                            
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Provider</p>
                                <p className="text-xs font-semibold text-zinc-800 leading-relaxed">
                                    Sharaco Studio SAS<br />
                                    123 Avenue de la Création<br />
                                    75001 Paris, France
                                </p>
                            </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-6">
                            <div className="space-y-1">
                                <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Quotation</h1>
                                <p className="text-xs font-mono font-bold text-zinc-400">REF: {draft.reference || "2024-000"}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
                                <div>
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Date</p>
                                    <p className="text-xs font-bold text-zinc-900">
                                        {draft.date ? format(new Date(draft.date), 'dd MMM yyyy', { locale: fr }) : "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Validity</p>
                                    <p className="text-xs font-bold text-zinc-900">{draft.validityDays} days</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Client Info */}
                    <div className="mb-20">
                        <div className="max-w-[300px] space-y-2">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Bill To</p>
                            <div className="space-y-1">
                                <p className="text-lg font-black text-zinc-900 tracking-tight">
                                    {draft.clientName || "Client Name"}
                                </p>
                                {draft.clientEmail && (
                                    <p className="text-xs font-semibold text-zinc-500">{draft.clientEmail}</p>
                                )}
                                <p className="text-xs font-semibold text-zinc-500 leading-relaxed whitespace-pre-wrap">
                                    {draft.clientAddress || "Billing Address"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-100">
                                    <th className="py-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] w-[60%]">Description</th>
                                    <th className="py-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center px-4">Qty</th>
                                    <th className="py-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">Unit Price</th>
                                    <th className="py-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {draft.items.map((item) => (
                                    <tr key={item.id} className="group">
                                        <td className="py-6 pr-8">
                                            <p className="text-sm font-bold text-zinc-900 leading-snug">
                                                {item.description || "Project Milestone / Service Name"}
                                            </p>
                                        </td>
                                        <td className="py-6 text-center">
                                            <span className="text-xs font-mono font-bold text-zinc-500">{item.quantity}</span>
                                        </td>
                                        <td className="py-6 text-right">
                                            <span className="text-xs font-mono font-bold text-zinc-500">{formatCurrency(item.unitPrice)}</span>
                                        </td>
                                        <td className="py-6 text-right">
                                            <span className="text-sm font-mono font-black text-zinc-900">{formatCurrency(item.quantity * item.unitPrice)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom Section: Summary & Totals */}
                    <div className="mt-20 pt-10 border-t border-zinc-100 grid grid-cols-2 gap-20">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Notes & Terms</p>
                                <p className="text-[11px] font-semibold text-zinc-500 leading-relaxed">
                                    {draft.notes || "Standard terms apply. Payment is due within the agreed timeframe."}
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Payment Details</p>
                                <p className="text-[10px] font-mono font-bold text-zinc-400 leading-relaxed uppercase">
                                    IBAN: FR76 1234 5678 9012 3456 7890 123<br />
                                    SWIFT: SHARFR2X
                                </p>
                            </div>
                        </div>

                        <div className="bg-zinc-50/50 rounded-3xl p-8 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Subtotal</span>
                                <span className="text-sm font-mono font-bold text-zinc-600">{formatCurrency(subTotal)}</span>
                            </div>

                            {draft.discountRate > 0 && (
                                <div className="flex justify-between items-center text-emerald-600">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Discount ({draft.discountRate}%)</span>
                                    <span className="text-sm font-mono font-bold">-{formatCurrency(discountAmount)}</span>
                                </div>
                            )}

                            {!draft.isTaxExempt && draft.hasVat && (
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">VAT Total</span>
                                    <span className="text-sm font-mono font-bold text-zinc-600">{formatCurrency(totalTax)}</span>
                                </div>
                            )}

                            <div className="pt-4 border-t border-zinc-200 flex justify-between items-end">
                                <span className="text-xs font-black text-zinc-900 uppercase tracking-tighter">Grand Total</span>
                                <span className="text-3xl font-black text-zinc-900 tracking-tighter">
                                    {formatCurrency(grandTotal)}
                                </span>
                            </div>
                            
                            {draft.isTaxExempt && (
                                <p className="text-[9px] font-bold text-zinc-400 italic text-right pt-2">
                                    Exonération de TVA, article 293 B du CGI.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer Branding */}
                    <div className="mt-20 flex justify-center">
                        <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.3em]">Powered by Sharaco Operating System</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
