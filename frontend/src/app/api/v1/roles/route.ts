import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const search = searchParams.get('search');
        const all = searchParams.get('all');

        const headersList = await headers();
        const authHeader = headersList.get('authorization');
        const token = authHeader?.split(' ')[1] || '';

        const query = new URLSearchParams();
        if (page) query.append('page', page);
        if (limit) query.append('limit', limit);
        if (search) query.append('search', search);
        if (all) query.append('all', all);

        const backendUrl = process.env.API_URL || 'http://localhost:8080/api/v1';
        // Handle both /roles and /roles/all if needed, but userService uses /roles or /roles/all
        const url = request.url.includes('/all') ? `${backendUrl}/roles/all` : `${backendUrl}/roles?${query.toString()}`;
        
        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const headersList = await headers();
        const authHeader = headersList.get('authorization');
        const token = authHeader?.split(' ')[1] || '';

        const backendUrl = process.env.API_URL || 'http://localhost:8080/api/v1';
        const res = await fetch(`${backendUrl}/roles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
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
