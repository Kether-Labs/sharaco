import { QuoteHeader } from "@/features/quotes/components/QuoteHeader"
import { QuoteList } from "@/features/quotes/components/QuoteList"
import { mockQuotes } from "@/features/quotes/data/mockQuotes"

export default function QuotesPage() {
    return (
        <div className="flex-1 space-y-6 lg:space-y-8 p-4 md:p-8 pt-6 max-w-[1600px] mx-auto min-h-screen">
            <QuoteHeader />

            <div className="mt-8">
                <QuoteList quotes={mockQuotes} />
            </div>
        </div>
    )
}
