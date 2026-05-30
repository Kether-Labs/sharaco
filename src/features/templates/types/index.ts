export interface DocumentTemplate {
    id: string;
    name: string;
    user_id: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    text_color: string;
    background_color: string;
    logo_url?: string;
    font_family: string;
    header_text?: string;
    footer_text?: string;
    show_bank_details: boolean;
    show_tax_id: boolean;
    layout_style: 'classic' | 'modern' | 'minimal';
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface DocumentPreviewItem {
    description: string;
    quantity: number;
    unit_price_cents: number;
    tax_rate: number;
}
export interface DocumentPreviewRequest {
    type: 'DEVIS' | 'FACTURE';
    // Client
    client_name: string;
    client_email: string;
    client_address: string;
    client_phone: string;
    // Articles
    items: DocumentPreviewItem[];
    // Template
    template_id?: string | null;
    layout_style: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    text_color: string;
    background_color: string;
    font_family: string;
    header_text?: string | null;
    footer_text?: string | null;
    show_bank_details: boolean;
    show_tax_id: boolean;
    // Méta
    notes?: string | null;
    reference?: string | null;
}
export interface Layout {
    id: 'classic' | 'modern' | 'minimal';
    name: string;
    description: string;
    preview_url: string;
}
export interface TemplateCreate {
    name: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    text_color: string;
    background_color: string;
    logo_url?: string;
    font_family: string;
    header_text?: string;
    footer_text?: string;
    show_bank_details?: boolean;
    show_tax_id?: boolean;
    layout_style: 'classic' | 'modern' | 'minimal';
    is_default?: boolean;
}

export interface TemplateUpdate {
    name?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    text_color?: string;
    background_color?: string;
    logo_url?: string;
    font_family?: string;
    header_text?: string;
    footer_text?: string;
    show_bank_details?: boolean;
    show_tax_id?: boolean;
    layout_style?: 'classic' | 'modern' | 'minimal';
    is_default?: boolean;
}