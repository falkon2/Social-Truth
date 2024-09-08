<script>
  import { onMount } from 'svelte';
  import { db, storage } from '$lib/firebase';
  import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { auth } from '$lib/firebase';

  let posts = [];
  let loading = true;
  let title = '';
  let content = '';
  let file = null;

  onMount(async () => {
    await loadPosts();
  });

  async function loadPosts() {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    loading = false;
  }

  async function handleSubmit() {
    if (!title || !content) return;

    const user = auth.currentUser;
    if (!user) return;

    let mediaUrl = null;
    if (file) {
      const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      mediaUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'posts'), {
      title,
      content,
      mediaUrl,
      authorId: user.uid,
      authorName: user.displayName || user.email,
      createdAt: serverTimestamp()
    });

    title = '';
    content = '';
    file = null;
    await loadPosts();
  }

  function handleFileInput(event) {
    file = event.target.files[0];
  }
</script>

<div class="max-w-2xl mx-auto">
  <h1 class="text-4xl font-bold mb-8 text-[#88ce02]">Your Feed</h1>
  
  <form on:submit|preventDefault={handleSubmit} class="mb-8 bg-[#2a2a2a] p-6 rounded-lg shadow-lg">
    <input
      bind:value={title}
      placeholder="Title"
      class="w-full p-2 mb-4 rounded bg-[#3a3a3a] text-white"
    />
    <textarea
      bind:value={content}
      placeholder="What's on your mind?"
      class="w-full p-2 mb-4 rounded bg-[#3a3a3a] text-white"
    ></textarea>
    <input
      type="file"
      on:change={handleFileInput}
      accept="image/*,video/*"
      class="mb-4"
    />
    <button type="submit" class="bg-[#88ce02] text-[#1a1a1a] px-4 py-2 rounded">Post</button>
  </form>

  {#if loading}
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