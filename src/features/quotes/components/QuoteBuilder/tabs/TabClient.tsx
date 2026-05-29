"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QuoteDraft } from "../../../types/QuoteBuilder";
import { Search, User, Mail, MapPin } from "lucide-react";

interface TabClientProps {
    draft: QuoteDraft;
    onChange: (field: keyof QuoteDraft, value: any) => void;
}

export function TabClient({ draft, onChange }: TabClientProps) {
    return (
        <div className="space-y-10 pb-32">
            {/* Header Description */}
            <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight">Client Information</h3>
                <p className="text-sm text-zinc-500">Search for an existing contact or enter new billing details manually.</p>
            </div>

            <div className="space-y-8">
                {/* Search existing */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-zinc-300 transition-colors" />
                    <Input
                        placeholder="Search CRM for existing client..."
                        className="h-12 pl-12 bg-white/[0.02] border-white/5 text-zinc-200 focus:border-white/10 focus:ring-1 focus:ring-white/10 rounded-2xl placeholder:text-zinc-700 transition-all shadow-inner"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em]">or manual entry</span>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                {/* Manual fields */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <User className="h-3 w-3" /> Client Name / Business
                        </label>
                        <Input
                            value={draft.clientName}
                            onChange={(e) => onChange("clientName", e.target.value)}
                            placeholder="e.g. Acme Corp or Jane Cooper"
                            className="h-11 bg-white/[0.02] border-white/5 text-zinc-200 focus:border-white/10 rounded-xl font-medium"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Mail className="h-3 w-3" /> Billing Email
                        </label>
                        <Input
                            type="email"
                            value={draft.clientEmail}
                            onChange={(e) => onChange("clientEmail", e.target.value)}
                            placeholder="billing@client.com"
                            className="h-11 bg-white/[0.02] border-white/5 text-zinc-200 focus:border-white/10 rounded-xl font-medium"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="h-3 w-3" /> Billing Address
                        </label>
                        <Textarea
                            value={draft.clientAddress}
                            onChange={(e) => onChange("clientAddress", e.target.value)}
                            placeholder="Street, City, Postcode, Country..."
                            className="bg-white/[0.02] border-white/5 text-zinc-200 focus:border-white/10 rounded-2xl min-h-[120px] resize-none p-4 leading-relaxed placeholder:text-zinc-700"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
