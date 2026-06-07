import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pegamos o token do localStorage (ou cookies, se você salvar lá)
  // Nota: Middleware não tem acesso ao localStorage, por isso o ideal é usar COOKIES
  const token = request.cookies.get('token')?.value;

  const { pathname } = request.nextUrl;

  // Se não tem token e tenta acessar rotas de coordenador/gestor/aluno
  if (!token && (pathname.startsWith('/coordenador') || pathname.startsWith('/aluno'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Define quais rotas o middleware deve observar
export const config = {
  matcher: ['/coordenador/:path*', '/aluno/:path*'],
};