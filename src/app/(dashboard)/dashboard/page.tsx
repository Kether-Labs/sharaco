"use client"

import * as React from "react"
import { motion } from "framer-motion"
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
import Link from "next/link"

export default function DashboardPage() {
    const { data: stats, isLoading: isStatsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
    const { data: revenueData, isLoading: isRevenueLoading } = useDashboardRevenue(12);

    if (statsError) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
                <p className="text-red-500 font-bold tracking-tight">Une erreur est survenue lors du chargement.</p>
                <Button onClick={() => refetchStats()} variant="outline" className="rounded-2xl">Réessayer</Button>
            </div>
        )
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex-1 space-y-10 pb-20"
        >
            {/* Header section with refined typography */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                        Overview
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                        Analytics and real-time business performance.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 font-bold shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>

                    <Link href="/dashboard/quotes/create">
                    <Button className="h-12 px-6 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/20 transition-all active:scale-95">
                        <Plus className="mr-2 h-4 w-4" /> Nouveau Devis
                    </Button>
                    </Link>
                </div>
            </div>

            {/* BENTO GRID ROW 1 — Primary KPIs */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {isStatsLoading ? (
                    [...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-[2rem]" />)
                ) : (
                    <>
                        <KPICard
                            title="Revenue"
                            value={formatCurrency(stats?.montant_paye_cents || 0)}
                            change="+12.5%"
                            trend="up"
                            description="vs last month"
                            icon={DollarSign}
                            iconColorClass="text-emerald-500"
                            iconBgClass="bg-emerald-500/10"
                        />
                        <KPICard
                            title="Pending"
                            value={formatCurrency(stats?.montant_en_attente_cents || 0)}
                            description="Active quotes"
                            icon={Clock}
                            iconColorClass="text-amber-500"
                            iconBgClass="bg-amber-500/10"
                        />
                        <KPICard
                            title="Conversion"
                            value={`${stats?.taux_conversion || 0}%`}
                            change={`${(stats?.taux_conversion || 0) > 50 ? '+' : ''}${((stats?.taux_conversion || 0) - 45).toFixed(1)}%`}
                            trend={(stats?.taux_conversion || 0) > 50 ? 'up' : 'down'}
                            description="success rate"
                            icon={TrendingUp}
                            iconColorClass={(stats?.taux_conversion || 0) > 50 ? "text-emerald-500" : "text-rose-500"}
                            iconBgClass={(stats?.taux_conversion || 0) > 50 ? "bg-emerald-500/10" : "bg-rose-500/10"}
                        />
                        <KPICard
                            title="Active Clients"
                            value={stats?.total_clients || 0}
                            description="Total contacts"
                            icon={Users}
                            iconColorClass="text-sky-500"
                            iconBgClass="bg-sky-500/10"
                        />
                    </>
                )}
            </div>

            {/* BENTO GRID ROW 2 — Large Charts with Asymmetry */}
            {revenueData && revenueData.length > 0 && (
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        {isRevenueLoading ? (
                            <Skeleton className="h-[400px] rounded-[2.5rem]" />
                        ) : (
                            <RevenueChart data={revenueData || []} />
                        )}
                    </div>
                    <div>
                        {isStatsLoading ? (
                            <Skeleton className="h-[400px] rounded-[2.5rem]" />
                        ) : (
                            <DistributionChart
                                draft={stats?.devis_draft || 0}
                                sent={stats?.devis_sent || 0}
                                viewed={stats?.devis_viewed || 0}
                                paid={stats?.devis_paid || 0}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* ROW 3 — Recent Documents */}
            <RecentDocuments />

            {/* ROW 4 — Secondary KPIs */}
            {revenueData && revenueData.length > 0 && (
                <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                    {isStatsLoading ? (
                        [...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-3xl" />)
                    ) : (
                        <>
                            <KPICard
                                title="Monthly Quotes"
                                value={stats?.devis_ce_mois || 0}
                                icon={FileText}
                                iconColorClass="text-indigo-500"
                                iconBgClass="bg-indigo-500/10"
                            />
                            <KPICard
                                title="Monthly Invoices"
                                value={stats?.factures_ce_mois || 0}
                                icon={FileSpreadsheet}
                                iconColorClass="text-cyan-500"
                                iconBgClass="bg-cyan-500/10"
                            />
                            <KPICard
                                title="Drafts"
                                value={stats?.devis_draft || 0}
                                icon={FileEdit}
                                iconColorClass="text-slate-500"
                                iconBgClass="bg-slate-500/10"
                            />
                            <KPICard
                                title="Failed Reminders"
                                value={stats?.relances_echouees || 0}
                                icon={AlertTriangle}
                                iconColorClass={(stats?.relances_echouees || 0) > 0 ? "text-white" : "text-slate-500"}
                                iconBgClass={(stats?.relances_echouees || 0) > 0 ? "bg-rose-500 animate-pulse" : "bg-slate-500/10"}
                                valueColorClass={(stats?.relances_echouees || 0) > 0 ? "text-rose-500" : undefined}
                            />
                        </>
                    )}
                </div>
            )}
        </motion.div>
    )
}
