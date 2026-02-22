export interface QuoteLineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number; // e.g., 20 for 20%
}

export interface QuoteDraft {
    clientName: string;
    clientAddress: string;
    reference: string;
    date: string;
    validityDays: number;
    hasVat: boolean;
    discountRate: number;      // e.g., 10 for 10% global discount
    items: QuoteLineItem[];
    notes?: string;
}
