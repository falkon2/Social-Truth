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
        y: 50,
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

<div class="text-center">
  <h1 class="text-5xl font-bold mb-6 hero-text">Welcome to SocialApp</h1>
  <p class="text-xl mb-8 hero-text">Connect, Share, and Engage with like-minded people</p>
  <a href="/register" class="bg-green-400 text-gray-900 px-8 py-3 rounded-full text-xl font-semibold hover:bg-green-500 transition duration-300 hero-text">
    Get Started
  </a>
</div>

<section class="features mt-32">
  <h2 class="text-4xl font-bold text-center mb-16">Why Choose Us?</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    {#each ['Connect with like-minded people', 'Share your thoughts and ideas', 'Engage in meaningful discussions'] as feature, i}
      <div class="bg-gray-800 p-8 rounded-lg shadow-lg feature-card">
        <div class="text-4xl mb-4">{['🌐', '💡', '💬'][i]}</div>
        <h3 class="text-2xl font-semibold mb-2 text-green-400">{feature}</h3>
        <p class="text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    {/each}
  </div>
</section>