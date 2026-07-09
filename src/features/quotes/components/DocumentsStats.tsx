// features/quotes/components/DocumentsStats.tsx
"use client";

import { useDocumentsStats } from "../hooks/useDocumentsStats";
import {
    CheckCircle2, XCircle, Clock, Target
} from "lucide-react";
import { motion } from "framer-motion";
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 rounded-3xl p-6 md:p-8 animate-pulse flex flex-col justify-between h-44">
                        <div className="flex justify-between items-center">
                            <div className="h-3 w-24 bg-slate-200 dark:bg-white/10 rounded-full" />
                            <div className="h-10 w-10 bg-slate-200 dark:bg-white/10 rounded-2xl" />
                        </div>
                        <div>
                            <div className="h-10 w-20 bg-slate-200 dark:bg-white/10 rounded-xl mb-3" />
                            <div className="h-3 w-24 bg-slate-200 dark:bg-white/10 rounded-full" />
                        </div>
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
            label: "Conversion",
            icon: Target,
            color: "violet",
            count: stats.conversion_rate,
            total: null,
            isPercentage: true,
        },
    ];

    const colorMap: Record<string, { text: string; icon: string; glow: string; bar: string }> = {
        emerald: {
            text: "text-emerald-600 dark:text-emerald-400",
            icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            glow: "from-emerald-500/20 via-transparent to-transparent",
            bar: "bg-emerald-500",
        },
        rose: {
            text: "text-rose-600 dark:text-rose-400",
            icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
            glow: "from-rose-500/20 via-transparent to-transparent",
            bar: "bg-rose-500",
        },
        amber: {
            text: "text-amber-600 dark:text-amber-400",
            icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            glow: "from-amber-500/20 via-transparent to-transparent",
            bar: "bg-amber-500",
        },
        violet: {
            text: "text-violet-600 dark:text-violet-400",
            icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
            glow: "from-violet-500/20 via-transparent to-transparent",
            bar: "bg-violet-500",
        },
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statusCards.map((card, index) => {
                const colors = colorMap[card.color];
                const Icon = card.icon;
                const isActive = currentFilter === card.key;
                const isClickable = !!onFilterByStatus;

                return (
                    <motion.button
                        key={card.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                        onClick={() => {
                            if (isClickable) onFilterByStatus(isActive ? null : card.key);
                        }}
                        disabled={!isClickable}
                        className={cn(
                            "relative group overflow-hidden text-left transition-all duration-500 rounded-3xl",
                            "bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border",
                            isClickable ? "cursor-pointer" : "cursor-default",
                            isActive 
                                ? "border-transparent shadow-lg scale-[1.02] ring-1 ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a0a]"
                                : "border-slate-200/50 dark:border-white/5 shadow-sm",
                            !isActive && isClickable && "hover:border-slate-300 dark:hover:border-white/10 hover:scale-[1.02]",
                            isActive && card.key === "ACCEPTED" && "ring-emerald-500 shadow-emerald-500/20",
                            isActive && card.key === "REFUSED" && "ring-rose-500 shadow-rose-500/20",
                            isActive && card.key === "PENDING" && "ring-amber-500 shadow-amber-500/20",
                            isActive && card.key === "CONVERSION" && "ring-violet-500 shadow-violet-500/20"
                        )}
                    >
                        {/* Background subtle glow */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 transition-opacity duration-500 bg-gradient-to-br",
                            colors.glow,
                            isClickable && "group-hover:opacity-100"
                        )} />

                        {isActive && (
                            <div className={cn(
                                "absolute inset-0 opacity-20 bg-gradient-to-br",
                                colors.glow
                            )} />
                        )}

                        <div className="relative z-10 p-5 md:p-8 flex flex-col h-full justify-between gap-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                                    {card.label}
                                </span>
                                <div className={cn(
                                    "h-10 w-10 rounded-2xl flex items-center justify-center transition-transform duration-500", 
                                    colors.icon,
                                    isClickable && "group-hover:scale-110",
                                    isActive && "scale-110"
                                )}>
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-baseline gap-1.5">
                                    <span className={cn(
                                        "text-4xl md:text-5xl font-black tracking-tighter transition-colors duration-500", 
                                        isActive ? colors.text : "text-slate-900 dark:text-white",
                                        isClickable && !isActive && `group-hover:${colors.text}`
                                    )}>
                                        {card.count}
                                        {card.isPercentage && <span className="text-2xl md:text-3xl ml-1 opacity-60">%</span>}
                                    </span>
                                </div>

                                {card.total !== null && !card.isPercentage && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className={cn("h-1.5 w-1.5 rounded-full", colors.bar)} />
                                        <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400">
                                            {formatCurrency(card.total)}
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            {card.isPercentage && (
                                <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 mt-2 overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${card.count}%` }}
                                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                        className={cn("h-full rounded-full", colors.bar)} 
                                    />
                                </div>
                            )}
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}