"use client";

import React, { useState, createContext, useEffect, useContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getBlob,
  // updateMetadata,
  // getMetadata,
  deleteObject,
} from "firebase/storage";
import {
  getFunctions,
  httpsCallable,
  httpsCallableFromURL,
  connectFunctionsEmulator,
} from "firebase/functions";

import mapValues from "lodash.mapvalues";
import mergeWith from "lodash.mergewith";
import isArray from "lodash.isarray";
import debounce from "lodash.debounce";

const {
  useCollection: useCollectionHook,
  useCollectionOnce,
  useDocumentDataOnce,
  useDocumentData,
} = require("react-firebase-hooks/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBCtIsYVLrKEsGE6HRxVxDjnr1NgNsT_50",
  authDomain: "langstonai-bb3f2.firebaseapp.com",
  projectId: "langstonai-bb3f2",
  storageBucket: "langstonai-bb3f2.appspot.com",
  messagingSenderId: "340753876577",
  appId: "1:340753876577:web:09446a260675934c87cc20",
  measurementId: "G-K2B8KFQEXP",
};

const FirebaseContext = createContext();
const FirestoreContext = createContext();
const FirebaseUserContext = createContext();

function getUserProperties(user) {
  if (!user) return null;

  const { uid, displayName, photoURL, email, phoneNumber, isAnonymous } = user;
  const { creationTime, lastSignInTime } = user.metadata;
  const userData = {
    uid,
    photoURL,
    email,
    emailLowercase: email?.toLowerCase(),
    emailDomain: email?.split("@")[1],
    isAnonymous,
  };

  // if(!userData.photoURL){
  //   userData.photoURL = `https://www.gravatar.com/avatar/${md5(email.toLowerCase().trim())}`
  // }

  if (displayName) userData.displayName = displayName;
  if (phoneNumber) userData.phoneNumber = phoneNumber;
  if (creationTime) userData.creationTime = new Date(creationTime);
  if (lastSignInTime) userData.lastSignInTime = new Date(lastSignInTime);

  return userData;
}

async function storeUser({ user, db, userDataKey }) {
  if (!user?.uid) return;
  const userRef = doc(db, "users", user[userDataKey]);

  const storedUserData = mapDates((await getDoc(userRef)).data());
  const userData = getUserProperties(user);
  let defaultUpdated = false;

  if (!storedUserData.words) {
    let defaultWordsArray = [
      "hola",
      "adios",
      "como estás?",
      "bien",
      "y",
      "tu",
      "él",
      "ella",
      "usted",
      "ustedes",
      "ellos",
      "ellas",
      "nosotros",
      "yo",
      "ser",
      "soy",
      "eres",
      "es",
      "son",
      "somos",
      "madre",
      "padre",
      "hermano",
      "hermana",
      "amigo",
      "amiga",
      "con",
      "para",
      "por",
      "a",
      "mi",
      "su",
      "donde",
      "quien",
      "estar",
      "estoy",
      "estás",
      "como",
      "está",
      "estamos",
      "están",
      "perro",
      "gato",
      "leche",
      "agua",
      "querer",
      "quiero",
      "quíeres",
      "quiere",
      "quieren",
      "queremos",
      "ir",
      "voy",
      "vas",
      "va",
      "van",
      "vamos",
      "el",
      "la",
      "tienda",
      "que",
      "cual",
      "pan",
      "manzana",
      "parque",
      "casa",
      "ropa",
      "rojo",
      "roja",
      "azul",
      "verde",
      "amarillo",
      "amarilla",
      "grande",
      "pequeño",
      "gustar",
      "se",
      "gusta",
      "comer",
      "como",
      "comes",
      "come",
      "comen",
      "comemos",
      "beber",
      "bebo",
      "bebes",
      "bebe",
      "beben",
      "bebemos",
      "por que",
      "café",
      "té",
      "o",
      "no",
      "un",
      "una",
      "persona",
      "inteligente",
      "simpático",
      "simpática",
      "gracioso",
      "graciosa",
      "bueno",
      "buena",
      "de",
      "mis",
      "tus",
      "sus",
      "pero",
      "en",
      "cuanto",
      "cuando",
      "ahora",
      "luego",
      "mañana",
      "hoy",
      "poder",
      "puedo",
      "puedes",
      "puede",
      "pueden",
      "podemos",
      "este",
      "esta",
      "ese",
      "eso",
      "esa",
      "aquel",
      "aquellos",
      "estes",
      "estas",
      "eses",
      "esos",
      "esas",
      "aquí",
      "ahí",
      "hacer",
      "hago",
      "haces",
      "hace",
      "hacen",
      "hacemos",
      "tener",
      "tengo",
      "tienes",
      "tiene",
      "tenemos",
      "tienen",
      "uno",
      "dos",
      "tres",
      "cuatro",
      "cinco",
      "seis",
      "siete",
      "ocho",
      "nueve",
      "diez",
      "algo",
      "entender",
      "entiendo",
      "entiendes",
      "entiende",
      "entienden",
      "entendemos",
      "llamar",
      "llamo",
      "llamas",
      "llama",
      "llaman",
      "llamamos",
      "de nada",
      "disculpe",
      "perdón",
      "buenas tardes",
      "buenas noches",
      "día",
      "noche",
      "tiempo",
      "nuevo",
      "viejo",
      "nueva",
      "vieja",
      "hijo",
      "hija",
    ];

    let defaultWordsObj = defaultWordsArray.map((word) => (
      {word, ease: 1, timesUnchecked: 0}
    ))
    
    userData.words = defaultWordsObj
  }

  if (!storedUserData.profileURL) {
    if (userData.photoURL) {
      userData.profileURL = userData.photoURL;
    } else {
      const defaultProfiles = [
        "https://firebasestorage.googleapis.com/v0/b/velocity-5c0ab.appspot.com/o/default%2Fprofile1.jpg?alt=media&token=db51f664-2b7d-4165-bbd1-9cd002eb4685&_gl=1*1o0zy0w*_ga*NDM1NTg2MTI3LjE2OTM1ODcyMzU.*_ga_CW55HF8NVT*MTY5NjQ3MDE5MC4xMDEuMS4xNjk2NDcxMjUwLjYwLjAuMA..",
        "https://firebasestorage.googleapis.com/v0/b/velocity-5c0ab.appspot.com/o/default%2Fprofile2.jpg?alt=media&token=550a61a8-ace6-4276-943a-6e5d610fdc09&_gl=1*1e2ho95*_ga*NDM1NTg2MTI3LjE2OTM1ODcyMzU.*_ga_CW55HF8NVT*MTY5NjQ3MDE5MC4xMDEuMS4xNjk2NDcxMzAwLjEwLjAuMA..",
        "https://firebasestorage.googleapis.com/v0/b/velocity-5c0ab.appspot.com/o/default%2Fprofile3.jpg?alt=media&token=b8a7a0d3-48d7-42c2-b674-d6abc4806b97&_gl=1*ijs4bi*_ga*NDM1NTg2MTI3LjE2OTM1ODcyMzU.*_ga_CW55HF8NVT*MTY5NjQ3MDE5MC4xMDEuMS4xNjk2NDcxMzIzLjYwLjAuMA..",
      ];
      userData.profileURL = defaultProfiles[Math.floor(Math.random() * 3)];
    }
    defaultUpdated = true;
  }

  if (!storedUserData.settings) {
    let defaultSettings = {
      theme: "light",
      notifications: "true",
      showToolTips: "true",
      showPopups: "true",
      generation: {
        freeTimeMethod: "divide",
        freeTimeProportions: [1, 1, 1],
      },
    };

    userData.settings = defaultSettings;
    defaultUpdated = true;
  }

  //don't overwrite with provider data if it's been changed
  if (
    storedUserData.displayName &&
    storedUserData?.displayName != userData?.displayName
  ) {
    userData.displayName = storedUserData.displayName;
  }

  if (
    storedUserData.emailLowercase &&
    storedUserData.emailLowercase != userData?.emailLowercase
  ) {
    userData.emailLowercase = storedUserData.emailLowercase;
  }

  // save a write if the user hasn't changed that much
  if (
    defaultUpdated ||
    userData.email !== storedUserData.email ||
    userData.photoURL !== storedUserData.photoURL ||
    Math.abs(storedUserData.lastSignInTime - userData.lastSignInTime) >
      1000 * 60 * 60
  ) {
    // console.info("✍🏻 writing to the user doc");
    // console.log({ userData, storedUserData });
    await setDoc(userRef, userData, { merge: true });
  }
  return { userRef, userData: storedUserData };
}

export function FirebaseProvider({ children, userDataKey = "uid" }) {
  console.log("RELOADING FIREBASE PROVIDER");
  const app = initializeApp(firebaseConfig);
  const db = getFirestore();
  const auth = getAuth();

  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      console.log("auth state changed");
      const userData = getUserProperties(user);
      setUser(userData || null);
      await storeUser({ user, db, userDataKey });
    });
  }, [db]);

  return (
    <FirebaseContext.Provider value={app}>
      <FirestoreContext.Provider value={db}>
        <FirebaseUserContext.Provider value={user}>
          {children}
        </FirebaseUserContext.Provider>
      </FirestoreContext.Provider>
    </FirebaseContext.Provider>
  );
}

export function useFirestore() {
  const context = React.useContext(FirestoreContext);
  if (context === undefined) {
    throw new Error("useFirestore must be used within a FirebaseProvider");
  }
  return context;
}

export function useFirebase() {
  const context = React.useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

export function useAuth() {
  const auth = getAuth();
  const context = useContext(FirebaseUserContext);

  if (context === undefined) {
    throw new Error("No fb provider");
  }

  return {
    user: context,
    signInWithPopup: () => {
      const googleProvider = new GoogleAuthProvider();
      return signInWithPopup(auth, googleProvider);
    },
    signOut: () => signOut(auth),
    createUserWithEmailAndPassword: (email, password) => {
      return createUserWithEmailAndPassword(auth, email, password);
    },
    signInWithEmailAndPassword: (email, password) => {
      return signInWithEmailAndPassword(auth, email, password);
    },
    deleteUser: () => {
      return deleteUser(auth.currentUser);
    },
  };
}

export function useCollection(collectionPath, options = { live: true }) {
  const db = getFirestore();

  const { user } = useAuth();

  let path = collectionPath;
  if (user && path[0] !== "/" && !options.group)
    path = `/users/${user.uid}/${path}`;

  let collectionRef;
  if (options.group) collectionRef = collectionGroup(db, path);
  else collectionRef = collection(db, path);

  const queryArgs = [collectionRef];

  if (options.orderBy)
    queryArgs.push(
      orderBy(options.orderBy, options.desc || options.dsc ? "desc" : "asc")
    );

  if (options.where) {
    // where can be an array of arrays or just an array
    // let's force it to be an array of arrays
    let whereClauses = options.where;
    if (!Array.isArray(options.where[0])) whereClauses = [options.where];

    whereClauses.forEach(([a, b, c]) => {
      queryArgs.push(where(a, b, c));
    });
  }

  if (options.limit) queryArgs.push(limit(options.limit));

  const [startAfterSnap, setStartAfterSnap] = useState(null);
  if (startAfterSnap) queryArgs.push(startAfter(startAfterSnap));

  let data = null,
    loading = null,
    error = null,
    snap = null;

  // only fetch the data if the limit isn't zero
  // this lets me just get the add function by passing limit=0
  // be careful not to ever change the limit to zero and back again D:

  if (options.limit !== 0) {
    // if(options.live)
    const useCollectionLiveOrNot =
      options.live === false ? useCollectionOnce : useCollectionHook;

    // console.log(options, queryArgs);

    [snap, loading, error] = useCollectionLiveOrNot(query(...queryArgs));
    // console.log({ snap, loading, error });
    if (snap?.docs) {
      // append instead of resetting if fetching more
      data = snap.docs.map((doc) => {
        return { ...mapDates(doc.data()), path: doc.ref.path, id: doc.id };
      });
    }
    if (error) {
      console.info("useCollection encountered an info with these options:");
      console.info({ collectionPath, options });
      console.error(error);
    }
  }

  function add(docData, docId = "") {
    const data = {
      ...docData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (options.group) {
      return setDoc(doc(db, docData.path), data);
    } else if (docId) {
      return setDoc(doc(collectionRef, docId), data, { create: true });
    } else return addDoc(collectionRef, data);
  }

  // TODO: merge properties here? It might already be happening? I might not need to do it with useDoc?
  const update = (docData) =>
    updateDocument(
      docData.path ? doc(db, docData.path) : doc(collectionRef, docData.id),
      docData
    );
  const remove = (docData) =>
    deleteDoc(
      docData.path ? doc(db, docData.path) : doc(collectionRef, docData.id)
    );

  // console.log({ path });
  // return [firebaseData, addDoc, loading, error];
  return { data, add, update, remove, loading, error };
}
const debouncedUpdate = debounce(
  (ref, data) => updateDocument(ref, data),
  1000
);

function mapDates(doc = {}) {
  return Object.fromEntries(
    Object.entries(doc).map(([k, v]) => {
      const value = typeof v?.toDate === "function" ? v.toDate() : v;
      return [k, value];
    })
  );
}

export function updateDocument(ref, data) {
  if (typeof ref === "string") ref = doc(getFirestore(), ref);

  // set fields to undefined to delete them
  const updatedFields = mapValues(data, (v) => {
    return v === undefined ? deleteField() : v;
  });
  const { id } = data;
  delete updatedFields.id;
  delete updatedFields.path;

  // console.log({ updatedFields, data });

  return setDoc(
    ref,
    {
      ...updatedFields,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function useDoc(docPath, config = { live: true }) {
  let path = docPath; // || "/null/null";
  const db = useFirestore();
  const { user } = useAuth();
  if (user && path && path[0] !== "/") path = `/users/${user.uid}/${path}`;

  // use an empty string to get the current user's doc
  if (user && path === "") path = `/users/${user.uid}`;

  if (!path) path = "/";
  path = path.replace(/\/+/, "/");

  const docRef = doc(db, path);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // idField might not work anymore?
  // if you change live during a render bad things will happen lol.
  const useDocHook = config.live ? useDocumentData : useDocumentDataOnce;
  const [firebaseData, firebaseLoading, error] = useDocHook(docRef, {
    idField: "id",
  });

  // update local data if remote data changes

  useEffect(() => {
    setLoading(firebaseLoading);
  }, [firebaseLoading]);

  useEffect(() => {
    setData(
      firebaseData ? { ...mapDates(firebaseData), path, id: docRef.id } : null
    );
  }, [firebaseData, path]);

  const remove = () => deleteDoc(docRef);
  const update = (docData) => updateDocument(docRef, docData);
  const set = (docData) => setDoc(docRef, docData);

  function setDataWithFirebase(newData) {
    // console.info("setDataWithFirebase", newData);
    // I don't know why I have to spread merge, but setData doesn't update if I don't
    // this might not work with setting data to undefined?

    // without this customizer I can't update the order of an array
    // just using `merge` tries to merge the object values at the same
    // index of an array
    function customizer(objValue, srcValue) {
      if (isArray(objValue)) {
        return srcValue;
      }
    }
    setData({ ...mergeWith(data, newData, customizer) });
    debouncedUpdate(docRef, newData);
  }

  return {
    data,
    update,
    upsert: update,
    set,
    debouncedUpdate: setDataWithFirebase,
    // if you're fucking around with debounceUpdating nested data,
    // make sure you flush between each written key
    flushDebouncedUpdates: debouncedUpdate.flush,
    remove,
    loading,
    error,
  };
}

export function useStorage(bucketUrl = null) {
  const firebaseApp = useFirebase();
  const [progress, setProgress] = useState({});
  const [error, setError] = useState(null);

  const storage = getStorage(firebaseApp, bucketUrl);

  function pause(path) {
    console.log("TODO: implement global pause, resume, cancel");
  }
  function resume(path) {
    console.log("TODO: implement global pause, resume, cancel");
  }
  function cancel(path) {
    console.log("TODO: implement global pause, resume, cancel");
  }

  function download(path) {
    const objectRef = ref(storage, path);
    return getBlob(objectRef);
  }

  function downloadUrl({ path, bucket = bucketUrl }) {
    const storage = getStorage(firebaseApp, bucket);
    if (storageEmulatorPort)
      connectStorageEmulator(storage, "localhost", storageEmulatorPort);
    return getDownloadURL(ref(storage, path));
  }

  function upload({ data, path, metadata = {}, onProgress }) {
    const objectRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(objectRef, data, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          if (typeof onProgress === "function") {
            const total = snapshot.totalBytes;
            const transferred = snapshot.bytesTransferred;
            const percent = (transferred / total) * 100;
            const fileProgress = { total, transferred, percent };
            onProgress(fileProgress);
            setProgress((progress) => ({ ...progress, [path]: fileProgress }));
          }
        },
        function (error) {
          console.log({ error });
          reject(error);
        },
        function () {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            resolve({
              url,
              ref: uploadTask.snapshot.ref,
              bucket: bucketUrl,
              path,
            });
            //   console.log("File available at", downloadURL);
          });
        }
      );
    });
  }

  function remove(path) {
    return deleteObject(ref(storage, path));
  }

  return {
    upload,
    download,
    downloadUrl,
    remove,
    progress,
    error,
    cancel,
    resume,
    pause,
  };
}

export function useCallableFunction(title, { zone = "us-central1" } = {}) {
  const functions = getFunctions();
  // const addMessage = httpsCallable(functions, "addMessage");
  // const firebaseApp = useFirebase();
  // return httpsCallable(getFunctions(firebaseApp, zone), title);
  // if (title.includes("http")) {
  //   // v2 function
  //   if (settings.httpHost && process.env.NODE_ENV === "development") {
  //     // "https://dropboxfetchtoken-oiylteqana-uc.a.run.app"
  //     const functionName = title.split("/").pop().split("-")[0];
  //     return httpsCallable(functions, functionName);
  //   }
  //   return httpsCallableFromURL(functions, title);
  // }
  return httpsCallable(functions, title);
}
