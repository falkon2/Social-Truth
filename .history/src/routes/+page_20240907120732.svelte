<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let gsap;

  onMount(async () => {
    if (browser) {
      const gsapModule = await import('gsap');
      gsap = gsapModule.gsap;
      const ScrollTrigger = (await import('gsap/ScrollTrigger')).ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      gsap.from('.hero-text', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2
      });

      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features',
          start: 'top center'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2
      });
    }
  });
</script>

<div class="text-center py-20">
  <h1 class="text-8xl font-bold mb-6 hero-text">
    <span class="text-[#88ce02]">Connect</span> with
  </h1>
  <h1 class="text-8xl font-bold mb-6 hero-text">
    <span class="text-[#88ce02]">Truth</span>
  </h1>
  <p class="text-2xl mb-8 hero-text">Share your thoughts, ideas, and experiences with the world</p>
  <a href="/register" class="bg-[#88ce02] text-[#1a1a1a] px-8 py-3 rounded-full text-xl font-semibold hover:bg-[#a0ef03] transition duration-300 hero-text inline-block">
    Get Started
  </a>
</div>

<section class="features mt-32">
  <h2 class="text-4xl font-bold text-center mb-16">Why Choose Social Truth?</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    {#each ['Authentic Connections', 'Unfiltered Sharing', 'Meaningful Engagement'] as feature, i}
      <div class="bg-[#2a2a2a] p-8 rounded-lg shadow-lg feature-card">
        <div class="text-4xl mb-4">{['🤝', '🎭', '💬'][i]}</div>
        <h3 class="text-2xl font-semibold mb-2 text-[#88ce02]">{feature}</h3>
        <p class="text-[#b0b0b0]">Experience a platform that values genuine interactions and promotes honest, open dialogue among users.</p>
      </div>
    {/each}
  </div>
</section>