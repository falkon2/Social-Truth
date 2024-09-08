export function load({ cookies }) {
    const session = cookies.get('session');
    return {
      session
    };
  }