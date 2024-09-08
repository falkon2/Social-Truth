<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let gsap;
  let ScrollTrigger;

  onMount(async () => {
    if (browser) {
      const gsapModule = await import('gsap');
      gsap = gsapModule.gsap;
      ScrollTrigger = (await import('gsap/ScrollTrigger')).ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // Intro animation
      const tl = gsap.timeline();
      tl.from('.hero-text', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2
      });

      // Smooth scroll for feature cards
      gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            end: 'bottom center',
            toggleActions: 'play none none reverse'
          }
        });
      });
    }
  });
</script>

<div class="min-h-screen bg-[#1a1a1a] text-[#f0f0f0] overflow-x-hidden">
  <section class="h-screen flex items-center justify-center text-center px-4">
    <div>
      <h1 class="text-6xl md:text-8xl font-bold mb-6 hero-text">
        <span class="text-[#88ce02]">Connect</span> with
      </h1>
      <h1 class="text-6xl md:text-8xl font-bold mb-6 hero-text">
        <span class="text-[#88ce02]">Truth</span>
      </h1>
      <p class="text-xl md:text-2xl mb-8 hero-text">Share your thoughts, ideas, and experiences with the world</p>
      <a href="/register" class="btn text-xl">
        Get Started
      </a>
    </div>
  </section>

  <section class="min-h-screen flex flex-col items-center justify-center px-4 py-16">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose Social Truth?</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {#each ['Authentic Connections', 'Unfiltered Sharing', 'Meaningful Engagement'] as feature, i}
        <div class="bg-[#2a2a2a] p-8 rounded-lg shadow-lg feature-card">
          <div class="text-4xl mb-4">{['🤝', '🎭', '💬'][i]}</div>
          <h3 class="text-2xl font-semibold mb-2 text-[#88ce02]">{feature}</h3>
          <p class="text-[#b0b0b0]">Experience a platform that values genuine interactions and promotes honest, open dialogue among users.</p>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
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
    display: inline-block;
  }

  .btn:hover {
    background-color: #a0ef03;
  }
</style>