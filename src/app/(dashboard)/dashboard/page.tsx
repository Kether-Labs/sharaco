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
            <div className="mt-12 md:mt-16">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Activité récente
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Suivez les dernières actions sur vos projets et devis.
                    </p>
                </div>
                <ActivityFeed limit={20} />
            </div>
        </div>
    );
}