"use client"

import { PieChart as PieChartIcon } from "lucide-react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DistributionChartProps {
    draft: number
    sent: number
    viewed: number
    paid: number
}

const COLORS = {
    Brouillon: "#94a3b8", // slate
    Envoyé: "#3b82f6",    // blue
    Consulté: "#f59e0b",  // amber
    Payé: "#10b981",      // emerald
}

export function DistributionChart({ draft, sent, viewed, paid }: DistributionChartProps) {
    const distributionData = [
        { name: "Brouillon", value: draft, color: COLORS.Brouillon },
        { name: "Envoyé", value: sent, color: COLORS.Envoyé },
        { name: "Consulté", value: viewed, color: COLORS.Consulté },
        { name: "Payé", value: paid, color: COLORS.Payé },
    ].filter(item => item.value >= 0); // Keep all even if 0 to show legend

    const total = draft + sent + viewed + paid;

    // Custom legend to include counts
    const renderLegend = (props: any) => {
        const { payload } = props;
        return (
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
                {payload.map((entry: any, index: number) => (
                    <li key={`item-${index}`} className="flex items-center text-xs">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-600 dark:text-slate-400 font-medium mr-1">{entry.value}</span>
                        <span className="text-slate-900 dark:text-white font-bold">{entry.payload.value}</span>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <Card className="col-span-1 border-slate-200 dark:border-slate-800 shadow-sm rounded-xl">
            <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-indigo-500" />
                    Devis par statut
                </CardTitle>
                <CardDescription className="text-xs">
                    Répartition des documents créés.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center flex-col items-center">
                <div className="h-[250px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={distributionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
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
                                    fontSize: "12px",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                                }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                                formatter={(value: number) => [`${value} Devis`]}
                            />
                            <Legend content={renderLegend} verticalAlign="bottom" />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-x-0 top-[40%] -translate-y-4 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">{total}</span>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Total</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
