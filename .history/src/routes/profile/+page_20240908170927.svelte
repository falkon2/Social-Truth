<script>
  import { onMount } from 'svelte';
  import { auth, db } from '$lib/firebase';
  import { updateProfile } from 'firebase/auth';
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  import { goto } from '$app/navigation';

  let user = null;
  let displayName = '';
  let email = '';
  let error = '';
  let success = '';

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        user = firebaseUser;
        displayName = user.displayName || '';
        email = user.email || '';

        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Add any additional user data you want to display
        }
      } else {
        goto('/login');
      }
    });

    return unsubscribe;
  });

  async function updateDisplayName() {
    try {
      await updateProfile(auth.currentUser, { displayName });
      await updateDoc(doc(db, 'users', user.uid), { displayName });
      success = 'Display name updated successfully!';
      error = '';
    } catch (err) {
      error = err.message;
      success = '';
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-[#88ce02]">Profile</h1>

  {#if user}
    <div class="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
      <div class="mb-4">
        <label for="displayName" class="block text-[#b0b0b0] mb-2">Display Name</label>
        <input
          type="text"
          id="displayName"
          bind:value={displayName}
          class="w-full p-2 rounded bg-[#3a3a3a] text-white border border-[#4a4a4a] focus:border-[#88ce02] focus:ring-1 focus:ring-[#88ce02]"
        />
      </div>
      <div class="mb-4">
        <label for="email" class="block text-[#b0b0b0] mb-2">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          disabled
          class="w-full p-2 rounded bg-[#3a3a3a] text-[#888888] border border-[#4a4a4a]"
        />
      </div>
      <button
        on:click={updateDisplayName}
        class="bg-[#88ce02] text-[#1a1a1a] px-4 py-2 rounded font-semibold hover:bg-[#a0ef03] transition duration-300"
      >
        Update Display Name
      </button>
      {#if error}
        <p class="text-red-500 mt-2">{error}</p>
      {/if}
      {#if success}
        <p class="text-green-500 mt-2">{success}</p>
      {/if}
    </div>
  {:else}
    <p>Loading profile...</p>
  {/if}
</div>