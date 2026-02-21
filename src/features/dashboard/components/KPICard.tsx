"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { ResponsiveContainer, LineChart, Line } from "recharts"

interface KPICardProps {
    title: string
    value: string
    change: string
    trend: 'up' | 'down'
    icon: any
    iconColor: string
    data: any[]
    strokeColor: string
}

export function KPICard({ title, value, change, trend, icon: Icon, iconColor, data, strokeColor }: KPICardProps) {
    return (
        <Card className="bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${iconColor}`} />
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-2xl font-bold">{value}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            {trend === 'up' ? (
                                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                            ) : (
                                <ArrowDownRight className="h-3 w-3 text-rose-500 mr-1" />
                            )}
                            <span className={trend === 'up' ? "text-emerald-500 font-medium" : "text-rose-500 font-medium"}>{change}</span>
                            <span className="ml-1">vs last month</span>
                        </p>
                    </div>
                    {/* Tiny Sparkline */}
                    <div className="h-[40px] w-[80px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={strokeColor}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
