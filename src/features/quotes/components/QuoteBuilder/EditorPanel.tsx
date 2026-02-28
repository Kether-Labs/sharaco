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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabDetails } from "./tabs/TabDetails";
import { TabClient } from "./tabs/TabClient";
import { TabItems } from "./tabs/TabItems";
import { TabDesign } from "./tabs/TabDesign";
import { Paintbrush } from "lucide-react";

interface EditorPanelProps {
    draft: QuoteDraft;
    onChange: (field: keyof QuoteDraft, value: any) => void;
    onItemChange: (id: string, field: keyof QuoteLineItem, value: any) => void;
    onAddItem: () => void;
    onRemoveItem: (id: string) => void;
}

export function EditorPanel({ draft, onChange, onItemChange, onAddItem, onRemoveItem }: EditorPanelProps) {
    const { grandTotal } = useQuoteTotal(draft.items, draft.hasVat, draft.discountRate, draft.isTaxExempt);

    // Explicitly casting handlers to satisfy child prop expectations if needed
    const handleDraftChange = onChange as (field: keyof QuoteDraft, value: any) => void;
    const handleItemChange = onItemChange as (id: string, field: keyof QuoteLineItem, value: any) => void;

    return (
        <div className="w-[90%] h-full bg-slate-950 flex flex-col shadow-2xl z-20 border-r border-slate-800">

            {/* Header: Elementor Style */}
            <div className="h-20 px-6 flex items-center justify-between shrink-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <Link href="/quotes">
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-slate-700">
                            <ChevronLeft className="h-5 w-5 text-slate-400" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-tighter">Quote Builder</h2>
                        <p className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase mt-0.5">Editor V2.0</p>
                    </div>
                </div>

                <div className="bg-slate-950/50 px-4 py-2 rounded-2xl border border-slate-800/50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Total TTC</p>
                    <p className="font-black text-lg text-white">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(grandTotal)}
                    </p>
                </div>
            </div>

            {/* Elementor Tabs System */}
            <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 py-4 bg-slate-900 border-b border-slate-800/50">
                    <TabsList className="w-full h-12 bg-slate-950 border border-slate-800 p-2 rounded-2xl flex">
                        <TabsTrigger
                            value="details"
                            className="flex-1 min-w-0 px-2 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 font-bold text-[10px] 2xl:text-xs uppercase tracking-widest transition-all whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                            <Calendar className="w-3.5 h-3.5 mr-1 2xl:mr-2 shrink-0 hidden xl:inline-block" /> Détails
                        </TabsTrigger>
                        <TabsTrigger
                            value="client"
                            className="flex-1 min-w-0 px-2 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 font-bold text-[10px] 2xl:text-xs uppercase tracking-widest transition-all whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                            <User className="w-3.5 h-3.5 mr-1 2xl:mr-2 shrink-0 hidden xl:inline-block" /> Client
                        </TabsTrigger>
                        <TabsTrigger
                            value="items"
                            className="flex-1 min-w-0 px-2 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 font-bold text-[10px] 2xl:text-xs uppercase tracking-widest transition-all whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                            <FileText className="w-3.5 h-3.5 mr-1 2xl:mr-2 shrink-0 hidden xl:inline-block" /> Prestations
                        </TabsTrigger>
                        <TabsTrigger
                            value="design"
                            className="flex-1 min-w-0 px-2 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 font-bold text-[10px] 2xl:text-xs uppercase tracking-widest transition-all whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                            <Paintbrush className="w-3.5 h-3.5 mr-1 2xl:mr-2 shrink-0 hidden xl:inline-block" /> Thème
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <div className="px-6 py-8">
                        <TabsContent value="details" className="mt-0 outline-none w-full">
                            <TabDetails draft={draft} onChange={handleDraftChange} />
                        </TabsContent>

                        <TabsContent value="client" className="mt-0 outline-none w-full">
                            <TabClient draft={draft} onChange={handleDraftChange} />
                        </TabsContent>

                        <TabsContent value="items" className="mt-0 outline-none w-full">
                            <TabItems
                                draft={draft}
                                onItemChange={handleItemChange}
                                onAddItem={onAddItem}
                                onRemoveItem={onRemoveItem}
                                onDraftChange={handleDraftChange}
                            />
                        </TabsContent>

                        <TabsContent value="design" className="mt-0 outline-none w-full">
                            <TabDesign draft={draft} onChange={handleDraftChange} />
                        </TabsContent>
                    </div>
                </ScrollArea>
            </Tabs>

            {/* Bottom Global Actions */}
            <div className="p-6 bg-slate-900/50 border-t border-slate-800 backdrop-blur-md shrink-0 grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 rounded-2xl border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-white font-bold text-xs uppercase tracking-widest transition-all">
                    <Save className="mr-2 h-4 w-4" /> Brouillon
                </Button>
                <Button className="h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 border-0 font-bold text-xs uppercase tracking-widest transition-all">
                    <Send className="mr-2 h-4 w-4" /> Finaliser
                </Button>
            </div>
        </div>
    );
}
