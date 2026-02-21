// Firebase Configuration for Kasir Pro 2.0
// SETUP INSTRUCTIONS:
// 1. Create a Firebase project at https://console.firebase.google.com
// 2. Enable Firestore Database and Authentication (Email/Password)
// 3. Replace the config values below with your Firebase project credentials
// 4. Set Firestore Security Rules (see bottom of this file)

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
// Note: These lines will be imported from CDN in index.html later
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/*
FIRESTORE SECURITY RULES:
================================

Replace the default Firestore rules with these in Firebase Console:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users to read/write their own shop data
    match /shops/{shopId} {
      allow read, write: if request.auth.uid == resource.data.ownerId;
      
      // Allow owner to manage all subcollections
      match /products/{productId} {
        allow read, write: if request.auth.uid == get(/databases/$(database)/documents/shops/$(shopId)).data.ownerId;
      }
      
      match /transactions/{transactionId} {
        allow read, write: if request.auth.uid == get(/databases/$(database)/documents/shops/$(shopId)).data.ownerId ||
                              request.auth.uid in get(/databases/$(database)/documents/shops/$(shopId)).data.cashiers;
      }
      
      match /inventory/{inventoryId} {
        allow read, write: if request.auth.uid == get(/databases/$(database)/documents/shops/$(shopId)).data.ownerId;
      }
    }
    
    // User profiles
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}

DATABASE STRUCTURE:
================================

shops/
├── {shopId}/
│   ├── ownerId: string
│   ├── shopName: string
│   ├── address: string
│   ├── phone: string
│   ├── cashiers: array (IDs of authorized cashiers)
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
products/
├── {productId}/
│   ├── name: string
│   ├── sku: string
│   ├── category: string
│   ├── price: number
│   ├── cost: number (for owner only)
│   ├── stock: number
│   ├── unit: string (e.g., "pcs", "pack", "kg")
│   ├── barcode: string (optional)
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
transactions/
├── {transactionId}/
│   ├── date: timestamp
│   ├── cashierId: string
│   ├── items: array of {productId, quantity, price, subtotal}
│   ├── subtotal: number
│   ├── tax: number
│   ├── total: number
│   ├── paid: number
│   ├── change: number
│   ├── paymentMethod: string (cash, card, etc)
│   ├── notes: string
│   └── status: string (completed, pending, refunded)
│
users/
├── {userId}/
│   ├── email: string
│   ├── name: string
│   ├── role: string (owner, cashier)
│   ├── shopId: string (reference to shop)
│   ├── createdAt: timestamp
│   └── avatar: string (URL)

*/

export const FIREBASE_CONFIG = firebaseConfig;
