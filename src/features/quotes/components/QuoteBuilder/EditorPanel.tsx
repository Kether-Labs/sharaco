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
        <div className="w-full h-full bg-zinc-950 flex flex-col border-r border-white/5 relative z-20 pt-[72px]">
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
              
            </Tabs>
        </div>
    );
}
