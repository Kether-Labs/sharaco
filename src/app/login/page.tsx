"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Mail, Apple, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "@/components/ui/logo"
import { LoginForm } from "@/features/auth/components/LoginForm"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-black dark:bg-slate-950 text-white  flex flex-col font-sans">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4">
                <Link href="/">
                    <Logo width={100} height={100} />
                </Link>
                <Link href="/signup">
                    <Button variant="ghost" className="text-sm font-medium hover:bg-white/10 text-white border border-white/10 rounded-full px-4">
                        Sign Up
                    </Button>
                </Link>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
                <LoginForm />
            </main>

            {/* Footer */}
            <footer className="py-8 flex justify-center space-x-6 text-xs text-zinc-600 font-bold tracking-tight">
                <Link href="/terms" className="hover:text-zinc-400 transition-colors">
                    Terms
                </Link>
                <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
                    Privacy Policy
                </Link>
            </footer>
        </div>
    )
}
