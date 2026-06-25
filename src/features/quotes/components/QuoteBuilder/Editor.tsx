// components/quotes/Editor.tsx
import { useCallback, useState, useEffect } from "react";
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
import { quotesApi } from "@/features/quotes/api/quotesApi";
import { clientsApi } from "@/features/clients/api/clientsApi"; // ← Adapter selon ton API
import { useAutoSave } from "../../hooks/useAutoSave";
import { DownloadLoader } from "../DownloadLoader";

interface EditorProps {
    templateId?: string | null;
    documentId?: string;
}

export function Editor({ templateId, documentId }: EditorProps) {
    const { downloadPdf, isDownloading } = useDownloadPdf();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(!!documentId);
    const [loadError, setLoadError] = useState<string | null>(null);

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
        notes: "Merci pour votre confiance. Conditions de paiement : 30% d'acompte à la signature, solde à la livraison.",
        internalNotes: "",
        logoUrl: null,
        brandColor: "#0ea5e9",
        isSaved: false,
        templateId: templateId || null,
        layoutStyle: templateId || "classic"
    });

    // Auto-save hook
    const { 
        isSaving, 
        lastSavedAt, 
        saveStatus, 
        documentId: savedDocumentId,
        isSaved,
        saveDraft,
    } = useAutoSave({
        draft,
        enabled: true,
        debounceMs: 2000,
    });

    // ✅ Charger un document existant depuis le backend
   useEffect(() => {
    if (!documentId) return;

    const loadDocument = async () => {
        try {
            setIsLoading(true);
            setLoadError(null);

            // 1. Charger le document
            const doc = await quotesApi.getById(documentId);
            
            // 2. Charger le client associé
            let clientData = {
                name: "",
                email: "",
                phone: "",
                address: "",
            };
            
            try {
                const client = await clientsApi.getById(doc.client_id);
                clientData = {
                    name: client.name || "",
                    email: client.email || "",
                    phone: client.phone || "",
                    address: client.address || "",
                };
            } catch (clientError) {
                console.warn("⚠️ Impossible de charger le client:", clientError);
            }

            // 3. Mapper les items
            const mappedItems: QuoteLineItem[] = (doc.items || []).map((item) => ({
                id: uuidv4(),
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unit_price_cents,
                tax_rate: item.tax_rate,
            }));

            // 4. Calculer validityDays
            let validityDays = 30;
            if (doc.due_date && doc.created_at) {
                const createdDate = new Date(doc.created_at);
                const dueDate = new Date(doc.due_date);
                const diffTime = dueDate.getTime() - createdDate.getTime();
                validityDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
            }

            // 5. Mettre à jour le draft
            setDraft({
                id: doc.id,
                clientId: doc.client_id,
                clientName: clientData.name,
                clientEmail: clientData.email,
                clientPhone: clientData.phone,
                clientAddress: clientData.address,
                reference: doc.number || `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
                date: doc.created_at ? new Date(doc.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                validityDays: validityDays,
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
                brandColor: "#0ea5e9",
                isSaved: true,
                templateId: doc.template_id || null,
                layoutStyle: (doc as any).layout_style || "classic",
            });

            console.log("✅ Document chargé avec succès:", doc.id);

        } catch (error: any) {
            // ✅ Si 404, c'est un nouveau document, passer en mode création
            if (error.response?.status === 404 || error.message?.includes("introuvable")) {
                console.warn("⚠️ Document non trouvé, passage en mode création");
                // Ne pas afficher d'erreur, juste passer en mode création
                setDraft(prev => ({
                    ...prev,
                    id: null, // ← Réinitialiser l'ID
                    isSaved: false,
                }));
            } else {
                console.error("❌ Erreur chargement document:", error);
                setLoadError(error.message || "Impossible de charger le document");
                toast({
                    title: "Erreur de chargement",
                    description: "Impossible de charger le document demandé.",
                    variant: "destructive",
                });
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
            setTimeout(() => {
                toast({
                    title: "PDF téléchargé",
                    description: `Le fichier ${draft.reference}.pdf a été téléchargé avec succès.`,
                });
            }, 300);
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: "Impossible de télécharger le PDF. Veuillez réessayer.",
                variant: "destructive",
            });
        }
    }, [draft, downloadPdf, toast]);

    const [zoom, setZoom] = useState(0.85);
    const [showActions, setShowActions] = useState(false);

    // ✅ État de chargement
    if (isLoading) {
        return (
            <div className="flex h-[100dvh] w-screen items-center justify-center bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
                    <p className="text-zinc-400 font-medium">Chargement du document...</p>
                </div>
            </div>
        );
    }

    // ✅ État d'erreur
    if (loadError) {
        return (
            <div className="flex h-[100dvh] w-screen items-center justify-center bg-zinc-950">
                <div className="flex flex-col items-center gap-4 max-w-md text-center">
                    <div className="h-16 w-16 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                        <svg className="h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white">Erreur de chargement</h2>
                    <p className="text-zinc-400">{loadError}</p>
                    <Button 
                        onClick={() => window.location.href = '/dashboard/quotes'}
                        className="bg-sky-500 hover:bg-sky-400 text-white"
                    >
                        Retour au tableau de bord
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[100dvh] w-screen overflow-hidden bg-zinc-950 font-sans selection:bg-sky-500/30">
            {/* Global Header */}
            <EditorHeader
                draft={draft}
                zoom={zoom}
                onZoomIn={() => setZoom(prev => Math.min(prev + 0.1, 1.5))}
                onZoomOut={() => setZoom(prev => Math.max(prev - 0.1, 0.4))}
                onResetZoom={() => setZoom(0.85)}
                onSave={saveDraft}
                onColorChange={(color) => handleDraftChange('brandColor', color)}
                showActions={showActions}
                setShowActions={setShowActions}
                downloadPdf={handleDownload}
                isDownloading={isDownloading}
                isSaving={isSaving}
                lastSavedAt={lastSavedAt}
                saveStatus={saveStatus}
            />

            {/* Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Left Side: Controls Panel */}
            <aside className="w-[450px] xl:w-[500px] h-full shrink-0 relative overflow-hidden">
                <EditorPanel
                    draft={draft}
                    onChange={handleDraftChange}
                    onItemChange={handleItemChange}
                    onAddItem={addItem}
                    onRemoveItem={removeItem}
                />
            </aside>

            {/* Right Side: Live A4 Preview */}
            <main className="flex-1 relative overflow-hidden bg-[#fafafa] dark:bg-zinc-900/50 pt-[72px]">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

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

                <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-zinc-900/10 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/5 pointer-events-none">
                    <div className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Precision Preview</span>
                    </div>
                </div>
            </main>

            {/* Download Loader */}
            <DownloadLoader 
                isVisible={isDownloading}
                filename={`${draft.reference || 'devis'}.pdf`}
            />
        </div>
    );
}