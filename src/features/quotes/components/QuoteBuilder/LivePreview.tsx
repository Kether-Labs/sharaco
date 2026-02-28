"use client";

import { QuoteDraft, QuoteLineItem } from "../../types/QuoteBuilder";
import { LineItem } from "./LineItem";
import { useQuoteTotal } from "../../hooks/useQuoteTotal";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface LivePreviewProps {
    draft: QuoteDraft;
}

export function LivePreview({ draft }: LivePreviewProps) {
    const { subTotal, discountAmount, subTotalAfterDiscount, totalTax, grandTotal } = useQuoteTotal(draft.items, draft.hasVat, draft.discountRate, draft.isTaxExempt);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

    return (
        <div className="w-full h-full flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 overflow-y-auto">

            {/* The A4 Paper Simulator */}
            <motion.div
                layout
                className="w-full max-w-[800px] bg-white min-h-[1131px] shadow-[0_40px_80px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden flex flex-col relative text-slate-800"
            >
                {/* Modern Header Shape - Dynamic Brand Color */}
                <div
                    className="absolute top-0 right-0 w-[400px] h-[400px] rounded-bl-[400px] -z-10 opacity-10 transition-colors duration-500"
                    style={{ backgroundColor: draft.brandColor || "#6366f1" }}
                />
                <div
                    className="absolute top-0 right-0 w-[300px] h-[300px] rounded-bl-[300px] -z-10 opacity-20 transition-colors duration-500"
                    style={{ backgroundColor: draft.brandColor || "#6366f1" }}
                />
                <div
                    className="h-4 w-full transition-colors duration-500"
                    style={{ backgroundColor: draft.brandColor || "#1e293b" }}
                ></div>

                <div className="p-14 flex-1 flex flex-col z-10">

                    {/* Header: Company & Quote Info */}
                    <div className="flex justify-between items-start mb-20">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                {draft.logoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={draft.logoUrl} alt="Company Logo" className="max-w-[160px] max-h-[60px] object-contain drop-shadow-sm" />
                                ) : (
                                    <>
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-500"
                                            style={{ backgroundColor: draft.brandColor || "#1e293b" }}
                                        >
                                            <span className="text-white font-black text-xl">S</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">SHARACO</h2>
                                    </>
                                )}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Freelance / Studio</p>
                            <p className="text-sm text-slate-500 max-w-[200px] leading-relaxed">123 Avenue de la Création<br />75001 Paris, France<br />contact@sharaco.com</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">DEVIS</h1>
                            <p className="text-sm text-slate-500 font-mono tracking-widest bg-slate-100 inline-block px-3 py-1 rounded-md border border-slate-200">
                                {draft.reference || "RÉF-XXXX"}
                            </p>
                        </div>
                    </div>

                    {/* Client & Dates Grid */}
                    <div className="grid grid-cols-2 gap-12 mb-16">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-2 inline-block">Client</h3>
                            <div>
                                <p className="font-bold text-slate-900 text-xl leading-none mb-1">{draft.clientName || "Désignation client"}</p>
                                {draft.clientEmail && <p className="text-indigo-600 text-sm font-medium mb-2">{draft.clientEmail}</p>}
                                <p className="text-slate-500 whitespace-pre-wrap text-sm leading-relaxed">{draft.clientAddress || "Adresse du client"}</p>
                            </div>
                        </div>
                        <div className="space-y-6 text-right flex flex-col items-end justify-end">
                            <div className="bg-slate-50/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 inline-block text-left min-w-[220px] shadow-sm">
                                <div className="mb-4">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Émis le</h3>
                                    <p className="font-bold text-slate-900 text-sm">
                                        {draft.date ? format(new Date(draft.date), 'dd MMMM yyyy', { locale: fr }) : "Date"}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Échéance</h3>
                                    <p className="font-bold text-indigo-600 text-sm">
                                        {draft.date ? format(new Date(new Date(draft.date).getTime() + draft.validityDays * 24 * 60 * 60 * 1000), 'dd MMMM yyyy', { locale: fr }) : "Date"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-12 flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-900">
                                    <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest w-[50%]">Prestation / Désignation</th>
                                    <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest text-center">Qté</th>
                                    <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest text-right">Unit. HT</th>
                                    {!draft.isTaxExempt && draft.hasVat && (
                                        <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest text-right">TVA</th>
                                    )}
                                    <th className="py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest text-right">Total HT</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {draft.items.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 pr-4">
                                            <p className="font-bold text-slate-900">{item.description || "Désignation de la prestation"}</p>
                                        </td>
                                        <td className="py-6 text-center text-slate-500 font-bold">{item.quantity}</td>
                                        <td className="py-6 text-right text-slate-500 font-bold">{formatCurrency(item.unitPrice)}</td>
                                        {!draft.isTaxExempt && draft.hasVat && (
                                            <td className="py-6 text-right text-slate-400 text-xs font-bold">{item.taxRate}%</td>
                                        )}
                                        <td className="py-6 text-right font-black text-slate-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-between items-end mb-12">
                        <div className="w-1/2 pr-16">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Informations de paiement</h3>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Virement bancaire uniquement. IBAN: FR76 1234 5678 9012 3456 7890 123.<br />Paiement à réception. Pénalités de retard : 15% par an.</p>
                            {draft.isTaxExempt && (
                                <p className="text-[10px] font-bold text-slate-400 italic mt-4 italic">Exonération de TVA, article 293 B du CGI.</p>
                            )}
                        </div>
                        <div className="w-1/2 space-y-4 bg-slate-900 p-8 rounded-[32px] shadow-2xl shadow-indigo-500/10">

                            <div className="flex justify-between text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <span>Sous-total HT</span>
                                <span className="text-white">{formatCurrency(subTotal)}</span>
                            </div>

                            {draft.discountRate > 0 && (
                                <div className="flex justify-between text-emerald-400 text-xs font-bold uppercase tracking-widest">
                                    <span>Remise ({draft.discountRate}%)</span>
                                    <span>-{formatCurrency(discountAmount)}</span>
                                </div>
                            )}

                            {!draft.isTaxExempt && draft.hasVat && (
                                <div className="flex justify-between text-slate-400 text-xs font-bold uppercase tracking-widest border-t border-white/10 pt-4">
                                    <span>TVA Totale</span>
                                    <span className="text-white">{formatCurrency(totalTax)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-end pt-2 mt-4">
                                <span className="font-black text-slate-500 uppercase tracking-tighter text-xs">Total à payer</span>
                                <span className="font-black text-3xl text-white tracking-tighter">{formatCurrency(grandTotal)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes & Footer */}
                    <div className="mt-auto pt-8 border-t border-slate-200">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Conditions & Notes</h3>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{draft.notes || "Aucune note additionnelle."}</p>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
