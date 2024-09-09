<script>
  import { auth } from '$lib/firebase';
  import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let error = '';
  let gsap;

  onMount(async () => {
    const gsapModule = await import('gsap');
    gsap = gsapModule.gsap;

    gsap.from('.login-form', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      goto('/feed');
    } catch (err) {
      error = err.message;
    }
  }

  async function handleGoogleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      goto('/feed');
    } catch (err) {
      error = err.message;
    }
  }
</script>

<div class="max-w-md mx-auto login-form">
  <h1 class="text-4xl font-bold mb-6 text-center text-[#88ce02]">Welcome Back!</h1>
  
  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}
  
  <form on:submit|preventDefault={handleLogin} class="space-y-4">
    <div>
      <label for="email" class="block mb-1 text-[#b0b0b0]">Email</label>
      <input type="email" id="email" bind:value={email} required class="w-full p-2 rounded bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#88ce02] focus:ring-1 focus:ring-[#88ce02] transition duration-300" />
    </div>
    <div>
      <label for="password" class="block mb-1 text-[#b0b0b0]">Password</label>
      <input type="password" id="password" bind:value={password} required class="w-full p-2 rounded bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#88ce02] focus:ring-1 focus:ring-[#88ce02] transition duration-300" />
    </div>
    <button type="submit" class="w-full bg-[#88ce02] text-[#1a1a1a] p-2 rounded font-semibold hover:bg-[#a0ef03] transition duration-300">
      Login
    </button>
  </form>
  
  <div class="mt-4">
    <button on:click={handleGoogleLogin} class="w-full bg-[#4285F4] text-white p-2 rounded font-semibold hover:bg-[#3367D6] transition duration-300 flex items-center justify-center">
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" class="w-6 h-6 mr-2" />
      Login with Google
    </button>
  </div>
  
  <p class="mt-4 text-center text-[#b0b0b0]">
    Don't have an account? <a href="/register" class="text-[#88ce02] hover:underline">Register here</a>
  </p>
</div>