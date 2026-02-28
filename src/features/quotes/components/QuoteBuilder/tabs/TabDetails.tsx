"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { QuoteDraft } from "../../../types/QuoteBuilder";
import { Calendar, FileText, Info } from "lucide-react";

interface TabDetailsProps {
    draft: QuoteDraft;
    onChange: (field: keyof QuoteDraft, value: any) => void;
}

export function TabDetails({ draft, onChange }: TabDetailsProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="h-3 w-3" /> Référence du devis
                    </label>
                    <Input
                        value={draft.reference}
                        readOnly
                        className="bg-slate-900/50 border-slate-800 text-slate-300 focus:border-indigo-500 rounded-xl"
                        placeholder="AUTO-GENERATED"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="h-3 w-3" /> Date d'émission
                        </label>
                        <Input
                            type="date"
                            value={draft.date}
                            onChange={(e) => onChange("date", e.target.value)}
                            className="bg-slate-900 border-slate-800 text-slate-200 focus:border-indigo-500 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="h-3 w-3" /> Validité (jours)
                        </label>
                        <Input
                            type="number"
                            min="1"
                            value={draft.validityDays}
                            onChange={(e) => onChange("validityDays", parseInt(e.target.value) || 0)}
                            className="bg-slate-900 border-slate-800 text-slate-200 focus:border-indigo-500 rounded-xl"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl mt-4 hover:border-indigo-500/50 transition-colors">
                    <div className="space-y-0.5">
                        <label className="text-sm font-bold text-slate-200 tracking-tight cursor-pointer" htmlFor="tax-exempt">Exonéré de TVA</label>
                        <p className="text-[10px] text-slate-500">Idéal pour les auto-entrepreneurs.</p>
                    </div>
                    <Switch
                        id="tax-exempt"
                        checked={draft.isTaxExempt}
                        onCheckedChange={(checked) => onChange("isTaxExempt", checked)}
                    />
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-800">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        Notes internes
                    </label>
                    <Textarea
                        placeholder="Ces notes ne seront pas visibles sur le devis final..."
                        value={draft.internalNotes}
                        onChange={(e) => onChange("internalNotes", e.target.value)}
                        className="bg-slate-900 border-slate-800 text-slate-200 focus:border-indigo-500 rounded-xl min-h-[120px] resize-none"
                    />
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Info className="h-3 w-3" /> Utiliser pour le suivi de projet, délais prévus, etc.
                    </p>
                </div>
            </div>
        </div>
    );
}
