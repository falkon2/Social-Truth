import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
  console.log('Clearing session cookie');
  cookies.delete('session', { path: '/' });
  return json({ success: true });
}