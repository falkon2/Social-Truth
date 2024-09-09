<script lang="ts">
    import { user } from '$lib/stores/authStore';
    import { auth } from '$lib/firebase';
    import { signOut } from 'firebase/auth';
    import { goto } from '$app/navigation';
  
    let isMenuOpen = false;
  
    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
    }
  
    async function handleLogout() {
      await signOut(auth);
      goto('/login');
    }
  </script>
  
  <nav class="bg-gray-800 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold">MyApp</a>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <a href="/feed" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Feed</a>
            <a href="/profile" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Profile</a>
            {#if $user}
              <button on:click={handleLogout} class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Logout</button>
            {:else}
              <a href="/login" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Login</a>
              <a href="/register" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Register</a>
            {/if}
          </div>
        </div>
        <div class="md:hidden">
          <button on:click={toggleMenu} class="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  
    {#if isMenuOpen}
      <div class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="/feed" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Feed</a>
          <a href="/profile" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Profile</a>
          {#if $user}
            <button on:click={handleLogout} class="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Logout</button>
          {:else}
            <a href="/login" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Login</a>
            <a href="/register" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Register</a>
          {/if}
        </div>
      </div>
    {/if}
  </nav>