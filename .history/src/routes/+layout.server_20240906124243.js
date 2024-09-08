import { auth } from '$lib/firebase-admin';

export async function load({ cookies }) {
  const sessionCookie = cookies.get('session');

  if (!sessionCookie) {
    return { user: null };
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return { user: decodedClaims };
  } catch (error) {
    return { user: null };
  }
}