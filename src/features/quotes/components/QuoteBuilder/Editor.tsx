// features/quotes/components/Editor.tsx
"use client"

import { useCallback, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { QuoteDraft, QuoteLineItem } from "../../types/QuoteBuilder";
import { EditorPanel } from "./EditorPanel";
import { LivePreview } from "./LivePreview";
import { EditorHeader } from "./EditorHeader";

import { useToast } from "@/hooks/use-toast";
import { useDownloadPdf } from "@/features/templates/hooks/useDownloadPdf";
import { quotesApi } from "@/features/quotes/api/quotesApi";
import { clientsApi } from "@/features/clients/api/clientsApi";
import { useRouter } from "next/navigation";
import { useAutoSave } from "../../hooks/useAutoSave";
import { useDocumentUpdate } from "../../hooks/useDocumentUpdate";
import { useBeforeUnload } from "../../hooks/useBeforeUnload";
import { DownloadLoader } from "../DownloadLoader";

interface EditorProps {
    templateId?: string | null;
    documentId?: string;
}

export function Editor({ templateId, documentId }: EditorProps) {
    const router = useRouter();
    const { downloadPdf, isDownloading } = useDownloadPdf();
    const { toast } = useToast();
    
    const [isLoading, setIsLoading] = useState(!!documentId);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    // ✅ Déterminer le mode
    const isEditMode = !!documentId;

    const [draft, setDraft] = useState<QuoteDraft>({
        id: null,
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
        notes: "Merci pour votre confiance.",
        internalNotes: "",
        logoUrl: null,
        brandColor: "#0ea5e9",
        isSaved: false,
        templateId: templateId || null,
        layoutStyle: templateId || "classic"
    });

    // ✅ Hook pour la CRÉATION (auto-save une fois)
    const { 
        isSaving, 
        lastSavedAt, 
        saveStatus, 
        documentId: savedDocumentId,
        isSaved,
        markAsChanged,
    } = useAutoSave({
        draft,
        enabled: !isEditMode, // Désactivé en mode édition
    });

    // ✅ Hook pour la MISE À JOUR (manuel)
    const {
        isUpdating,
        lastUpdatedAt,
        updateStatus,
        updateDocument,
    } = useDocumentUpdate({
        draft,
        documentId: documentId || '',
        onUpdateSuccess: () => {
            setHasUnsavedChanges(false);
        },
    });

    
    // Alerte de sortie
    useBeforeUnload(hasUnsavedChanges);

    // Charger un document existant
    useEffect(() => {
        if (!documentId) {
            setIsLoading(false);
            return;
        }

        const loadDocument = async () => {
            try {
                setIsLoading(true);
                setLoadError(null);

                const doc = await quotesApi.getById(documentId);
                
                let clientData = { name: "", email: "", phone: "", address: "" };
                try {
                    const client = await clientsApi.getById(doc.client_id);
                    clientData = {
                        name: client.name || "",
                        email: client.email || "",
                        phone: client.phone || "",
                        address: client.address || "",
                    };
                } catch (err) {
                    console.warn("Client non trouvé:", err);
                }

                const mappedItems = (doc.items || []).map((item) => ({
                    id: uuidv4(),
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unit_price_cents,
                    tax_rate: item.tax_rate,
                }));

                let validityDays = 30;
                if (doc.due_date && doc.created_at) {
                    const diff = new Date(doc.due_date).getTime() - new Date(doc.created_at).getTime();
                    validityDays = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
                }

                setDraft({
    id: doc.id,
    clientId: doc.client_id,
    clientName: clientData.name,
    clientEmail: clientData.email,
    clientPhone: clientData.phone,
    clientAddress: clientData.address,
    reference: doc.number || `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    date: doc.created_at ? new Date(doc.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    validityDays,
    hasVat: true,
    vatRate: 20,
    isTaxExempt: false,
    discountRate: 0,
    items: mappedItems.length > 0 ? mappedItems : [{
        id: uuidv4(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        tax_rate: 20,
    }],
    notes: doc.notes || "",
    internalNotes: "",
    logoUrl: null,
    // ✅ CORRECTION : Lire la couleur sauvegardée
    brandColor: (doc as any).primary_color || "#0ea5e9",
    isSaved: true,
    templateId: doc.template_id || null,
    layoutStyle: (doc as any).layout_style || "classic",
});
                console.log("✅ Document chargé:", doc.id, "- Mode édition");

            } catch (error: any) {
                if (error.response?.status === 404) {
                    console.warn("⚠️ Document non trouvé, mode création");
                    setDraft(prev => ({ ...prev, id: null, isSaved: false }));
                } else {
                    console.error("❌ Erreur chargement:", error);
                    setLoadError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadDocument();
    }, [documentId]);

    // Handlers
    const handleDraftChange = (field: keyof QuoteDraft, value: any) => {
        setDraft(prev => ({ ...prev, [field]: value }));
        setHasUnsavedChanges(true);
        markAsChanged();
    };

    const handleItemChange = (id: string, field: keyof QuoteLineItem, value: any) => {
        setDraft(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
        setHasUnsavedChanges(true);
        markAsChanged();
    };

    const addItem = () => {
        setDraft(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { id: uuidv4(), description: "", quantity: 1, unitPrice: 0, tax_rate: draft.vatRate || 20 }
            ]
        }));
        setHasUnsavedChanges(true);
        markAsChanged();
    };

    const removeItem = (id: string) => {
        if (draft.items.length === 1) return;
        setDraft(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
        setHasUnsavedChanges(true);
        markAsChanged();
    };

    // ✅ Handler de sauvegarde unifié
    const handleSave = useCallback(() => {
        if (isEditMode) {
            // Mode édition → mise à jour manuelle
            updateDocument();
        } else {
            // Mode création → auto-save (déjà géré par le hook)
            // Rien à faire, le hook s'en occupe
        }
    }, [isEditMode, updateDocument]);

    const handleDownload = useCallback(async () => {
        const previewRequest = {
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
            await downloadPdf(previewRequest, draft.isSaved ? draft.id : null, `${draft.reference || 'devis'}.pdf`);
            toast({ title: "PDF téléchargé", description: "Le fichier a été téléchargé avec succès." });
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de télécharger le PDF.", variant: "destructive" });
        }
    }, [draft, downloadPdf, toast]);

    const [zoom, setZoom] = useState(0.85);
    const [showActions, setShowActions] = useState(false);

    // État de chargement
    if (isLoading) {
        return (
            <div className="flex h-[100dvh] w-screen items-center justify-center bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
                    <p className="text-zinc-400 font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="flex h-[100dvh] w-screen items-center justify-center bg-zinc-950">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-4">Erreur</h2>
                    <p className="text-zinc-400 mb-6">{loadError}</p>
                    <button onClick={() => router.push('/dashboard/quotes')} className="px-6 py-3 bg-sky-500 text-white rounded-xl">
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    // Déterminer les états à passer au header
    const currentIsSaving = isEditMode ? isUpdating : isSaving;
    const currentLastSavedAt = isEditMode ? lastUpdatedAt : lastSavedAt;
    const currentSaveStatus = isEditMode ? updateStatus : saveStatus;

    return (
        <div className="flex h-[100dvh] w-screen overflow-hidden bg-zinc-950 font-sans">
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
                isSaving={currentIsSaving}
                lastSavedAt={currentLastSavedAt}
                saveStatus={currentSaveStatus}
                hasUnsavedChanges={hasUnsavedChanges}
                isEditMode={isEditMode}
            />

            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <aside className="w-[450px] xl:w-[500px] h-full shrink-0 relative overflow-hidden">
                <EditorPanel
                    draft={draft}
                    onChange={handleDraftChange}
                    onItemChange={handleItemChange}
                    onAddItem={addItem}
                    onRemoveItem={removeItem}
                />
            </aside>

            <main className="flex-1 relative overflow-hidden bg-[#fafafa] dark:bg-zinc-900/50 pt-[72px]">
                <div className="absolute inset-0 overflow-auto custom-scrollbar pt-24 pb-32">
                    <div className="flex justify-center transition-transform duration-300 origin-top" style={{ transform: `scale(${zoom})` }}>
                        <div className="w-full max-w-[1000px] px-12">
                            <LivePreview
                                templateId={draft.templateId || null}
                                layoutStyle={draft.layoutStyle || "classic"}
                                draft={draft}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <DownloadLoader isVisible={isDownloading} filename={`${draft.reference || 'devis'}.pdf`} />
        </div>
    );
}