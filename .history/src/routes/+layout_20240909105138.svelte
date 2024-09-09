<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { fade, fly } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

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
      <button class="md:hidden z-50" on:click={toggleMenu}>
        <div class="w-6 h-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out" class:rotate-45={isMenuOpen}>
          <span class="w-full h-0.5 bg-[#88ce02] transform transition-transform duration-300 ease-in-out" class:translate-y-2.5={isMenuOpen}></span>
          <span class="w-full h-0.5 bg-[#88ce02] transition-opacity duration-300 ease-in-out" class:opacity-0={isMenuOpen}></span>
          <span class="w-full h-0.5 bg-[#88ce02] transform transition-transform duration-300 ease-in-out" class:-translate-y-2.5={isMenuOpen} class:-rotate-90={isMenuOpen}></span>
        </div>
      </button>
    </div>
  </nav>

  {#if isMenuOpen}
    <div class="fixed inset-0 bg-[#1a1a1a] z-40 flex items-center justify-center" transition:fade={{ duration: 300, easing: cubicInOut }}>
      <div class="text-center">
        {#if user}
          <a href="/feed" class="block text-4xl font-bold mb-8 text-[#f0f0f0] hover:text-[#88ce02] transition-colors duration-300" on:click={toggleMenu} in:fly={{ y: 20, duration: 300, delay: 100 }}>Feed</a>
          <a href="/post" class="block text-4xl font-bold mb-8 text-[#f0f0f0] hover:text-[#88ce02] transition-colors duration-300" on:click={toggleMenu} in:fly={{ y: 20, duration: 300, delay: 200 }}>New Post</a>
          <a href="/profile" class="block text-4xl font-bold mb-8 text-[#f0f0f0] hover:text-[#88ce02] transition-colors duration-300" on:click={toggleMenu} in:fly={{ y: 20, duration: 300, delay: 300 }}>Profile</a>
          <button on:click={() => { handleLogout(); toggleMenu(); }} class="block text-4xl font-bold mb-8 text-[#f0f0f0] hover:text-[#88ce02] transition-colors duration-300" in:fly={{ y: 20, duration: 300, delay: 400 }}>Logout</button>
        {:else}
          <a href="/login" class="block text-4xl font-bold mb-8 text-[#f0f0f0] hover:text-[#88ce02] transition-colors duration-300" on:click={toggleMenu} in:fly={{ y: 20, duration: 300, delay: 100 }}>Login</a>
          <a href="/register" class="block text-4xl font-bold mb-8 text-[#f0f0f0] hover:text-[#88ce02] transition-colors duration-300" on:click={toggleMenu} in:fly={{ y: 20, duration: 300, delay: 200 }}>Sign Up</a>
        {/if}
      </div>
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