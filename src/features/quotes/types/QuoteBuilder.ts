export interface QuoteLineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number; // e.g., 20 for 20%
}

export interface QuoteDraft {
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    reference: string;
    date: string;
    validityDays: number;
    hasVat: boolean;
    isTaxExempt: boolean;
    discountRate: number;
    items: QuoteLineItem[];
    notes?: string;
    internalNotes?: string;
}
