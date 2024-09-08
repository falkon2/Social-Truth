import { redirect } from '@sveltejs/kit';

const unprotectedRoutes = ['/', '/login', '/register', '/email-verification'];

export async function handle({ event, resolve }) {
  const session = event.cookies.get('session');
  const path = event.url.pathname;

  if (!session && !unprotectedRoutes.includes(path)) {
    throw redirect(303, '/login');
  }

  if (session && (path === '/login' || path === '/register')) {
    throw redirect(303, '/feed');
  }

  const response = await resolve(event);
  return response;
}