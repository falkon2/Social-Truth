<script>
  import { auth } from '$lib/firebase';
  import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      goto('/');
    } catch (err) {
      error = err.message;
    }
  }

  async function handleGoogleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      goto('/');
    } catch (err) {
      error = err.message;
    }
  }
</script>

<div class="max-w-md mx-auto">
  <h1 class="text-3xl font-bold mb-6 text-center">Login</h1>
  
  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}
  
  <form on:submit|preventDefault={handleLogin} class="space-y-4">
    <div>
      <label for="email" class="block mb-1">Email</label>
      <input type="email" id="email" bind:value={email} required class="w-full p-2 rounded bg-gray-800 text-white" />
    </div>
    <div>
      <label for="password" class="block mb-1">Password</label>
      <input type="password" id="password" bind:value={password} required class="w-full p-2 rounded bg-gray-800 text-white" />
    </div>
    <button type="submit" class="w-full bg-green-400 text-gray-900 p-2 rounded font-semibold hover:bg-green-500">
      Login
    </button>
  </form>
  
  <div class="mt-4">
    <button on:click={handleGoogleLogin} class="w-full bg-blue-500 text-white p-2 rounded font-semibold hover:bg-blue-600">
      Login with Google
    </button>
  </div>
  
  <p class="mt-4 text-center">
    Don't have an account? <a href="/register" class="text-green-400 hover:underline">Register here</a>
  </p>
</div>