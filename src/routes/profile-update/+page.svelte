<script>
    import { onMount } from 'svelte';
    import { auth, db, storage } from '$lib/firebase';
    import { doc, setDoc, getDoc } from 'firebase/firestore';
    import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
    import { goto } from '$app/navigation';
  
    let displayName = '';
    let file = null;
    let loading = false;
    let error = null;
    let user = null;
  
    onMount(() => {
      user = auth.currentUser;
      if (user) {
        displayName = user.displayName || '';
      }
    });
  
    async function handleSubmit() {
      if (!user) return;
  
      loading = true;
      try {
        let photoURL = user.photoURL;
  
        if (file) {
          const storageRef = ref(storage, `profile_pictures/${user.uid}`);
          await uploadBytes(storageRef, file);
          photoURL = await getDownloadURL(storageRef);
        }
  
        await Promise.all([
          setDoc(doc(db, 'users', user.uid), {
            displayName,
            photoURL,
            updatedAt: new Date()
          }, { merge: true }),
          user.updateProfile({
            displayName,
            photoURL
          })
        ]);
  
        goto('/profile');
      } catch (err) {
        error = err.message;
      } finally {
        loading = false;
      }
    }
  
    function handleFileInput(event) {
      file = event.target.files[0];
    }
  </script>
  
  <div class="max-w-md mx-auto">
    <h1 class="text-4xl font-bold mb-8 text-[#88ce02]">Update Your Profile</h1>
    
    {#if error}
      <p class="text-red-500 mb-4">{error}</p>
    {/if}
  
    <form on:submit|preventDefault={handleSubmit} class="bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
      <div class="mb-4">
        <label for="displayName" class="block text-sm font-medium text-[#f0f0f0] mb-2">Display Name</label>
        <input
          id="displayName"
          bind:value={displayName}
          class="w-full p-2 rounded bg-[#3a3a3a] text-white"
          required
        />
      </div>
      <div class="mb-4">
        <label for="profilePicture" class="block text-sm font-medium text-[#f0f0f0] mb-2">Profile Picture</label>
        <input
          id="profilePicture"
          type="file"
          on:change={handleFileInput}
          accept="image/*"
          class="w-full p-2 rounded bg-[#3a3a3a] text-white"
        />
      </div>
      <button type="submit" class="btn w-full" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  </div>
  
  <style>
    .btn {
      background-color: #88ce02;
      color: #1a1a1a;
      border: none;
      border-radius: 20px;
      padding: 10px 20px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    .btn:hover:not(:disabled) {
      background-color: #a0ef03;
    }
  
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  </style>