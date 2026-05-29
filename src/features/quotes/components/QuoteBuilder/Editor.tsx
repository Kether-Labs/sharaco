"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { QuoteDraft, QuoteLineItem } from "../../types/QuoteBuilder";
import { EditorPanel } from "./EditorPanel";
import { LivePreview } from "./LivePreview";
import { Plus, Minus, Maximize, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LayoutPreview } from "@/features/templates/components/LayoutPreview";

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
        isTaxExempt: false,
        discountRate: 0,
        items: [
            {
                id: uuidv4(),
                description: "Design UI/UX - Mobile App",
                quantity: 1,
                unitPrice: 1500,
                taxRate: 20
            }
        ],
        notes: "Merci pour votre confiance. Conditions de paiement : 30% d'acompte à la signature, solde à la livraison.",
        internalNotes: "",
        logoUrl: null,
        brandColor: "#0ea5e9"
    });

    const [zoom, setZoom] = useState(0.85);

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
                    taxRate: 20
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

    return (
        <div className="flex h-[100dvh] w-screen overflow-hidden bg-zinc-950 font-sans selection:bg-sky-500/30">
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
            <main className="flex-1 relative overflow-hidden bg-[#fafafa] dark:bg-zinc-900/50">
                {/* Background Workbench Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                
                {/* Scrollable Canvas Area */}
                <div className="absolute inset-0 overflow-auto custom-scrollbar pt-24 pb-32">
                    <div 
                        className="flex justify-center transition-transform duration-300 ease-out origin-top"
                        style={{ transform: `scale(${zoom})` }}
                    >
                        <div className="w-full max-w-[1000px] px-12">
                            <LayoutPreview
                                                        layoutId={templateId as any} 
                                                        className="w-full h-[120vh] cover border-0" 
                                                    />
                        </div>
                    </div>
                </div>

                {/* Combined Status & Zoom Bar */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
                    {/* Status Part */}
                    <div className="px-4 py-2 rounded-2xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-3">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">A4 Canvas</span>
                        <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <span className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Editing Mode</span>
                    </div>

                    {/* Zoom Part */}
                    <div className="px-2 py-1.5 rounded-2xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.4))}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex items-center justify-center w-14">
                            <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100">
                                {Math.round(zoom * 100)}%
                            </span>
                        </div>

                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                            onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.5))}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>

                        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1" />

                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
                            onClick={() => setZoom(0.85)}
                            title="Reset Zoom"
                        >
                            <Maximize className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                        </Button>
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
