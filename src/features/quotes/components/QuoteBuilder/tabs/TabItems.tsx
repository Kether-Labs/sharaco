"use client";

import { QuoteDraft, QuoteLineItem } from "../../../types/QuoteBuilder";
import { Plus, ReceiptText } from "lucide-react";
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
        <div className="space-y-10 pb-32">
            {/* Header Description */}
            <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight">Services & Pricing</h3>
                <p className="text-sm text-zinc-500">Add or edit line items for this quotation. Totals are recalculated automatically.</p>
            </div>

            {/* Items List */}
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

            {/* Add Item Button */}
            <Button
                onClick={onAddItem}
                variant="outline"
                className="w-full h-14 border-dashed border border-zinc-800 bg-white/[0.02] hover:bg-white/[0.05] hover:border-zinc-600 text-zinc-400 hover:text-zinc-100 rounded-2xl transition-all group"
            >
                <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs uppercase tracking-widest">Add New Item</span>
            </Button>

            {/* Financial Summary */}
            <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] mt-12 space-y-6 shadow-2xl relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-sky-500/10 transition-colors" />

                <div className="flex items-center gap-3 mb-2 relative z-10">
                    <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                        <ReceiptText className="h-4 w-4 text-zinc-400" />
                    </div>
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Financial Summary</h4>
                </div>

                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-zinc-500">
                        <span>Subtotal (Net)</span>
                        <span className="text-zinc-200">{formatCurrency(subTotal)}</span>
                    </div>

                    {draft.discountRate > 0 && (
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-emerald-500/80">
                            <span>Discount ({draft.discountRate}%)</span>
                            <span>-{formatCurrency(discountAmount)}</span>
                        </div>
                    )}

                    {!draft.isTaxExempt && draft.hasVat && (
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-zinc-500">
                            <span>Tax Amount</span>
                            <span className="text-zinc-200">{formatCurrency(totalTax)}</span>
                        </div>
                    )}

                    <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Total Amount</span>
                            <p className="text-[10px] text-zinc-500 leading-none">Including all applicable taxes</p>
                        </div>
                        <span className="text-3xl font-black text-white tracking-tighter">
                            {formatCurrency(grandTotal)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
