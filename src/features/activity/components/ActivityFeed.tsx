// features/activity/components/ActivityFeed.tsx
"use client";

import { useActivity, ActivityItem } from "../hooks/useActivity";
import {
    Folder, File, CheckCircle2, XCircle, Send, Eye,
    Loader2, Filter
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
    limit?: number;
    compact?: boolean;
}

const iconMap: Record<string, any> = {
    folder: Folder,
    file: File,
    "check-circle": CheckCircle2,
    "x-circle": XCircle,
    send: Send,
    eye: Eye,
};

const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    slate: "bg-slate-500/10 text-slate-400 border-slate-500/20",
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

    // Grouper par période
    const groupedActivities = activities.reduce((acc, activity) => {
        const { group } = formatTimestamp(activity.timestamp);
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(activity);
        return acc;
    }, {} as Record<string, ActivityItem[]>);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 text-sky-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filtres */}
            {!compact && (
                <div className="flex items-center gap-3 flex-wrap">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[180px] bg-zinc-900 border-white/10 text-white">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10">
                            <SelectItem value="all">Tous les types</SelectItem>
                            <SelectItem value="PROJECT">Projets</SelectItem>
                            <SelectItem value="DOCUMENT">Documents</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={actionFilter} onValueChange={setActionFilter}>
                        <SelectTrigger className="w-[180px] bg-zinc-900 border-white/10 text-white">
                            <SelectValue placeholder="Action" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10">
                            <SelectItem value="all">Toutes les actions</SelectItem>
                            <SelectItem value="CREATED">Création</SelectItem>
                            <SelectItem value="UPDATED">Modification</SelectItem>
                            <SelectItem value="SENT">Envoi</SelectItem>
                            <SelectItem value="ACCEPTED">Acceptation</SelectItem>
                            <SelectItem value="REFUSED">Refus</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Timeline */}
            {Object.keys(groupedActivities).length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                    <p>Aucune activité récente</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedActivities).map(([group, items]) => (
                        <div key={group}>
                            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-3 px-1">
                                {group}
                            </h3>
                            <div className="space-y-2">
                                {items.map((activity) => {
                                    const Icon = iconMap[activity.icon] || File;
                                    const colors = colorMap[activity.color] || colorMap.slate;
                                    const { time } = formatTimestamp(activity.timestamp);

                                    return (
                                        <Link
                                            key={activity.id}
                                            href={activity.link || "#"}
                                            className="block"
                                        >
                                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900 border border-white/5 hover:border-white/10 transition-all group">
                                                {/* Icône */}
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 border",
                                                    colors
                                                )}>
                                                    <Icon className="h-5 w-5" />
                                                </div>

                                                {/* Contenu */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-white truncate group-hover:text-sky-400 transition-colors">
                                                                {activity.title}
                                                            </p>
                                                            {activity.subtitle && (
                                                                <p className="text-sm text-zinc-500 mt-0.5">
                                                                    {activity.subtitle}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-zinc-600 flex-shrink-0">
                                                            {time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}