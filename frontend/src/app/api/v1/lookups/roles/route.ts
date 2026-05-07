import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { lookupService } from '@/lib/modules/users/services/lookup.service';

export async function GET() {
    try {
        const headersList = await headers();
        const authHeader = headersList.get('authorization');
        const token = authHeader?.split(' ')[1] || '';

        const response = await lookupService.getRoleOptions(token);
        return NextResponse.json(response, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json(
            { 
                status: 'error', 
                message: error instanceof Error ? error.message : 'Internal Server Error' 
            },
            { status: 500 }
        );
    }
}
