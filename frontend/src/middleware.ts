import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;

    // 1. If trying to access dashboard but no token, redirect to login
    if (pathname.startsWith('/dashboard') && !accessToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. If already logged in and trying to access login page, redirect to dashboard
    if (pathname.startsWith('/login') && accessToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/dashboard/:path*', '/login'],
};
