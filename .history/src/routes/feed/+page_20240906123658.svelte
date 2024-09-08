<script>
    import { onMount } from 'svelte';
    import { auth, db } from '$lib/firebase';
    import { doc, getDoc } from 'firebase/firestore';
  
    let user = null;
    let profileData = null;
  
    onMount(async () => {
      auth.onAuthStateChanged(async (authUser) => {
        if (authUser) {
          user = authUser;
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            profileData = userDoc.data();
          }
        }
      });
    });
  </script>
  
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          {#if user && profileData}
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                User Profile
              </h3>
            </div>
            <div class="border-t border-gray-200">
              <dl>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {profileData.displayName}
                  </dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.email}
                  </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">
                    Profile picture
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <img src={profileData.photoURL || '/default-avatar.png'} alt="Profile" class="h-20 w-20 rounded-full" />
                  </dd>
                </div>
              </dl>
            </div>
          {:else}
            <p class="p-4">Loading profile...</p>
          {/if}
        </div>
      </div>
    </div>
  </div>