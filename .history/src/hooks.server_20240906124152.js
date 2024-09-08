import { redirect } from '@sveltejs/kit';

const unprotectedRoutes = ['/', '/login', '/register'];

export async function handle({ event, resolve }) {
  const user = event.locals.user;
  const path = event.url.pathname;

  if (!user && !unprotectedRoutes.includes(path)) {
    throw redirect(303, '/login');
  }

  if (user && (path === '/login' || path === '/register')) {
    throw redirect(303, '/feed');
  }

  const response = await resolve(event);
  return response;
}