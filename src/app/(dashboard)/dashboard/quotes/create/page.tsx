"use client";

import { Editor } from "@/features/quotes/components/QuoteBuilder/Editor"

export default function LiveQuoteBuilderPage() {
    return (
        <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-950 font-sans">
            <Editor />
        </div>
    )
}
