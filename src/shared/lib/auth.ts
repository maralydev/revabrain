import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";

export interface Session {
  userId: number;
  email: string;
  voornaam: string;
  achternaam: string;
  isAdmin: boolean;
  mustChangePassword: boolean;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default-secret-change-in-production"
    );
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  if (session.mustChangePassword) {
    redirect("/change-password");
  }

  return session;
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireAuth();
  
  if (!session.isAdmin) {
    redirect("/admin");
  }

  return session;
}

// Alias for backward compatibility
export const requireZorgverlener = requireAuth;
export const verifySession = getSession;

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Session utilities
export async function createSession(user: Session): Promise<string> {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "default-secret-change-in-production"
  );
  
  const token = await new SignJWT(user as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
  
  return token;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
