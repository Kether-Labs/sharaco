"use client"

import { Plus, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export function QuoteHeader() {
    return (
        <div className="relative overflow-hidden  p-8 md:p-14 flex flex-col items-center justify-center text-center shadow-sm">

            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[50%] -left-[10%] w-[50%] h-[150%] bg-sky-400/20 dark:bg-sky-400/10 blur-[100px] rounded-full mix-blend-overlay" />
                <div className="absolute -bottom-[50%] -right-[10%] w-[50%] h-[150%] bg-purple-400/20 dark:bg-purple-400/10 blur-[100px] rounded-full mix-blend-overlay" />
            </div>

            <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">


                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-10"
                >
                    Tout vos Devis
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full flex flex-col sm:flex-row gap-4 items-center"
                >
                    <div className="relative flex-1 w-full group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Recherchez des devis, des clients ou des dossiers..."
                            className="w-full h-[60px] pl-14 pr-6 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-900 dark:text-white placeholder:text-slate-500 font-medium text-base"
                        />
                    </div>


                </motion.div>
            </div>
        </div>
    )
}
