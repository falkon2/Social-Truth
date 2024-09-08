<script>
    import { onMount } from 'svelte';
    import { auth } from '$lib/firebase';
    import { user } from '$lib/stores/authStore';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import barba from '@barba/core';
    import { gsap } from 'gsap';
    import '../app.css';
  
    export let data;
  
    onMount(() => {
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          user.set(firebaseUser);
          if (!data.session) {
            // If we have a Firebase user but no session cookie, set it
            fetch('/api/login', { method: 'POST' });
          }
        } else {
          user.set(null);
          if (data.session) {
            // If we have no Firebase user but a session cookie, clear it
            fetch('/api/logout', { method: 'POST' });
          }
        }
      });
  
      barba.init({
        transitions: [{
          name: 'opacity-transition',
          leave(data) {
            return gsap.to(data.current.container, {
              opacity: 0
            });
          },
          enter(data) {
            return gsap.from(data.next.container, {
              opacity: 0
            });
          }
        }]
      });
  
      return () => {
        unsubscribe();
        barba.destroy();
      };
    });
  
    $: if (!$user && !$page.url.pathname.startsWith('/login')) {
      goto('/login');
    }
  </script>
  
  <div data-barba="wrapper">
    <main data-barba="container" data-barba-namespace={$page.url.pathname}>
      <slot />
    </main>
  </div>