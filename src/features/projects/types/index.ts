// features/projects/types.ts

export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'CANCELLED';

export type AttachmentType = 'CDC' | 'CONTRACT' | 'SPEC' | 'OTHER';

export interface ProjectAttachment {
    id: string;
    name: string;
    file_url: string;
    file_type: AttachmentType;
    uploaded_at: string;
    project_id: string;
    user_id: string;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    budget_cents?: number;
    start_date?: string;
    end_date?: string;
    created_at: string;
    updated_at?: string;
    user_id: string;
    client_id: string;
    client_name?: string;
    documents_count?: number;
    total_invoiced_cents?: number;
    attachments?: ProjectAttachment[];
}

export interface ProjectCreate {
    name: string;
    description?: string;
    status?: ProjectStatus;
    budget_cents?: number;
    start_date?: string;
    end_date?: string;
    client_id: string;
}

export interface ProjectUpdate {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    budget_cents?: number;
    start_date?: string;
    end_date?: string;
    client_id?: string;
}

export interface ProjectAttachmentCreate {
    name: string;
    file_url: string;
    file_type?: AttachmentType;
}