"use client";

import { useState, useEffect } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { templatesApi } from "@/features/templates/api/templatesApi";
import type { QuoteDraft } from "../../types/QuoteBuilder";
import { DocumentPreviewRequest } from "@/features/templates/types";
import { Loader2 } from "lucide-react";
// ton type ajouté précédemment
import { cn } from "@/lib/utils"
interface LivePreviewProps {
    draft: QuoteDraft;
    layoutStyle?: string;
    templateId?: string | null;
}

/**
 * Convertit le draft frontend → format attendu par POST /documents/preview
 */
function draftToPreviewRequest(
    draft: QuoteDraft,
    layoutStyle: string,
    templateId?: string | null
): DocumentPreviewRequest {
    return {
        type: "DEVIS",
        // Client
        client_name: draft.clientName || "Client Exemple",
        client_email: draft.clientEmail || "",
        client_address: draft.clientAddress || "",
        client_phone: "",
        // Articles — mapping des champs frontend → backend
        items: draft.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price_cents: item.unitPrice, // FCFA = pas de centimes
            tax_rate: draft.hasVat ? draft.vatRate : 0,
        })),
        // Template
        template_id: templateId || null,
        layout_style: layoutStyle,
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
        // Méta
        notes: draft.notes || null,
        reference: draft.reference || null,
    };
}

export function LivePreview({ draft, layoutStyle = "classic", templateId }: LivePreviewProps) {
    const [previewHtml, setPreviewHtml] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🔑 Debounce : attend 500ms après la dernière modif
    const debouncedDraft = useDebouncedValue(draft, 500);

    useEffect(() => {
        let cancelled = false;

        async function fetchPreview() {
            setIsLoading(true);
            setError(null);

            try {
                const requestData = draftToPreviewRequest(
                    debouncedDraft,
                    layoutStyle,
                    templateId
                );
                const html = await templatesApi.previewDocument(requestData);

                if (!cancelled) {
                    setPreviewHtml(html);
                }
            } catch (err: any) {
                if (!cancelled) {
                    setError(err.message || "Erreur aperçu");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchPreview();

        // Cleanup : si le draft change avant la réponse, on annule
        return () => {
            cancelled = true;
        };
    }, [debouncedDraft, layoutStyle, templateId]);

    return (
        <div className="relative w-full h-full">
            {/* Loading indicator — petit bandeau discret */}
            {isLoading && (
                <div className="absolute top-2 right-2 z-10 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
                    <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest animate-pulse">
                        Mise à jour...
                    </span>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-950/20">
                    <div className="text-center p-6">
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                            Erreur aperçu
                        </p>
                        <p className="text-xs text-red-500/70 mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Preview iframe */}
            {previewHtml ? (
                <iframe
                    srcDoc={previewHtml}
                    className="w-full h-[120vh] border-0 bg-white"
                    title="Aperçu du document"
                    sandbox="allow-same-origin"
                />
            ) : (
                /* Loading skeleton avant le premier rendu */
                 <div className={cn(
                                
                                "flex flex-col h-[120vh] items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden relative"
                            )}>
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                <div className="flex flex-col items-center gap-4 relative z-10">
                                    <div className="h-12 w-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 text-sky-500 animate-spin" />
                                    </div>
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Engine Rendering...</span>
                                </div>
                            </div>
            )}
        </div>
    );
}