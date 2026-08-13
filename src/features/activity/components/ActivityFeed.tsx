// features/activity/components/ActivityFeed.tsx
"use client";

import { useActivity, ActivityItem } from "../hooks/useActivity";
import {
    Folder, File, CheckCircle2, XCircle, Send, Eye,
    Loader2, Search, Banknote, CreditCard, Wallet
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DocumentPreview } from "@/features/quotes/components/DocumentPreview";
import { formatCurrency } from "@/features/quotes/lib/formatCurrency";

interface ActivityFeedProps {
    limit?: number;
    compact?: boolean;
}

// ✅ Icônes étendues avec banknote pour PAID
const iconMap: Record<string, any> = {
    folder: Folder,
    file: File,
    "check-circle": CheckCircle2,
    "x-circle": XCircle,
    send: Send,
    eye: Eye,
    banknote: Banknote,
    "credit-card": CreditCard,
    wallet: Wallet,
};

const colorMap: Record<string, { icon: string; text: string; glow: string; border: string; badge?: string }> = {
    blue: { icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400", text: "text-blue-600 dark:text-blue-400", glow: "from-blue-500/20 via-transparent to-transparent", border: "group-hover:border-blue-500/30" },
    emerald: { icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", text: "text-emerald-600 dark:text-emerald-400", glow: "from-emerald-500/20 via-transparent to-transparent", border: "group-hover:border-emerald-500/30", badge: "bg-emerald-500" },
    rose: { icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400", text: "text-rose-600 dark:text-rose-400", glow: "from-rose-500/20 via-transparent to-transparent", border: "group-hover:border-rose-500/30" },
    amber: { icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400", text: "text-amber-600 dark:text-amber-400", glow: "from-amber-500/20 via-transparent to-transparent", border: "group-hover:border-amber-500/30" },
    sky: { icon: "bg-sky-500/10 text-sky-600 dark:text-sky-400", text: "text-sky-600 dark:text-sky-400", glow: "from-sky-500/20 via-transparent to-transparent", border: "group-hover:border-sky-500/30" },
    slate: { icon: "bg-slate-500/10 text-slate-600 dark:text-slate-400", text: "text-slate-600 dark:text-slate-400", glow: "from-slate-500/20 via-transparent to-transparent", border: "group-hover:border-slate-500/30" },
};

function formatTimestamp(timestamp: string): { group: string; time: string } {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    let group: string;
    if (diffHours < 24 && date.getDate() === now.getDate()) {
        group = "Aujourd'hui";
    } else if (diffHours < 48 && date.getDate() === now.getDate() - 1) {
        group = "Hier";
    } else if (diffDays < 7) {
        group = "Cette semaine";
    } else {
        group = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    }

    const time = date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return { group, time };
}

export function ActivityFeed({ limit = 20, compact = false }: ActivityFeedProps) {
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [actionFilter, setActionFilter] = useState<string>("all");

    const { data: activities = [], isLoading } = useActivity({
        limit,
        type_filter: typeFilter === "all" ? undefined : typeFilter as any,
        action_filter: actionFilter === "all" ? undefined : actionFilter,
    });

    const groupedActivities = activities.reduce((acc, activity) => {
        const { group } = formatTimestamp(activity.timestamp);
        if (!acc[group]) acc[group] = [];
        acc[group].push(activity);
        return acc;
    }, {} as Record<string, ActivityItem[]>);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-sky-500 animate-spin opacity-50" />
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    return (
        <div className="space-y-8">
            {/* Filtres */}
            {!compact && (
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full bg-slate-100/50 dark:bg-[#111] p-2 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-sm">
                    {/* Type filters */}
                    <div className="flex items-center gap-1 bg-slate-200/50 dark:bg-black/50 p-1.5 rounded-xl w-full sm:w-auto overflow-x-auto hide-scrollbar">
                        {["all", "PROJECT", "DOCUMENT"].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setTypeFilter(type)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex-1 sm:flex-none whitespace-nowrap",
                                    typeFilter === type
                                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                )}
                            >
                                {type === "all" ? "Tous" : type === "PROJECT" ? "Projets" : "Documents"}
                            </button>
                        ))}
                    </div>

                    {/* Action filters — ✅ AJOUTÉ : PAID */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 xl:pb-0 hide-scrollbar w-full xl:w-auto">
                        {[
                            { id: "all", label: "Toutes" },
                            { id: "CREATED", label: "Création" },
                            { id: "UPDATED", label: "Modification" },
                            { id: "SENT", label: "Envoi" },
                            { id: "ACCEPTED", label: "Accepté" },
                            { id: "PAID", label: "Payé" },  // ✅ NOUVEAU
                            { id: "REFUSED", label: "Refusé" }
                        ].map((action) => (
                            <button
                                key={action.id}
                                type="button"
                                onClick={() => setActionFilter(action.id)}
                                className={cn(
                                    "px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300",
                                    actionFilter === action.id
                                        ? action.id === "PAID"
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                            : "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5"
                                )}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Timeline / List */}
            {Object.keys(groupedActivities).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Search className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">Aucune activité récente</h4>
                    <p className="text-slate-500 mt-2 font-medium">Modifiez vos filtres ou revenez plus tard.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {Object.entries(groupedActivities).map(([group, items]) => (
                        <div key={group}>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-4 px-2 flex items-center gap-4">
                                {group}
                                <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
                            </h3>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6"
                            >
                                <AnimatePresence mode="popLayout">
                                    {items.map((activity) => {
                                        const Icon = iconMap[activity.icon] || File;
                                        const colors = colorMap[activity.color] || colorMap.slate;
                                        const { time } = formatTimestamp(activity.timestamp);

                                        const isDocument = activity.type === 'DOCUMENT';
                                        const isPaid = activity.action === 'PAID';
                                        const isInvoice = activity.metadata?.document_type === "FACTURE";
                                        const docId = activity.link ? activity.link.split('/').pop() : undefined;
                                        const amountCents = activity.metadata?.amount_cents || 0;

                                        return (
                                            <motion.div
                                                key={`${activity.id}-${activity.action}`}
                                                layout
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                                            >
                                                <Link
                                                    href={activity.link || "#"}
                                                    className={cn(
                                                        "group relative flex items-start gap-4 sm:gap-6 p-4 rounded-2xl transition-all duration-300",
                                                        "hover:bg-slate-50 dark:hover:bg-white/[0.02]",
                                                    )}
                                                >
                                                    {/* Visual / Thumbnail */}
                                                    <div className="relative flex-shrink-0">
                                                        {isDocument && docId && (
                                                            <div className="relative w-16 sm:w-20 aspect-[4/5] rounded-lg sm:rounded-xl overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-sm bg-white dark:bg-slate-900 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-300">
                                                                <div className="w-full h-full relative pointer-events-none">
                                                                    <DocumentPreview
                                                                        documentId={docId}
                                                                        layoutStyle={activity.metadata?.layout_style || "modern"}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0 pt-1 sm:pt-2">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <h4 className={cn(
                                                                "font-bold text-base sm:text-lg transition-colors line-clamp-2 text-slate-900 dark:text-white group-hover:text-sky-500",
                                                               
                                                                   
                                                            )}>
                                                                {activity.title}
                                                            </h4>
                                                            <span className={cn(
                                                                "text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5",
                                                               
                                                            )}>
                                                                {time}
                                                            </span>
                                                        </div>
                                                        
                                                        {activity.subtitle && (
                                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 sm:mt-1.5 line-clamp-2 leading-relaxed">
                                                                {activity.subtitle}
                                                            </p>
                                                        )}

                                                        {/* ✅ BADGE MONTANT pour les paiements */}
                                                        {isPaid && amountCents > 0 && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.1 }}
                                                                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg  border border-[#2563EB] shadow-sm"
                                                            >
                                                                <div className="h-1.5 w-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                                                                <span className="text-xs font-bold text-[#2563EB] dark:text-[#2563EB]">
                                                                    + {formatCurrency(amountCents)}
                                                                </span>
                                                                <span className="text-[10px] text-[#2563EB]/70 font-bold uppercase tracking-wider">
                                                                    encaissé
                                                                </span>
                                                            </motion.div>
                                                        )}

                                                        {/* Badge pour factures (non payées) */}
                                                        {isInvoice && !isPaid && (
                                                            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/20">
                                                                <CreditCard className="h-3 w-3 text-violet-500" />
                                                                <span className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">
                                                                    Facture
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}