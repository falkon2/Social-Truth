import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
  console.log('Setting session cookie');
  cookies.set('session', 'logged-in', { path: '/', httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
  return json({ success: true });
}