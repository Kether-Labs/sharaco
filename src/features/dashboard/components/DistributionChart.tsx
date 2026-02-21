"use client"

import { PieChart as PieChartIcon } from "lucide-react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const distributionData = [
    { name: "Enterprise", value: 400, color: "#0ea5e9" },
    { name: "SMB", value: 300, color: "#6366f1" },
    { name: "Consumer", value: 300, color: "#8b5cf6" },
    { name: "Other", value: 200, color: "#cbd5e1" },
]

export function DistributionChart() {
    return (
        <Card className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-950 border-border/50 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-indigo-500" />
                    Client Distribution
                </CardTitle>
                <CardDescription>
                    Breakdown by client type.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <div className="h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={distributionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {distributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    borderColor: "hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                    fontSize: "12px"
                                }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <span className="text-3xl font-bold">1200</span>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Clients</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
