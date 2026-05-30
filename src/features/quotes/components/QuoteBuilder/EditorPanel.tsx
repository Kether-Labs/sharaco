"use client";

import { QuoteDraft, QuoteLineItem } from "../../types/QuoteBuilder";
import { Plus, User, FileText, Calendar, ChevronLeft, Save, Send, Paintbrush, ReceiptText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuoteTotal } from "../../hooks/useQuoteTotal";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabDetails } from "./tabs/TabDetails";
import { TabClient } from "./tabs/TabClient";
import { TabItems } from "./tabs/TabItems";
import { TabDesign } from "./tabs/TabDesign";

interface EditorPanelProps {
    draft: QuoteDraft;
    onChange: (field: keyof QuoteDraft, value: any) => void;
    onItemChange: (id: string, field: keyof QuoteLineItem, value: any) => void;
    onAddItem: () => void;
    onRemoveItem: (id: string) => void;
}

export function EditorPanel({ draft, onChange, onItemChange, onAddItem, onRemoveItem }: EditorPanelProps) {
    const { grandTotal } = useQuoteTotal(draft.items, draft.hasVat, draft.discountRate, draft.isTaxExempt);

    const formatCurrency = (amount: number) => 
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(amount);

    return (
        <div className="w-full h-full bg-zinc-950 flex flex-col border-r border-white/5 relative z-20">
            {/* Header: Refined and Minimal */}
            <header className="h-16 px-6 flex items-center justify-between shrink-0 bg-zinc-950/50 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/quotes">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5 rounded-lg transition-all border border-white/5 hover:border-white/10 group">
                            <ChevronLeft className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
                        </Button>
                    </Link>
                    <div className="flex flex-col">
                        <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] leading-none mb-1">Quote Builder</h2>
                        <p className="text-sm font-semibold text-zinc-100 tracking-tight leading-none">
                            {draft.reference || "New Quotation"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="h-8 px-3 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Editing Live</span>
                    </div>
                </div>
            </header>

            {/* Main Tabs Navigation */}
            <Tabs defaultValue="items" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 py-4 bg-zinc-950">
                    <TabsList className="w-full h-11 bg-zinc-900/50 border border-white/5 p-1 rounded-xl">
                        {[
                            { value: "items", icon: ReceiptText, label: "Items" },
                            { value: "client", icon: User, label: "Client" },
                            { value: "details", icon: Calendar, label: "Info" },
                            { value: "design", icon: Paintbrush, label: "Design" },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex-1 cursor-pointer rounded-lg text-zinc-500 data-[state=active]:bg-white/5 data-[state=active]:text-white font-bold text-[10px] uppercase tracking-widest transition-all gap-2"
                            >
                                <tab.icon className="w-3.5 h-3.5" strokeWidth={2} />
                                <span className="hidden xl:inline">{tab.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <div className="px-6 py-4 max-w-2xl mx-auto w-full pb-32">
                        <TabsContent value="details" className="mt-0 outline-none">
                            <TabDetails draft={draft} onChange={onChange} />
                        </TabsContent>

                        <TabsContent value="client" className="mt-0 outline-none">
                            <TabClient draft={draft} onChange={onChange} />
                        </TabsContent>

                        <TabsContent value="items" className="mt-0 outline-none">
                            <TabItems
                                draft={draft}
                                onItemChange={onItemChange}
                                onAddItem={onAddItem}
                                onRemoveItem={onRemoveItem}
                                onDraftChange={onChange}
                            />
                        </TabsContent>

                        <TabsContent value="design" className="mt-0 outline-none">
                            <TabDesign draft={draft} onChange={onChange} />
                        </TabsContent>
                    </div>
                </ScrollArea>

                {/* Bottom Floating Summary & Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent pointer-events-none">
                    <div className="pointer-events-auto bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
                        <div className="pl-4">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Grand Total</p>
                            <p className="text-xl font-black text-white tracking-tighter">
                                {formatCurrency(grandTotal)}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
                                <Save className="h-5 w-5" />
                            </Button>
                            <Button className="h-12 px-8 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98]">
                                <Send className="mr-2 h-4 w-4" /> Finalize Quote
                            </Button>
                        </div>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
