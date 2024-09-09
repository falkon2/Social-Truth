<script lang="ts">
  import { auth, googleProvider, appleProvider } from '$lib/firebase';
  import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/authStore';

  let email = '';
  let password = '';
  let error = '';

  async function handleEmailLogin() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.set(userCredential.user);
      goto('/feed');
    } catch (err: any) {
      error = err.message;
    }
  }

  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      user.set(result.user);
      goto('/feed');
    } catch (err: any) {
      error = err.message;
    }
  }

  async function handleAppleLogin() {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      user.set(result.user);
      goto('/feed');
    } catch (err: any) {
      error = err.message;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleEmailLogin}>
      <input type="hidden" name="remember" value="true">
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input id="email-address" name="email" type="email" autocomplete="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" bind:value={email}>
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" bind:value={password}>
        </div>
      </div>

      <div>
        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Sign in
        </button>
      </div>
    </form>

    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-gray-50 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3">
        <div>
          <button on:click={handleGoogleLogin} class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span class="sr-only">Sign in with Google</span>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
          </button>
        </div>

        <div>
          <button on:click={handleAppleLogin} class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span class="sr-only">Sign in with Apple</span>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3c-2.67 0-4.814 1.358-5.646 3.18-.132.29-.264.58-.38.89-.09.25-.17.51-.23.78-.06.27-.11.54-.13.82-.02.28-.03.56-.01.84.02.28.06.55.12.82.06.27.14.53.24.78.1.25.22.49.36.72.28.45.62.85 1.02 1.18.4.33.85.59 1.34.76.49.17 1.01.26 1.54.26.53 0 1.05-.09 1.54-.26.49-.17.94-.43 1.34-.76.4-.33.74-.73 1.02-1.18.14-.23.26-.47.36-.72.1-.25.18-.51.24-.78.06-.27.1-.54.12-.82.02-.28.01-.56-.01-.84-.02-.28-.07-.55-.13-.82-.06-.27-.14-.53-.23-.78-.116-.31-.248-.6-.38-.89C16.814 6.358 14.67 5 12 5z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

{#if error}
  <p class="mt-2 text-center text-sm text-red-600">{error}</p>
{/if}