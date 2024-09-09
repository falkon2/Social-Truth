<script>
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
  import { goto } from '$app/navigation';

  let posts = [];

  onMount(() => {
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
  <h1 class="text-4xl font-bold mb-8 text-[#88ce02]">Feed</h1>

  <div class="space-y-8">
    {#each posts as post}
      <div class="bg-[#2a2a2a] p-6 rounded-lg shadow-lg cursor-pointer" on:click={() => goToPost(post.id)}>
        <h2 class="text-2xl font-semibold mb-2 text-[#f0f0f0]">{post.title}</h2>
        <p class="text-[#b0b0b0] mb-4">{post.content}</p>
        {#if post.mediaUrl}
          {#if post.mediaType === 'image'}
            <img src={post.mediaUrl} alt={post.title} class="w-full h-64 object-cover rounded-lg mb-4">
          {:else if post.mediaType === 'video'}
            <video src={post.mediaUrl} controls class="w-full h-64 object-cover rounded-lg mb-4"></video>
          {/if}
        {/if}
        <p class="text-sm text-[#888888]">Posted by {post.authorName}</p>
        <p class="text-sm text-[#888888]">Votes: {post.votes}</p>
      </div>
    {/each}
  </div>
</div>