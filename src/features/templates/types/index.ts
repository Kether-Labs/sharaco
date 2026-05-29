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