"use client";

import { QuoteDraft, QuoteLineItem } from "../../types/QuoteBuilder";
import { Plus, User, FileText, Calendar, Building2, ChevronLeft, Save, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LineItem } from "./LineItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuoteTotal } from "../../hooks/useQuoteTotal";

interface EditorPanelProps {
    draft: QuoteDraft;
    onChange: (field: keyof QuoteDraft, value: any) => void;
    onItemChange: (id: string, field: keyof QuoteLineItem, value: any) => void;
    onAddItem: () => void;
    onRemoveItem: (id: string) => void;
}

export function EditorPanel({ draft, onChange, onItemChange, onAddItem, onRemoveItem }: EditorPanelProps) {
    const { grandTotal } = useQuoteTotal(draft.items);

    return (
        <div className="w-full md:w-[600px] h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/10 flex flex-col shadow-2xl z-20">

            {/* Header: Back Button & Total */}
            <div className="h-20 border-b border-slate-200 dark:border-white/10 px-6 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <Link href="/quotes">
                        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                            <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                        </Button>
                    </Link>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Éditeur</h2>
                </div>
                <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total TTC</p>
                    <p className="font-black text-xl bg-gradient-to-br from-sky-500 to-indigo-600 bg-clip-text text-transparent">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(grandTotal)}
                    </p>
                </div>
            </div>

            {/* Scrollable Form Area */}
            <ScrollArea className="flex-1 px-6 py-8">
                <div className="space-y-10">

                    {/* General Settings */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Building2 className="h-5 w-5 text-indigo-500" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Général</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500">CLIENT</label>
                                <Input
                                    placeholder="Nom de l'entreprise"
                                    value={draft.clientName}
                                    onChange={(e) => onChange("clientName", e.target.value)}
                                    className="bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white focus:border-indigo-500 transition-all rounded-xl h-12"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500">ADRESSE DE FACTURATION</label>
                                <Textarea
                                    placeholder="Adresse complète..."
                                    value={draft.clientAddress}
                                    onChange={(e) => onChange("clientAddress", e.target.value)}
                                    className="resize-none bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white focus:border-indigo-500 transition-all rounded-xl h-20"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500">DATE</label>
                                    <Input
                                        type="date"
                                        value={draft.date}
                                        onChange={(e) => onChange("date", e.target.value)}
                                        className="bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white focus:border-indigo-500 transition-all rounded-xl h-12"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500">VALIDITÉ (JOURS)</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={draft.validityDays}
                                        onChange={(e) => onChange("validityDays", parseInt(e.target.value) || 0)}
                                        className="bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white focus:border-indigo-500 transition-all rounded-xl h-12"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-200 dark:bg-white/10 w-full" />

                    {/* Commercial Options */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-indigo-500" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Options Commerciales</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-bold text-slate-900 dark:text-white">Appliquer la TVA</label>
                                    <p className="text-xs text-slate-500">Active ou désactive la TVA sur tout le devis.</p>
                                </div>
                                <Switch
                                    checked={draft.hasVat}
                                    onCheckedChange={(checked: boolean) => onChange("hasVat", checked)}
                                />
                            </div>

                            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                                <label className="text-xs font-semibold text-slate-500">REMISE GLOBALE (%)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={draft.discountRate || ''}
                                    onChange={(e) => onChange("discountRate", parseFloat(e.target.value) || 0)}
                                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 focus:border-indigo-500 transition-all rounded-xl h-12"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-200 dark:bg-white/10 w-full" />

                    {/* Line Items */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-sky-500" />
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Prestations</h3>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {draft.items.map((item, index) => (
                                    <LineItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        onChange={onItemChange}
                                        onRemove={onRemoveItem}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        <Button
                            onClick={onAddItem}
                            variant="outline"
                            className="w-full h-14 border-dashed border-2 border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-sky-500 dark:hover:border-sky-400 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 rounded-2xl transition-all group"
                        >
                            <Plus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                            <span className="font-semibold text-sm">Ajouter une ligne</span>
                        </Button>
                    </div>

                    <div className="h-px bg-slate-200 dark:bg-white/10 w-full" />

                    {/* Footer Notes */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-emerald-500" />
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Notes</h3>
                        </div>
                        <Textarea
                            placeholder="Mentions légales, détails de paiement..."
                            value={draft.notes}
                            onChange={(e) => onChange("notes", e.target.value)}
                            className="resize-none bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white focus:border-emerald-500 transition-all rounded-xl h-32"
                        />
                    </div>
                </div>
            </ScrollArea>

            {/* Bottom Action Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 shrink-0 grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold">
                    <Save className="mr-2 h-4 w-4" /> Brouillon
                </Button>
                <Button className="h-12 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/25 border-0 font-semibold">
                    <Send className="mr-2 h-4 w-4" /> Finaliser
                </Button>
            </div>
        </div>
    );
}
