import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const headersList = await headers();
        const authHeader = headersList.get('authorization');
        const token = authHeader?.split(' ')[1] || '';
        const companyIdHeader = headersList.get('x-company-id');

        const backendUrl = process.env.API_URL || 'http://localhost:8080/api/v1';
        
        const proxyHeaders: HeadersInit = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        if (companyIdHeader) {
            proxyHeaders['X-Company-ID'] = companyIdHeader;
        }

        const res = await fetch(`${backendUrl}/lookups/pos-categories`, {
            headers: proxyHeaders,
            cache: 'no-store'
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: unknown) {
        return NextResponse.json(
            { status: 'error', message: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
