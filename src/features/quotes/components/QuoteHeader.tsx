"use client"

import { Plus, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuoteHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Mes Devis
                </h2>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                    Gérez vos devis, factures et suivez leur état d'avancement.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" className="hidden md:flex bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                    <Calendar className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Tous les temps</span>
                </Button>
                <Button variant="outline" size="icon" className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                    <Download className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </Button>
                <Button className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg shadow-sky-500/25 border-0 transition-all active:scale-95 group">
                    <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-semibold tracking-wide">Nouveau devis</span>
                </Button>
            </div>
        </div>
    )
}
