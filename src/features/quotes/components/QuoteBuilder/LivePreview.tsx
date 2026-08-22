// features/quotes/components/LivePreview.tsx
"use client";

import { useState, useEffect } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { templatesApi } from "@/features/templates/api/templatesApi";
import type { QuoteDraft } from "../../types/QuoteBuilder";
import { DocumentPreviewRequest } from "@/features/templates/types";
import { Loader2, AlertCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils"

interface LivePreviewProps {
    draft: QuoteDraft;
    layoutStyle?: string;
    templateId?: string | null;
}

function draftToPreviewRequest(
    draft: QuoteDraft,
    layoutStyle: string,
    templateId?: string | null
): DocumentPreviewRequest {
    const hasValidSchedule =
        draft.paymentMilestones &&
        draft.paymentMilestones.length > 0 &&
        !(draft.paymentMilestones.length === 1 && draft.paymentMilestones[0].percent === 100);

    return {
        type: "DEVIS",
        client_name: draft.clientName || "Client Exemple",
        client_email: draft.clientEmail || "",
        client_address: draft.clientAddress || "",
        client_phone: draft.clientPhone || "",
        items: draft.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price_cents: item.unitPrice,
            tax_rate: draft.hasVat ? draft.vatRate : 0,
        })),
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
        notes: draft.notes || null,
        reference: draft.reference || null,
        payment_schedule: hasValidSchedule
            ? draft.paymentMilestones!.map((ms, idx) => ({
                sequence: idx + 1,
                title: ms.title || `Échéance ${idx + 1}`,
                percent: ms.percent,
                description: ms.description || null,
                trigger_date: ms.trigger_date || null,
            }))
            : null,
    };
}

export function LivePreview({ draft, layoutStyle = "classic", templateId }: LivePreviewProps) {
    const [previewHtml, setPreviewHtml] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

        return () => {
            cancelled = true;
        };
    }, [debouncedDraft, layoutStyle, templateId]);

    return (
        <div className="relative w-full min-h-[80vh] lg:min-h-[120vh]">
            {/* ═══════════ LOADING BADGE (discret) ═══════════ */}
            {isLoading && (
                <div className="absolute top-2 right-2 z-10 px-2.5 sm:px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 backdrop-blur-sm">
                    <span className="text-[9px] sm:text-[10px] font-bold text-sky-500 uppercase tracking-widest animate-pulse flex items-center gap-1.5">
                        <Loader2 className="h-2.5 w-2.5 animate-spin" />
                        <span className="hidden sm:inline">Mise à jour...</span>
                        <span className="sm:hidden">...</span>
                    </span>
                </div>
            )}

            {/* ═══════════ ERROR STATE ═══════════ */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-950/20 rounded-xl">
                    <div className="text-center p-4 sm:p-6 max-w-sm">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                            Erreur aperçu
                        </p>
                        <p className="text-xs text-red-500/70 mt-1 line-clamp-2">{error}</p>
                    </div>
                </div>
            )}

            {/* ═══════════ PREVIEW IFRAME ═══════════ */}
            {previewHtml ? (
                <div className="relative w-full">
                    {/* Conteneur avec aspect ratio adaptatif */}
                    <div className="w-full bg-white shadow-2xl shadow-slate-900/10 dark:shadow-black/40 rounded-sm overflow-hidden mx-auto max-w-full">
                        <iframe
                            srcDoc={previewHtml}
                            className="w-full border-0 bg-white block"
                            style={{
                                // Hauteur adaptative : plus petite sur mobile, plus grande sur desktop
                                height: '140vh',
                                minHeight: '800px',
                            }}
                            title="Aperçu du document"
                            sandbox="allow-same-origin"
                        />
                    </div>
                </div>
            ) : (
                /* ═══════════ SKELETON LOADING ═══════════ */
                <div className={cn(
                    "flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden relative rounded-sm shadow-xl",
                    "min-h-[60vh] lg:min-h-[800px]"
                )}>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

                    <div className="flex flex-col items-center gap-3 sm:gap-4 relative z-10 px-6">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-sky-500" />
                        </div>
                        <div className="text-center">
                            <span className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] block">
                                Engine Rendering
                            </span>
                            <span className="text-slate-500 text-[10px] sm:text-xs mt-1 block">
                                Génération de l'aperçu...
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}