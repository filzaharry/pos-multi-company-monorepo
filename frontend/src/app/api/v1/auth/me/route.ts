import { NextResponse } from 'next/server';
import { loginService } from '@/lib/modules/login/services/login.service';
import { headers } from 'next/headers';

export async function GET() {
    try {
        const headersList = await headers();
        const authHeader = headersList.get('authorization');
        const token = authHeader?.split(' ')[1] || '';

        if (!token) {
            return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
        }

        const response = await loginService.getMe(token);
        return NextResponse.json(response, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json(
            { 
                status: 'error', 
                message: error instanceof Error ? error.message : 'Internal Server Error',
                data: null
            },
            { status: 500 }
        );
    }
}
