<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';

  let user = null;

  onMount(async () => {
    if (browser) {
      const { default: barba } = await import('@barba/core');
      const { gsap } = await import('gsap');

      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        user = firebaseUser;
        if (!user && !$page.url.pathname.startsWith('/login') && !$page.url.pathname.startsWith('/register')) {
          goto('/login');
        }
      });

      barba.init({
        transitions: [{
          name: 'opacity-transition',
          leave(data) {
            return gsap.to(data.current.container, {
              opacity: 0,
              duration: 0.5
            });
          },
          enter(data) {
            return gsap.from(data.next.container, {
              opacity: 0,
              duration: 0.5
            });
          }
        }]
      });

      return () => {
        unsubscribe();
        barba.destroy();
      };
    }
  });
</script>

<div class="min-h-screen flex flex-col bg-[#1a1a1a] text-[#f0f0f0]">
  <nav class="p-4 sticky top-0 z-50 bg-[#1a1a1a]">
    <div class="container mx-auto flex justify-between items-center">
      <a href="/" class="text-2xl font-bold text-[#88ce02]">Social Truth</a>
      <div class="space-x-4">
        {#if user}
          <a href="/feed" class="btn">Feed</a>
          <a href="/profile" class="btn">Profile</a>
          <button on:click={() => auth.signOut()} class="btn">Logout</button>
        {:else}
          <a href="/login" class="btn">Login</a>
          <a href="/register" class="btn">Sign Up</a>
        {/if}
      </div>
    </div>
  </nav>

  <main class="flex-grow container mx-auto py-8" data-barba="container" data-barba-namespace={$page.url.pathname}>
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