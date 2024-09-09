<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { db, auth } from '$lib/firebase';
    import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
  
    let post = null;
    let error = null;
    let currentUser = null;
  
    onMount(async () => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        currentUser = user;
      });
  
      try {
        const { authorId, postId } = $page.params;
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          post = { id: postDoc.id, ...postDoc.data() };
        } else {
          error = "Post not found";
        }
      } catch (err) {
        error = err.message;
      }
  
      return unsubscribe;
    });
  
    async function handleVote(increment) {
      if (!currentUser) {
        error = "You must be logged in to vote";
        return;
      }
  
      try {
        const postRef = doc(db, 'posts', post.id);
        const currentVote = post.votedBy[currentUser.uid] || 0;
  
        if (currentVote === increment) {
          // Remove the vote
          await updateDoc(postRef, {
            votes: increment(-currentVote),
            [`votedBy.${currentUser.uid}`]: 0
          });
          post.votes -= currentVote;
          post.votedBy[currentUser.uid] = 0;
        } else {
          // Update the vote
          await updateDoc(postRef, {
            votes: increment(increment - currentVote),
            [`votedBy.${currentUser.uid}`]: increment
          });
          post.votes += (increment - currentVote);
          post.votedBy[currentUser.uid] = increment;
        }
      } catch (err) {
        error = err.message;
      }
    }
  </script>
  
  <div class="container mx-auto px-4 py-8">
    {#if error}
      <p class="text-red-500">{error}</p>
    {:else if post}
      <h1 class="text-4xl font-bold mb-4 text-[#88ce02]">{post.title}</h1>
      <p class="text-[#b0b0b0] mb-4">By {post.authorName}</p>
      <p class="text-[#f0f0f0] mb-4">{post.content}</p>
      {#if post.mediaUrl}
        {#if post.mediaType === 'image'}
          <img src={post.mediaUrl} alt={post.title} class="w-full max-h-96 object-cover rounded-lg mb-4">
        {:else if post.mediaType === 'video'}
          <video src={post.mediaUrl} controls class="w-full max-h-96 object-cover rounded-lg mb-4"></video>
        {/if}
      {/if}
      <div class="flex items-center mt-4">
        <button on:click={() => handleVote(1)} class="bg-green-500 text-white px-4 py-2 rounded mr-2" class:opacity-50={post.votedBy[currentUser?.uid] === 1}>Upvote</button>
        <button on:click={() => handleVote(-1)} class="bg-red-500 text-white px-4 py-2 rounded mr-2" class:opacity-50={post.votedBy[currentUser?.uid] === -1}>Downvote</button>
        <span class="text-[#f0f0f0]">Votes: {post.votes}</span>
      </div>
    {:else}
      <p class="text-[#f0f0f0]">Loading...</p>
    {/if}
  </div>