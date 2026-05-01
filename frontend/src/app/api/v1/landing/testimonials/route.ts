import { NextResponse } from 'next/server';
import { landingService } from '@/lib/modules/landing/services/landing.service';

export async function GET() {
    try {
        const response = await landingService.getTestimonials();
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
