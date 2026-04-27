"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthlyRevenue } from "@/features/dashboard/types"
import { formatCurrency } from "@/features/quotes/lib/formatCurrency"

interface RevenueChartProps {
    data: MonthlyRevenue[]
}

const formatMonth = (monthString: string) => {
    if (!monthString) return "";
    const date = new Date(monthString + "-01");
    // Format to short french month, e.g., "Jan", "Fév"
    return new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(date);
}

export function RevenueChart({ data }: RevenueChartProps) {
    // If no data or array is empty, provide a fallback to avoid empty chart
    const chartData = data && data.length > 0 ? data : [];
    console.log(data)
    console.log("level")
    return (
        <Card className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Revenus mensuels
                </CardTitle>
                <CardDescription className="text-xs">
                    Évolution des revenus encaissés sur les 12 derniers mois.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                            <XAxis
                                dataKey="month"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={formatMonth}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                // Auto scale or format compactly to avoid overlapping text
                                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                            />
                            <Tooltip
                                formatter={(value: number) => [formatCurrency(value), "Revenus"]}
                                labelFormatter={(label) => formatMonth(label as string)}
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                    fontSize: "12px",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                                }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue_cents"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
