import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const proxyRequest = async (request: Request, { params }: { params: Promise<{ path?: string[] }> }) => {
    try {
        const { path } = await params;
        const url = new URL(request.url);
        const searchParams = url.searchParams.toString();
        
        // Construct the backend path
        const backendPath = path ? path.join('/') : '';
        const backendUrl = process.env.API_URL || 'http://localhost:8080/api/v1';
        
        // Build the full backend URL
        const fullUrl = `${backendUrl}/pos${backendPath ? `/${backendPath}` : ''}${searchParams ? `?${searchParams}` : ''}`;

        // Forward Headers (especially Authorization and X-Company-ID)
        const headersList = await headers();
        const proxyHeaders: HeadersInit = {};

        const authHeader = headersList.get('authorization');
        if (authHeader) {
            proxyHeaders['Authorization'] = authHeader;
        }

        const companyIdHeader = headersList.get('x-company-id');
        if (companyIdHeader) {
            proxyHeaders['X-Company-ID'] = companyIdHeader;
        }

        const contentTypeHeader = headersList.get('content-type');
        if (contentTypeHeader) {
            proxyHeaders['Content-Type'] = contentTypeHeader;
        }

        // Prepare the fetch options
        const fetchOptions: RequestInit = {
            method: request.method,
            headers: proxyHeaders,
            cache: 'no-store',
        };

        // Forward the body if it's not a GET or HEAD request
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            const contentType = headersList.get('content-type');
            if (contentType?.includes('multipart/form-data')) {
                const arrayBuffer = await request.arrayBuffer();
                fetchOptions.body = arrayBuffer;
            } else {
                const body = await request.text();
                if (body) {
                    fetchOptions.body = body;
                }
            }
        }

        // Make the proxy request
        const res = await fetch(fullUrl, fetchOptions);

        // Try to parse JSON response, fallback to text if not JSON
        let data;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        return NextResponse.json(data, { status: res.status });
    } catch (error: unknown) {
        return NextResponse.json(
            { status: 'error', message: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
