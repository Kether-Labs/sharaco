"use client"

import { QuoteHeader } from "@/features/quotes/components/QuoteHeader"
import { QuoteList } from "@/features/quotes/components/QuoteList"
import { useQuotes } from "@/features/quotes/hooks/useQuotes"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function QuotesPage() {
    const { data: quotes, isLoading, error, refetch } = useQuotes()

    return (
        <div className="flex-1 space-y-6 lg:space-y-8 p-4 md:p-8 pt-6 max-w-[1600px] mx-auto min-h-screen">
            <QuoteHeader />

            <div className="mt-8">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} className="h-64 rounded-[2rem]" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center bg-white/40 dark:bg-slate-950/40 rounded-3xl border border-rose-500/20 backdrop-blur-xl">
                        <p className="text-rose-500 font-medium mb-4">Impossible de charger les devis.</p>
                        <Button onClick={() => refetch()} variant="outline" className="rounded-xl">
                            <RefreshCcw className="mr-2 h-4 w-4" /> Réessayer
                        </Button>
                    </div>
                ) : (
                    <QuoteList quotes={quotes || []} />
                )}
            </div>
        </div>
    )
}
