"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Mail, Apple, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "@/components/ui/logo"

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
                <div className="w-full max-w-[400px] space-y-8 text-center">
                    {/* Logo & Heading */}
                    <div className="flex flex-col items-center space-y-6">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 dark:border-slate-800">
                            <Logo width={80} height={80} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Sign in to Sharaco</h1>
                            <p className="text-zinc-500 text-sm font-medium">
                                Sign in to Sharaco using your account.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="name@work-email.com"
                                className="h-12 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-sky-500 focus:border-sky-500 rounded-xl"
                            />
                        </div>
                        <Button className="w-full h-12 bg-sky-700  hover:bg-sky-600 font-bold rounded-xl transition-all">
                            Continue with Email
                        </Button>
                    </div>

                    {/* Separator */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-black px-2 text-zinc-500 font-bold tracking-widest">or</span>
                        </div>
                    </div>

                    {/* Social Auth */}
                    <div className="space-y-3">
                        {/* Google (Custom SVG for better branding) */}
                        <Button variant="outline" className="w-full h-12 bg-transparent border-zinc-800 hover:bg-white/5 text-white font-bold rounded-xl flex items-center justify-center gap-3">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.1-1.93 3.3-4.77 3.3-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </Button>

                        <Button variant="outline" className="w-full h-12 bg-transparent border-zinc-800 hover:bg-white/5 text-white font-bold rounded-xl flex items-center justify-center gap-3">
                            <Github className="w-5 h-5" />
                            Continue with GitHub
                        </Button>

                        <Button variant="outline" className="w-full h-12 bg-transparent border-zinc-800 hover:bg-white/5 text-white font-bold rounded-xl flex items-center justify-center gap-3">
                            <Apple className="w-5 h-5" />
                            Continue with Apple
                        </Button>

                        <Button variant="outline" className="w-full h-12 bg-transparent border-zinc-800 hover:bg-white/5 text-white font-bold rounded-xl flex items-center justify-center gap-3">
                            <ShieldCheck className="w-5 h-5" />
                            Continue with SAML SSO
                        </Button>
                    </div>

                    <button className="text-zinc-500 text-sm font-bold hover:text-white transition-colors pt-2">
                        Show other options
                    </button>

                    <p className="text-zinc-500 text-sm font-medium pt-4">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-sky-500 hover:text-sky-400 font-bold underline-offset-4 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
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
