"use client";

import { QuoteDraft, QuoteLineItem } from "../../types/QuoteBuilder";
import { User, Calendar, Paintbrush, ReceiptText, CreditCard } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuoteTotal } from "../../hooks/useQuoteTotal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabDetails } from "./tabs/TabDetails";
import { TabClient } from "./tabs/TabClient";
import { TabItems } from "./tabs/TabItems";
import { TabDesign } from "./tabs/TabDesign";
import { PaymentScheduleEditor } from "@/features/invoices/components/PaymentScheduleEditor";

interface EditorPanelProps {
    draft: QuoteDraft;
    onChange: <K extends keyof QuoteDraft>(field: K, value: QuoteDraft[K]) => void;
    onItemChange: <K extends keyof QuoteLineItem>(id: string, field: K, value: QuoteLineItem[K]) => void;
    onAddItem: () => void;
    onRemoveItem: (id: string) => void;
}

export function EditorPanel({ draft, onChange, onItemChange, onAddItem, onRemoveItem }: EditorPanelProps) {
    const { grandTotal } = useQuoteTotal(draft.items, draft.hasVat, draft.vatRate, draft.discountRate, draft.isTaxExempt);

    // ✅ NOUVEAU : Handler qui gère le changement de mode + initialisation des milestones
    const handlePaymentModeChange = (mode: 'simple' | 'schedule') => {
        // Toujours mettre à jour le mode
        onChange('paymentMode', mode);
        
        if (mode === 'schedule') {
            // Vérifier si les milestones actuelles sont valides
            const currentMilestones = draft.paymentMilestones || [];
            const totalPercent = currentMilestones.reduce(
                (sum, m) => sum + (m.percent || 0), 0
            );
            const isValid = Math.abs(totalPercent - 100) < 0.01;
            const hasDefaultMilestone = 
                currentMilestones.length === 1 && 
                currentMilestones[0].percent === 100 &&
                currentMilestones[0].title === 'Paiement intégral';
            
            // Si invalide ou juste le "100% par défaut" → initialiser avec 50/50
            if (!isValid || currentMilestones.length === 0 || hasDefaultMilestone) {
                onChange('paymentMilestones', [
                    {
                        id: crypto.randomUUID(),
                        title: 'Acompte à la commande',
                        percent: 50,
                        description: '',
                        trigger_date: '',
                    },
                    {
                        id: crypto.randomUUID(),
                        title: 'Solde à la livraison',
                        percent: 50,
                        description: '',
                        trigger_date: '',
                    },
                ]);
            }
        } else {
            // Mode simple → remettre le milestone par défaut
            onChange('paymentMilestones', [
                {
                    id: crypto.randomUUID(),
                    title: 'Paiement intégral',
                    percent: 100,
                    description: '',
                    trigger_date: '',
                },
            ]);
        }
    };

    return (
        <div className="w-full h-full bg-zinc-950 flex flex-col border-r border-white/5 relative z-20 pt-[72px]">
            <Tabs defaultValue="items" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 py-4 bg-zinc-950">
                    <TabsList className="w-full h-11 bg-zinc-900/50 border border-white/5 p-1 rounded-xl">
                        {[
                            { value: "items", icon: ReceiptText, label: "Items" },
                            { value: "client", icon: User, label: "Client" },
                            { value: "details", icon: Calendar, label: "Info" },
                            { value: "payment", icon: CreditCard, label: "Paiement" },
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

                        <TabsContent value="payment" className="mt-0 outline-none">
                            <PaymentScheduleEditor
                                totalAmount={grandTotal}
                                value={draft.paymentMilestones}
                                onChange={(milestones) => onChange('paymentMilestones', milestones)}
                                paymentMode={draft.paymentMode}
                                onModeChange={handlePaymentModeChange}  // ✅ Utiliser le nouveau handler
                                disabled={false}
                            />
                        </TabsContent>

                        <TabsContent value="design" className="mt-0 outline-none">
                            <TabDesign draft={draft} onChange={onChange} />
                        </TabsContent>
                    </div>
                </ScrollArea>
            </Tabs>
        </div>
    );
}