import { NextResponse } from 'next/server';
import { loginService } from '@/lib/modules/login/services/login.service';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await loginService.requestOTP(body);
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
