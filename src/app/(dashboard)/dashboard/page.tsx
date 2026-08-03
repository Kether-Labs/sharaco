// app/dashboard/page.tsx
"use client";

import { ActivityFeed } from "@/features/activity/components/ActivityFeed";
import { DocumentsStats } from "@/features/quotes/components/DocumentsStats";
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/features/auth/api/authApi';

export default function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isChecking, setIsChecking] = useState(true);

    const { token, setToken, setUser, isAuthenticated } = useAuthStore();

    // ✅ Empêche le traitement multiple du token OAuth
    const hasProcessedOAuth = useRef(false);

    useEffect(() => {
        const run = async () => {
            const urlToken = searchParams.get('token');

            // 1. Cas OAuth : On vient de Google avec un token dans l'URL
            if (urlToken && !hasProcessedOAuth.current) {
                hasProcessedOAuth.current = true;
                setToken(urlToken);

                try {
                    const user = await authApi.getMe();
                    setUser(user);
                } catch (err) {
                    console.error("Erreur récupération profil:", err);
                }

                router.replace('/dashboard');
                setIsChecking(false);
                return;
            }

            // 2. Cas normal : Vérification de secours dans le localStorage
            if (!urlToken) {
                const storedToken = typeof window !== 'undefined' ? localStorage.getItem('sharaco_token') : null;

                if (!storedToken && !token && !isAuthenticated) {
                    router.replace('/login');
                    return;
                }
            }

            setIsChecking(false);
        };

        run();
    }, [searchParams, router, setToken, setUser, token, isAuthenticated]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-zinc-500">Vérification de la connexion...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 min-h-screen">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-white">Tableau de bord</h1>
                <p className="text-zinc-500 mt-1">Vue d'ensemble de votre activité</p>
            </div>
            <DocumentsStats />
            <div className="mt-12 md:mt-16">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Activité récente</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Suivez les dernières actions sur vos projets et devis.</p>
                </div>
                <ActivityFeed limit={20} />
            </div>
        </div>
    );
}