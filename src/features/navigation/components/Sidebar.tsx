"use client"

import { cn } from "@/lib/utils"
import { ScrollArea } from '@/components/ui/scroll-area'
import { navItems } from '../data/navItemsData'
import { NavItem } from './NavItem'
import { Button } from '@/components/ui/button'
import { X, LogOut, Settings } from 'lucide-react'
import Link from "next/link"
import Logo from "@/components/ui/logo"
import { motion, AnimatePresence } from "framer-motion"

export default function Sidebar({ setIsSidebarOpen, isSidebarOpen }: { setIsSidebarOpen: (open: boolean) => void, isSidebarOpen: boolean }) {
  return (
    <AnimatePresence mode="wait">
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-0 top-0 z-40 h-[100dvh] w-72 transform border-r border-slate-200/50 dark:border-white/5",
          "shadow-[20px_0_50px_rgba(0,0,0,0.02)] dark:shadow-[20px_0_50px_rgba(0,0,0,0.2)]"
        )}
      >
        <div className="flex h-full flex-col bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl relative overflow-hidden">
          {/* Perpetual motion background elements */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-64 h-64 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-[80px] pointer-events-none" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] -right-[10%] w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" 
          />

          {/* Header Area */}
          <div className="relative flex h-24 items-center justify-between px-8">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="p-2 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/10 shadow-sm group-hover:scale-105 group-hover:rotate-2 transition-all duration-500">
                <Logo width={32} height={32} />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">Sharaco</span>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </Button>
          </div>

          {/* Navigation Area */}
          <ScrollArea className="flex-1 px-4 py-2">
            <nav className="space-y-8 pt-4">
              <div className="space-y-1">
                {navItems.map((item, index) => (
                  item.isHeader ? (
                    <div key={index} className="px-4 pt-6 pb-2">
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-slate-500"
                      >
                        {item.title}
                      </motion.span>
                    </div>
                  ) : (
                    <NavItem key={index} item={item} />
                  )
                ))}
              </div>
            </nav>
          </ScrollArea>

          {/* User Profile / Footer Area */}
          <div className="p-6 mt-auto">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/50 dark:border-white/5 p-5 bg-white/40 dark:bg-white/[0.02] backdrop-blur-xl group transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-[0_8px_16px_rgba(14,165,233,0.25)] transition-transform group-hover:scale-110 group-hover:rotate-3">
                    JD
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 shadow-sm" 
                  />
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-black truncate text-slate-900 dark:text-white tracking-tight">
                    John Doe
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 truncate uppercase tracking-wider mt-0.5">
                    Premium Plan
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="ghost"
                className="flex-1 h-11 justify-start px-4 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all group"
              >
                <LogOut className="h-4 w-4 mr-3 group-hover:-translate-x-1 transition-transform" />
                <span>Sortie</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-2xl bg-slate-100/50 dark:bg-white/5 hover:bg-sky-500/10 dark:hover:bg-sky-500/10 group transition-all"
              >
                <Settings className="h-4 w-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
              </Button>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}

