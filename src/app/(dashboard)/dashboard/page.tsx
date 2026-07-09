// app/dashboard/page.tsx
"use client";

import { ActivityFeed } from "@/features/activity/components/ActivityFeed";
import { DocumentsStats } from "@/features/quotes/components/DocumentsStats";

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                    Tableau de bord
                </h1>
                <p className="text-zinc-500 mt-1">
                    Vue d'ensemble de votre activité
                </p>
            </div>

            {/* Stats */}
            <DocumentsStats />

            {/* Activité récente */}
            <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-white">
                        Activité récente
                    </h2>
                </div>
                <ActivityFeed limit={20} />
            </div>
        </div>
    );
}