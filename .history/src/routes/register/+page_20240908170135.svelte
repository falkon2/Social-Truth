<script>
  import { auth } from '$lib/firebase';
  import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let username = '';
  let error = '';

  async function handleRegister() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      goto('/feed');
    } catch (err) {
      error = err.message;
    }
  }

  async function handleGoogleRegister() {
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
  <h1 class="text-4xl font-bold mb-6 text-center text-[#88ce02]">Create an Account</h1>
  
  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}
  
  <form on:submit|preventDefault={handleRegister} class="space-y-4">
    <div>
      <label for="username" class="block mb-1 text-[#b0b0b0]">Username</label>
      <input type="text" id="username" bind:value={username} required class="w-full p-2 rounded bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#88ce02] focus:ring-1 focus:ring-[#88ce02] transition duration-300" />
    </div>
    <div>
      <label for="email" class="block mb-1 text-[#b0b0b0]">Email</label>
      <input type="email" id="email" bind:value={email} required class="w-full p-2 rounded bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#88ce02] focus:ring-1 focus:ring-[#88ce02] transition duration-300" />
    </div>
    <div>
      <label for="password" class="block mb-1 text-[#b0b0b0]">Password</label>
      <input type="password" id="password" bind:value={password} required class="w-full p-2 rounded bg-[#2a2a2a] text-white border border-[#3a3a3a] focus:border-[#88ce02] focus:ring-1 focus:ring-[#88ce02] transition duration-300" />
    </div>
    <button type="submit" class="w-full bg-[#88ce02] text-[#1a1a1a] p-2 rounded font-semibold hover:bg-[#a0ef03] transition duration-300">
      Register
    </button>
  </form>
  
  <div class="mt-4">
    <button on:click={handleGoogleRegister} class="w-full bg-[#4285F4] text-white p-2 rounded font-semibold hover:bg-[#3367D6] transition duration-300 flex items-center justify-center">
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" class="w-6 h-6 mr-2" />
      Register with Google
    </button>
  </div>
  
  <p class="mt-4 text-center text-[#b0b0b0]">
    Already have an account? <a href="/login" class="text-[#88ce02] hover:underline">Login here</a>
  </p>
</div>