'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { useLogin } from '../hooks/useAuth';

const loginSchema = z.object({
    email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
    password: z.string().min(1, 'Le mot de passe est requis'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const loginMutation = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        loginMutation.mutate({
            username: data.email,
            password: data.password,
        });
    };

    return (
        <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight">
                    Connexion
                </CardTitle>
                <CardDescription>
                    Entrez vos identifiants pour accéder à votre compte
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {loginMutation.isError && (
                            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                                {loginMutation.error instanceof Error
                                    ? loginMutation.error.message
                                    : 'Identifiants incorrects. Veuillez réessayer.'}
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="nom@entreprise.com"
                                            autoComplete="email"
                                            disabled={loginMutation.isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Mot de passe</FormLabel>
                                        <button
                                            type="button"
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? 'Masquer' : 'Afficher'}
                                        </button>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            disabled={loginMutation.isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Connexion en cours...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    Pas encore de compte ?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        Créer un compte
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}