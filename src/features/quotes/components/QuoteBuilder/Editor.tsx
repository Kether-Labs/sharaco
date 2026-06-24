"use client";

import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { QuoteDraft, QuoteLineItem } from "../../types/QuoteBuilder";
import { EditorPanel } from "./EditorPanel";
import { LivePreview } from "./LivePreview";
import { Plus, Minus, Maximize, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import { EditorHeader } from "./EditorHeader";

import type { DocumentPreviewRequest } from "../../types";
import { useToast } from "@/hooks/use-toast";
import { useDownloadPdf } from "@/features/templates/hooks/useDownloadPdf";
import { DownloadLoader } from "../DownloadLoader";
interface EditorProps {
    templateId?: string | null;
    documentId?: string;
}

export function Editor({ templateId, documentId }: EditorProps) {
    const { downloadPdf, isDownloading } = useDownloadPdf();
    const { toast } = useToast();

    const [draft, setDraft] = useState<QuoteDraft>({
        id: documentId,
        clientId: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
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
        brandColor: "#0ea5e9",
        isSaved: false,
        templateId: templateId || null,
        layoutStyle: templateId || "classic"
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
                    tax_rate: draft.vatRate || 20
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

    /**
     * handleDownload : Génère et télécharge le PDF du devis.
     * - Si le devis est sauvegardé en DB → GET /documents/{id}/pdf
     * - Si pas sauvegardé → POST /documents/preview/pdf (sans sauvegarde)
     */
    const handleDownload = useCallback(async () => {
        const previewRequest: DocumentPreviewRequest = {
            type: "DEVIS",
            client_name: draft.clientName || "Client Exemple",
            client_email: draft.clientEmail || "",
            client_address: draft.clientAddress || "",
            client_phone: draft.clientPhone || "",
            items: draft.items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                unit_price_cents: item.unitPrice,
                tax_rate: item.tax_rate,
            })),
            template_id: draft.templateId || null,
            layout_style: draft.layoutStyle || "classic",
            primary_color: draft.brandColor || "#2563EB",
            secondary_color: "#1E40AF",
            accent_color: "#DBEAFE",
            text_color: "#1F2937",
            background_color: "#FFFFFF",
            font_family: "Inter",
            header_text: null,
            footer_text: null,
            show_bank_details: true,
            show_tax_id: true,
            notes: draft.notes || null,
            reference: draft.reference || null,
        };

        try {
            await downloadPdf(
                previewRequest,
                draft.isSaved ? draft.id : null,
                `${draft.reference || 'devis'}.pdf`
            );
            toast({
                title: "PDF téléchargé",
                description: "Le devis a été téléchargé au format PDF.",
            });
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: "Impossible de télécharger le PDF. Veuillez réessayer.",
                variant: "destructive",
            });
        }
    }, [draft, downloadPdf, toast]);

    const handleSave = useCallback(() => {
        // TODO: Implémenter la sauvegarde via l'API
        // Pour l'instant, on marque le draft comme sauvegardé
        setDraft(prev => ({ ...prev, isSaved: true }));
        toast({
            title: "Devis enregistré",
            description: "Le devis a été sauvegardé comme brouillon.",
        });
    }, [toast]);

    const [zoom, setZoom] = useState(0.85);
    const [showActions, setShowActions] = useState(false);

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
                downloadPdf={handleDownload}
                isDownloading={isDownloading}
            />

            <DownloadLoader
            isVisible={isDownloading}
            filename={`${draft.reference || 'devis'}.pdf`}
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
                                templateId={draft.templateId || null}
                                layoutStyle={draft.layoutStyle || "classic"}
                                draft={draft}
                            />
                        </div>
                    </div>
                </div>

                {/* Floating Hint */}
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
