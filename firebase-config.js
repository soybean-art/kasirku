// === firebase-config.js ===

const firebaseConfig = {
  apiKey: "GANTI_DENGAN_API_KEY_MILIKMU",
  authDomain: "GANTI_DENGAN_PROJECT_ID.firebaseapp.com",
  projectId: "GANTI_DENGAN_PROJECT_ID",
  storageBucket: "GANTI_DENGAN_PROJECT_ID.appspot.com",
  messagingSenderId: "GANTI_SENDER_ID",
  appId: "GANTI_APP_ID"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Inisialisasi Firestore Database & Authentication
const db = firebase.firestore();
const auth = firebase.auth();

// Aktifkan mode Offline (Sangat penting agar kasir tetap bisa input saat WiFi mati)
db.enablePersistence().catch((err) => {
    console.warn("Offline persistence error:", err.code);
});

console.log("✅ Firebase Config & Offline Mode Aktif!");
