<script>
  import { onMount } from 'svelte';
  import { auth, db, storage } from '$lib/firebase';
  import { updateProfile } from 'firebase/auth';
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { goto } from '$app/navigation';

  let user = null;
  let displayName = '';
  let email = '';
  let profilePicture = null;
  let profilePictureUrl = '';
  let error = '';
  let success = '';

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        user = firebaseUser;
        displayName = user.displayName || '';
        email = user.email || '';
        profilePictureUrl = user.photoURL || '';

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

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      try {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        await updateProfile(auth.currentUser, { photoURL: downloadURL });
        await updateDoc(doc(db, 'users', user.uid), { photoURL: downloadURL });

        profilePictureUrl = downloadURL;
        success = 'Profile picture updated successfully!';
        error = '';
      } catch (err) {
        error = err.message;
        success = '';
      }
    }
  }
</script>

<div class="max-w-md mx-auto">
  <h1 class="text-4xl font-bold mb-6 text-center text-[#88ce02]">Profile</h1>

  {#if user}
    <div class="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
      <div class="mb-6 text-center">
        <img src={profilePictureUrl || '/placeholder.svg?height=100&width=100'} alt="Profile Picture" class="w-32 h-32 rounded-full mx-auto mb-4">
        <input type="file" accept="image/*" on:change={handleFileChange} class="hidden" id="profilePicture">
        <label for="profilePicture" class="bg-[#88ce02] text-[#1a1a1a] px-4 py-2 rounded font-semibold hover:bg-[#a0ef03] transition duration-300 cursor-pointer">
          Change Profile Picture
        </label>
      </div>
      <div class="space-y-4">
        <div>
          <label for="displayName" class="block mb-1 text-[#b0b0b0]">Display Name</label>
          <input
            type="text"
            id="displayName"
            bind:value={displayName}
            class="w-full p-2 rounded bg-[#3a3a3a] text-white border border-[#4a4a4a] focus:border-[#88ce02] focus:ring-1 focus:ring-[#88ce02] transition duration-300"
          />
        </div>
        <div>
          <label for="email" class="block mb-1 text-[#b0b0b0]">Email</label>
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
          class="w-full bg-[#88ce02] text-[#1a1a1a] p-2 rounded font-semibold hover:bg-[#a0ef03] transition duration-300"
        >
          Update Display Name
        </button>
      </div>
      {#if error}
        <p class="text-red-500 mt-4 text-center">{error}</p>
      {/if}
      {#if success}
        <p class="text-green-500 mt-4 text-center">{success}</p>
      {/if}
    </div>
  {:else}
    <p class="text-center text-[#b0b0b0]">Loading profile...</p>
  {/if}
</div>