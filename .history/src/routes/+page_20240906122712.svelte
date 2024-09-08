<script>
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { browser } from '$app/environment';
  
    gsap.registerPlugin(ScrollTrigger);
  
    onMount(() => {
      if (browser) {
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
  
  <div class="min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
    <nav class="p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-3xl font-bold text-white">SocialApp</h1>
        <div class="space-x-4">
          <a href="/login" class="text-white hover:text-green-200">Login</a>
          <a href="/signup" class="bg-white text-green-500 px-4 py-2 rounded-full hover:bg-green-100">Sign Up</a>
        </div>
      </div>
    </nav>
  
    <header class="container mx-auto mt-20 text-center">
      <h1 class="text-6xl font-bold text-white mb-6 opacity-0 transform translate-y-10 hero-text">
        Connect, Share, Engage
      </h1>
      <p class="text-xl text-white mb-8 opacity-0 transform translate-y-10 hero-text">
        Join our vibrant community and express yourself like never before
      </p>
      <a href="/signup" class="bg-white text-green-500 px-8 py-3 rounded-full text-xl font-semibold hover:bg-green-100 transition duration-300 opacity-0 transform translate-y-10 hero-text">
        Get Started
      </a>
    </header>
  
    <section class="features container mx-auto mt-32">
      <h2 class="text-4xl font-bold text-white text-center mb-16">Why Choose Us?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each ['Connect with like-minded people', 'Share your thoughts and ideas', 'Engage in meaningful discussions'] as feature, i}
          <div class="bg-white p-8 rounded-lg shadow-lg transform opacity-0 translate-y-10 feature-card">
            <div class="text-4xl mb-4">{['🌐', '💡', '💬'][i]}</div>
            <h3 class="text-2xl font-semibold mb-2 text-gray-800">{feature}</h3>
            <p class="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        {/each}
      </div>
    </section>
  </div>
  
  <style>
    /* Add any additional styles here */
  </style>