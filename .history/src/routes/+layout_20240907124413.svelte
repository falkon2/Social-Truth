<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { auth, db } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { doc, getDoc } from 'firebase/firestore';

  let user = null;
  let userProfile = null;

  onMount(async () => {
    if (browser) {
      const { default: barba } = await import('@barba/core');
      const { gsap } = await import('gsap');

      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        user = firebaseUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            userProfile = userDoc.data();
          } else if (!$page.url.pathname.startsWith('/update-profile')) {
            goto('/update-profile');
          }
        } else if (!$page.url.pathname.startsWith('/login') && !$page.url.pathname.startsWith('/register')) {
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

  function handleLogout() {
    auth.signOut();
    goto('/login');
  }
</script>

<div class="min-h-screen flex flex-col bg-[#1a1a1a] text-[#f0f0f0]">
  <nav class="p-4 sticky top-0 z-50 bg-[#1a1a1a]">
    <div class="container mx-auto flex justify-between items-center">
      <a href="/" class="text-2xl font-bold text-[#88ce02]">Social Truth</a>
      <div class="space-x-4 flex items-center">
        {#if user}
          <a href="/feed" class="btn">Feed</a>
          <a href="/posts" class="btn">New Post</a>
          <div class="relative">
            <button class="w-10 h-10 rounded-full overflow-hidden focus:outline-none">
              <img src={userProfile?.photoURL || user.photoURL || '/default-avatar.png'} alt="Profile" class="w-full h-full object-cover" />
            </button>
            <div class="absolute right-0 mt-2 w-48 bg-[#2a2a2a] rounded-md shadow-lg py-1 hidden group-hover:block">
              <a href="/profile" class="block px-4 py-2 text-sm text-[#f0f0f0] hover:bg-[#3a3a3a]">Profile</a>
              <button on:click={handleLogout} class="block w-full text-left px-4 py-2 text-sm text-[#f0f0f0] hover:bg-[#3a3a3a]">Logout</button>
            </div>
          </div>
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