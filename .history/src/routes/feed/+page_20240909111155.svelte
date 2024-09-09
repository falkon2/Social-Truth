<script>
  import { onMount } from 'svelte';
  import { db, auth } from '$lib/firebase';
  import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
  import { goto } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  let posts = [];
  let user = null;

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      user = firebaseUser;
      if (!user) {
        goto('/login');
      }
    });

    const q = query(collection(db, 'posts'), orderBy('votes', 'desc'), orderBy('createdAt', 'desc'), limit(20));
    const postUnsubscribe = onSnapshot(q, (snapshot) => {
      posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });

    return () => {
      unsubscribe();
      postUnsubscribe();
    };
  });

  function goToPost(authorId, postId) {
    if (user) {
      goto(`/post/${authorId}/${postId}`);
    } else {
      goto('/login');
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-[#88ce02]" in:fly={{ y: -20, duration: 500, delay: 200, easing: cubicOut }}>Feed</h1>

  <div class="space-y-8">
    {#each posts as post, i}
      <div class="bg-[#2a2a2a] p-6 rounded-lg shadow-lg" in:fade={{ duration: 300, delay: 100 * i }} >
        <h2 class="text-2xl font-semibold mb-2 text-[#f0f0f0] cursor-pointer" on:click={() => goToPost(post.authorId, post.id)}>{post.title}</h2>
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