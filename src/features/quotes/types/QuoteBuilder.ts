export interface QuoteLineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    tax_rate: number; // e.g., 20 for 20%
}

export interface QuoteDraft {
    id: string; 
    clientId: string | null;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    clientPhone: string; // NOUVEAU : champ téléphone
    reference: string;
    date: string;
    validityDays: number;
    hasVat: boolean;
    vatRate: number;
    isTaxExempt: boolean;
    discountRate: number;
    items: QuoteLineItem[];
    notes?: string;
    internalNotes?: string;
    logoUrl?: string | null;
    brandColor?: string;
    templateId: string | null;
    layoutStyle: string;  // "classic" | "modern" | "minimal"
    isSaved: boolean;     // ← NOUVEAU : track si le document est sauvé en DB
}
