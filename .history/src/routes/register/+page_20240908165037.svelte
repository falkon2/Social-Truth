<!-- src/routes/register/+page.svelte -->
<script>
  import { auth } from '$lib/firebase';
  import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
  import { goto } from '$app/navigation';

  let username = '';
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleRegister() {
    loading = true;
    error = '';
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      goto('/feed');
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto mt-8 p-6 bg-[#2a2a2a] rounded-lg shadow-lg">
  <h2 class="text-3xl font-bold mb-6 text-[#88ce02]">Create your account</h2>
  
  <form on:submit|preventDefault={handleRegister} class="space-y-4">
    <div>
      <label for="username" class="block text-sm font-medium text-[#f0f0f0]">Username</label>
      <input id="username" type="text" bind:value={username} required class="mt-1 block w-full rounded-md bg-[#3a3a3a] border-gray-300 shadow-sm focus:border-[#88ce02] focus:ring focus:ring-[#88ce02] focus:ring-opacity-50">
    </div>
    
    <div>
      <label for="email" class="block text-sm font-medium text-[#f0f0f0]">Email address</label>
      <input id="email" type="email" bind:value={email} required class="mt-1 block w-full rounded-md bg-[#3a3a3a] border-gray-300 shadow-sm focus:border-[#88ce02] focus:ring focus:ring-[#88ce02] focus:ring-opacity-50">
    </div>
    
    <div>
      <label for="password" class="block text-sm font-medium text-[#f0f0f0]">Password</label>
      <input id="password" type="password" bind:value={password} required class="mt-1 block w-full rounded-md bg-[#3a3a3a] border-gray-300 shadow-sm focus:border-[#88ce02] focus:ring focus:ring-[#88ce02] focus:ring-opacity-50">
    </div>
    
    <button type="submit" class="w-full btn" disabled={loading}>
      {loading ? 'Registering...' : 'Register'}
    </button>
  </form>
  
  {#if error}
    <p class="mt-4 text-red-500">{error}</p>
  {/if}
</div>

<style>
  .btn {
    background-color: #88ce02;
    color: #1a1a1a;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .btn:hover:not(:disabled) {
    background-color: #a0ef03;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>