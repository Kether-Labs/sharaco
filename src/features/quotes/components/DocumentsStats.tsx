// features/quotes/components/DocumentsStats.tsx
"use client";

import { useDocumentsStats } from "../hooks/useDocumentsStats";
import {
    CheckCircle2, XCircle, Clock, Eye, Send, Loader2,
    TrendingUp, FileText, DollarSign, Target
} from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCurrency } from "../lib/formatCurrency";

interface DocumentsStatsProps {
    onFilterByStatus?: (status: string | null) => void;
    currentFilter?: string | null;
}

export function DocumentsStats({ onFilterByStatus, currentFilter }: DocumentsStatsProps) {
    const { data: stats, isLoading } = useDocumentsStats();

    if (isLoading || !stats) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 animate-pulse">
                        <div className="h-4 w-20 bg-white/10 rounded mb-3" />
                        <div className="h-8 w-16 bg-white/10 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    const statusCards = [
        {
            key: "ACCEPTED",
            label: "Acceptés",
            icon: CheckCircle2,
            color: "emerald",
            count: stats.by_status.ACCEPTED?.count || 0,
            total: stats.by_status.ACCEPTED?.total_cents || 0,
        },
        {
            key: "REFUSED",
            label: "Refusés",
            icon: XCircle,
            color: "rose",
            count: stats.by_status.REFUSED?.count || 0,
            total: stats.by_status.REFUSED?.total_cents || 0,
        },
        {
            key: "PENDING",
            label: "En attente",
            icon: Clock,
            color: "amber",
            count: (stats.by_status.SENT?.count || 0) + (stats.by_status.VIEWED?.count || 0),
            total: (stats.by_status.SENT?.total_cents || 0) + (stats.by_status.VIEWED?.total_cents || 0),
        },
        {
            key: "CONVERSION",
            label: "Taux de conversion",
            icon: Target,
            color: "violet",
            count: stats.conversion_rate,
            total: null,
            isPercentage: true,
        },
    ];

    const colorMap: Record<string, { bg: string; text: string; border: string; icon: string }> = {
        emerald: {
            bg: "bg-emerald-500/10",
            text: "text-emerald-400",
            border: "border-emerald-500/20",
            icon: "bg-emerald-500/10 text-emerald-400",
        },
        rose: {
            bg: "bg-rose-500/10",
            text: "text-rose-400",
            border: "border-rose-500/20",
            icon: "bg-rose-500/10 text-rose-400",
        },
        amber: {
            bg: "bg-amber-500/10",
            text: "text-amber-400",
            border: "border-amber-500/20",
            icon: "bg-amber-500/10 text-amber-400",
        },
        violet: {
            bg: "bg-violet-500/10",
            text: "text-violet-400",
            border: "border-violet-500/20",
            icon: "bg-violet-500/10 text-violet-400",
        },
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statusCards.map((card) => {
                const colors = colorMap[card.color];
                const Icon = card.icon;
                const isActive = currentFilter === card.key;

                return (
                    <button
                        key={card.key}
                        onClick={() => onFilterByStatus?.(isActive ? null : card.key)}
                        className={cn(
                            "bg-zinc-900 border rounded-2xl p-6 text-left transition-all hover:scale-[1.02]",
                            colors.border,
                            isActive && "ring-2 ring-offset-2 ring-offset-black",
                            isActive && card.key === "ACCEPTED" && "ring-emerald-500",
                            isActive && card.key === "REFUSED" && "ring-rose-500",
                            isActive && card.key === "PENDING" && "ring-amber-500",
                            isActive && card.key === "CONVERSION" && "ring-violet-500",
                        )}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black uppercase tracking-wider text-zinc-500">
                                {card.label}
                            </span>
                            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", colors.icon)}>
                                <Icon className="h-4 w-4" />
                            </div>
                        </div>

                        <div className={cn("text-3xl font-black", colors.text)}>
                            {card.isPercentage ? (
                                <>{card.count}%</>
                            ) : (
                                card.count
                            )}
                        </div>

                        {card.total !== null && !card.isPercentage && (
                            <p className="text-xs text-zinc-500 mt-1 font-medium">
                                {formatCurrency(card.total)}
                            </p>
                        )}
                    </button>
                );
            })}
        </div>
    );
}