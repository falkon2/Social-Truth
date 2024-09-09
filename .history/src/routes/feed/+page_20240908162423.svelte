<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/authStore';
  import { db, storage } from '$lib/firebase';
  import { collection, query, orderBy, limit, onSnapshot, addDoc, updateDoc, arrayUnion, increment, doc, serverTimestamp } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { goto } from '$app/navigation';

  let posts = [];
  let title = '';
  let file: File | null = null;
  let uploading = false;
  let commentText = '';

  onMount(() => {
    if (!$user) {
      goto('/login');
      return;
    }

    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });

    return unsubscribe;
  });

  async function handleSubmit() {
    if (!title || !file) return;

    uploading = true;
    try {
      const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'posts'), {
        title,
        mediaUrl: downloadURL,
        createdAt: serverTimestamp(),
        userId: $user.uid,
        userName: $user.displayName,
        votes: 0,
        comments: []
      });

      title = '';
      file = null;
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      uploading = false;
    }
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      file = target.files[0];
    }
  }

  async function handleVote(postId: string, increment: number) {
    await updateDoc(doc(db, 'posts', postId), {
      votes: increment(increment)
    });
  }

  async function handleComment(postId: string) {
    if (!commentText.trim()) return;

    await updateDoc(doc(db, 'posts', postId), {
      comments: arrayUnion({
        userId: $user.uid,
        userName: $user.displayName,
        text: commentText,
        createdAt: serverTimestamp()
      })
    });

    commentText = '';
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Feed</h1>

  <form on:submit|preventDefault={handleSubmit} class="mb-8">
    <input
      type="text"
      bind:value={title}
      placeholder="Post title"
      class="w-full p-2 mb-2 border rounded"
      required
    >
    <input
      type="file"
      accept="image/*,video/*"
      on:change={handleFileChange}
      class="mb-2"
      required
    >
    <button
      type="submit"
      class="bg-blue-500 text-white px-4 py-2 rounded"
      disabled={uploading}
    >
      {uploading ? 'Uploading...' : 'Create Post'}
    </button>
  </form>

  <div class="space-y-8">
    {#each posts as post}
      <div class="border rounded p-4">
        <h2 class="text-xl font-semibold mb-2">{post.title}</h2>
        {#if post.mediaUrl.includes('image')}
          <img src={post.mediaUrl} alt={post.title} class="w-full h-48 object-cover mb-2">
        {:else}
          <video src={post.mediaUrl} controls class="w-full h-48 object-cover mb-2"></video>
        {/if}
        <p class="text-sm text-gray-500 mb-2">Posted by {post.userName}</p>
        <div class="flex items-center mb-4">
          <button on:click={() => handleVote(post.id, 1)} class="mr-2 bg-green-500 text-white px-2 py-1 rounded">Upvote</button>
          <button on:click={() => handleVote(post.id, -1)} class="mr-2 bg-red-500 text-white px-2 py-1 rounded">Downvote</button>
          <span>{post.votes} votes</span>
        </div>
        <div class="mb-4">
          <h3 class="font-semibold mb-2">Comments:</h3>
          {#each post.comments as comment}
            <div class="mb-2">
              <p class="text-sm"><strong>{comment.userName}:</strong> {comment.text}</p>
            </div>
          {/each}
        </div>
        <div class="flex">
          <input
            type="text"
            bind:value={commentText}
            placeholder="Add a comment"
            class="flex-grow p-2 mr-2 border rounded"
          >
          <button
            on:click={() => handleComment(post.id)}
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Comment
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>