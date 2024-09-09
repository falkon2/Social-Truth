<script>
  import { onMount } from 'svelte';
  import { db, storage, auth } from '$lib/firebase';
  import { createPost } from '$lib/firestore';
  import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
  import { goto } from '$app/navigation';

  let title = '';
  let content = '';
  let file = null;
  let error = null;
  let loading = false;
  let previewUrl = null;

  onMount(() => {
    if (!auth.currentUser) {
      goto('/login');
    }
  });

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
      let mediaType = null;
      if (file) {
        const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        mediaUrl = await getDownloadURL(storageRef);
        mediaType = file.type.startsWith('image/') ? 'image' : 'video';
      }

      const postData = {
        title,
        content,
        mediaUrl,
        mediaType,
        authorName: user.displayName || user.email,
        votes: 0,
        votedBy: {}
      };

      const postId = await createPost(user.uid, postData);
      goto(`/post/${postId}`);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleFileInput(event) {
    file = event.target.files[0];
    if (file) {
      previewUrl = URL.createObjectURL(file);
    }
  }

  function removeUpload() {
    file = null;
    previewUrl = null;
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-[#88ce02]">Create a New Post</h1>

  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="title" class="block text-[#f0f0f0] mb-2">Title</label>
      <input
        type="text"
        id="title"
        bind:value={title}
        required
        class="w-full p-2 bg-[#2a2a2a] text-[#f0f0f0] rounded"
      />
    </div>

    <div>
      <label for="content" class="block text-[#f0f0f0] mb-2">Content</label>
      <textarea
        id="content"
        bind:value={content}
        required
        class="w-full p-2 bg-[#2a2a2a] text-[#f0f0f0] rounded h-32"
      ></textarea>
    </div>

    <div>
      <label for="file" class="block text-[#f0f0f0] mb-2">Media (optional)</label>
      <input
        type="file"
        id="file"
        on:change={handleFileInput}
        accept="image/*,video/*"
        class="w-full p-2 bg-[#2a2a2a] text-[#f0f0f0] rounded"
      />
    </div>

    {#if previewUrl}
      <div class="mt-4">
        {#if file.type.startsWith('image/')}
          <img src={previewUrl} alt="Preview" class="max-w-full h-auto rounded-lg" />
        {:else if file.type.startsWith('video/')}
          <video src={previewUrl} controls class="max-w-full h-auto rounded-lg"></video>
        {/if}
        <button
          type="button"
          on:click={removeUpload}
          class="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Remove Upload
        </button>
      </div>
    {/if}

    <button
      type="submit"
      disabled={loading}
      class="bg-[#88ce02] text-[#1a1a1a] px-4 py-2 rounded font-bold hover:bg-[#a0ef03] transition-colors"
    >
      {loading ? 'Posting...' : 'Create Post'}
    </button>
  </form>
</div>