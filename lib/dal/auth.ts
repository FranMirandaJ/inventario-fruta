// archivo DAL (Data Access Layer)
import 'server-only';

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { cache } from 'react';
import { redirect } from 'next/navigation';

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);
 
  if (!session?.id_usuario) {
    redirect('/login');
  }
 
  return { 
    isAuth: true,
    id_usuario: session.id_usuario,
    nombre: session.nombre,
    rol: session.rol
  };
});

