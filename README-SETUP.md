# Kasir Pro 2.0 - PWA Setup & Implementation Guide

## Overview
Kasir Pro 2.0 adalah sistem manajemen penjualan modern yang berjalan di browser dengan kemampuan offline, sinkronisasi cloud real-time, dan integrasi hardware (scanner + printer).

---

## Phase 1: PWA Foundation ✅ COMPLETED

### What's Installed:
1. **manifest.json** - Konfigurasi instalasi aplikasi
2. **sw.js** - Service Worker untuk offline + caching
3. **PWA Meta Tags** - di index.html untuk iOS/Android recognition

### How to Install on Mobile:

#### Android:
1. Buka `index.html` di Chrome / Firefox
2. Ketuk menu **⋮** → **"Install app"** atau **"Kasir Pro"**
3. Aplikasi akan muncul di home screen

#### iOS:
1. Buka `index.html` di Safari
2. Ketuk tombol **Share** 
3. Pilih **"Add to Home Screen"**
4. Aplikasi akan muncul di home screen

### Testing Offline Mode:
- Buka aplikasi di mobile
- Aktifkan WiFi dan load halaman
- Nonaktifkan WiFi/Airplane Mode
- Aplikasi tetap bisa menampilkan produk dari cache

**Expected Result:** Data produk tersimpan, transaksi tetap bisa diinput (akan sync nanti)

---

## Phase 2: Cloud Integration (NEXT STEP)

### Prerequisites:
- Akun Google
- Akun Firebase (gratis)

### Setup Firebase:

1. **Buat Firebase Project:**
   - Buka https://console.firebase.google.com
   - Klik "Create Project"
   - Nama: `kasir-pro` (atau nama lain)
   - Skip Google Analytics (bisa ditambah nanti)

2. **Enable Firestore Database:**
   - Di Firebase Console, pilih "Firestore Database"
   - Create Database → Start in Test Mode (untuk development)
   - Region: pilih terdekat (misal asia-southeast1 untuk Indonesia)
   - Klik "Enable"

3. **Enable Authentication:**
   - Pilih "Authentication"
   - Klik "Get Started"
   - Enable "Email/Password"
   - Buat user test: email@example.com / password123

4. **Copy Firebase Config:**
   - Di Firebase Console, buka Project Settings (⚙️)
   - Copy config object
   - Paste ke `firebase-config.js` (di blok `firebaseConfig`)

5. **Update Firestore Security Rules:**
   - Di Firestore, pilih "Rules"
   - Ganti dengan rules dari `firebase-config.js` 
   - Publish ✓

### Implement Cloud Sync in kasir.js:

```javascript
// Contoh implementasi (akan ditambahin ke kasir.js):

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signIn, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { FIREBASE_CONFIG } from './firebase-config.js';

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);

// Saat save product:
async function saveProductToFirebase(product) {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      name: product.name,
      price: product.price,
      stock: product.stock,
      timestamp: new Date()
    });
    console.log('Produk tersimpan di Firebase:', docRef.id);
  } catch (error) {
    console.error('Error saving product:', error);
  }
}

// Saat load produk:
async function loadProductsFromFirebase() {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    querySnapshot.forEach((doc) => {
      console.log('Produk:', doc.data());
    });
  } catch (error) {
    console.error('Error loading products:', error);
  }
}
```

---

## Phase 3: Hardware Integration (PLANNED)

### A. Barcode Scanner

#### Option 1: Camera-Based (No Hardware Needed)
- Library: **Html5-QRCode** 
- Cara: User point kamera HP ke barcode
- Kelebihan: Gratis, works dengan semua HP
- Kekurangan: Lebih lambat

```html
<!-- Add to index.html -->
<script src="https://unpkg.com/html5-qrcode"></script>

<script>
// Inisialisasi scanner
const html5QrcodeScanner = new Html5Qrcode("reader");

html5QrcodeScanner.start(
  { facingMode: "environment" }, // Gunakan kamera belakang
  { fps: 10, qrbox: 250 },
  (decodedText) => {
    // decodedText = hasil scan barcode
    console.log('Barcode:', decodedText);
    addProductByBarcode(decodedText);
  },
  (error) => console.warn('Scan error:', error)
);
</script>
```

#### Option 2: Physical Scanner (USB/Bluetooth)
- Hardware: Barcode scanner USB or Bluetooth
- Android: Bisa langsung dengan OTG cable
- iOS: Perlu wireless scanner

### B. Thermal Printer (Bluetooth)

#### Implementasi Web Bluetooth API:
```javascript
// Hubungkan ke Printer Bluetooth
async function connectPrinter() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['180a'] }]
    });
    
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('180a');
    const characteristic = await service.getCharacteristic('2a29');
    
    return { device, characteristic };
  } catch (error) {
    console.error('Printer connection failed:', error);
  }
}

// Cetak struk dengan ESC/POS command
async function printReceipt(printer, receiptData) {
  const receiptText = formatReceiptEscPos(receiptData);
  const encoder = new TextEncoder();
  const uint8array = encoder.encode(receiptText);
  
  await printer.characteristic.writeValue(uint8array);
  console.log('Receipt printed!');
}
```

---

## Testing Checklist

- [ ] Instalasi aplikasi di Android
- [ ] Instalasi aplikasi di iOS  
- [ ] Offline mode: produk tetap tampil tanpa internet
- [ ] Cloud sync: data produk sync ke Firebase
- [ ] Multi-user: Kasir 1 dan Owner bisa lihat data yang sama
- [ ] Barcode scan: bisa scan dan add produk
- [ ] Printer: struk bisa diprint

---

## File Structure

```
kasir baru/
├── index.html              ← PWA + meta tags + SW registration
├── kasir.js               ← Core app logic
├── kasir-data.js          ← Product data (migrasi ke Firebase)
├── kasir.css              ← Styling
├── manifest.json          ← PWA manifest ✅
├── sw.js                  ← Service Worker ✅
├── firebase-config.js     ← Firebase credentials (to be filled)
└── README-SETUP.md        ← Panduan ini
```

---

## Common Issues

**Q: Service Worker tidak register**
A: Pastikan `sw.js` di root directory. Service Workers perlu HTTPS (atau localhost).

**Q: Aplikasi tidak bisa install**
A: Cek browser support, pastikan semua PWA requirements tercukupi.

**Q: Firebase credentials error**
A: Pastikan sudah ganti placeholder di `firebase-config.js` dengan actual credentials.

**Q: Printer tidak terhubung**
A: Perlu enable "Bluetooth" permission di index.html + kasir.js, test di Android Chrome v56+.

---

## Next Steps

1. **Setup Firebase** (Week 1) - Konfigurasi database & auth
2. **Migrate Products to Cloud** (Week 2) - saveProduct() gunakan Firestore
3. **Multi-user Login** (Week 2) - Kasir & Owner authentication
4. **Barcode Scanner** (Week 3) - Implementasi dengan Html5-QRCode
5. **Bluetooth Printer** (Week 3) - Web Bluetooth API untuk print struk
6. **UAT Testing** (Week 4) - Uji real transactions di toko

---

## Resources

- PWA: https://web.dev/progressive-web-apps/
- Firebase: https://firebase.google.com/docs
- Web Bluetooth: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API
- Html5-QRCode: https://davidshimjs.github.io/qrcodejs/

---

**Created for Kasir Pro 2.0 - Mobile & Cloud Ready**
