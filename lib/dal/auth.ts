// archivo DAL (Data Access Layer)
import 'server-only';

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { puede, type Permiso } from '@/lib/permisos';

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);
 
  if (!session?.id_usuario) {
    redirect('/api/sesion-expirada');
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(session.id_usuario) },
    select: { nombre: true, rol: true, activo: true },
  });

  if (!usuario?.activo) {
    redirect('/api/sesion-expirada');
  }
 
  return { 
    isAuth: true,
    id_usuario: session.id_usuario,
    nombre: usuario.nombre,
    rol: usuario.rol,
    debe_cambiar_password: session.debe_cambiar_password,
  };
});

export const requirePermiso = cache(async (permiso: Permiso) => {
  const session = await verifySession();

  if (!puede(session.rol, permiso)) {
    redirect('/dashboard');
  }

  return session;
});

