<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/authStore';
  import { auth, db, storage } from '$lib/firebase';
  import { doc, getDoc, setDoc } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { goto } from '$app/navigation';

  let profilePicture: File | null = null;
  let profilePictureUrl = '';
  let bio = '';
  let uploadStatus = '';

  onMount(async () => {
    if ($user) {
      const userDoc = await getDoc(doc(db, 'users', $user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        bio = userData.bio || '';
        profilePictureUrl = userData.profilePicture || $user.photoURL || '';
      } else {
        // Create user document if it doesn't exist
        await setDoc(doc(db, 'users', $user.uid), {
          displayName: $user.displayName,
          email: $user.email,
          bio: '',
          profilePicture: $user.photoURL || ''
        });
      }
    } else {
      goto('/login');
    }
  });

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      profilePicture = target.files[0];
    }
  }

  async function handleUpload() {
    if (!profilePicture || !$user) return;

    uploadStatus = 'Uploading...';
    const storageRef = ref(storage, `profilePictures/${$user.uid}`);

    try {
      const snapshot = await uploadBytes(storageRef, profilePicture);
      profilePictureUrl = await getDownloadURL(snapshot.ref);
      await setDoc(doc(db, 'users', $user.uid), { profilePicture: profilePictureUrl }, { merge: true });
      uploadStatus = 'Upload successful!';
    } catch (error) {
      console.error('Upload failed:', error);
      uploadStatus = 'Upload failed. Please try again.';
    }
  }

  async function updateBio() {
    if (!$user) return;

    try {
      await setDoc(doc(db, 'users', $user.uid), { bio }, { merge: true });
      alert('Bio updated successfully!');
    } catch (error) {
      console.error('Failed to update bio:', error);
      alert('Failed to update bio. Please try again.');
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Profile</h1>
  
  {#if $user}
    <div class="mb-8">
      <img src={profilePictureUrl || '/placeholder.svg?height=200&width=200'} alt="Profile Picture" class="w-32 h-32 rounded-full mb-4">
      <input type="file" accept="image/*" on:change={handleFileChange} class="mb-2">
      <button on:click={handleUpload} class="bg-blue-500 text-white px-4 py-2 rounded">Upload Picture</button>
      {#if uploadStatus}
        <p class="mt-2">{uploadStatus}</p>
      {/if}
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">User Information</h2>
      <p><strong>Name:</strong> {$user.displayName}</p>
      <p><strong>Email:</strong> {$user.email}</p>
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Bio</h2>
      <textarea bind:value={bio} class="w-full p-2 border rounded" rows="4"></textarea>
      <button on:click={updateBio} class="mt-2 bg-green-500 text-white px-4 py-2 rounded">Update Bio</button>
    </div>
  {:else}
    <p>Please log in to view your profile.</p>
  {/if}
</div>