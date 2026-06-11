export type DocumentType = 'DEVIS' | 'FACTURE';
export type DocumentStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'PAID' | 'CANCELLED';

export interface DocumentItem {
  id: string;
  description: string;
  quantity: number;
  unit_price_cents: number;
  tax_rate: number;
  document_id: string;
}

export interface Document {
  id: string;
  type: DocumentType;
  status: DocumentStatus;
  number?: string;
  created_at: string;
  due_date?: string;
  sent_at?: string;
  viewed_at?: string;
  user_id: string;
  client_id: string;
  template_id?: string;
  items?: DocumentItem[];
  subtotal_cents?: number;
  tax_total_cents?: number;
  total_cents?: number;
  client?: {
    id: string;
    name: string;
    email?: string;
  };
}

export interface DocumentCreate {
  type: DocumentType;
  client_id: string;
  template_id?: string;
  due_date?: string;
  items: {
    description: string;
    quantity: number;
    unit_price_cents: number;
    tax_rate: number;
  }[];
}

export interface DocumentStatusUpdate {
  status: DocumentStatus;
}

/**
 * Requête d'aperçu de document pour le endpoint POST /documents/preview/pdf.
 * Utilisé pour générer un PDF sans sauvegarder en DB.
 * Correspond au schema Python DocumentPreviewRequest.
 */
export interface DocumentPreviewRequest {
  type?: string;
  client_name?: string;
  client_email?: string;
  client_address?: string;
  client_phone?: string;
  items: {
    description: string;
    quantity: number;
    unit_price_cents: number;
    tax_rate?: number;
  }[];
  template_id?: string | null;
  layout_style?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  text_color?: string;
  background_color?: string;
  font_family?: string;
  header_text?: string | null;
  footer_text?: string | null;
  show_bank_details?: boolean;
  show_tax_id?: boolean;
  notes?: string | null;
  reference?: string | null;
}