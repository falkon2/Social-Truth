<script>
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase';
  import { goto } from '$app/navigation';

  let verificationSent = false;
  let error = '';

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        goto('/feed');
      }
    });

    return unsubscribe;
  });

  async function resendVerificationEmail() {
    try {
      await auth.currentUser.sendEmailVerification();
      verificationSent = true;
    } catch (err) {
      error = err.message;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
  <div class="bg-[#2d2d2d] p-8 rounded-lg shadow-lg w-96 text-center">
    <h2 class="text-3xl font-bold mb-6 text-[#88ce02]">Verify Your Email</h2>
    <p class="mb-4 text-gray-300">We've sent a verification email to your address. Please check your inbox and click the verification link.</p>
    
    {#if verificationSent}
      <p class="text-[#88ce02] mb-4">Verification email resent successfully!</p>
    {/if}

    {#if error}
      <p class="text-red-500 mb-4">{error}</p>
    {/if}

    <button on:click={resendVerificationEmail} class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#1e1e1e] bg-[#88ce02] hover:bg-[#a0ef03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88ce02]">
      Resend Verification Email
    </button>

    <div class="mt-4">
      <a href="/login" class="text-sm font-medium text-[#88ce02] hover:text-[#a0ef03]">
        Back to Login
      </a>
    </div>
  </div>
</div>