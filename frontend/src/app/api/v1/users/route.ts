import { NextResponse } from 'next/server';
import { userService } from '@/lib/modules/users/services/user.service';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const search = searchParams.get('search');
        const role_id = searchParams.get('role_id');
        const company_id = searchParams.get('company_id');

        const headersList = await headers();
        const authHeader = headersList.get('authorization');
        const token = authHeader?.split(' ')[1] || '';

        // Call backend directly using fetch to avoid circularity if userService uses apiRouter
        // Actually, I should create a server-side userService or use fetch here.
        const query = new URLSearchParams();
        if (page) query.append('page', page);
        if (limit) query.append('limit', limit);
        if (search) query.append('search', search);
        if (role_id) query.append('role_id', role_id);
        if (company_id) query.append('company_id', company_id);

        const backendUrl = process.env.API_URL || 'http://localhost:8080/api/v1';
        const res = await fetch(`${backendUrl}/users?${query.toString()}`, {
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
        const res = await fetch(`${backendUrl}/users`, {
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
