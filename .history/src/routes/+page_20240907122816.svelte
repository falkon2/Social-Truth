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
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2
      });

      // Smooth scroll
      gsap.utils.toArray('.section').forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          pin: true,
          pinSpacing: false
        });
      });

      // Scroll indicator
      gsap.to('.scroll-indicator', {
        y: '100vh',
        ease: 'none',
        scrollTrigger: {
          scrub: 0.5,
          trigger: '.features',
          start: 'top bottom',
          end: 'bottom top',
        }
      });
    }
  });
</script>

<div class="overflow-hidden relative">
  <div class="scroll-indicator"></div>

  <section class="section h-screen flex items-center justify-center text-center">
    <div>
      <h1 class="text-8xl font-bold mb-6 hero-text">
        <span class="text-[#88ce02]">Connect</span> with
      </h1>
      <h1 class="text-8xl font-bold mb-6 hero-text">
        <span class="text-[#88ce02]">Truth</span>
      </h1>
      <p class="text-2xl mb-8 hero-text">Share your thoughts, ideas, and experiences with the world</p>
      <a href="/register" class="btn text-xl">
        Get Started
      </a>
    </div>
  </section>

  <section class="section h-screen flex items-center justify-center features relative">
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
</div>

<style>
  .scroll-indicator {
    position: fixed;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100vh;
    background-color: #88ce02;
    transform: translateX(-50%);
    z-index: 100;
  }
</style>