// app/dashboard/page.tsx
"use client";

import { ActivityFeed } from "@/features/activity/components/ActivityFeed";
import { DocumentsStats } from "@/features/quotes/components/DocumentsStats";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
export default function DashboardPage() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [isChecking, setIsChecking] = useState(true);


    useEffect(() => {
        // 1. Vérifier si un token est passé dans l'URL (après un login Google)
        const token = searchParams.get('token');

        if (token) {
            // 2. Le sauvegarder dans le localStorage
            localStorage.setItem('sharaco_token', token);

            // 3. Nettoyer l'URL (enlever le ?token=...) pour des raisons de sécurité et d'esthétique
            // router.replace ne rajoute pas d'entrée dans l'historique du navigateur
            router.replace('/dashboard');
        }
    }, [searchParams, router]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-zinc-500">Vérification de la connexion...</div>
            </div>
        );
    }
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                    Tableau de bord
                </h1>
                <p className="text-zinc-500 mt-1">
                    Vue d'ensemble de votre activité
                </p>
            </div>

            {/* Stats */}
            <DocumentsStats />

            {/* Activité récente */}
            <div className="mt-12 md:mt-16">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Activité récente
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Suivez les dernières actions sur vos projets et devis.
                    </p>
                </div>
                <ActivityFeed limit={20} />
            </div>
        </div>
    );
}