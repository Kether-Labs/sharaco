"use client"

import { Users, Layers, Send, CheckCircle2, Sparkles, ArrowRight, FileText, Zap, ShieldCheck } from 'lucide-react'

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      badge: "Étape 1",
      badgeColor: "bg-sky-500/10 border-sky-500/20 text-sky-400",
      gradient: "from-sky-400 via-blue-500 to-indigo-600",
      title: "Ajoutez vos clients & prestations",
      description: "Importez ou créez votre base de clients et vos éléments en quelques clics. Fini la réécriture répétitive et les erreurs de saisie.",
      icon: <Users className="w-6 h-6 text-sky-400" />,
      preview: (
        <div className="space-y-3 p-4 bg-slate-900/80 rounded-2xl border border-white/10 text-left">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">AC</div>
              <div>
                <div className="text-xs font-bold text-white">Acme Corp</div>
                <div className="text-[10px] text-slate-400">client@acme.com</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Actif</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span className="text-xs text-slate-200 font-medium">Design UI/UX App</span>
            </div>
            <span className="text-xs font-mono font-bold text-white">1 200 €</span>
          </div>
        </div>
      )
    },
    {
      number: "02",
      badge: "Étape 2",
      badgeColor: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
      gradient: "from-indigo-400 via-purple-500 to-violet-600",
      title: "Composez avec un modèle pro",
      description: "Choisissez parmi des templates élégants, adaptés à votre identité visuelle. Générez des devis clairs et ultra-professionnels.",
      icon: <Layers className="w-6 h-6 text-indigo-400" />,
      preview: (
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Template Premium</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>
            </div>
          </div>
          <div className="h-16 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-bold text-white">Mise en page automatique</span>
          </div>
        </div>
      )
    },
    {
      number: "03",
      badge: "Étape 3",
      badgeColor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      title: "Envoyez et encaissez",
      description: "Suivez l'ouverture en temps réel, faites signer électroniquement en un clic et convertissez automatiquement vos devis en factures.",
      icon: <Send className="w-6 h-6 text-emerald-400" />,
      preview: (
        <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 text-left space-y-3">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300">Devis Signé en ligne</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/20 px-2 py-0.5 rounded-full">Validé</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Relance automatique</span>
            <span className="text-emerald-400 font-mono font-bold">Payé le 04/08</span>
          </div>
        </div>
      )
    }
  ]

  return (
    <section className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Background Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-sky-500/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          How It Works — Zéro friction
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Votre premier devis en <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">3 étapes</span>
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
          Une expérience fluide et intuitive, conçue pour vous faire gagner un temps précieux à chaque opportunité.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="group relative rounded-3xl p-8 bg-slate-950/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:border-white/20 hover:-translate-y-2 flex flex-col justify-between"
          >
            {/* Top Row: Number & Icon */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className={`text-6xl sm:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br ${step.gradient}`}>
                  {step.number}
                </span>
                <div className={`p-3 rounded-2xl border ${step.badgeColor} group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                {step.description}
              </p>
            </div>

            {/* Interactive Preview Widget */}
            <div className="mt-auto pt-6 border-t border-white/5">
              {step.preview}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
