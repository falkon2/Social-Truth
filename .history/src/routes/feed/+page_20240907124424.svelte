<script>
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

  let posts = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      await loadPosts();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

  async function loadPosts() {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
</script>

<div class="max-w-2xl mx-auto">
  <h1 class="text-4xl font-bold mb-8 text-[#88ce02]">Your Feed</h1>
  
  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {:else if loading}
    <p class="text-center text-[#b0b0b0]">Loading posts...</p>
  {:else if posts.length === 0}
    <p class="text-center text-[#b0b0b0]">No posts yet. Be the first to share something!</p>
  {:else}
    {#each posts as post}
      <div class="bg-[#2a2a2a] p-6 rounded-lg shadow-lg mb-6">
        <h2 class="text-2xl font-semibold mb-2">{post.title}</h2>
        <p class="text-[#b0b0b0] mb-4">{post.content}</p>
        {#if post.mediaUrl}
          {#if post.mediaUrl.includes('image')}
            <img src={post.mediaUrl} alt="Post media" class="w-full mb-4 rounded" />
          {:else}
            <video src={post.mediaUrl} controls class="w-full mb-4 rounded"></video>
          {/if}
        {/if}
        <div class="flex justify-between items-center text-sm text-[#888888]">
          <span>By {post.authorName}</span>
          <span>{new Date(post.createdAt.toDate()).toLocaleString()}</span>
        </div>
      </div>
    {/each}
  {/if}
</div>