<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import { doc, getDoc, updateDoc, arrayUnion, increment, serverTimestamp } from 'firebase/firestore';
  import { user } from '$lib/stores/authStore';

  let post: any = null;
  let commentText = '';

  onMount(async () => {
    const postId = $page.params.id;
    const postDoc = await getDoc(doc(db, 'posts', postId));
    if (postDoc.exists()) {
      post = { id: postDoc.id, ...postDoc.data() };
    }
  });

  async function handleVote(increment: number) {
    if (!post) return;
    await updateDoc(doc(db, 'posts', post.id), {
      votes: increment(increment)
    });
    post.votes += increment;
  }

  async function handleComment() {
    if (!post || !commentText.trim() || !$user) return;

    await updateDoc(doc(db, 'posts', post.id), {
      comments: arrayUnion({
        userId: $user.uid,
        userName: $user.displayName,
        text: commentText,
        createdAt: serverTimestamp()
      })
    });

    post.comments = [...post.comments, {
      userId: $user.uid,
      userName: $user.displayName,
      text: commentText,
      createdAt: new Date()
    }];

    commentText = '';
  }
</script>

<div class="container mx-auto px-4 py-8">
  {#if post}
    <h1 class="text-3xl font-bold mb-4">{post.title}</h1>
    {#if post.mediaUrl.includes('image')}
      <img src={post.mediaUrl} alt={post.title} class="w-full max-h-96 object-cover mb-4">
    {:else}
      <video src={post.mediaUrl} controls class="w-full max-h-96 object-cover mb-4"></video>
    {/if}
    <p class="text-sm text-gray-500 mb-4">Posted by {post.userName}</p>
    <div class="flex items-center mb-4">
      <button on:click={() => handleVote(1)} class="mr-2 bg-green-500 text-white px-2 py-1 rounded">Upvote</button>
      <button on:click={() => handleVote(-1)} class="mr-2 bg-red-500 text-white px-2 py-1 rounded">Downvote</button>
      <span>{post.votes} votes</span>
    </div>
    <div class="mb-4">
      <h2 class="text-xl font-semibold mb-2">Comments:</h2>
      {#each post.comments as comment}
        <div class="mb-2">
          <p class="text-sm"><strong>{comment.userName}:</strong> {comment.text}</p>
        </div>
      {/each}
    </div>
    {#if $user}
      <div class="flex">
        <input
          type="text"
          bind:value={commentText}
          placeholder="Add a comment"
          class="flex-grow p-2 mr-2 border rounded"
        >
        <button
          on:click={handleComment}
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Comment
        </button>
      </div>
    {:else}
      <p>Please <a href="/login" class="text-blue-500">log in</a> to comment.</p>
    {/if}
  {:else}
    <p>Loading post...</p>
  {/if}
</div>