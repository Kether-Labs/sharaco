"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { QuoteDraft, QuoteLineItem } from "../../types/QuoteBuilder";
import { EditorPanel } from "./EditorPanel";
import { LivePreview } from "./LivePreview";

export function Editor() {
    const [draft, setDraft] = useState<QuoteDraft>({
        clientName: "",
        clientAddress: "",
        reference: `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().split('T')[0],
        validityDays: 30,
        hasVat: true,
        discountRate: 0,
        items: [
            {
                id: uuidv4(),
                description: "Design UI/UX",
                quantity: 1,
                unitPrice: 1500,
                taxRate: 20
            }
        ],
        notes: "Merci pour votre confiance. Conditions de paiement : 30% d'acompte à la signature, solde à la livraison."
    });

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
        if (draft.items.length === 1) return; // Keep at least one item
        setDraft(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-950">
            {/* Left Side: Controls Panel */}
            <EditorPanel
                draft={draft}
                onChange={handleDraftChange}
                onItemChange={handleItemChange}
                onAddItem={addItem}
                onRemoveItem={removeItem}
            />

            {/* Right Side: Live A4 Preview */}
            <div className="flex-1 relative overflow-hidden bg-slate-100/50 dark:bg-slate-900/50">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Scrollable Canvas */}
                <LivePreview draft={draft} />
            </div>
        </div>
    );
}
