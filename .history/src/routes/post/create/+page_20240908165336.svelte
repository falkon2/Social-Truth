<!-- src/routes/post/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { db, storage, auth } from '$lib/firebase';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { goto } from '$app/navigation';

  let title = '';
  let content = '';
  let file = null;
  let error = null;
  let loading = false;

  async function handleSubmit() {
    if (!title || !content) return;

    const user = auth.currentUser;
    if (!user) {
      error = "You must be logged in to post.";
      return;
    }

    loading = true;
    try {
      let mediaUrl = null;
      if (file) {
        const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        mediaUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'posts'), {
        title,
        content,
        mediaUrl,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        createdAt: serverTimestamp()
      });

      goto('/feed');
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

<div class="max-w-2xl mx-auto">
  <h1 class="text-4xl font-bold mb-8 text-[#88ce02]">Create a New Post</h1>
  
  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="mb-8 bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
    <input
      bind:value={title}
      placeholder="Title"
      class="w-full p-2 mb-4 rounded bg-[#3a3a3a] text-white"
    />
    <textarea
      bind:value={content}
      placeholder="What's on your mind?"
      class="w-full p-2 mb-4 rounded bg-[#3a3a3a] text-white"
    ></textarea>
    <input
      type="file"
      on:change={handleFileInput}
      accept="image/*,video/*"
      class="mb-4"
    />
    <button type="submit" class="btn" disabled={loading}>
      {loading ? 'Posting...' : 'Post'}
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