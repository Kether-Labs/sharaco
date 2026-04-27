"use client"

import * as React from "react"
import {
    Activity,
    DollarSign,
    Plus,
    FileText,
    Users,
    Clock,
    TrendingUp,
    FileSpreadsheet,
    FileEdit,
    AlertTriangle,
    Download,
    Calendar
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { KPICard } from "@/features/dashboard/components/KPICard"
import { RevenueChart } from "@/features/dashboard/components/RevenueChart"
import { DistributionChart } from "@/features/dashboard/components/DistributionChart"
import { RecentDocuments } from "@/features/dashboard/components/RecentDocuments"
import { RecentActivity } from "@/features/dashboard/components/RecentActivity"
import { useDashboardStats, useDashboardRevenue } from "@/features/dashboard/hooks/useDashboard"
import { formatCurrency } from "@/features/quotes/lib/formatCurrency"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
    const { data: stats, isLoading: isStatsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
    const { data: revenueData, isLoading: isRevenueLoading } = useDashboardRevenue(12);


    if (statsError) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
                <p className="text-red-500 font-medium">Une erreur est survenue lors du chargement des statistiques.</p>
                <Button onClick={() => refetchStats()} variant="outline">Réessayer</Button>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Tableau de bord
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">
                        Vue d'ensemble de votre activité.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                        <Plus className="mr-2 h-4 w-4" /> Nouveau Devis
                    </Button>
                </div>
            </div>

            {/* ROW 1 — 4 KPI Cards */}
            <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4">
                {isStatsLoading ? (
                    [...Array(4)].map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)
                ) : (
                    <>
                        <KPICard
                            title="Revenu encaissé"
                            value={formatCurrency(stats?.montant_paye_cents || 0)}
                            description={`Ce mois : ${formatCurrency(stats?.montant_paye_ce_mois_cents || 0)}`}
                            icon={DollarSign}
                            iconColorClass="text-emerald-500"
                            iconBgClass="bg-emerald-500/10"
                        />
                        <KPICard
                            title="En attente"
                            value={formatCurrency(stats?.montant_en_attente_cents || 0)}
                            description="Devis envoyés & consultés"
                            icon={Clock}
                            iconColorClass="text-amber-500"
                            iconBgClass="bg-amber-500/10"
                        />
                        <KPICard
                            title="Taux de conversion"
                            value={`${stats?.taux_conversion || 0}%`}
                            description="Devis → Payé"
                            icon={TrendingUp}
                            trend={(stats?.taux_conversion || 0) > 50 ? 'up' : 'down'}
                            iconColorClass={(stats?.taux_conversion || 0) > 50 ? "text-emerald-500" : "text-rose-500"}
                            iconBgClass={(stats?.taux_conversion || 0) > 50 ? "bg-emerald-500/10" : "bg-rose-500/10"}
                        />
                        <KPICard
                            title="Clients"
                            value={stats?.total_clients || 0}
                            description="Total contacts"
                            icon={Users}
                            iconColorClass="text-sky-500"
                            iconBgClass="bg-sky-500/10"
                        />
                    </>
                )}
            </div>

            {/* ROW 2 — Charts */}
            {revenueData && revenueData?.length > 0 && <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
                {isRevenueLoading ? (
                    <Skeleton className="col-span-1 lg:col-span-2 h-[350px] rounded-xl" />
                ) : (
                    <RevenueChart data={revenueData || []} />
                )}
                {isStatsLoading ? (
                    <Skeleton className="col-span-1 h-[350px] rounded-xl" />
                ) : (
                    <DistributionChart
                        draft={stats?.devis_draft || 0}
                        sent={stats?.devis_sent || 0}
                        viewed={stats?.devis_viewed || 0}
                        paid={stats?.devis_paid || 0}
                    />
                )}
            </div>}


            {/* ROW 3 — Recent Documents & Activity */}

            <RecentDocuments />
            {/* ROW 4 — Mini Stats */}

            {revenueData && revenueData?.length > 0 && <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
                {isStatsLoading ? (
                    [...Array(4)].map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)
                ) : (
                    <>
                        <KPICard
                            title="Devis ce mois"
                            value={stats?.devis_ce_mois || 0}
                            icon={FileText}
                            iconColorClass="text-indigo-500"
                            iconBgClass="bg-indigo-500/10"
                        />
                        <KPICard
                            title="Factures ce mois"
                            value={stats?.factures_ce_mois || 0}
                            icon={FileSpreadsheet}
                            iconColorClass="text-cyan-500"
                            iconBgClass="bg-cyan-500/10"
                        />
                        <KPICard
                            title="Devis brouillon"
                            value={stats?.devis_draft || 0}
                            icon={FileEdit}
                            iconColorClass="text-slate-500"
                            iconBgClass="bg-slate-500/10"
                        />
                        <KPICard
                            title="Relances échouées"
                            value={stats?.relances_echouees || 0}
                            icon={AlertTriangle}
                            iconColorClass={(stats?.relances_echouees || 0) > 0 ? "text-white" : "text-slate-500"}
                            iconBgClass={(stats?.relances_echouees || 0) > 0 ? "bg-rose-500" : "bg-slate-500/10"}
                            valueColorClass={(stats?.relances_echouees || 0) > 0 ? "text-rose-500" : undefined}
                        />
                    </>
                )}
            </div>}

        </div>
    )
}
