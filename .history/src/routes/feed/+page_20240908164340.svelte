<!-- src/routes/feed/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/authStore';
  import { db } from '$lib/firebase';
  import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
  import { goto } from '$app/navigation';

  let posts = [];

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

  function goToPost(postId) {
    goto(`/post/${postId}`);
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Feed</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each posts as post}
      <div class="border rounded p-4 cursor-pointer" on:click={() => goToPost(post.id)}>
        <h2 class="text-xl font-semibold mb-2">{post.title}</h2>
        {#if post.mediaUrl.includes('image')}
          <img src={post.mediaUrl} alt={post.title} class="w-full h-48 object-cover mb-2">
        {:else}
          <video src={post.mediaUrl} controls class="w-full h-48 object-cover mb-2"></video>
        {/if}
        <p class="text-sm text-gray-500">Posted by {post.userName}</p>
        <p class="text-sm text-gray-500">Votes: {post.votes}</p>
      </div>
    {/each}
  </div>
</div>