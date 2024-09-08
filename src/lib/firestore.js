import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export async function createPost(userId, postData) {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      authorId: userId,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
}

export async function updatePost(postId, postData) {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, postData);
  } catch (error) {
    throw error;
  }
}

export async function deletePost(postId) {
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (error) {
    throw error;
  }
}

export async function getPost(postId) {
  try {
    const docSnap = await getDoc(doc(db, 'posts', postId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Post not found');
    }
  } catch (error) {
    throw error;
  }
}

export async function getPosts(limit = 10) {
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(limit));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
}

export async function getUserPosts(userId, limit = 10) {
  try {
    const q = query(collection(db, 'posts'), where('authorId', '==', userId), orderBy('createdAt', 'desc'), limit(limit));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
}