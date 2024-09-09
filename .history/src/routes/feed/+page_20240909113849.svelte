<script>
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase';
  import { getPosts, deletePost } from '$lib/firestore';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  let posts = [];
  let user = null;
  let loading = true;

  onMount(async () => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      user = firebaseUser;
      if (!user) {
        goto('/login');
      }
    });

    try {
      posts = await getPosts();
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      loading = false;
    }

    return unsubscribe;
  });

  function goToPost(postId) {
    goto(`/post/${postId}`);
  }

  async function handleDeletePost(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        posts = posts.filter(post => post.id !== postId);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-[#88ce02]">Feed</h1>

  {#if loading}
    <p class="text-[#f0f0f0]">Loading posts...</p>
  {:else if posts.length === 0}
    <p class="text-[#f0f0f0]">No posts yet. Be the first to create a post!</p>
  {:else}
    <div class="space-y-8">
      {#each posts as post, i}
        <div class="bg-[#2a2a2a] p-6 rounded-lg shadow-lg" transition:fade={{ duration: 300, delay: 100 * i, easing: cubicOut }}>
          <h2 class="text-2xl font-semibold mb-2 text-[#f0f0f0] cursor-pointer" on:click={() => goToPost(post.id)}>{post.title}</h2>
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
          {#if user && user.uid === post.authorId}
            <button
              on:click={() => handleDeletePost(post.id)}
              class="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Delete Post
            </button>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>