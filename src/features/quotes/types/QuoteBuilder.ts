export interface QuoteLineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    tax_rate: number; // e.g., 20 for 20% — correspond au champ backend
}

export interface QuoteDraft {
    id?: string;              // UUID du document (si sauvegardé)
    clientId?: string;        // ID du client en DB
    clientName: string;
    clientEmail: string;
    clientPhone?: string;     // Téléphone du client
    clientAddress: string;
    reference: string;
    date: string;
    validityDays: number;
    hasVat: boolean;
    vatRate?: number;         // Taux de TVA par défaut
    isTaxExempt: boolean;
    discountRate: number;
    items: QuoteLineItem[];
    notes?: string;
    internalNotes?: string;
    logoUrl?: string | null;
    brandColor?: string;
    isSaved?: boolean;        // Indique si le draft est sauvegardé en DB
    templateId?: string | null;  // ID du template sélectionné
    layoutStyle?: string;     // "classic" | "modern" | "minimal"
}
