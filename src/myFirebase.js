import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  limit,
  getDocs,
  startAfter,
  getCountFromServer,
  endBefore,
  limitToLast,
  orderBy,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLBAlPuEvDhiYkMlnLQ9P0fKmqf-P8UoE",
  authDomain: "filmoteka-f9ce2.firebaseapp.com",
  projectId: "filmoteka-f9ce2",
  storageBucket: "filmoteka-f9ce2.appspot.com",
  messagingSenderId: "921137797726",
  appId: "1:921137797726:web:e91c99d3b903f9cbd532cf",
  measurementId: "G-3X347TPLWL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const storage = getStorage(app);

export const auth = getAuth(app);

export const usersRef = collection(db, 'users');

export const getUserRef = userId => doc(getFirestore(app), 'users', userId);
export const getWatchedListRef = uid => collection(db, `users/${uid}/wachedList`);
export const getQueueListRef = uid => collection(db, `users/${uid}/queueList`);
export const getWatchedItemRef = (uid, id) => doc(getFirestore(app), `users/${uid}/wachedList`, id);
export const getQueueItemRef = (uid, id) => doc(getFirestore(app), `users/${uid}/queueList`, id);

export const setUser = async data => {
  await setDoc(doc(usersRef, data.uid), data);
};

export const updateUser = async (data, id) => {
  await updateDoc(doc(usersRef, id), data);
};

export const addingItemToWachedList = async ({ data, uid, id }) => {
  await setDoc(doc(getWatchedListRef(uid), id), data);
};

export const deleteItemFromWachedList = async (uid, id) => {
  await deleteDoc(getWatchedItemRef(uid, id));
};

export const addingItemToQueueList = async ({ data, uid, id }) => {
  await setDoc(doc(getQueueListRef(uid), id), data);
};

export const deleteItemFromQueueList = async (uid, id) => {
  await deleteDoc(getQueueItemRef(uid, id));
};

export const getFirstList = async ref => {
  const first = query(ref, limit(20));

  const snapshot = await getCountFromServer(ref);
  const documentSnapshots = await getDocs(first);
  return {
    documentSnapshots,
    snapshot,
  }
};

export const getNextList = async (ref, lastVisible) => {
  const next = query(ref, startAfter(lastVisible), limit(20));

  const snapshot = await getCountFromServer(ref);
  const documentSnapshots = await getDocs(next);
  return {
    documentSnapshots,
    snapshot,
  }
};

export const getPrevList = async (ref, firstVisible) => {
  const next = query(ref, orderBy('details'), endBefore(firstVisible), limitToLast(20));

  const snapshot = await getCountFromServer(ref);
  const documentSnapshots = await getDocs(next);
  return {
    documentSnapshots,
    snapshot,
  }
};
