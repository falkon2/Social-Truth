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

      gsap.to('.hero-text', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2
      });

      gsap.to('.feature-card', {
        scrollTrigger: {
          trigger: '.features',
          start: 'top center'
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2
      });
    }
  });
</script>

<div class="bg-[#1e1e1e] min-h-screen">
  <nav class="bg-[#2d2d2d] p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-3xl font-bold text-[#88ce02]">SocialApp</h1>
      <div class="space-x-4">
        <a href="/login" class="text-white hover:text-[#88ce02]">Login</a>
        <a href="/register" class="bg-[#88ce02] text-[#1e1e1e] px-4 py-2 rounded-full hover:bg-[#a0ef03]">Sign Up</a>
      </div>
    </div>
  </nav>

  <header class="container mx-auto mt-20 text-center">
    <h1 class="text-6xl font-bold text-[#88ce02] mb-6 opacity-0 transform translate-y-10 hero-text">
      Connect, Share, Engage
    </h1>
    <p class="text-xl text-white mb-8 opacity-0 transform translate-y-10 hero-text">
      Join our vibrant community and express yourself like never before
    </p>
    <a href="/register" class="bg-[#88ce02] text-[#1e1e1e] px-8 py-3 rounded-full text-xl font-semibold hover:bg-[#a0ef03] transition duration-300 opacity-0 transform translate-y-10 hero-text">
      Get Started
    </a>
  </header>

  <section class="features container mx-auto mt-32">
    <h2 class="text-4xl font-bold text-[#88ce02] text-center mb-16">Why Choose Us?</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each ['Connect with like-minded people', 'Share your thoughts and ideas', 'Engage in meaningful discussions'] as feature, i}
        <div class="bg-[#2d2d2d] p-8 rounded-lg shadow-lg transform opacity-0 translate-y-10 feature-card">
          <div class="text-4xl mb-4">{['🌐', '💡', '💬'][i]}</div>
          <h3 class="text-2xl font-semibold mb-2 text-[#88ce02]">{feature}</h3>
          <p class="text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      {/each}
    </div>
  </section>
</div>