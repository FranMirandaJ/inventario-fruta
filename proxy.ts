import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
 
// Especificar rutas publicas — todo lo demas es protegido automaticamente
const publicRoutes = ['/login', '/sandbox'];
 
export default async function proxy(req: NextRequest) {

  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));
 
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);
 
  // Redirigir a /login si no esta autenticado en ruta protegida
  if (!isPublicRoute && !session?.id_usuario) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
 
  // Redirigir a /dashboard si esta autenticado y visita ruta publica
  if (isPublicRoute && session?.id_usuario && !path.startsWith('/sandbox')) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }
 
  return NextResponse.next()
}
 

// el optimizador config, le dice a Next.js que no ejecute el middleware (proxy)
//en imágenes, íconos o archivos internos, solo en las rutas reales que visita el usuario.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.ico$).*)'],
};
