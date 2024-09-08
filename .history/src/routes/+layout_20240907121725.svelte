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
  <nav class="p-4 sticky top-0 z-50">
    <div class="container mx-auto flex justify-between items-center">
      <a href="/" class="text-2xl font-bold text-[#88ce02]">Social Truth</a>
      <div class="space-x-4">
        {#if user}
          <a href="/feed" class="button-74">Feed</a>
          <a href="/profile" class="button-74">Profile</a>
          <button on:click={() => auth.signOut()} class="button-74">Logout</button>
        {:else}
          <a href="/login" class="button-74">Login</a>
          <a href="/register" class="button-74">Sign Up</a>
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

  .button-74 {
    background-color: #fbeee0;
    border: 2px solid #422800;
    border-radius: 30px;
    box-shadow: #422800 4px 4px 0 0;
    color: #422800;
    cursor: pointer;
    display: inline-block;
    font-weight: 600;
    font-size: 18px;
    padding: 0 18px;
    line-height: 50px;
    text-align: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  .button-74:hover {
    background-color: #fff;
  }

  .button-74:active {
    box-shadow: #422800 2px 2px 0 0;
    transform: translate(2px, 2px);
  }

  @media (min-width: 768px) {
    .button-74 {
      min-width: 120px;
      padding: 0 25px;
    }
  }
</style>