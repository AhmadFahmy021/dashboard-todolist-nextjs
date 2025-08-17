import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest){
    const token = req.cookies.get("token")?.value;
    const {pathname} = req.nextUrl;

    if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token && req.nextUrl.pathname.startsWith("/login")) {
        const previousPage = req.headers.get("referer") || "/dashboard";
        return NextResponse.redirect(new URL(previousPage, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcer: ["/dashboard/:path*"],
}