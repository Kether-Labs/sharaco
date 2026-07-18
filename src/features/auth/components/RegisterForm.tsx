'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';

import Logo from '@/components/ui/logo';
import { useRegister, useVerifyIfEmailExist } from '../hooks/useAuth';
import { Label } from '@/components/ui/label';

const registerSchema = z.object({
    full_name: z.string().min(2, "Le nom complet est requis"),
    password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
    phone: z.string().optional(),
    company_name: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    const registerMutation = useRegister();
    const verifyIfEmailExistMutation = useVerifyIfEmailExist();

    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'email' | 'details'>('email');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            full_name: '',
            password: '',
            phone: '',
            company_name: '',
        },
    });

    const currentPassword = form.watch("password") || "";

    const onStepNext = async () => {
        setError('');
        if (!email || !z.string().email().safeParse(email).success) {
            setError("Veuillez entrer un email valide");
            return;
        }

        try {
            const exists = await verifyIfEmailExistMutation.mutateAsync(email);

            if (!exists) {
                setError("Cet email est déjà utilisé. Veuillez vous connecter.");
            } else {
                setStep('details');
            }
        } catch (err) {
            console.log(err);
            setError("Une erreur est survenue lors de la vérification.");
        }
    };

    const onSubmit = async (data: RegisterFormValues) => {
        setError('');
        try {
            const response = await registerMutation.mutateAsync({
                email,
                full_name: data.full_name,
                password: data.password,
                phone: data.phone || undefined,
                company_name: data.company_name || undefined,
            });

            if (response) {
                router.push('/dashboard');
            } else {
                setError("Une erreur est survenue lors de la connexion.");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la création du compte.");
        }
    };

    return (
        <div className="w-full max-w-[400px] space-y-8 text-center overflow-hidden">
            {/* Logo & Heading */}
            <div className="flex flex-col items-center space-y-6">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 dark:border-slate-800">
                    <Logo width={80} height={80} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Rejoindre Sharaco</h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Créez votre compte pour commencer.
                    </p>
                </div>
            </div>

            <div className="relative">
                <AnimatePresence mode="wait">
                    {step === 'email' ? (
                        <motion.div
                            key="email-step"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Input
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && onStepNext()}
                                    value={email}
                                    type="email"
                                    placeholder="Entrez votre email"
                                    disabled={verifyIfEmailExistMutation.isPending}
                                    className="h-12 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-sky-500 focus:border-sky-500 rounded-xl"
                                />
                            </div>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}
                            <Button
                                onClick={onStepNext}
                                disabled={verifyIfEmailExistMutation.isPending || !email}
                                className="w-full cursor-pointer h-12 bg-[#2563EB] hover:bg-[#2563EB]/80 text-white font-bold rounded-xl transition-all"
                            >
                                {verifyIfEmailExistMutation.isPending ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Continuer'
                                )}
                            </Button>

                            <p className="text-zinc-500 text-sm font-medium pt-4">
                                Vous avez déjà un compte ?{" "}
                                <Link href="/login" className="text-[#2563EB] hover:text-blue-400 font-bold underline-offset-4 hover:underline">
                                    Connectez-vous
                                </Link>
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="details-step"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
                                    {(error || registerMutation.isError) && (
                                        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500 text-left mb-4">
                                            {error || (registerMutation.error instanceof Error ? registerMutation.error.message : 'Erreur lors de la création.')}
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-2 text-sm text-zinc-400 mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep('email')}
                                            className="hover:text-white transition-colors"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <span className="font-medium truncate">{email}</span>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="full_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label className="text-zinc-400 text-xs tracking-widest font-bold">Nom complet</Label>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Jean Dupont"
                                                        className="h-12 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-[#2563EB] focus:border-[#2563EB] rounded-xl"
                                                        disabled={registerMutation.isPending}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="company_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label className="text-zinc-400 text-xs tracking-widest font-bold">Entreprise (Optionnel)</Label>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Sharaco Inc."
                                                        className="h-12 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-[#2563EB] focus:border-[#2563EB] rounded-xl"
                                                        disabled={registerMutation.isPending}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label className="text-zinc-400 text-xs tracking-widest font-bold">Téléphone (Optionnel)</Label>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        placeholder="+33 6 12 34 56 78"
                                                        className="h-12 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-[#2563EB] focus:border-[#2563EB] rounded-xl"
                                                        disabled={registerMutation.isPending}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between mt-2 mb-1">
                                                    <Label className="text-zinc-400 text-xs tracking-widest font-bold">Mot de passe</Label>
                                                    <button
                                                        type="button"
                                                        className="text-xs text-[#2563EB] cursor-pointer hover:text-blue-400 font-bold transition-colors"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? 'Masquer' : 'Afficher'}
                                                    </button>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="••••••••"
                                                        className="h-12 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-[#2563EB] focus:border-[#2563EB] rounded-xl"
                                                        autoComplete="new-password"
                                                        disabled={registerMutation.isPending}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full cursor-pointer h-12 bg-[#2563EB] hover:bg-[#2563EB]/80 text-white font-bold rounded-xl transition-all mt-4"
                                        disabled={registerMutation.isPending || currentPassword.length < 8}
                                    >
                                        {registerMutation.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Création en cours...
                                            </>
                                        ) : (
                                            'Créer mon compte'
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
