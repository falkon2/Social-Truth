<script>
  import { onMount } from 'svelte';
  import { db, storage, auth } from '$lib/firebase';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { goto } from '$app/navigation';

  let title = '';
  let content = '';
  let file = null;
  let error = null;
  let loading = false;

  async function handleSubmit() {
    if (!title || !content) return;

    const user = auth.currentUser;
    if (!user) {
      error = "You must be logged in to post.";
      return;
    }

    loading = true;
    try {
      let mediaUrl = null;
      let mediaType = null;
      if (file) {
        const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        mediaUrl = await getDownloadURL(storageRef);
        mediaType = file.type.startsWith('image/') ? 'image' : 'video';
      }

      const docRef = await addDoc(collection(db, 'posts'), {
        title,
        content,
        mediaUrl,
        mediaType,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        createdAt: serverTimestamp(),
        votes: 0,
        comments: []
      });

      goto(`/post/${docRef.id}`);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleFileInput(event) {
    file = event.target.files[0];
  }
</script>

<!-- Rest of the component remains the same -->