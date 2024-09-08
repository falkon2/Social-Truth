<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let user = null;

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      user = firebaseUser;
      if (!user && !$page.url.pathname.startsWith('/login') && !$page.url.pathname.startsWith('/register')) {
        goto('/login');
      }
    });

    return unsubscribe;
  });
</script>

<div class="min-h-screen flex flex-col">
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <a href="/" class="text-2xl font-bold text-green-400">SocialApp</a>
      <div class="space-x-4">
        {#if user}
          <a href="/profile" class="text-white hover:text-green-400">Profile</a>
          <button on:click={() => auth.signOut()} class="text-white hover:text-green-400">Logout</button>
        {:else}
          <a href="/login" class="text-white hover:text-green-400">Login</a>
          <a href="/register" class="bg-green-400 text-gray-900 px-4 py-2 rounded hover:bg-green-500">Sign Up</a>
        {/if}
      </div>
    </div>
  </nav>

  <main class="flex-grow container mx-auto py-8">
    <slot />
  </main>

  <footer class="bg-gray-800 p-4 text-center">
    <p class="text-gray-400">&copy; 2024 SocialApp. All rights reserved.</p>
  </footer>
</div>