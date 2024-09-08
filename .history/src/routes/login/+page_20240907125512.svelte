<script>
  import { auth } from '$lib/firebase';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = null;

  async function handleSubmit() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      goto('/feed');
    } catch (err) {
      error = err.message;
    }
  }
</script>

<div class="max-w-md mx-auto">
  <h1 class="text-4xl font-bold mb-8 text-[#88ce02]">Login</h1>
  
  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
    <div class="mb-4">
      <label for="email" class="block text-sm font-medium text-[#f0f0f0] mb-2">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        class="w-full p-2 rounded bg-[#3a3a3a] text-white"
        required
      />
    </div>
    <div class="mb-4">
      <label for="password" class="block text-sm font-medium text-[#f0f0f0] mb-2">Password</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        class="w-full p-2 rounded bg-[#3a3a3a] text-white"
        required
      />
    </div>
    <button type="submit" class="btn w-full">Login</button>
  </form>
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

  .btn:hover {
    background-color: #a0ef03;
  }
</style>