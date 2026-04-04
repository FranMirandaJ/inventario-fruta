import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
 
// Especificar rutas protegidas y rutas publicas
const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/', '/login'];
 
export default async function proxy(req: NextRequest) {

  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
 
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);
 
  // Redireccionar a /login si el usuario no esta autenticado
  if (isProtectedRoute && !session?.id_usuario) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
 
  // Redireccionar a /dashboard si el usuario esta autenticado
  if (
    isPublicRoute &&
    session?.id_usuario &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }
 
  return NextResponse.next()
}
 

// el optimizador config, le dice a Next.js que no ejecute el middleware (proxy)
//en imágenes, íconos o archivos internos, solo en las rutas reales que visita el usuario.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.ico$).*)'],
};