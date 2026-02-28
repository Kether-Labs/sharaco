"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QuoteDraft } from "../../../types/QuoteBuilder";
import { Search, User, Mail, MapPin, Building } from "lucide-react";

interface TabClientProps {
    draft: QuoteDraft;
    onChange: (field: keyof QuoteDraft, value: any) => void;
}

export function TabClient({ draft, onChange }: TabClientProps) {
    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                    placeholder="Rechercher un client existant..."
                    className="pl-10 bg-slate-950 border-slate-800 text-slate-300 focus:border-indigo-500 rounded-xl h-12"
                />
            </div>

            <div className="h-px bg-slate-800 w-full my-6" />

            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <User className="h-3 w-3" /> Nom du client
                    </label>
                    <Input
                        value={draft.clientName}
                        onChange={(e) => onChange("clientName", e.target.value)}
                        placeholder="John Doe"
                        className="bg-slate-900 border-slate-800 text-slate-200 focus:border-indigo-500 rounded-xl"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="h-3 w-3" /> Adresse Email
                    </label>
                    <Input
                        type="email"
                        value={draft.clientEmail}
                        onChange={(e) => onChange("clientEmail", e.target.value)}
                        placeholder="client@exemple.com"
                        className="bg-slate-900 border-slate-800 text-slate-200 focus:border-indigo-500 rounded-xl"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="h-3 w-3" /> Adresse Postale
                    </label>
                    <Textarea
                        value={draft.clientAddress}
                        onChange={(e) => onChange("clientAddress", e.target.value)}
                        placeholder="123 Rue de la Réussite, 75000 Paris"
                        className="bg-slate-900 border-slate-800 text-slate-200 focus:border-indigo-500 rounded-xl min-h-[100px] resize-none"
                    />
                </div>
            </div>
        </div>
    );
}
