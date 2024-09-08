<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { db } from '$lib/firebase';
    import { doc, getDoc } from 'firebase/firestore';
  
    let post = null;
  
    onMount(async () => {
      const postId = $page.params.id;
      const postDoc = await getDoc(doc(db, 'posts', postId));
      if (postDoc.exists()) {
        post = {
          id: postDoc.id,
          ...postDoc.data()
        };
      }
    });
  </script>
  
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        {#if post}
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h1 class="text-3xl font-bold mb-4">{post.title}</h1>
              <p class="text-gray-600 mb-4">
                Posted by {post.authorName}
                on {new Date(post.createdAt.toDate()).toLocaleString()}
              </p>
              <div class="prose max-w-none">
                {post.content}
              </div>
            </div>
          </div>
        {:else}
          <p>Loading post...</p>
        {/if}
      </div>
    </div>
  </div>