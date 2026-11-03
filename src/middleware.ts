import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  // Uma sessão inválida pode vir sem `user` — só conta como sessão se tiver utilizador
  const user = session?.user;
  const pathname = nextUrl.pathname;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/login';

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?callbackUrl=' + encodeURIComponent(pathname), nextUrl));
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|uploads).*)'],
};
