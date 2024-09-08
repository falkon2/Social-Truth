<script>
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase';
  import { user } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import '../app.css';

  export let data;

  onMount(async () => {
    if (browser) {
      const { default: barba } = await import('@barba/core');
      const { gsap } = await import('gsap');

      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          user.set(firebaseUser);
          if (!data.session) {
            fetch('/api/login', { method: 'POST' });
          }
        } else {
          user.set(null);
          if (data.session) {
            fetch('/api/logout', { method: 'POST' });
          }
        }
      });

      barba.init({
        transitions: [{
          name: 'tile-transition',
          leave(data) {
            return gsap.to(data.current.container, {
              duration: 0.5,
              opacity: 0,
              y: -50,
              stagger: 0.05,
              ease: "power2.in"
            });
          },
          enter(data) {
            return gsap.from(data.next.container, {
              duration: 0.5,
              opacity: 0,
              y: 50,
              stagger: 0.05,
              ease: "power2.out"
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

  $: if (browser && !$user && !$page.url.pathname.startsWith('/login') && !$page.url.pathname.startsWith('/register')) {
    goto('/login');
  }
</script>

<div data-barba="wrapper">
  <main data-barba="container" data-barba-namespace={$page.url.pathname}>
    <slot />
  </main>
</div>

<style>
  :global(body) {
    background-color: #1e1e1e;
    color: #ffffff;
    font-family: 'Arial', sans-serif;
  }
</style>