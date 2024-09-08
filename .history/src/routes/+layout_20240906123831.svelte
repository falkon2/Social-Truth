<script>
    import { onMount } from 'svelte';
    import barba from '@barba/core';
    import { gsap } from 'gsap';
  
    onMount(() => {
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
    });
  </script>
  
  <div data-barba="wrapper">
    <main data-barba="container" data-barba-namespace={$page.url.pathname}>
      <slot></slot>
    </main>
  </div>