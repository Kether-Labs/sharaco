"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { QuoteDraft, QuoteLineItem } from "../../types/QuoteBuilder";
import { EditorPanel } from "./EditorPanel";
import { LivePreview } from "./LivePreview";
import { Plus, Minus, Maximize, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LayoutPreview } from "@/features/templates/components/LayoutPreview";
import { EditorHeader } from "./EditorHeader";


interface EditorProps {
    templateId?: string | null
}

export function Editor({ templateId }: EditorProps) {
    const [draft, setDraft] = useState<QuoteDraft>({
        clientName: "",
        clientEmail: "",
        clientAddress: "",
        reference: `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().split('T')[0],
        validityDays: 30,
        hasVat: true,
        vatRate: 20,
        isTaxExempt: false,
        discountRate: 0,
        items: [
            {
                id: uuidv4(),
                description: "Design UI/UX - Mobile App",
                quantity: 1,
                unitPrice: 1500,
                tax_rate: 20
            }
        ],
        notes: "Merci pour votre confiance. Conditions de paiement : 30% d'acompte à la signature, solde à la livraison.",
        internalNotes: "",
        logoUrl: null,
        brandColor: "#0ea5e9"
    });

    const [zoom, setZoom] = useState(0.85);
    const [showActions, setShowActions] = useState(false);

    const handleDraftChange = (field: keyof QuoteDraft, value: any) => {
        setDraft(prev => ({ ...prev, [field]: value }));
    };

    const handleItemChange = (id: string, field: keyof QuoteLineItem, value: any) => {
        setDraft(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const addItem = () => {
        setDraft(prev => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    id: uuidv4(),
                    description: "",
                    quantity: 1,
                    unitPrice: 0,
                    tax_rate: 20
                }
            ]
        }));
    };

    const removeItem = (id: string) => {
        if (draft.items.length === 1) return;
        setDraft(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };

    const handleSave = () => {
        // Logic for saving (API calls etc) would go here
        setShowActions(true);
    };

    return (
        <div className="flex h-[100dvh] w-screen overflow-hidden bg-zinc-950 font-sans selection:bg-sky-500/30">
            {/* Global Header */}
            <EditorHeader 
                draft={draft} 
                zoom={zoom}
                onZoomIn={() => setZoom(prev => Math.min(prev + 0.1, 1.5))}
                onZoomOut={() => setZoom(prev => Math.max(prev - 0.1, 0.4))}
                onResetZoom={() => setZoom(0.85)}
                onSave={handleSave}
                onColorChange={(color) => handleDraftChange('brandColor', color)}
                showActions={showActions}
                setShowActions={setShowActions}
            />

            {/* Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Left Side: Controls Panel (Fixed Width) */}
            <aside className="w-[450px] xl:w-[500px] h-full shrink-0 relative overflow-hidden">
                <EditorPanel
                    draft={draft}
                    onChange={handleDraftChange}
                    onItemChange={handleItemChange}
                    onAddItem={addItem}
                    onRemoveItem={removeItem}
                />
            </aside>

            {/* Right Side: Live A4 Preview (Flexible) */}
            <main className="flex-1 relative overflow-hidden bg-[#fafafa] dark:bg-zinc-900/50 pt-[72px]">
                {/* Background Workbench Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                
                {/* Scrollable Canvas Area */}
                <div className="absolute inset-0 overflow-auto custom-scrollbar pt-24 pb-32">
                    <div 
                        className="flex justify-center transition-transform duration-300 ease-out origin-top"
                        style={{ transform: `scale(${zoom})` }}
                    >
                        <div className="w-full max-w-[1000px] px-12">
                             <LivePreview
                                draft={draft}
                                layoutStyle={templateId || "classic"}
                                templateId={templateId}
                            />
                        </div>
                    </div>
                </div>

                {/* Floating Hint (Optional but nice) */}
                <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-zinc-900/10 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/5 pointer-events-none">
                    <div className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Precision Preview</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
