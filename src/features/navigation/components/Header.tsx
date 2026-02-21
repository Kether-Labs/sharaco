import { Search, Bell, ChevronDown, Menu, Settings, LogOut, Sun, Moon, AlertCircle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { SwitchTheme } from "@/components/ui/switch-theme"

export default function Header({
  setIsSidebarOpen,
  isQuoteLayout,
  isSidebarOpen,
  isShowLogo,
  isMobile = false
}: {
  setIsSidebarOpen: any,
  isSidebarOpen: boolean,
  isShowLogo: boolean,
  isQuoteLayout: boolean,
  isMobile?: boolean
}) {

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl px-4 sm:px-8 transition-all duration-300">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
        >
          <Menu className="h-6 w-6 text-slate-600 dark:text-slate-400" />
        </Button>
        {isShowLogo && (
          <span className="text-xl md:text-2xl text-slate-900 dark:text-white font-black tracking-tight">
            Sharaco
          </span>
        )}
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        {/* Search bar - hidden on mobile */}
        {!isQuoteLayout && (
          <div className="relative hidden md:block group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400 group-focus-within:text-sky-500 transition-colors" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-[280px] lg:w-[400px] h-10 bg-slate-100/50 dark:bg-white/5 border-transparent focus:border-sky-500/50 focus:ring-0 rounded-xl pl-10 transition-all"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-xl hover:bg-black/5 dark:hover:bg-white/5 relative">
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-950" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex rounded-xl hover:bg-black/5 dark:hover:bg-white/5">
            <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </Button>

          <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />

          <SwitchTheme />
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1 pr-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 group">
              <div className="relative">
                <Avatar className="h-9 w-9 rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-100 dark:bg-white/5">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback className="rounded-none">CN</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 shadow-sm" />
              </div>
              <div className="hidden md:flex flex-col items-start ml-2 text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-none capitalize">level</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Administrateur</p>
              </div>
              <ChevronDown className="h-4 w-4 ml-2 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 border-slate-200/50 dark:border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-2xl">
            <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 mx-1" />
            <DropdownMenuItem className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-all text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400">
              <div className="flex items-center">
                <Settings className="mr-3 h-4 w-4" />
                Paramètres
              </div>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center rounded-xl px-3 py-2.5 transition-all text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400">
              <LogOut className="mr-3 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
