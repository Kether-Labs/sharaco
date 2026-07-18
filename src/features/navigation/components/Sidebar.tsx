"use client"

import { cn } from "@/lib/utils"
import { ScrollArea } from '@/components/ui/scroll-area'
import { navItems } from '../data/navItemsData'
import { Plus, Bell, X, User, LogOut } from 'lucide-react'
import Link from "next/link"
import Logo from "@/components/ui/logo"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useCurrentUser } from "@/features/auth/hooks/useAuth"
import { useAuthStore } from "@/store/auth-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Sidebar({ setIsSidebarOpen, isSidebarOpen }: { setIsSidebarOpen: (open: boolean) => void, isSidebarOpen: boolean }) {
  const pathname = usePathname() || "";
  const { data: user } = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);

  // Filter out headers for the slim rail
  const mainNavItems = navItems.filter(item => !item.isHeader);

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 768 ? "-100%" : 0) }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-0 top-0 z-40 h-[100dvh] w-[88px] transform border-r border-white/10",
          "shadow-2xl bg-[#0a0a0a]/90 backdrop-blur-3xl md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col relative overflow-hidden">

          {/* Ambient Background Glow */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-sky-500/10 to-transparent pointer-events-none" />

          {/* Top Logo & Close (Mobile) */}
          <div className="flex flex-col items-center pt-6 pb-4 relative z-10">


            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden absolute top-6 right-2 p-1 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Create Button */}
          <div className="px-3 pb-6 flex justify-center relative z-10">
            <Link href="/dashboard/quotes/create" className="flex flex-col items-center justify-center gap-1 group w-full">
              <div className="w-[40px] h-[40px] rounded-2xl bg-[#2563EB] flex items-center justify-center text-white  transition-all duration-300">
                <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              </div>
              <span className="text-[11px] font-bold text-white/90 mt-1.5 tracking-wide">Créer</span>
            </Link>
          </div>

          {/* Navigation Area */}
          <ScrollArea className="flex-1 w-full hide-scrollbar relative z-10">
            <nav className="flex flex-col items-center gap-1 px-2 pb-4">
              {mainNavItems.map((item, index) => {
                const isActive = item.href ? pathname === item.href : false;
                return (
                  <Link
                    key={index}
                    href={item.href || "#"}
                    className={cn(
                      "flex flex-col items-center justify-center w-full py-2 rounded-2xl transition-all duration-300 group relative",
                      isActive
                        ? ""
                        : "text-slate-400 "
                    )}
                  >

                    <div className={cn(
                      "p-3 rounded-xl mb-1.5 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "bg-white/5  shadow-sm text-[#2563EB]" : "hover:bg-white/5"
                    )}>
                      {item.icon}
                    </div>
                    <span className="text-[12px] font-bold text-center w-full px-1 truncate tracking-wide">
                      {item.title}
                    </span>
                  </Link>
                )
              })}

              {/* More button */}
              <button className="flex flex-col items-center justify-center w-full py-3.5 rounded-2xl transition-all duration-300 group text-slate-400 hover:text-white  mt-2">
                <div className="flex gap-1 mb-2.5 mt-1  transition-transform">
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                </div>
                <span className="text-[10px] font-bold tracking-wide">Plus</span>
              </button>
            </nav>
          </ScrollArea>

          {/* User Profile / Footer Area */}
          <div className="flex flex-col items-center gap-5 py-6 mt-auto relative z-10 bg-gradient-to-t from-[#0a0a0a] to-transparent">
            <button className="text-slate-400 hover:text-white transition-colors relative group">
              <Bell className="h-5 w-5 " />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-violet-500 rounded-full border-2 border-[#0a0a0a]" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative group cursor-pointer outline-none">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#2563EB] to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300 uppercase">
                    {user?.full_name ? user.full_name.charAt(0) : "U"}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-[2px] border-[#0a0a0a]" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                side="right" 
                align="end" 
                sideOffset={16}
                className="w-60 rounded-2xl border-white/10 shadow-2xl bg-white dark:bg-zinc-950 p-2"
              >
                <div className="px-3 py-2.5 mb-1">
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user?.full_name || "Mon Espace"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user?.email || "Chargement..."}</p>
                </div>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 mb-1.5" />
                <DropdownMenuItem className="gap-3 cursor-pointer rounded-xl font-bold focus:bg-slate-100 dark:focus:bg-white/5 py-2.5 transition-colors">
                  <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-500 dark:text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => logout()}
                  className="gap-3 cursor-pointer rounded-xl font-bold text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-500/10 focus:text-rose-600 dark:focus:text-rose-400 py-2.5 mt-1 transition-colors"
                >
                  <div className="p-1.5 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-500 dark:text-rose-400">
                    <LogOut className="h-4 w-4" />
                  </div>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
