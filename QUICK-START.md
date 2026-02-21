# Kasir Pro 2.0 - Quick Start Guide

## 🚀 Getting Started (5 minutes)

### 1. Test on Desktop
```bash
# Open in browser:
# Windows: Double-click index.html or open with Chrome
# Mac: Open index.html in Safari
# Linux: Open index.html in Firefox or Chrome
```

### 2. Test PWA Installation

**Chrome (Android):**
1. Open http://localhost:8000/index.html (or your server URL)
2. Tap ⋮ menu → "Install app" → "Install"
3. Check home screen for "Kasir Pro" icon

**Safari (iOS):**
1. Open index.html
2. Tap Share → "Add to Home Screen"
3. Name: "Kasir Pro" → Add
4. Icon appears on home screen

### 3. Test Offline Mode
1. Open the app (loaded)
2. Open DevTools (F12) → Go Offline
3. Refresh page → Should see cached content
4. Try viewing products → Should work from cache

---

## 📱 Mobile Devices Testing

### Android Setup
- Device: Any Android 5.0+
- Browser: Chrome, Firefox, or Samsung Internet
- Connect PC and phone to same WiFi
- Open: `http://{YOUR_PC_IP}:8000/index.html`

### iPhone Setup  
- Device: Any iPhone with iOS 11+
- Browser: Safari only (supports PWA)
- Steps:
  1. Connect to same WiFi as PC
  2. Open Safari: `http://{YOUR_PC_IP}:8000`
  3. Tap Share → Add to Home Screen

---

## 🔧 Local Testing Server

### Option A: Python (Built-in)
```bash
# Python 3
cd "c:\Users\ASUS\OneDrive\Desktop\kasir baru"
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Then open: http://localhost:8000
```

### Option B: Node.js (if installed)
```bash
npm install -g http-server
cd "c:\Users\ASUS\OneDrive\Desktop\kasir baru"
http-server -p 8000

# Then open: http://localhost:8000
```

### Option C: Windows PowerShell
```powershell
# Start simple server on port 8000
cd "c:\Users\ASUS\OneDrive\Desktop\kasir baru"

# Create temp PowerShell server
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()
# (Not recommended - use Python/Node above)
```

---

## 📋 Next Steps Checklist

### Immediate (This Week)
- [ ] Test app opens in browser
- [ ] Test PWA install on Android
- [ ] Test PWA install on iOS
- [ ] Verify offline mode works
- [ ] Check DevTools > Application > Service Workers (should show "active")

### Short-term (Week 1-2)
- [ ] Setup Firebase project (free tier)
- [ ] Fill in firebase-config.js credentials
- [ ] Test Firebase connection
- [ ] Migrate first product to Firestore

### Medium-term (Week 2-4)
- [ ] Implement barcode scanner
- [ ] Connect thermal printer
- [ ] Multi-user role-based access
- [ ] Real-time sync testing

---

## 🐛 Troubleshooting

### "Service Worker not registering"
**Solution:**
- Service Workers need HTTPS (or localhost)
- Check browser console (F12 → Console tab)
- Ensure `sw.js` is in root directory
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### "App won't install"
**Solution:**
- Verify manifest.json is valid (F12 → Application → Manifest)
- Check app meets PWA requirements (HTTPS + icon + manifest)
- Try different browser
- Clear cache: Settings → Clear browsing data

### "Can't connect to Firebase"
**Solution:**
- Check firebase-config.js has correct credentials
- Verify internet connection
- Check Firebase project is enabled
- Check Firestore rules allow read (start with test mode)

### "Offline mode not working"
**Solution:**
- Hard refresh page when online first
- Check DevTools > Cache Storage > kasir-pro-v1
- Ensure CSS/JS files are cached
- Try in Incognito/Private mode

---

## 📞 Support Resources

- **Service Worker Issues:** https://developer.chrome.com/docs/workbox/service-worker-overview/
- **PWA Checklist:** https://web.dev/pwa-checklist/
- **Firebase Setup:** https://firebase.google.com/docs/firestore/quickstart
- **Web Bluetooth:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API

---

## 💡 Tips & Tricks

1. **Test on Real Device:**
   - Phone hotspot + tether to PC
   - Or open on same WiFi

2. **Check What's Cached:**
   - DevTools → Application → Cache Storage → kasir-pro-v1
   - Delete cached files to force fresh load

3. **Update Service Worker:**
   - Service Worker checks for updates every 60 seconds
   - Or navigate to a new page
   - Or hard refresh (Ctrl+Shift+R)

4. **Monitor Offline Performance:**
   - DevTools → Network tab → "Offline" mode
   - Test critical features work without internet

---

## 🎯 Success Criteria

You'll know it's working when:
- ✅ App installs on mobile home screen
- ✅ App works without internet
- ✅ DevTools shows Service Worker "activated & running"
- ✅ Console shows "Service Worker registered successfully"
- ✅ Can see products list when offline

---

**Version:** 1.0  
**Last Updated:** February 2026  
**Status:** PWA Foundation Complete ✅
