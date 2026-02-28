"use client";

import { QuoteDraft, QuoteLineItem } from "../../../types/QuoteBuilder";
import { Plus, SlidersHorizontal, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineItem } from "../LineItem";
import { useQuoteTotal } from "../../../hooks/useQuoteTotal";


interface TabItemsProps {
    draft: QuoteDraft;
    onItemChange: (id: string, field: keyof QuoteLineItem, value: any) => void;
    onAddItem: () => void;
    onRemoveItem: (id: string) => void;
    onDraftChange: (field: keyof QuoteDraft, value: any) => void;
}

export function TabItems({ draft, onItemChange, onAddItem, onRemoveItem, onDraftChange }: TabItemsProps) {
    const { subTotal, totalTax, grandTotal, discountAmount } = useQuoteTotal(draft.items, draft.hasVat, draft.discountRate, draft.isTaxExempt);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

    return (
        <div className="space-y-8 pb-32">
            <div className="space-y-4">

                {draft.items.map((item: QuoteLineItem, index: number) => (
                    <LineItem
                        key={item.id}
                        item={item}
                        index={index}
                        onChange={onItemChange}
                        onRemove={onRemoveItem}
                    />
                ))}

            </div>

            <Button
                onClick={onAddItem}
                variant="outline"
                className="w-full h-14 border-dashed border-2 border-slate-800 bg-slate-900/20 hover:bg-indigo-500/10 hover:border-indigo-500 text-slate-400 hover:text-indigo-400 rounded-2xl transition-all group"
            >
                <Plus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm">Ajouter une ligne</span>
            </Button>

            {/* Sticky Totals at bottom of tab content for better UX */}
            <div className="p-6 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-3xl mt-12 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                    <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Résumé financier</h4>
                </div>

                <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm text-slate-500">
                        <span>Total Hors Taxes</span>
                        <span className="font-medium text-slate-300">{formatCurrency(subTotal)}</span>
                    </div>

                    {draft.discountRate > 0 && (
                        <div className="flex justify-between text-sm text-emerald-500 border-t border-slate-800/50 pt-2">
                            <span>Remise ({draft.discountRate}%)</span>
                            <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                        </div>
                    )}

                    {!draft.isTaxExempt && draft.hasVat && (
                        <div className="flex justify-between text-sm text-slate-500 border-t border-slate-800/50 pt-2">
                            <span>TVA</span>
                            <span className="font-medium text-slate-300">{formatCurrency(totalTax)}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-2">
                        <span className="text-md font-black text-slate-200 uppercase tracking-tighter">Total TTC</span>
                        <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
                            {formatCurrency(grandTotal)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
