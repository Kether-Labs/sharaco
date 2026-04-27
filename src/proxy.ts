import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // 1. On récupère le token dans les cookies ou le header x-auth
    const token = request.cookies.get('sharaco_token')?.value || request.headers.get('x-auth');

    const { pathname } = request.nextUrl;

    // 2. Si l'utilisateur essaie d'aller sur le dashboard sans token
    if (pathname.startsWith('/dashboard') && !token) {
        // On le redirige vers la page de login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Si l'utilisateur est déjà connecté et essaie d'aller sur le login
    if (pathname === '/login' && token) {
        // On l'envoie directement sur le dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// On définit sur quelles routes le proxy doit s'activer
export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};