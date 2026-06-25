// hooks/useAutoSave.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { quotesApi } from '@/features/quotes/api/quotesApi';
import type { QuoteDraft } from '@/features/quotes/types';
import { useDebounce } from './useDebounce';

interface UseAutoSaveProps {
    draft: QuoteDraft;
    enabled?: boolean;
    debounceMs?: number;
}

export function useAutoSave({ draft, enabled = true, debounceMs = 2000 }: UseAutoSaveProps) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    
    // ✅ CRITIQUE : documentId ne vient PAS de draft.id
    // Il vient seulement du backend après un CREATE réussi
    const [documentId, setDocumentId] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState<boolean>(false); // ← Toujours false au début
    
    const draftRef = useRef(draft);
    const previousDraftRef = useRef<string>('');
    const hasChangesRef = useRef(false);
    const saveInProgressRef = useRef(false);

    useEffect(() => {
        draftRef.current = draft;
        
        const currentDraftStr = JSON.stringify(draft);
        if (previousDraftRef.current && previousDraftRef.current !== currentDraftStr) {
            hasChangesRef.current = true;
        }
        previousDraftRef.current = currentDraftStr;
    }, [draft]);

    const debouncedDraft = useDebounce(draft, debounceMs);

    const saveDraft = useCallback(async (forceSave = false) => {
        if (!enabled) return;
        
        // Éviter les sauvegardes concurrentes
        if (saveInProgressRef.current) {
            console.log('⏳ Sauvegarde déjà en cours, skip');
            return;
        }
        
        if (!forceSave && (!hasChangesRef.current || isSaving)) {
            return;
        }

        saveInProgressRef.current = true;
        setIsSaving(true);
        setSaveStatus('saving');

        try {
            const payload = {
                type: 'DEVIS',
                client_id: draftRef.current.clientId,
                items: draftRef.current.items.map(item => ({
                    description: item.description || "Article",
                    quantity: Math.max(1, item.quantity || 1),
                    unit_price_cents: Math.max(0, item.unitPrice || 0),
                    tax_rate: Math.min(100, Math.max(0, item.tax_rate || 20)),
                })),
                layout_style: draftRef.current.layoutStyle || "classic",
                template_id: null,
                due_date: draftRef.current.validityDays 
                    ? new Date(Date.now() + draftRef.current.validityDays * 24 * 60 * 60 * 1000).toISOString()
                    : undefined,
                notes: draftRef.current.notes || undefined,
            };

            console.log('📤 === AUTO-SAVE ===');
            console.log('🔑 documentId:', documentId);
            console.log('✅ isSaved:', isSaved);
            console.log('📝 Payload:', payload);

            let response;

            if (documentId && isSaved) {
                // UPDATE - Le document existe en DB
                console.log('🔄 Mode UPDATE');
                try {
                    response = await quotesApi.update(documentId, payload);
                    console.log('✅ UPDATE réussi');
                } catch (updateError: any) {
                    // Si UPDATE échoue avec 404, le document n'existe pas
                    if (updateError.response?.status === 404) {
                        console.warn('⚠️ Document non trouvé en DB, passage en mode CREATE');
                        // Réinitialiser et faire CREATE
                        setDocumentId(null);
                        setIsSaved(false);
                        
                        response = await quotesApi.create({
                            ...payload,
                            id: undefined, // Laisser le backend générer l'ID
                        } as any);
                        console.log('✅ CREATE réussi (après 404)');
                    } else {
                        throw updateError;
                    }
                }
            } else {
                // CREATE - Première sauvegarde
                console.log('✨ Mode CREATE - Nouveau document');
                response = await quotesApi.create({
                    ...payload,
                    id: undefined, // ← Laisser le backend générer l'ID
                } as any);
                console.log('✅ CREATE réussi, ID:', response.id);
            }

            // ✅ CRITIQUE : Mettre à jour documentId et isSaved après succès
            if (response?.id) {
                console.log('💾 Mise à jour documentId:', response.id);
                setDocumentId(response.id);
                setIsSaved(true);
            }

            setLastSavedAt(new Date());
            setSaveStatus('saved');
            hasChangesRef.current = false;
            
            if (forceSave || !isSaved) {
                toast({
                    title: isSaved ? 'Modifications enregistrées' : 'Brouillon enregistré',
                    description: 'Vos modifications sont sauvegardées.',
                    duration: 2000,
                });
            }

        } catch (error: any) {
            console.error('❌ Auto-save error:', error);
            console.error('📥 Error response:', error.response?.data);
            
            setSaveStatus('error');
            toast({
                title: 'Erreur de sauvegarde',
                description: error.response?.data?.detail 
                    ? JSON.stringify(error.response.data.detail)
                    : 'Impossible d\'enregistrer le brouillon.',
                variant: 'destructive',
                duration: 5000,
            });
        } finally {
            setIsSaving(false);
            saveInProgressRef.current = false;
        }
    }, [documentId, isSaved, enabled, isSaving, toast]);

    // Auto-save après debounce
    useEffect(() => {
        if (!enabled || !debouncedDraft) return;

        // Sauvegarder si :
        // - Le document est déjà sauvegardé (UPDATE)
        // - OU il y a des changements (CREATE ou UPDATE)
        if (isSaved || hasChangesRef.current) {
            saveDraft(false);
        }
    }, [debouncedDraft, saveDraft, enabled, isSaved]);

    const manualSave = useCallback(() => {
        saveDraft(true);
    }, [saveDraft]);

    // Save on unmount
    useEffect(() => {
        return () => {
            if (hasChangesRef.current) {
                saveDraft(true);
            }
        };
    }, [saveDraft]);

    return {
        isSaving,
        lastSavedAt,
        saveStatus,
        documentId,
        isSaved,
        saveDraft: manualSave,
        setDocumentId,
        setIsSaved,
    };
}