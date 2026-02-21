"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import Header from "@/components/auth/Header"
import Sidebar from "@/components/auth/sidebar/Sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    // Fermer le sidebar sur mobile quand l'écran devient plus petit
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false)
            } else {
                setIsSidebarOpen(true)
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="flex bg-background dark:bg-slate-900 h-[100%]">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
            </div>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="bg-transparent border-transparent p-0">
                    <Sidebar setIsSidebarOpen={setIsMobileMenuOpen} isSidebarOpen={true} />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className={cn(
                "flex-1 transition-all duration-300 ease-in-out",
                isSidebarOpen ? "md:ml-72" : "ml-0"
            )}>
                {/* Header */}
                <Header
                    setIsSidebarOpen={setIsMobileMenuOpen}
                    isSidebarOpen={isSidebarOpen}
                    isQuoteLayout={false}
                    isShowLogo={false}
                    isMobile={true}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                    <Toaster />
                </main>
            </div>
        </div>
    )
}

