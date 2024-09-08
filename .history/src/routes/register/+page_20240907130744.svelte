<script>
  import { auth, db } from '$lib/firebase';
  import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let displayName = '';
  let error = '';

  async function handleRegister() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName,
        email,
        createdAt: new Date()
      });
      goto('/');
    } catch (err) {
      error = err.message;
    }
  }
</script>

<div class="max-w-md mx-auto">
  <h1 class="text-3xl font-bold mb-6 text-center">Register</h1>
  
  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}
  
  <form on:submit|preventDefault={handleRegister} class="space-y-4">
    <div>
      <label for="displayName" class="block mb-1">Display Name</label>
      <input type="text" id="displayName" bind:value={displayName} required class="w-full p-2 rounded bg-gray-800 text-white" />
    </div>
    <div>
      <label for="email" class="block mb-1">Email</label>
      <input type="email" id="email" bind:value={email} required class="w-full p-2 rounded bg-gray-800 text-white" />
    </div>
    <div>
      <label for="password" class="block mb-1">Password</label>
      <input type="password" id="password" bind:value={password} required class="w-full p-2 rounded bg-gray-800 text-white" />
    </div>
    <button type="submit" class="w-full bg-green-400 text-gray-900 p-2 rounded font-semibold hover:bg-green-500">
      Register
    </button>
  </form>
  
  <p class="mt-4 text-center">
    Already have an account? <a href="/login" class="text-green-400 hover:underline">Login here</a>
  </p>
</div>