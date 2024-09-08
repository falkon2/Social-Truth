import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
  cookies.set('session', 'logged-in', { path: '/', httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
  return json({ success: true });
}