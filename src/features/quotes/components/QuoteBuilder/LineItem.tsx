"use client";

import { Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuoteLineItem } from "../../types/QuoteBuilder";

interface LineItemProps {
    item: QuoteLineItem;
    index: number;
    onChange: (id: string, field: keyof QuoteLineItem, value: any) => void;
    onRemove: (id: string) => void;
}

export function LineItem({ item, index, onChange, onRemove }: LineItemProps) {
    const handleNumberChange = (field: keyof QuoteLineItem, val: string) => {
        const num = parseFloat(val);
        onChange(item.id, field, isNaN(num) ? 0 : num);
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

    const lineTotal = item.quantity * item.unitPrice;

    return (
        <div className="group relative flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all duration-300">
            {/* Grip handle */}
            <div className="mt-2.5 text-zinc-600 cursor-grab active:cursor-grabbing hover:text-zinc-400 transition-colors shrink-0">
                <GripVertical className="h-4 w-4" />
            </div>

            <div className="flex-1 flex flex-col gap-5">
                {/* Description */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                    <Input
                        value={item.description}
                        onChange={(e) => onChange(item.id, 'description', e.target.value)}
                        placeholder="Project Milestone or Service Name..."
                        className="h-11 bg-zinc-900/50 border-white/5 focus:border-white/10 focus:ring-1 focus:ring-white/10 rounded-xl w-full text-zinc-200 placeholder:text-zinc-700 font-medium"
                    />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Quantity</label>
                        <Input
                            type="number"
                            min="1"
                            value={item.quantity || ''}
                            onChange={(e) => handleNumberChange('quantity', e.target.value)}
                            className="h-11 bg-zinc-900/50 border-white/5 focus:border-white/10 rounded-xl text-zinc-200 font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Unit Price</label>
                        <div className="relative">
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice || ''}
                                onChange={(e) => handleNumberChange('unitPrice', e.target.value)}
                                className="h-11 pl-7 bg-zinc-900/50 border-white/5 focus:border-white/10 rounded-xl text-zinc-200 font-mono"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 font-medium text-xs">€</span>
                        </div>
                    </div>

                    <div className="space-y-2 flex flex-col items-end justify-end pb-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right w-full">Line Total</label>
                        <span className="text-sm font-black text-zinc-100 tracking-tight">
                            {formatCurrency(lineTotal)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Remove Button */}
            <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.id)}
                    className="h-7 w-7 rounded-lg bg-zinc-900 border border-white/10 text-zinc-500 hover:text-rose-500 hover:bg-zinc-800 transition-all shadow-xl"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}
