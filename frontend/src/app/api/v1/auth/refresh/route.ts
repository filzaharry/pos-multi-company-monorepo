import { NextResponse } from 'next/server';
import { loginService } from '@/lib/modules/login/services/login.service';

export async function POST(request: Request) {
    try {
        const { refresh_token } = await request.json();
        const response = await loginService.refreshToken(refresh_token);
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
