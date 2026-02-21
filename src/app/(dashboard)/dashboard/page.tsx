"use client"

import * as React from "react"
import {
    Activity,
    DollarSign,
    Plus,
    FileText,
    Briefcase,
    Calendar,
    Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { KPICard } from "@/features/dashboard/components/KPICard"
import { RevenueChart } from "@/features/dashboard/components/RevenueChart"
import { DistributionChart } from "@/features/dashboard/components/DistributionChart"
import { QuotesHistory } from "@/features/dashboard/components/QuotesHistory"
import { ActivityFeed } from "@/features/dashboard/components/ActivityFeed"
import { sparklineData1, sparklineData2, sparklineData3, sparklineData4 } from "@/features/dashboard/data/SparklineData"

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-6 lg:space-y-8 p-4 md:p-8 pt-6 max-w-[1600px] mx-auto">
            {/* Enterprise Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Welcome back, John 👋
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">
                        Here's what's happening with your business today.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden md:flex bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Feb 12, 2024 - Feb 19, 2024</span>
                    </Button>
                    <Button variant="outline" size="icon" className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800">
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button className="bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-500/20 transition-all active:scale-95">
                        <Plus className="mr-2 h-4 w-4" /> New Quote
                    </Button>
                </div>
            </div>

            {/* KPI Cards with Sparklines */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Revenue"
                    value="$45,231.89"
                    change="+20.1%"
                    trend="up"
                    icon={DollarSign}
                    iconColor="text-emerald-500"
                    data={sparklineData1}
                    strokeColor="#10b981"
                />
                <KPICard
                    title="Active Quotes"
                    value="2,350"
                    change="+180.1%"
                    trend="up"
                    icon={FileText}
                    iconColor="text-sky-500"
                    data={sparklineData2}
                    strokeColor="#0ea5e9"
                />
                <KPICard
                    title="Acceptance Rate"
                    value="42.5%"
                    change="-4.5%"
                    trend="down"
                    icon={Activity}
                    iconColor="text-amber-500"
                    data={sparklineData3}
                    strokeColor="#f59e0b"
                />
                <KPICard
                    title="Avg. Deal Size"
                    value="$3,250"
                    change="+8%"
                    trend="up"
                    icon={Briefcase}
                    iconColor="text-indigo-500"
                    data={sparklineData4}
                    strokeColor="#6366f1"
                />
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                <RevenueChart />
                <DistributionChart />
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                <QuotesHistory />
                <ActivityFeed />
            </div>
        </div>
    )
}
