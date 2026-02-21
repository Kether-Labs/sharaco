"use client"

import { useState } from "react"
import { Search, Filter, ChevronDown, CalendarDays, MoreVertical, ArrowRight } from "lucide-react"


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Quote } from "../types/Quote"

interface QuoteListProps {
    quotes: Quote[]
}

const statusConfig = {
    Accepted: {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        text: "text-emerald-700 dark:text-emerald-400",
        dot: "bg-emerald-500",
        glow: "shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)] dark:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]",
        label: "Accepté"
    },
    Rejected: {
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        text: "text-rose-700 dark:text-rose-400",
        dot: "bg-rose-500",
        glow: "shadow-[0_0_20px_-3px_rgba(244,63,94,0.3)] dark:shadow-[0_0_30px_-5px_rgba(244,63,94,0.2)]",
        label: "Rejeté"
    },
    Sent: {
        bg: "bg-sky-500/10",
        border: "border-sky-500/20",
        text: "text-sky-700 dark:text-sky-400",
        dot: "bg-sky-500",
        glow: "shadow-[0_0_20px_-3px_rgba(14,165,233,0.3)] dark:shadow-[0_0_30px_-5px_rgba(14,165,233,0.2)]",
        label: "Envoyé"
    },
    Draft: {
        bg: "bg-slate-500/10",
        border: "border-slate-500/20",
        text: "text-slate-700 dark:text-slate-400",
        dot: "bg-slate-500",
        glow: "shadow-[0_0_20px_-3px_rgba(100,116,139,0.2)] dark:shadow-[0_0_30px_-5px_rgba(100,116,139,0.15)]",
        label: "Brouillon"
    }
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

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export function QuoteList({ quotes }: QuoteListProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredQuotes = quotes.filter(quote =>
        quote.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8">
            {/* Filtering Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/40 dark:bg-slate-950/40 p-4 rounded-3xl backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
                <div className="relative w-full sm:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors duration-300" />
                    </div>
                    <Input
                        placeholder="Rechercher par client, référence..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-14 bg-white/50 dark:bg-slate-900/50 border-white/50 dark:border-white/5 hover:border-sky-500/30 focus:border-sky-500/50 rounded-2xl text-base shadow-sm backdrop-blur-sm transition-all duration-300 focus:ring-4 focus:ring-sky-500/10"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="h-14 px-6 rounded-2xl border-white/50 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm font-medium hover:bg-white dark:hover:bg-white/10 transition-all duration-300 shadow-sm">
                        <Filter className="mr-2 h-4 w-4 text-slate-500" />
                        Filtres
                    </Button>
                    <Button variant="outline" className="h-14 px-6 rounded-2xl border-white/50 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm font-medium hover:bg-white dark:hover:bg-white/10 transition-all duration-300 shadow-sm">
                        Tous les statuts <ChevronDown className="ml-2 h-4 w-4 text-slate-500" />
                    </Button>
                </div>
            </div>

            {/* Glowing Cards Grid */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >

                {filteredQuotes.map((quote) => {
                    const style = statusConfig[quote.status];

                    return (
                        <div
                            key={quote.id}
                            className="group relative rounded-[2rem] p-[1px] bg-slate-200/50 dark:bg-white/5 hover:bg-gradient-to-br hover:from-sky-400 hover:to-indigo-500 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl z-0"
                        >
                            {/* Glow Effect Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-indigo-500 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 -z-10" />

                            {/* Card Content */}
                            <div className="relative z-10 h-full w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-[1.95rem] p-6 flex flex-col justify-between overflow-hidden border border-white/20 dark:border-white/5">

                                {/* Top Section */}
                                <div className="flex items-start justify-between mb-6">
                                    <Badge
                                        className={`px-3 py-1.5 rounded-xl font-semibold border ${style.bg} ${style.border} ${style.text} ${style.glow} transition-all duration-300`}
                                    >
                                        <span className={`w-2 h-2 rounded-full mr-2 inline-block ${style.dot} shadow-[0_0_8px_currentColor]`} />
                                        {style.label}
                                    </Badge>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 rounded-2xl border-white/20 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl shadow-2xl p-2">
                                            <DropdownMenuItem className="rounded-xl cursor-pointer p-3 font-medium">Ouvrir le devis</DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl cursor-pointer p-3 font-medium">Télécharger PDF</DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-white/10 my-1" />
                                            <DropdownMenuItem className="rounded-xl cursor-pointer p-3 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-500/10">Supprimer</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Mid Section - Client & Value */}
                                <div className="space-y-4 mb-8">
                                    <p className="text-sm font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                                        {quote.id}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 ring-4 ring-slate-50 dark:ring-slate-900 transition-transform duration-500">
                                            <AvatarImage src={quote.avatarUrl} />
                                            <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-700 dark:text-slate-300 font-bold text-lg">
                                                {quote.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                                {quote.clientName}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <p className="text-3xl font-black bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent  transform origin-left transition-transform duration-500">
                                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(quote.amount)}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom Section */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between mt-auto">
                                    <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                                        <CalendarDays className="mr-2 h-4 w-4" />
                                        {new Date(quote.date).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-sky-50 dark:group-hover:bg-sky-500/20 group-hover:text-sky-500 transition-colors duration-300">
                                        <ArrowRight className="h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>

            {filteredQuotes.length === 0 && (
                <div
                    className="flex flex-col items-center justify-center p-16 text-center bg-white/40 dark:bg-slate-950/40 rounded-3xl border border-white/20 dark:border-white/5 backdrop-blur-xl"
                >
                    <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Search className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Aucun devis trouvé</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                        La recherche pour "{searchQuery}" n'a donné aucun résultat. Essayez d'autres termes ou filtres.
                    </p>
                </div>
            )}
        </div>
    )
}
