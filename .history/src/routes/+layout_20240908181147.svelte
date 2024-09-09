<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let user = null;
  let isMenuOpen = false;

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      user = firebaseUser;
    });

    return unsubscribe;
  });

  function handleLogout() {
    auth.signOut().then(() => {
      goto('/login');
    });
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<div class="min-h-screen flex flex-col bg-[#1a1a1a] text-[#f0f0f0]">
  <nav class="p-4 sticky top-0 z-50 bg-[#1a1a1a]">
    <div class="container mx-auto flex justify-between items-center">
      <a href="/" class="text-2xl font-bold text-[#88ce02]">Social Truth</a>
      <div class="hidden md:flex space-x-4">
        {#if user}
          <a href="/feed" class="btn">Feed</a>
          <a href="/post" class="btn">New Post</a>
          <a href="/profile" class="btn">Profile</a>
          <button on:click={handleLogout} class="btn">Logout</button>
        {:else}
          <a href="/login" class="btn">Login</a>
          <a href="/register" class="btn">Sign Up</a>
        {/if}
      </div>
      <button class="md:hidden" on:click={toggleMenu}>
        <svg class="w-6 h-6 text-[#88ce02]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>
  </nav>

  {#if isMenuOpen}
    <div class="md:hidden bg-[#2a2a2a] p-4">
      {#if user}
        <a href="/feed" class="block py-2 text-[#f0f0f0]">Feed</a>
        <a href="/post" class="block py-2 text-[#f0f0f0]">New Post</a>
        <a href="/profile" class="block py-2 text-[#f0f0f0]">Profile</a>
        <button on:click={handleLogout} class="block w-full text-left py-2 text-[#f0f0f0]">Logout</button>
      {:else}
        <a href="/login" class="block py-2 text-[#f0f0f0]">Login</a>
        <a href="/register" class="block py-2 text-[#f0f0f0]">Sign Up</a>
      {/if}
    </div>
  {/if}

  <main class="flex-grow container mx-auto py-8">
    <slot />
  </main>

  <footer class="bg-[#2a2a2a] p-4 text-center">
    <p class="text-[#888888]">&copy; 2024 Social Truth. All rights reserved.</p>
  </footer>
</div>

<style>
  :global(body) {
    background-color: #1a1a1a;
    color: #f0f0f0;
    font-family: 'Arial', sans-serif;
  }

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