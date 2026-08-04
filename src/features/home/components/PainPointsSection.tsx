"use client"

import Link from 'next/link'
import { AlertTriangle, Clock, EyeOff, UserX, Sparkles, ArrowRight } from 'lucide-react'

export default function PainPointsSection() {
  return (
    <section className="py-16 md:py-24 max-w-6xl mx-auto px-4 relative z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" />
          Le problème actuel
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Chaque semaine, des freelances perdent des clients pour ça
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
          Si vous avez reconnu au moins une de ces situations — <span className="text-slate-900 dark:text-white font-bold">Sharaco a été conçu pour vous.</span>
        </p>
      </div>

      {/* 3 Pain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="group relative rounded-3xl p-8 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-xl border border-rose-500/20 dark:border-rose-500/10 shadow-xl transition-all duration-300 hover:border-rose-500/40 hover:-translate-y-1.5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 font-bold group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-rose-500 uppercase tracking-widest">Temps perdu</div>
            <p className="text-slate-200 font-semibold text-lg leading-snug">
              Vous passez 1h30 sur Word. Un tableau bancal. Un client qui ne rappelle plus.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>Inconvénient majeur</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative rounded-3xl p-8 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-xl border border-rose-500/20 dark:border-rose-500/10 shadow-xl transition-all duration-300 hover:border-rose-500/40 hover:-translate-y-1.5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 font-bold group-hover:scale-110 transition-transform">
              <EyeOff className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-rose-500 uppercase tracking-widest">Incertitude</div>
            <p className="text-slate-200 font-semibold text-lg leading-snug">
              Votre devis est parti. Silence radio. Accepté ? Lu ? Ignoré ? Vous ne savez pas.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>Manque de visibilité</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative rounded-3xl p-8 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-xl border border-rose-500/20 dark:border-rose-500/10 shadow-xl transition-all duration-300 hover:border-rose-500/40 hover:-translate-y-1.5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 font-bold group-hover:scale-110 transition-transform">
              <UserX className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-rose-500 uppercase tracking-widest">Chiffre d'affaires perdu</div>
            <p className="text-slate-200 font-semibold text-lg leading-snug">
              Vous oubliez de relancer. Le client signe ailleurs.
            </p>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>Occasion manquée</span>
          </div>
        </div>
      </div>

      {/* Solution Banner & Transition CTA */}
      <div className="mt-16 rounded-3xl p-8 sm:p-12 bg-slate-900/60 backdrop-blur-2xl border border-sky-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-sky-400 font-bold text-sm uppercase tracking-wider">
            La Solution Sharaco
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Sharaco règle ça. Voici comment.
          </h3>
          <p className="text-slate-300 text-sm sm:text-base font-medium">
            Automatisez vos devis, suivez leur ouverture en temps réel et relancez au moment exact où le prospect hésite.
          </p>
        </div>

        <Link href="/register" className="flex-shrink-0">
          <button className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-full text-lg shadow-xl shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3">
            Commencez maintenant
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </section>
  )
}
