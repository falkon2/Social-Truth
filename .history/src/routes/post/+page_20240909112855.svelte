<script>
  import { onMount } from 'svelte';
  import { db, storage, auth } from '$lib/firebase';
  import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { goto } from '$app/navigation';

  let title = '';
  let content = '';
  let file = null;
  let error = null;
  let loading = false;

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

      // Generate a unique ID for the post
      const postId = doc(db, 'posts').id;

      // Create the post object
      const postObject = {
        id: postId,
        title,
        content,
        mediaUrl,
        mediaType,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        createdAt: serverTimestamp(),
        votes: 0,
        votedBy: {}
      };

      // Add the document to Firestore with the generated ID
      await setDoc(doc(db, 'posts', postId), postObject);

      goto(`/post/${postId}`);
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

    <button
      type="submit"
      disabled={loading}
      class="bg-[#88ce02] text-[#1a1a1a] px-4 py-2 rounded font-bold hover:bg-[#a0ef03] transition-colors"
    >
      {loading ? 'Posting...' : 'Create Post'}
    </button>
  </form>
</div>