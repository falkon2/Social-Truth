<!-- src/routes/post/create/+page.svelte -->
<script>
  import { user } from '$lib/stores/authStore';
  import { db, storage } from '$lib/firebase';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let title = '';
  let file = null;
  let uploading = false;

  onMount(() => {
    if (!$user) {
      goto('/login');
    }
  });

  async function handleSubmit() {
    if (!title || !file) return;

    uploading = true;
    try {
      const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const docRef = await addDoc(collection(db, 'posts'), {
        title,
        mediaUrl: downloadURL,
        createdAt: serverTimestamp(),
        userId: $user.uid,
        userName: $user.displayName,
        votes: 0,
        comments: []
      });

      goto(`/post/${docRef.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      uploading = false;
    }
  }

  function handleFileChange(event) {
    const target = event.target;
    if (target.files) {
      file = target.files[0];
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Create a New Post</h1>

  <form on:submit|preventDefault={handleSubmit} class="max-w-md mx-auto">
    <div class="mb-4">
      <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
      <input
        type="text"
        id="title"
        bind:value={title}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        required
      >
    </div>
    <div class="mb-4">
      <label for="file" class="block text-sm font-medium text-gray-700">Media (Image or Video)</label>
      <input
        type="file"
        id="file"
        accept="image/*,video/*"
        on:change={handleFileChange}
        class="mt-1 block w-full"
        required
      >
    </div>
    <button
      type="submit"
      class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      disabled={uploading}
    >
      {uploading ? 'Uploading...' : 'Create Post'}
    </button>
  </form>
</div>