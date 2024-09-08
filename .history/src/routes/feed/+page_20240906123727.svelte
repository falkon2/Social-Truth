<script>
    import { onMount } from 'svelte';
    import { db } from '$lib/firebase';
    import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
  
    let posts = [];
  
    onMount(async () => {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  </script>
  
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h2 class="text-2xl font-bold mb-4">Recent Posts</h2>
        <div class="space-y-4">
          {#each posts as post}
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {post.title}
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  Posted by {post.authorName} on {new Date(post.createdAt.toDate()).toLocaleString()}
                </p>
                <div class="mt-4 text-gray-700">
                  {post.content}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>