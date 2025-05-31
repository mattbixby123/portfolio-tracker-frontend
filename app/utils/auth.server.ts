import { redirect } from "@remix-run/node";
import { getSession, commitSession, destroySession } from "./session.server";
import type { AuthenticationResponse } from "~/types/auth";

const USER_SESSION_KEY = "userId";
const TOKEN_SESSION_KEY = "token";

export async function getSessionData(request: Request) {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  return {
    userId: session.get(USER_SESSION_KEY),
    token: session.get(TOKEN_SESSION_KEY),
    session,
  };
}

export async function getUserId(request: Request): Promise<string | undefined> {
  const { userId } = await getSessionData(request);
  return userId;
}

export async function getAuthToken(request: Request): Promise<string | undefined> {
  const { token } = await getSessionData(request);
  return token;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireAuthToken(request: Request) {
  const token = await getAuthToken(request);
  if (!token) {
    throw redirect("/login");
  }
  return token;
}

export async function createUserSession({
  request,
  authResponse,
  remember = false,
  redirectTo = "/dashboard",
}: {
  request: Request;
  authResponse: AuthenticationResponse;
  remember?: boolean;
  redirectTo?: string;
}) {
  const { session } = await getSessionData(request);
  session.set(USER_SESSION_KEY, authResponse.email);
  session.set(TOKEN_SESSION_KEY, authResponse.token);
  
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : undefined, // 7 days or session
      }),
    },
  });
}

export async function logout(request: Request) {
  const { session } = await getSessionData(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}