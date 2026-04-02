import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SessionPayload } from "./definitions";
import { createLogger } from "./logger";

const log = createLogger("Auth/Session");
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log.warn(`Token de sesión rechazado/no encontrado: ${errorMessage}`);
    return null;
  }
}

export async function createSession(
  userId: string,
  username: string,
  role: string,
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // expiración en 7 días
  const dataSession: SessionPayload = {
    id_usuario: userId,
    nombre: username,
    rol: role,
  };
  const session = await encrypt(dataSession);
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // expiración en 7 días

  const dataSession: SessionPayload = {
    id_usuario: payload.id_usuario,
    nombre: payload.nombre,
    rol: payload.rol,
  };

  const newSession = await encrypt(dataSession);

  const cookieStore = await cookies();
  cookieStore.set("session", newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
