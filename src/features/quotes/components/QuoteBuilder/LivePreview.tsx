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
    const { subTotal, discountAmount, subTotalAfterDiscount, totalTax, grandTotal } = useQuoteTotal(draft.items, draft.hasVat, draft.discountRate);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

    return (
        <div className="w-full h-full flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 overflow-y-auto">

            {/* The A4 Paper Simulator */}
            <motion.div
                layout
                className="w-full max-w-[800px] bg-white min-h-[1131px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden flex flex-col relative text-slate-800"
            >
                {/* Modern Header Shape */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-bl-[400px] -z-10" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-sky-50/50 rounded-bl-[300px] -z-10" />
                <div className="h-4 w-full bg-slate-900"></div>

                <div className="p-14 flex-1 flex flex-col z-10">

                    {/* Header: Company & Quote Info */}
                    <div className="flex justify-between items-start mb-20">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-black text-xl">S</span>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">SHARACO</h2>
                            </div>
                            <p className="text-sm text-slate-500 max-w-[200px]">123 Avenue de la Création<br />75001 Paris, France<br />contact@sharaco.com</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">DEVIS</h1>
                            <p className="text-sm text-slate-500 font-mono tracking-widest bg-slate-100 inline-block px-3 py-1 rounded-md">
                                {draft.reference || "RÉF-XXXX"}
                            </p>
                        </div>
                    </div>

                    {/* Client & Dates Grid */}
                    <div className="grid grid-cols-2 gap-12 mb-16">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b-2 border-slate-900 pb-2 inline-block">Facturé à</h3>
                            <div>
                                <p className="font-bold text-slate-900 text-xl">{draft.clientName || "Nom du client"}</p>
                                <p className="text-slate-600 whitespace-pre-wrap text-sm mt-1">{draft.clientAddress || "Adresse du client"}</p>
                            </div>
                        </div>
                        <div className="space-y-6 text-right flex flex-col items-end justify-end">
                            <div className="bg-slate-50 p-4 rounded-xl inline-block text-left min-w-[200px]">
                                <div className="mb-3">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date d'émission</h3>
                                    <p className="font-semibold text-slate-900 text-sm">
                                        {draft.date ? format(new Date(draft.date), 'dd MMMM yyyy', { locale: fr }) : "Date"}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Valide jusqu'au</h3>
                                    <p className="font-semibold text-slate-900 text-sm">
                                        {draft.date ? format(new Date(new Date(draft.date).getTime() + draft.validityDays * 24 * 60 * 60 * 1000), 'dd MMMM yyyy', { locale: fr }) : "Date"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-12">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-900">
                                    <th className="py-4 text-xs font-bold text-slate-900 uppercase tracking-widest w-[50%]">Désignation</th>
                                    <th className="py-4 text-xs font-bold text-slate-900 uppercase tracking-widest text-center">Qté</th>
                                    <th className="py-4 text-xs font-bold text-slate-900 uppercase tracking-widest text-right">Prix U.</th>
                                    {draft.hasVat && (
                                        <th className="py-4 text-xs font-bold text-slate-900 uppercase tracking-widest text-right">TVA</th>
                                    )}
                                    <th className="py-4 text-xs font-bold text-slate-900 uppercase tracking-widest text-right">Montant</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {draft.items.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-5 pr-4">
                                            <p className="font-semibold text-slate-900">{item.description || "Description de l'article"}</p>
                                        </td>
                                        <td className="py-5 text-center text-slate-600 font-medium">{item.quantity}</td>
                                        <td className="py-5 text-right text-slate-600 font-medium">{formatCurrency(item.unitPrice)}</td>
                                        {draft.hasVat && (
                                            <td className="py-5 text-right text-slate-500 text-sm">{item.taxRate}%</td>
                                        )}
                                        <td className="py-5 text-right font-bold text-slate-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-between items-end mb-16 mt-auto">
                        <div className="w-1/2 pr-12">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Options de paiement</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">Virement bancaire uniquement. IBAN: FR76 1234 5678 9012 3456 7890 123.<br />En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée.</p>
                        </div>
                        <div className="w-1/2 space-y-3 bg-slate-50 p-8 rounded-2xl border border-slate-100">

                            <div className="flex justify-between text-slate-600 text-sm">
                                <span>Total HT</span>
                                <span className="font-semibold text-slate-900">{formatCurrency(subTotal)}</span>
                            </div>

                            {draft.discountRate > 0 && (
                                <div className="flex justify-between text-emerald-600 text-sm">
                                    <span>Remise globale ({draft.discountRate}%)</span>
                                    <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                                </div>
                            )}

                            {draft.hasVat && (
                                <div className="flex justify-between text-slate-600 text-sm border-t border-slate-200 pt-3">
                                    <span>TVA Total</span>
                                    <span className="font-medium text-slate-900">{formatCurrency(totalTax)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-end pt-4 border-t-2 border-slate-900 mt-4">
                                <span className="font-black text-slate-900 uppercase tracking-widest text-sm">Total {draft.hasVat ? 'TTC' : 'HT'}</span>
                                <span className="font-black text-3xl text-slate-900">{formatCurrency(grandTotal)}</span>
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
