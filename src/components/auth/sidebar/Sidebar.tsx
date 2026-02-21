"use client"

import { cn } from "@/lib/utils"
import { ScrollArea } from '@/components/ui/scroll-area'
import { navItems } from '@/data/navItemsData'
import { NavItem } from './NavItem'
import { Button } from '@/components/ui/button'
import { X, LogOut, Settings } from 'lucide-react'
import Link from "next/link"
import Logo from "@/components/logo"
import { motion, AnimatePresence } from "framer-motion"

export default function Sidebar({ setIsSidebarOpen, isSidebarOpen }: { setIsSidebarOpen: (open: boolean) => void, isSidebarOpen: boolean }) {
  return (
    <AnimatePresence>
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-72 transform border-r border-white/10 dark:border-white/5",
          "shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.3)]"
        )}
      >
        <div className="flex h-full flex-col backdrop-blur-3xl bg-white/70 dark:bg-slate-950/80 relative overflow-hidden">
          {/* Decorative background element for premium feel */}
          <div className="absolute top-[-10%] left-[-10%] w-40 h-40 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[80px]" />

          {/* Header Area */}
          <div className="relative flex h-24 items-center justify-between px-6">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="p-1 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 dark:from-sky-500/10 dark:to-indigo-500/10 border border-white/20 dark:border-white/5 group-hover:scale-105 transition-transform duration-300">
                <Logo width={120} height={120} />
              </div>
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
            <nav className="space-y-6 pt-2">
              {/* Grouping logic could be improved in data, but let's stick to current structure and make it look good */}
              <div className="space-y-1">
                {navItems.map((item, index) => (
                  item.isHeader ? (
                    <div key={index} className="px-3 pt-6 pb-2">
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="text-[11px] uppercase tracking-[0.15em] font-bold text-slate-400 dark:text-slate-500"
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
          <div className="p-4 mt-auto">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-white/5 p-4 bg-white/40 dark:bg-white/[0.03] backdrop-blur-md group transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/5 hover:border-sky-500/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_4px_12px_rgba(14,165,233,0.3)] transition-transform group-hover:scale-105">
                    JD
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 shadow-sm" />
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate text-slate-900 dark:text-white leading-tight">
                    John Doe
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    admin@sharaco.com
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 group/btn">
                    <Settings className="h-4 w-4 text-slate-400 group-hover/btn:text-sky-500 transition-colors" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-3 px-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group"
              >
                <LogOut className="h-4 w-4 mr-3 group-hover:translate-x-1 transition-transform" />
                <span>Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}

