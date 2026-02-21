"use client"

import { useState } from 'react'

import Link from 'next/link'


import { Sparkles, BarChart3, Users, CheckCircle, ArrowRight, Menu, X, Rocket, Zap, Globe, ShieldCheck, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { SwitchTheme } from '@/components/ui/switch-theme'
import Image from 'next/image'
import Logo from '@/components/ui/logo'

// Types
interface NavItem {
  label: string
  href: string
}

interface Feature {
  title: string
  description: string
  icon: any
  bgColor: string
}


// Constants
const NAV_ITEMS: NavItem[] = [
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/resources' },
  { label: 'Enterprise', href: '/enterprise' },
]

const CTA_BUTTONS = {
  primary: {
    label: 'Start Free Trial',
    href: '/login',
    className: 'bg-sky-600 hover:bg-sky-700 text-white rounded-full font-semibold px-8 py-6 text-base transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)]'
  },
  secondary: {
    label: 'Book a Demo',
    href: '/demo',
    className: 'bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700 text-gray-900 dark:text-white rounded-full font-semibold px-8 py-6 text-base transition-all duration-300 hover:bg-white/20 dark:hover:bg-slate-800'
  }
}

const FEATURES: Feature[] = [
  {
    title: 'AI-Powered Quotes',
    description: 'Create multi-page, professional quotes in under a minute using our proprietary AI engine.',
    icon: <Sparkles className="w-8 h-8 text-sky-500" />,
    bgColor: 'bg-sky-500/10'
  },
  {
    title: 'Precision Analytics',
    description: 'Deep dive into your conversion rates with real-time tracking and behavioral insights.',
    icon: <BarChart3 className="w-8 h-8 text-emerald-500" />,
    bgColor: 'bg-emerald-500/10'
  },
  {
    title: 'Global Collaboration',
    description: 'Work with your distributed team in real-time with granular permissions and audit logs.',
    icon: <Globe className="w-8 h-8 text-indigo-500" />,
    bgColor: 'bg-indigo-500/10'
  }
]



export default function Hero() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen">
      {/* Navigation */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
        <nav className="glass-dark rounded-full px-6 py-2 shadow-xl border-white/20">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center scale-90 origin-left">
              <Logo width={150} height={150} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-x-10">
              <div className="flex items-center space-x-8">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700" />

              <div className="flex items-center gap-6">
                <SwitchTheme />
                <Link href={CTA_BUTTONS.primary.href}>
                  <button className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-sky-500/20 active:scale-95">
                    Join Waitlist
                  </button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-4">

              <button
                type="button"
                className="p-2 text-gray-700 dark:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-x-0 top-24 mx-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl transform transition-all duration-300 ease-in-out lg:hidden z-40 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
            }`}
        >
          <div className="p-6">
            <div className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-4 py-3 text-lg font-semibold text-gray-900 dark:text-white hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <Button asChild className="w-full h-12 rounded-xl text-lg font-bold bg-sky-600 hover:bg-sky-700">
                <Link href={CTA_BUTTONS.primary.href} onClick={() => setIsMobileMenuOpen(false)}>
                  {CTA_BUTTONS.primary.label}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-12 rounded-xl text-lg font-bold border-gray-200 dark:border-slate-700">
                <Link href={CTA_BUTTONS.secondary.href} onClick={() => setIsMobileMenuOpen(false)}>
                  {CTA_BUTTONS.secondary.label}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="bg-white dark:bg-slate-950 overflow-hidden">
        {/* Hero section */}
        <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-32">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            {/* Mesh Gradients */}
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-sky-400/20 blur-[120px] rounded-full animate-pulse-slow" />
            <div className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-indigo-500/15 blur-[120px] rounded-full animate-pulse-slow delay-700" />
            <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-emerald-400/10 blur-[120px] rounded-full animate-pulse-slow delay-1000" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
              style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, gray 1px, transparent 0)', backgroundSize: '40px 40px' }}
            />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center flex flex-col items-center">
              {/* Announcement banner */}
              <div className="inline-flex items-center gap-3 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800 px-4 py-1.5 mb-10 transition-all hover:border-sky-300 cursor-pointer group">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 shadow-lg shadow-sky-500/40">
                  <Rocket className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-sky-700 dark:text-sky-300">
                  Join 5,000+ companies scaling with Sharaco
                </span>
                <ArrowRight className="h-4 w-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Hero content */}
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-7xl lg:text-8xl max-w-4xl">
                Master Your Quotes,
                <span className="text-gradient block mt-2">Scale Your Empire.</span>
              </h1>

              <p className="mt-8 text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
                The AI-first platform for modern sales teams. Create stunning proposals, track every view, and close deals while you sleep.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row gap-5">
                <Link href={CTA_BUTTONS.primary.href}>
                  <Button className={CTA_BUTTONS.primary.className}>
                    {CTA_BUTTONS.primary.label}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={CTA_BUTTONS.secondary.href}>
                  <Button className={CTA_BUTTONS.secondary.className}>
                    {CTA_BUTTONS.secondary.label}
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
                {[
                  { value: '5K+', label: 'Active Teams', icon: <Users className="w-5 h-5 text-sky-500" /> },
                  { value: '98%', label: 'CSAT Score', icon: <Zap className="w-5 h-5 text-amber-500" /> },
                  { value: '2x', label: 'Faster Output', icon: <Rocket className="w-5 h-5 text-emerald-500" /> },
                  { value: '24/7', label: 'AI Support', icon: <ShieldCheck className="w-5 h-5 text-indigo-500" /> },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center">
                    <div className="mb-2 p-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Dashboard Preview */}
              <div className="mt-24 relative max-w-5xl mx-auto w-full">
                <div className="relative group">
                  {/* Decorative Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />

                  {/* Browser Frame */}
                  <div className="relative rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
                    <div className="h-10 border-b border-gray-100 dark:border-slate-800 flex items-center px-4 gap-1.5 bg-gray-50/50 dark:bg-slate-900/50">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <div className="ml-4 h-4 w-48 rounded bg-gray-200 dark:bg-slate-800/50" />
                    </div>
                    <div className="relative aspect-video">
                      <Image
                        src="/img/hero.jpg"
                        alt="Dashboard preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Floating Action Cards */}
                  <div className="absolute -left-6 -bottom-6 animate-float z-10 hidden sm:block">
                    <div className="rounded-2xl glass dark:glass-dark p-4 shadow-2xl border-white/20 dark:border-slate-700/50 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-extrabold text-slate-900 dark:text-white">Quote Approved</div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold font-mono">+$12,400.00</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-8 top-1/4 animate-float [animation-delay:2s] z-10 hidden sm:block">
                    <div className="rounded-2xl glass dark:glass-dark p-5 shadow-2xl border-white/20 dark:border-slate-700/50 flex flex-col gap-3 min-w-[200px]">
                      <div className="flex items-center justify-between">
                        <div className="h-8 w-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-500">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">Active Team</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white text-left">Recent Activity</div>
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-7 w-7 rounded-full border-2 border-white dark:border-slate-900 bg-gray-200 dark:bg-slate-800" />
                        ))}
                        <div className="h-7 w-7 rounded-full border-2 border-white dark:border-slate-900 bg-sky-100 dark:bg-sky-900 flex items-center justify-center text-[10px] font-bold text-sky-600 dark:text-sky-300">
                          +12
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features grid */}
            <div className="mt-48 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-10 transition duration-500" />
                  <div className="relative h-full rounded-[2.5rem] p-10 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col">
                    <div className={`mb-8 inline-flex p-5 rounded-3xl ${feature.bgColor} w-fit shadow-xl shadow-sky-500/5`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-8">
                      {feature.description}
                    </p>
                    <div className="mt-auto flex items-center text-sky-600 dark:text-sky-400 font-bold text-sm uppercase tracking-widest gap-2 cursor-pointer group/link">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
