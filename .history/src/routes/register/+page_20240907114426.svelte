<script>
  import { registerUser, loginWithGoogle } from '$lib/auth';
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/authStore';

  let email = '';
  let password = '';
  let displayName = '';
  let error = '';
  let loading = false;

  function validateForm() {
    if (!email || !password || !displayName) {
      error = 'Please fill in all fields';
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      error = 'Please enter a valid email address';
      return false;
    }
    if (password.length < 6) {
      error = 'Password must be at least 6 characters long';
      return false;
    }
    return true;
  }

  async function handleRegister() {
    if (!validateForm()) return;

    loading = true;
    error = '';

    try {
      await registerUser(email, password, displayName);
      goto('/email-verification');
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleGoogleRegister() {
    loading = true;
    error = '';

    try {
      await loginWithGoogle();
      goto('/feed');
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
  <div class="bg-[#2d2d2d] p-8 rounded-lg shadow-lg w-96">
    <h2 class="text-3xl font-bold mb-6 text-center text-[#88ce02]">Register</h2>
    
    {#if error}
      <p class="text-red-500 mb-4">{error}</p>
    {/if}
    
    <form on:submit|preventDefault={handleRegister} class="space-y-4">
      <div>
        <label for="displayName" class="block text-sm font-medium text-gray-300">Display Name</label>
        <input type="text" id="displayName" bind:value={displayName} required class="mt-1 block w-full px-3 py-2 bg-[#3d3d3d] border border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-[#88ce02] focus:ring-1 focus:ring-[#88ce02] text-white" />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
        <input type="email" id="email" bind:value={email} required class="mt-1 block w-full px-3 py-2 bg-[#3d3d3d] border border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-[#88ce02] focus:ring-1 focus:ring-[#88ce02] text-white" />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
        <input type="password" id="password" bind:value={password} required class="mt-1 block w-full px-3 py-2 bg-[#3d3d3d] border border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-[#88ce02] focus:ring-1 focus:ring-[#88ce02] text-white" />
      </div>
      <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#1e1e1e] bg-[#88ce02] hover:bg-[#a0ef03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88ce02]" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
    
    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-[#2d2d2d] text-gray-400">Or continue with</span>
        </div>
      </div>
      
      <div class="mt-6">
        <button on:click={handleGoogleRegister} class="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-[#3d3d3d] hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88ce02]" disabled={loading}>
          <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
          </svg>
          {loading ? 'Registering...' : 'Register with Google'}
        </button>
      </div>
    </div>

    <div class="mt-4 text-center">
      <p class="text-sm text-gray-400">
        Already have an account? 
        <a href="/login" class="font-medium text-[#88ce02] hover:text-[#a0ef03]">
          Sign in
        </a>
      </p>
    </div>

    <div class="mt-4 text-center">
      <a href="/" class="text-sm font-medium text-[#88ce02] hover:text-[#a0ef03]">
        Back to Home
      </a>
    </div>
  </div>
</div>