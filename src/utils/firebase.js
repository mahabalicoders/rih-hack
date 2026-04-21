// --- Firebase Configuration ---
// These are loaded via CDN in index.html (compat versions)
const firebaseConfig = {
    apiKey: "AIzaSyC5pe8gt-XTlkcBERxSVrbuxJcNbilIVw4",
    authDomain: "credit-iq-baa91.firebaseapp.com",
    projectId: "credit-iq-baa91",
    storageBucket: "credit-iq-baa91.firebasestorage.app",
    messagingSenderId: "31663798764",
    appId: "1:31663798764:web:d1ce015657133a0e9768c9",
    measurementId: "G-HGYNZ30ZV1"
};

let app;
let db;
let auth;

if (window.firebase) {
    if (!window.firebase.apps.length) {
        app = window.firebase.initializeApp(firebaseConfig);
    } else {
        app = window.firebase.app();
    }
    db = window.firebase.firestore();
    auth = window.firebase.auth();
    signIn = (email, password) => auth.signInWithEmailAndPassword(email, password);
} else {
    console.warn("Firebase script not loaded yet.");
}

export { app, db, auth, signIn };
