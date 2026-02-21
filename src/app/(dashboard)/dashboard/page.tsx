"use client"

import * as React from "react"
import {
    Activity,
    CreditCard,
    DollarSign,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    MoreHorizontal,
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    TrendingUp,
    Briefcase,
    Calendar,
    Download,
    Filter,
    PieChart as PieChartIcon,
    BarChart3,
    ArrowRight
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    Line,
    LineChart,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from "recharts"

const revenueData = [
    { name: "Jan", total: 2400 },
    { name: "Feb", total: 1398 },
    { name: "Mar", total: 9800 },
    { name: "Apr", total: 3908 },
    { name: "May", total: 4800 },
    { name: "Jun", total: 3800 },
    { name: "Jul", total: 4300 },
]

const sparklineData1 = [
    { value: 100 }, { value: 120 }, { value: 110 }, { value: 140 }, { value: 130 }, { value: 160 }, { value: 180 }
]
const sparklineData2 = [
    { value: 30 }, { value: 40 }, { value: 35 }, { value: 50 }, { value: 45 }, { value: 60 }, { value: 70 }
]
const sparklineData3 = [
    { value: 80 }, { value: 70 }, { value: 75 }, { value: 65 }, { value: 60 }, { value: 55 }, { value: 50 }
]
const sparklineData4 = [
    { value: 200 }, { value: 220 }, { value: 210 }, { value: 240 }, { value: 280 }, { value: 260 }, { value: 300 }
]

const distributionData = [
    { name: "Enterprise", value: 400, color: "#0ea5e9" },
    { name: "SMB", value: 300, color: "#6366f1" },
    { name: "Consumer", value: 300, color: "#8b5cf6" },
    { name: "Other", value: 200, color: "#cbd5e1" },
]

const recentQuotes = [
    {
        id: "Q-1024",
        client: "Acme Corp",
        amount: "$2,500.00",
        status: "Accepted",
        date: "2024-02-12",
        avatar: "/avatars/01.png",
        initials: "AC"
    },
    {
        id: "Q-1023",
        client: "Globex Inc",
        amount: "$5,350.50",
        status: "Sent",
        date: "2024-02-11",
        avatar: "/avatars/02.png",
        initials: "GL"
    },
    {
        id: "Q-1022",
        client: "Soylent Corp",
        amount: "$950.00",
        status: "Draft",
        date: "2024-02-10",
        avatar: "/avatars/03.png",
        initials: "SC"
    },
    {
        id: "Q-1021",
        client: "Initech",
        amount: "$12,000.00",
        status: "Rejected",
        date: "2024-02-09",
        avatar: "/avatars/04.png",
        initials: "IN"
    },
    {
        id: "Q-1020",
        client: "Umbrella Corp",
        amount: "$6,500.00",
        status: "Sent",
        date: "2024-02-08",
        avatar: "/avatars/05.png",
        initials: "UC"
    },
]

const activities = [
    { id: 1, type: "quote_sent", user: "You", action: "sent a quote to", target: "Acme Corp", time: "2 hours ago", icon: FileText, color: "text-sky-500", bg: "bg-sky-100 dark:bg-sky-900/30" },
    { id: 2, type: "payment", user: "Stripe", action: "received payment from", target: "Globex Inc", time: "5 hours ago", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    { id: 3, type: "client_add", user: "Sarah", action: "added new client", target: "TechStart", time: "1 day ago", icon: Users, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
]

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
                {/* Revenue Chart */}
                <Card className="col-span-1 lg:col-span-5 bg-white dark:bg-slate-950 border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-sky-500" />
                            Revenue Overview
                        </CardTitle>
                        <CardDescription>
                            Comparing current revenue against last year's performance.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
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
                                        dataKey="total"
                                        stroke="#0ea5e9"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Distribution Chart */}
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
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                {/* Recent Quotes Table */}
                <Card className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-950 border-border/50 shadow-sm">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle>Quotes History</CardTitle>
                            <CardDescription>
                                Manage your recent quotes and invoices.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="hidden sm:flex h-8">
                                <Filter className="mr-2 h-3.5 w-3.5" />
                                Filter
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 text-sky-600 dark:text-sky-400">
                                View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[100px]">Invoice</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden md:table-cell">Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentQuotes.map((quote) => (
                                    <TableRow key={quote.id} className="hover:bg-muted/50 cursor-pointer transition-colors group">
                                        <TableCell className="font-medium">{quote.id}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-[10px] bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300">{quote.initials}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-slate-700 dark:text-slate-200">{quote.client}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={`
                                            ${quote.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                                        quote.status === 'Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
                                                            quote.status === 'Sent' ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400' :
                                                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}
                                            `}
                                            >
                                                {quote.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{quote.date}</TableCell>
                                        <TableCell className="text-right font-bold text-slate-700 dark:text-slate-200">{quote.amount}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Unified Activity Feed */}
                <Card className="col-span-1 bg-white dark:bg-slate-950 border-border/50 shadow-sm flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-sky-500" />
                            Activity Feed
                        </CardTitle>
                        <CardDescription>
                            Latest events this week.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="relative pl-6 border-l border-gray-200 dark:border-slate-800 space-y-8">
                            {activities.map((activity) => (
                                <div key={activity.id} className="relative">
                                    {/* Timeline Dot */}
                                    <div className={`absolute -left-[31px] top-1 h-6 w-6 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center ${activity.bg}`}>
                                        <activity.icon className={`h-3 w-3 ${activity.color}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm">
                                            <span className="font-semibold text-slate-900 dark:text-white">{activity.user}</span>{" "}
                                            <span className="text-muted-foreground">{activity.action}</span>{" "}
                                            <span className="font-medium text-sky-600 dark:text-sky-400">{activity.target}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div className="relative">
                                <div className="absolute -left-[29px] top-1 h-2 w-2 rounded-full bg-gray-200 dark:bg-slate-800" />
                                <p className="text-xs text-muted-foreground">End of recent activity</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button variant="outline" className="w-full">
                            View All Activity
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

function KPICard({ title, value, change, trend, icon: Icon, iconColor, data, strokeColor }: any) {
    return (
        <Card className="bg-white dark:bg-slate-950  shadow-sm hover:shadow-md transition-shadow">
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
