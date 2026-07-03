"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import Header from "@/features/navigation/components/Header"
import Sidebar from "@/features/navigation/components/Sidebar"
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
        <div className="flex bg-background mesh-gradient min-h-[100dvh] overflow-x-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
            </div>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="bg-transparent border-transparent p-0 w-72">
                    <Sidebar setIsSidebarOpen={setIsMobileMenuOpen} isSidebarOpen={true} />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className={cn(
                "flex-1 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                isSidebarOpen ? "md:ml-[88px]" : "ml-0"
            )}>
                {/* Header */}


                {/* Page Content */}
                <main className="relative flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
                    {children}
                    <Toaster />
                </main>
            </div>
        </div>
    )
}

