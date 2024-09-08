<script>
  import { onMount } from 'svelte';
  import { auth, db } from '$lib/firebase';
  import { doc, getDoc } from 'firebase/firestore';

  let user = null;
  let userProfile = null;
  let loading = true;
  let error = null;

  onMount(async () => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        user = firebaseUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            userProfile = userDoc.data();
          }
        }
      } catch (err) {
        error = err.message;
      } finally {
        loading = false;
      }
    });

    return unsubscribe;
  });
</script>

<div class="max-w-2xl mx-auto">
  <h1 class="text-4xl font-bold mb-8 text-[#88ce02]">Your Profile</h1>
  
  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {:else if loading}
    <p class="text-center text-[#b0b0b0]">Loading profile...</p>
  {:else if user && userProfile}
    <div class="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
      <img src={user.photoURL || 'https://via.placeholder.com/150'} alt="Profile picture" class="w-32 h-32 rounded-full mx-auto mb-4" />
      <h2 class="text-2xl font-semibold text-center mb-4">{userProfile.displayName}</h2>
      <p class="text-center text-[#b0b0b0] mb-4">{user.email}</p>
      <p class="text-center text-[#b0b0b0]">Joined on {new Date(userProfile.createdAt.toDate()).toLocaleDateString()}</p>
    </div>
  {:else}
    <p class="text-center text-[#b0b0b0]">No profile data available. Please log in.</p>
  {/if}
</div>