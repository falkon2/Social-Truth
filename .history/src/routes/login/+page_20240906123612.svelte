<script>
    import { auth } from '$lib/firebase';
    import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
    
    let email = '';
    let password = '';
    let error = '';
  
    async function handleEmailLogin() {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // Redirect to feed page after successful login
        window.location.href = '/feed';
      } catch (err) {
        error = err.message;
      }
    }
  
    async function handleGoogleLogin() {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        // Redirect to feed page after successful login
        window.location.href = '/feed';
      } catch (err) {
        error = err.message;
      }
    }
  </script>
  
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
      
      {#if error}
        <p class="text-red-500 mb-4">{error}</p>
      {/if}
      
      <form on:submit|preventDefault={handleEmailLogin} class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" bind:value={email} required class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="password" bind:value={password} required class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
        </div>
        <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
          Sign In
        </button>
      </form>
      
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div class="mt-6">
          <button on:click={handleGoogleLogin} class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  </div>