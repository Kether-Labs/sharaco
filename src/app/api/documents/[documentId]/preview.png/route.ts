// app/api/documents/[documentId]/preview.png/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ documentId: string }> }
) {
    try {
        // ✅ Déballer params avec await
        const { documentId } = await params;
        
        const cookieStore = await cookies();
        const token = cookieStore.get('sharaco_token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(
            `${apiUrl}/api/v1/documents/${documentId}/preview.png`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                cache: 'force-cache',
                next: { revalidate: 3600 }, // Cache 1 heure
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Erreur backend' },
                { status: response.status }
            );
        }

        const imageBuffer = await response.arrayBuffer();

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Erreur preview document:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}