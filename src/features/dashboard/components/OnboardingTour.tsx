// components/onboarding/OnboardingTour.tsx
'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const TOUR_STORAGE_KEY = 'sharaco_tour_completed';

export function OnboardingTour() {
    useEffect(() => {
        const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY);

        if (hasSeenTour) return;

        const driverObj = driver({
            showProgress: true,
            animate: true,
            smoothScroll: true,
            overlayColor: 'rgba(0, 0, 0, 0.8)',
            stagePadding: 6,
            stageRadius: 8,
            nextBtnText: 'Suivant →',
            prevBtnText: '← Précédent',
            doneBtnText: 'Terminer 🎉',
            progressText: '{{current}} sur {{total}}',
            onDestroyed: () => {
                localStorage.setItem(TOUR_STORAGE_KEY, 'true');
            },
            steps: [
                {
                    element: '[data-tour="sidebar-create"]',
                    popover: {
                        title: '✨ Créez en un clic',
                        description: 'Utilisez ce bouton pour créer rapidement des devis, factures ou clients.',
                        side: 'right',
                    },
                },
                {
                    element: '[data-tour="sidebar-nav"]',
                    popover: {
                        title: '🧭 Navigation',
                        description: 'Accédez à toutes les sections de Sharaco depuis ce menu.',
                        side: 'right',
                    },
                },
                {
                    element: '[data-tour="sidebar-notifications"]',
                    popover: {
                        title: '🔔 Notifications',
                        description: 'Restez informé des mises à jour importantes sur vos projets.',
                        side: 'right',
                    },
                },
                {
                    element: '[data-tour="sidebar-profile"]',
                    popover: {
                        title: '👤 Votre profil',
                        description: 'Gérez votre compte et déconnectez-vous depuis ici.',
                        side: 'right',
                    },
                },
                {
                    element: '[data-tour="dashboard-title"]',
                    popover: {
                        title: '👋 Bienvenue sur Sharaco !',
                        description: 'Voici votre tableau de bord avec une vue d\'ensemble de votre activité.',
                        side: 'bottom',
                    },
                },
                {
                    element: '[data-tour="dashboard-stats"]',
                    popover: {
                        title: '📊 Vos statistiques',
                        description: 'Suivez l\'évolution de vos devis, factures et chiffre d\'affaires.',
                        side: 'bottom',
                    },
                },
                {
                    element: '[data-tour="dashboard-activity"]',
                    popover: {
                        title: '🕐 Activité récente',
                        description: 'Toutes les actions sur vos projets apparaissent ici en temps réel. C\'est parti !',
                        side: 'top',
                    },
                },
            ],
        });

        // Attendre que le DOM soit prêt
        const timer = setTimeout(() => {
            driverObj.drive();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return null;
}