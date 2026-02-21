/* kasir.js — Main Application Logic */
"use strict";
let cart = {},
  S = { catId: "all", total: 0, discAmt: 0 },
  currentUser = null,
  charts = {};
const ls = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k) || "null");
  } catch {
    return null;
  }
};
const lss = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const fRp = (n) => "Rp " + Math.round(n || 0).toLocaleString("id-ID");
const fDt = (d) => new Date(d).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const pKey = (c, n) => c + "||" + n;
const $ = (id) => document.getElementById(id);
function toast(msg, type = "success") {
  const d = document.createElement("div");
  d.className = "toast t-" + type;
  d.textContent = (type === "error" ? "❌ " : type === "info" ? "ℹ️ " : "✅ ") + msg;
  $("toast-container").appendChild(d);
  setTimeout(() => d.remove(), 2500);
}
const openModal = (id) => $(id) && $(id).classList.add("open");
const closeModal = (id) => $(id) && $(id).classList.remove("open");
function getPrice(c, n) {
  const p = ls("kp_prices") || {};
  return p[pKey(c, n)] ?? categories.find((x) => x.id === c)?.products.find((x) => x.name === n)?.price ?? 0;
}
let bcMap = {};
function buildBCMap() {
  bcMap = {};
  let i = 0;
  categories.forEach((cat) =>
    cat.products.forEach((p) => {
      bcMap[String(++i).padStart(6, "0")] = { catId: cat.id, name: p.name };
    }),
  );
}

function initDefaults() {
  if (!ls("kp_users"))
    lss("kp_users", [
      { id: 1, name: "Administrator", username: "admin", password: "admin123", role: "admin" },
      { id: 2, name: "Kasir 1", username: "kasir1", password: "kasir1", role: "kasir" },
    ]);
  const stock = ls("kp_stock") || {};
  let chg = false;
  categories.forEach((cat) =>
    cat.products.forEach((p) => {
      const k = pKey(cat.id, p.name);
      if (stock[k] === undefined) {
        stock[k] = 50;
        chg = true;
      }
    }),
  );
  if (chg) lss("kp_stock", stock);
}

/* ── AUTH ── */
function doLogin() {
  const u = $("login-username").value.trim(),
    p = $("login-password").value;
  const user = (ls("kp_users") || []).find((x) => x.username === u && x.password === p);
  const err = $("login-error");
  if (!user) {
    err.textContent = "Username atau password salah";
    err.style.display = "block";
    return;
  }
  err.style.display = "none";
  lss("kp_current", user.id);
  currentUser = user;
  startApp();
}
function doLogout() {
  localStorage.removeItem("kp_current");
  currentUser = null;
  $("app").style.display = "none";
  $("login-screen").style.display = "flex";
  $("login-password").value = "";
}
function startApp() {
  $("login-screen").style.display = "none";
  $("app").style.display = "flex";
  $("user-name-display").textContent = currentUser.name;
  if (currentUser.role !== "admin") $("nav-users").style.display = "none";
  checkStockAlerts();
  buildCategoryTabs();
  renderProducts();
  buildQuickAmounts();
  showPage("pos");
}

/* ── NAV ── */
const pageNames = { pos: "Kasir", history: "Riwayat Transaksi", reports: "Laporan Penjualan", stock: "Manajemen Stok & Produk", users: "Manajemen Pengguna", settings: "Pengaturan" };
function showPage(id) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
  $("page-" + id)?.classList.add("active");
  $("nav-" + id)?.classList.add("active");
  $("header-page-name").textContent = pageNames[id] || "";
  if (id === "history") renderHistory();
  else if (id === "reports") renderReports();
  else if (id === "stock") renderStock();
  else if (id === "users") renderUsers();
  else if (id === "settings") {
    renderPriceEditor();
    updateThemeBtns();
  }
}
const toggleSidebar = () => $("sidebar").classList.toggle("collapsed");
const toggleTheme = () => setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
function setTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  lss("kp_theme", t);
  $("btn-theme").textContent = t === "dark" ? "🌙" : "☀️";
  updateThemeBtns();
}
function updateThemeBtns() {
  const t = document.documentElement.getAttribute("data-theme");
  $("theme-dark-btn")?.classList.toggle("active", t === "dark");
  $("theme-light-btn")?.classList.toggle("active", t === "light");
}
const updateClock = () => {
  const el = $("clock-display");
  if (el) el.textContent = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

/* ── POS ── */
function buildCategoryTabs() {
  const bar = $("category-bar");
  bar.innerHTML = "";
  [["all", "Semua", "🏪"], ...categories.map((c) => [c.id, c.name, c.emoji])].forEach(([id, name, em]) => {
    const b = document.createElement("button");
    b.className = "cat-tab" + (S.catId === id ? " active" : "");
    b.textContent = em + " " + name;
    b.onclick = () => showCat(id);
    bar.appendChild(b);
  });
}
function showCat(id) {
  S.catId = id;
  // Clear search when switching tabs for a clean view
  const searchEl = $("prod-search");
  if (searchEl) searchEl.value = "";
  buildCategoryTabs();
  renderProducts();
}
function renderProducts() {
  const wrap = $("product-grid-wrap");
  wrap.innerHTML = "";
  const stock = ls("kp_stock") || {},
    q = ($("prod-search")?.value || "").toLowerCase();
  // When searching, always scan ALL categories (ignore active tab filter)
  const cats = q || S.catId === "all" ? categories : categories.filter((c) => c.id === S.catId);
  // Visually mark all tabs inactive while search is active
  if (q) {
    document.querySelectorAll(".cat-tab").forEach((b) => b.classList.remove("active"));
  } else {
    buildCategoryTabs(); // restore active tab highlight
  }
  cats.forEach((cat) => {
    const prods = cat.products.filter((p) => !q || p.name.toLowerCase().includes(q));
    if (!prods.length) return;
    const h = document.createElement("div");
    h.className = "section-header-row";
    h.innerHTML = `<div class="section-header-title">${cat.emoji} ${cat.name}</div><div class="section-header-line"></div>`;
    wrap.appendChild(h);
    const g = document.createElement("div");
    g.className = "product-grid";
    prods.forEach((prod) => {
      const price = getPrice(cat.id, prod.name),
        k = pKey(cat.id, prod.name),
        qty = stock[k] ?? 50;
      const d = document.createElement("div");
      d.className = "prod-card";
      d.innerHTML = `<div class="prod-emoji">${cat.emoji}</div><div class="prod-name">${prod.name}</div><div class="prod-price">${fRp(price)}</div><div class="prod-stock-badge${qty <= 5 ? " prod-stock-low" : ""}">Stok: ${qty}</div><div class="prod-add">+</div>`;
      d.onclick = () => addToCart(cat.id, prod.name, price);
      g.appendChild(d);
    });
    wrap.appendChild(g);
  });
  if (!wrap.children.length)
    wrap.innerHTML = `<div class="cart-empty" style="text-align:center;padding:40px;color:var(--muted)"><div style="font-size:36px;opacity:.4">🔍</div><div style="margin-top:8px">Produk "${q}" tidak ditemukan</div></div>`;
}

/* ── CART ── */
function addToCart(catId, name, price) {
  const k = pKey(catId, name),
    stock = ls("kp_stock") || {},
    avail = stock[k] ?? 50,
    inCart = cart[k]?.qty || 0;
  if (inCart >= avail) {
    toast("Stok tidak cukup!", "error");
    return;
  }
  cart[k] ? cart[k].qty++ : (cart[k] = { catId, name, price, qty: 1 });
  renderCart();
}
function changeQty(k, d) {
  if (!cart[k]) return;
  cart[k].qty += d;
  if (cart[k].qty <= 0) delete cart[k];
  renderCart();
}
function removeItem(k) {
  delete cart[k];
  renderCart();
}
function clearCart() {
  cart = {};
  ["bayar-input", "disc-value"].forEach((id) => {
    if ($(id)) $(id).value = "";
  });
  ["disc-row"].forEach((id) => {
    if ($(id)) $(id).style.display = "none";
  });
  renderCart();
}
function renderCart() {
  const c = $("cart-items"),
    keys = Object.keys(cart);
  $("cart-count").textContent = keys.length;
  if (!keys.length) {
    c.innerHTML = '<div class="cart-empty" id="cart-empty" style="text-align:center;padding:30px;color:var(--muted)"><div style="font-size:36px;opacity:.4">🛒</div><div style="margin-top:8px">Keranjang kosong</div></div>';
    updateTotals();
    updateMobileFAB();
    return;
  }
  c.innerHTML = "";
  keys.forEach((k) => {
    const it = cart[k],
      d = document.createElement("div");
    d.className = "cart-item";
    d.innerHTML = `<div class="ci-info"><div class="ci-name">${it.name}</div><div class="ci-unit">${fRp(it.price)}/pcs</div></div><div class="qty-ctrl"><button class="qty-btn" onclick="changeQty('${k}',-1)">−</button><span class="qty-num">${it.qty}</span><button class="qty-btn" onclick="changeQty('${k}',1)">+</button></div><div class="ci-sub">${fRp(it.price * it.qty)}</div><button class="ci-del" onclick="removeItem('${k}')">✕</button>`;
    c.appendChild(d);
  });
  updateTotals();
  updateMobileFAB();
}
function updateTotals() {
  const sub = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  $("subtotal-display").textContent = fRp(sub);
  const dType = $("disc-type")?.value || "pct",
    dVal = parseFloat($("disc-value")?.value) || 0;
  let dAmt = dVal > 0 ? (dType === "pct" ? sub * (dVal / 100) : Math.min(dVal, sub)) : 0;
  const discRow = $("disc-row");
  if (discRow) discRow.style.display = dAmt > 0 ? "flex" : "none";
  if (dAmt > 0 && $("disc-amount-display")) $("disc-amount-display").textContent = "- " + fRp(dAmt);
  S.total = Math.max(0, sub - dAmt);
  S.discAmt = dAmt;
  if ($("total-display")) $("total-display").textContent = fRp(S.total);
  updateKembalian();
  buildQuickAmounts(S.total);
}
const updateDiscount = () => updateTotals();
const clearDiscount = () => {
  if ($("disc-value")) $("disc-value").value = "";
  if ($("disc-type")) $("disc-type").value = "pct";
  updateTotals();
};
function parseBayar() {
  const v = ($("bayar-input")?.value || "").replace(/\./g, "");
  return parseFloat(v) || 0;
}
function formatBayarInput() {
  const el = $("bayar-input");
  if (!el) return;
  const raw = el.value.replace(/[^0-9]/g, "");
  const num = parseInt(raw, 10);
  el.value = raw === "" ? "" : isNaN(num) ? "" : num.toLocaleString("id-ID");
  updateKembalian();
}
function updateKembalian() {
  const b = parseBayar(),
    kem = b - S.total,
    el = $("kembalian-display");
  if (el) {
    el.textContent = kem >= 0 ? fRp(kem) : "- " + fRp(Math.abs(kem));
    el.style.color = kem < 0 ? "var(--red)" : "";
  }
}
function buildQuickAmounts(total = 0) {
  const c = $("quick-amounts");
  if (!c) return;
  c.innerHTML = "";
  const ru = (n, s) => Math.ceil(n / s) * s;
  const amts = total > 0 ? [...new Set([total, ru(total, 5000), ru(total, 10000), ru(total, 50000)])].slice(0, 4) : [5000, 10000, 20000, 50000];
  amts.forEach((a) => {
    const b = document.createElement("button");
    b.className = "quick-btn";
    b.textContent = fRp(a);
    b.onclick = () => {
      $("bayar-input").value = a.toLocaleString("id-ID");
      updateKembalian();
    };
    c.appendChild(b);
  });
}
/* ── PAYMENT ── */
function processPayment() {
  const keys = Object.keys(cart);
  if (!keys.length) {
    toast("Keranjang kosong!", "error");
    return;
  }
  const bayar = parseBayar();
  if (bayar < S.total) {
    toast("Uang bayar kurang!", "error");
    return;
  }
  const sub = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  const stock = ls("kp_stock") || {};
  keys.forEach((k) => {
    if (stock[k] !== undefined) stock[k] = Math.max(0, stock[k] - cart[k].qty);
  });
  lss("kp_stock", stock);
  const tx = {
    id: "TRX-" + Date.now(),
    date: new Date().toISOString(),
    items: keys.map((k) => ({ ...cart[k] })),
    subtotal: sub,
    total: S.total,
    bayar,
    kembalian: bayar - S.total,
    discountAmt: S.discAmt,
    userId: currentUser.id,
    userName: currentUser.name,
  };
  const txs = ls("kp_tx") || [];
  txs.unshift(tx);
  lss("kp_tx", txs);
  showReceipt(tx);
  clearCart();
  checkStockAlerts();
  renderProducts();
}
function showReceipt(tx) {
  if ($("receipt-date")) $("receipt-date").textContent = fDt(tx.date);
  if ($("receipt-meta")) $("receipt-meta").innerHTML = `<div><span>No. Transaksi</span><span><b>${tx.id}</b></span></div><div><span>Kasir</span><span>${tx.userName}</span></div>`;
  if ($("receipt-items-list")) $("receipt-items-list").innerHTML = tx.items.map((i) => `<div class="receipt-item-row"><span>${i.name} x${i.qty}</span><span>${fRp(i.price * i.qty)}</span></div>`).join("");
  if ($("receipt-totals"))
    $("receipt-totals").innerHTML =
      `<div><span>Subtotal</span><span>${fRp(tx.subtotal)}</span></div>${tx.discountAmt > 0 ? `<div><span>Diskon</span><span>- ${fRp(tx.discountAmt)}</span></div>` : ""}<div class="receipt-trow-total"><span>TOTAL</span><span>${fRp(tx.total)}</span></div><div><span>Bayar</span><span>${fRp(tx.bayar)}</span></div><div class="receipt-trow-kem"><span>Kembalian</span><span>${fRp(tx.kembalian)}</span></div>`;
  openModal("modal-receipt");
}
const printReceipt = () => window.print();

/* ── HISTORY ── */
function renderHistory() {
  const txs = ls("kp_tx") || [],
    q = ($("hist-search")?.value || "").toLowerCase(),
    dt = $("hist-date")?.value || "";
  const f = txs.filter((t) => (!q || (t.id + t.userName).toLowerCase().includes(q)) && (!dt || t.date.startsWith(dt)));
  const tod = txs.filter((t) => t.date.startsWith(new Date().toISOString().slice(0, 10)));
  if ($("hist-stats"))
    $("hist-stats").innerHTML =
      `<div class="stat-card"><div class="stat-card-label">Total Transaksi</div><div class="stat-card-value">${txs.length}</div></div><div class="stat-card"><div class="stat-card-label">Hari Ini</div><div class="stat-card-value">${tod.length}</div></div><div class="stat-card"><div class="stat-card-label">Pendapatan Hari Ini</div><div class="stat-card-value text-green">${fRp(tod.reduce((s, t) => s + t.total, 0))}</div></div>`;
  const body = $("hist-tbody");
  if (!body) return;
  body.innerHTML = "";
  if ($("hist-empty")) $("hist-empty").style.display = f.length ? "none" : "block";
  f.forEach((tx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><b>${tx.id}</b></td><td>${fDt(tx.date)}</td><td>${tx.userName}</td><td>${tx.items.length} item</td><td class="text-green fw700">${fRp(tx.total)}</td><td>${fRp(tx.bayar)}</td><td class="text-yellow">${fRp(tx.kembalian)}</td><td><button class="btn-sm btn-outline" onclick="openReprint('${tx.id}')">🖨️ Cetak</button></td>`;
    body.appendChild(tr);
  });
}
const clearHistoryFilters = () => {
  if ($("hist-search")) $("hist-search").value = "";
  if ($("hist-date")) $("hist-date").value = "";
  renderHistory();
};
function openReprint(id) {
  const tx = (ls("kp_tx") || []).find((t) => t.id === id);
  if (!tx) return;
  if ($("reprint-content"))
    $("reprint-content").innerHTML =
      `<div class="receipt-meta"><div><span>No.</span><span><b>${tx.id}</b></span></div><div><span>Tanggal</span><span>${fDt(tx.date)}</span></div><div><span>Kasir</span><span>${tx.userName}</span></div></div><hr class="divider"/>${tx.items.map((i) => `<div class="receipt-item-row"><span>${i.name} x${i.qty}</span><span>${fRp(i.price * i.qty)}</span></div>`).join("")}<hr class="divider"/><div class="receipt-totals"><div class="receipt-trow-total"><span>TOTAL</span><span>${fRp(tx.total)}</span></div><div><span>Bayar</span><span>${fRp(tx.bayar)}</span></div><div class="receipt-trow-kem"><span>Kembalian</span><span>${fRp(tx.kembalian)}</span></div></div>`;
  openModal("modal-reprint");
}

/* ── REPORTS ── */
function renderReports() {
  const period = $("report-period")?.value || "week",
    txs = ls("kp_tx") || [],
    days = period === "today" ? 1 : period === "week" ? 7 : 30;
  const cut = new Date();
  cut.setDate(cut.getDate() - (days - 1));
  cut.setHours(0, 0, 0, 0);
  const f = txs.filter((t) => new Date(t.date) >= cut),
    rev = f.reduce((s, t) => s + t.total, 0);
  if ($("report-stats"))
    $("report-stats").innerHTML =
      `<div class="stat-card"><div class="stat-card-label">Pendapatan</div><div class="stat-card-value text-green">${fRp(rev)}</div></div><div class="stat-card"><div class="stat-card-label">Transaksi</div><div class="stat-card-value">${f.length}</div></div><div class="stat-card"><div class="stat-card-label">Rata-rata</div><div class="stat-card-value">${fRp(f.length ? rev / f.length : 0)}</div></div><div class="stat-card"><div class="stat-card-label">Item Terjual</div><div class="stat-card-value">${f.reduce((s, t) => s + t.items.reduce((a, i) => a + i.qty, 0), 0)}</div></div>`;
  const isDark = document.documentElement.getAttribute("data-theme") === "dark",
    tc = isDark ? "#94a3b8" : "#64748b",
    gc = isDark ? "#273059" : "#dde3f0";
  const now = new Date(),
    labels = [],
    data = [];
  for (let i = Math.min(days, 14) - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    labels.push(d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }));
    data.push(f.filter((t) => t.date.startsWith(ds)).reduce((s, t) => s + t.total, 0));
  }
  const ctx1 = $("chart-revenue")?.getContext("2d");
  if (ctx1) {
    if (charts.rev) charts.rev.destroy();
    charts.rev = new Chart(ctx1, {
      type: "bar",
      data: { labels, datasets: [{ label: "Pendapatan", data, backgroundColor: "rgba(108,99,255,.7)", borderColor: "#6c63ff", borderWidth: 2, borderRadius: 6 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { color: tc, callback: (v) => "Rp" + v.toLocaleString("id-ID") }, grid: { color: gc } }, x: { ticks: { color: tc }, grid: { color: gc } } },
      },
    });
  }
  const pm = {};
  f.forEach((t) =>
    t.items.forEach((i) => {
      if (!pm[i.name]) pm[i.name] = { q: 0, r: 0 };
      pm[i.name].q += i.qty;
      pm[i.name].r += i.price * i.qty;
    }),
  );
  const top = Object.entries(pm)
    .sort((a, b) => b[1].q - a[1].q)
    .slice(0, 8);
  const ctx2 = $("chart-top")?.getContext("2d");
  if (ctx2) {
    if (charts.top) charts.top.destroy();
    charts.top = new Chart(ctx2, {
      type: "doughnut",
      data: { labels: top.map(([k]) => k), datasets: [{ data: top.map(([, v]) => v.q), backgroundColor: ["#6c63ff", "#a78bfa", "#34d399", "#fbbf24", "#60a5fa", "#f87171", "#fb923c", "#4ade80"], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "right", labels: { color: tc, boxWidth: 12, font: { size: 10 } } } } },
    });
  }
  if ($("top-tbody")) $("top-tbody").innerHTML = top.map(([n, v], i) => `<tr><td>${i + 1}</td><td>${n}</td><td>${v.q}</td><td class="text-green">${fRp(v.r)}</td></tr>`).join("");
}

/* ── STOCK ── */
function renderStock() {
  const q = ($("stock-search")?.value || "").toLowerCase(),
    filter = $("stock-filter")?.value || "all";
  const stock = ls("kp_stock") || {},
    body = $("stock-tbody");
  if (!body) return;
  body.innerHTML = "";
  const alerts = [];
  let idx = 0;
  categories.forEach((cat) =>
    cat.products.forEach((prod) => {
      idx++;
      const k = pKey(cat.id, prod.name),
        qty = stock[k] ?? 50,
        bc = String(idx).padStart(6, "0");
      if (qty <= 10 && qty > 0) alerts.push(prod.name);
      if (q && !prod.name.toLowerCase().includes(q)) return;
      if (filter === "low" && qty > 10) return;
      if (filter === "empty" && qty > 0) return;
      const st = qty === 0 ? '<span class="stock-status status-empty">Habis</span>' : qty <= 10 ? '<span class="stock-status status-low">Rendah</span>' : '<span class="stock-status status-ok">OK</span>';
      const price = getPrice(cat.id, prod.name);
      const tr = document.createElement("tr");
      tr.innerHTML = `<td class="barcode-text">${bc}</td><td>${prod.name}</td><td>${cat.name}</td><td>${fRp(price)}</td><td><input class="stock-input" type="number" min="0" value="${qty}" onchange="saveStockEdit('${k}',this.value)"/></td><td>${st}</td><td><button class="btn-xs btn-outline" onclick="openEditProductModal('${k}', '${cat.id}', '${prod.name.replace(/'/g, "\\'")}', ${price}, ${qty})">✏️</button> <button class="btn-xs btn-red" onclick="openDeleteConfirm('${k}', '${prod.name}')">✕</button></td>`;
      body.appendChild(tr);
    }),
  );
  const banner = $("stock-alerts-banner");
  if (banner) {
    if (alerts.length) {
      banner.style.display = "block";
      banner.textContent = "⚠️ Stok rendah: " + alerts.slice(0, 5).join(", ") + (alerts.length > 5 ? ` dan ${alerts.length - 5} lainnya` : "");
    } else banner.style.display = "none";
  }
}
function saveStockEdit(k, v) {
  const st = ls("kp_stock") || {};
  st[k] = Math.max(0, parseInt(v) || 0);
  lss("kp_stock", st);
  checkStockAlerts();
}
function addStock10(k) {
  const st = ls("kp_stock") || {};
  st[k] = (st[k] ?? 0) + 10;
  lss("kp_stock", st);
  renderStock();
}
function resetAllStock() {
  if (!confirm("Reset semua stok ke 50?")) return;
  const st = {};
  categories.forEach((cat) =>
    cat.products.forEach((p) => {
      st[pKey(cat.id, p.name)] = 50;
    }),
  );
  lss("kp_stock", st);
  renderStock();
  toast("Stok direset ke 50");
}
function checkStockAlerts() {
  const st = ls("kp_stock") || {},
    low = Object.values(st).filter((v) => v <= 10).length;
  const badge = $("stock-badge");
  if (badge) {
    badge.style.display = low ? "block" : "none";
    badge.textContent = low;
  }
  const mb = $("mnav-stock-badge");
  if (mb) {
    mb.style.display = low ? "block" : "none";
    mb.textContent = low;
  }
}

/* ── USERS ── */
function renderUsers() {
  const body = $("users-tbody");
  if (!body) return;
  body.innerHTML = (ls("kp_users") || [])
    .map(
      (u) =>
        `<tr><td>#${u.id}</td><td><b>${u.name}</b></td><td>${u.username}</td><td><span class="stock-status ${u.role === "admin" ? "status-ok" : "status-low"}">${u.role}</span></td><td>${u.id !== currentUser.id ? `<button class="btn-xs btn-red" onclick="deleteUser(${u.id})">Hapus</button>` : "-"}</td></tr>`,
    )
    .join("");
}
const openAddUser = () => openModal("modal-add-user");
function saveUser() {
  const name = ($("user-form-name")?.value || "").trim(),
    uname = ($("user-form-username")?.value || "").trim(),
    pass = $("user-form-password")?.value || "",
    role = $("user-form-role")?.value || "kasir";
  if (!name || !uname || !pass) {
    toast("Semua field wajib diisi", "error");
    return;
  }
  const us = ls("kp_users") || [];
  if (us.find((u) => u.username === uname)) {
    toast("Username sudah ada", "error");
    return;
  }
  us.push({ id: Date.now(), name, username: uname, password: pass, role });
  lss("kp_users", us);
  closeModal("modal-add-user");
  renderUsers();
  toast("Pengguna " + name + " ditambahkan");
}
function deleteUser(id) {
  if (!confirm("Hapus pengguna ini?")) return;
  lss(
    "kp_users",
    (ls("kp_users") || []).filter((u) => u.id !== id),
  );
  renderUsers();
}

/* ── PRODUCTS (CRUD) ── */
function populateCategoryDropdown() {
  const sel = $("pf-cat");
  if (!sel) return;
  sel.innerHTML = '<option value="">-- Pilih Kategori --</option>';
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.emoji + " " + cat.name;
    sel.appendChild(opt);
  });
}

function openAddProductModal() {
  populateCategoryDropdown();
  if ($("pf-name")) $("pf-name").value = "";
  if ($("pf-cat")) $("pf-cat").value = "";
  if ($("pf-price")) $("pf-price").value = "";
  if ($("pf-stock")) $("pf-stock").value = "50";
  if ($("pf-edit-key")) $("pf-edit-key").value = "";
  if ($("product-form-title")) $("product-form-title").textContent = "🏪 Tambah Produk";
  if ($("btn-save-product")) $("btn-save-product").textContent = "Simpan";
  openModal("modal-product-form");
}

function openEditProductModal(key, catId, name, price, qty) {
  populateCategoryDropdown();
  if ($("pf-name")) $("pf-name").value = name;
  if ($("pf-cat")) $("pf-cat").value = catId;
  if ($("pf-price")) $("pf-price").value = price;
  if ($("pf-stock")) $("pf-stock").value = qty;
  if ($("pf-edit-key")) $("pf-edit-key").value = key;
  if ($("product-form-title")) $("product-form-title").textContent = "✏️ Edit Produk";
  if ($("btn-save-product")) $("btn-save-product").textContent = "Update";
  openModal("modal-product-form");
  setTimeout(() => $("pf-name")?.focus(), 100);
}

function formatPriceInput(id) {
  const el = $(id);
  if (!el) return;
  const raw = el.value.replace(/[^0-9]/g, "");
  const num = parseInt(raw, 10);
  el.value = raw === "" ? "" : isNaN(num) ? "" : num.toLocaleString("id-ID");
}

function saveProduct() {
  const name = ($("pf-name")?.value || "").trim();
  const catId = $("pf-cat")?.value || "";
  const priceRaw = ($("pf-price")?.value || "").replace(/\./g, "");
  const price = parseInt(priceRaw) || 0;
  const qty = parseInt($("pf-stock")?.value) || 50;
  const editKey = $("pf-edit-key")?.value || "";

  if (!name || !catId || !price) {
    toast("Nama, kategori, dan harga wajib diisi", "error");
    return;
  }

  const cat = categories.find((c) => c.id === catId);
  if (!cat) {
    toast("Kategori tidak valid", "error");
    return;
  }

  const prices = ls("kp_prices") || {};
  const stock = ls("kp_stock") || {};

  if (editKey) {
    // EDIT mode: find product in ALL categories (in case category changed)
    let oldCat = null,
      oldProd = null,
      oldCatId = null;
    for (let category of categories) {
      const found = category.products.find((p) => pKey(category.id, p.name) === editKey);
      if (found) {
        oldCat = category;
        oldProd = found;
        oldCatId = category.id;
        break;
      }
    }

    if (oldProd) {
      // If user changed category, move product from old category to new one
      if (oldCatId !== catId) {
        // Remove from old category
        const oldIdx = oldCat.products.indexOf(oldProd);
        if (oldIdx >= 0) {
          oldCat.products.splice(oldIdx, 1);
        }
        // Add to new category
        cat.products.push({ name, price });
        // Delete old key from prices/stock
        delete prices[editKey];
        delete stock[editKey];
      } else {
        // Same category, just update name and price in place
        oldProd.name = name;
        oldProd.price = price;
        // Remove old key if name changed
        if (editKey !== pKey(catId, name)) {
          delete prices[editKey];
          delete stock[editKey];
        }
      }

      // Set new key for prices and stock
      prices[pKey(catId, name)] = price;
      stock[pKey(catId, name)] = qty;
    }
  } else {
    // ADD mode: check if product already exists
    if (cat.products.find((p) => p.name === name)) {
      toast("Produk sudah ada di kategori ini", "error");
      return;
    }
    cat.products.push({ name, price });
    const k = pKey(catId, name);
    prices[k] = price;
    stock[k] = qty;
  }

  lss("kp_prices", prices);
  lss("kp_stock", stock);
  saveCategoryToStorage(); // SAVE categories after edit/add
  closeModal("modal-product-form");
  renderStock();
  buildCategoryTabs();
  renderProducts();
  buildBCMap();
  toast(editKey ? "✏️ Produk diperbarui" : "✅ Produk ditambahkan");
}

function openAddCategoryModal() {
  if ($("cf-name")) $("cf-name").value = "";
  if ($("cf-emoji")) $("cf-emoji").value = "🛍️";
  openModal("modal-category-form");
  setTimeout(() => $("cf-name")?.focus(), 100);
}

function saveCategory() {
  const name = ($("cf-name")?.value || "").trim();
  const emoji = ($("cf-emoji")?.value || "🛍️").trim();

  if (!name) {
    toast("Nama kategori wajib diisi", "error");
    return;
  }

  if (categories.find((c) => c.name === name)) {
    toast("Kategori sudah ada", "error");
    return;
  }

  const newCatId = name.toLowerCase().replace(/\s+/g, "-");
  categories.push({
    id: newCatId,
    name: name,
    emoji: emoji,
    products: [],
  });

  saveCategoryToStorage(); // SAVE categories after add
  closeModal("modal-category-form");
  renderStock();
  buildCategoryTabs();
  buildBCMap();
  toast("✅ Kategori ditambahkan");
}

function openDeleteConfirm(key, productName) {
  if ($("delete-confirm-msg")) $("delete-confirm-msg").textContent = `Yakin hapus produk "${productName}"?`;
  const btn = $("btn-confirm-delete");
  if (btn) {
    btn.onclick = () => deleteProduct(key);
  }
  openModal("modal-delete-confirm");
}

function deleteProduct(key) {
  // Find and remove product from categories
  let found = false;
  for (let cat of categories) {
    const idx = cat.products.findIndex((p) => pKey(cat.id, p.name) === key);
    if (idx >= 0) {
      cat.products.splice(idx, 1);
      found = true;
      break;
    }
  }

  if (!found) {
    toast("Produk tidak ditemukan", "error");
    return;
  }

  // Clean up storage
  const prices = ls("kp_prices") || {};
  const stock = ls("kp_stock") || {};
  delete prices[key];
  delete stock[key];
  lss("kp_prices", prices);
  lss("kp_stock", stock);

  saveCategoryToStorage(); // Save after deletion

  closeModal("modal-delete-confirm");
  renderStock();
  buildCategoryTabs();
  renderProducts();
  buildBCMap();
  toast("🗑️ Produk dihapus");
}

/* ── PERSISTENCE: SAVE/LOAD CATEGORIES & PRODUCTS ── */
function saveCategoryToStorage() {
  lss("kp_categories", categories);
  console.log("✅ Categories saved to localStorage");
}

function loadCategoriesFromStorage() {
  const saved = ls("kp_categories");
  if (saved && Array.isArray(saved) && saved.length > 0) {
    // Clear and replace with saved data
    categories.length = 0;
    saved.forEach((cat) => categories.push(cat));
    console.log("🔄 Categories loaded from localStorage:", categories);
  }
}

/* ── SETTINGS ── */
function exportData() {
  const blob = new Blob([JSON.stringify({ version: 1, exportDate: new Date().toISOString(), transactions: ls("kp_tx") || [], stock: ls("kp_stock") || {}, prices: ls("kp_prices") || {}, users: ls("kp_users") || [] }, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "kasir-backup-" + new Date().toISOString().slice(0, 10) + ".json";
  a.click();
  toast("Data berhasil diexport");
}
function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = (ev) => {
    try {
      const d = JSON.parse(ev.target.result);
      if (d.transactions) lss("kp_tx", d.transactions);
      if (d.stock) lss("kp_stock", d.stock);
      if (d.prices) lss("kp_prices", d.prices);
      if (d.users) lss("kp_users", d.users);
      toast("Data diimport! Refresh untuk memuat ulang.");
    } catch {
      toast("File tidak valid", "error");
    }
  };
  r.readAsText(file);
}
function resetAllTransactions() {
  if (!confirm("Hapus SEMUA transaksi?")) return;
  lss("kp_tx", []);
  toast("Semua transaksi dihapus");
}
function renderPriceEditor() {
  const q = ($("price-search")?.value || "").toLowerCase(),
    c = $("price-editor-list"),
    prices = ls("kp_prices") || {};
  if (!c) return;
  c.innerHTML = "";
  categories.forEach((cat) =>
    cat.products.forEach((prod) => {
      if (q && !prod.name.toLowerCase().includes(q)) return;
      const k = pKey(cat.id, prod.name),
        price = prices[k] ?? prod.price,
        sid = "pe_" + k.replace(/\W/g, "_");
      const row = document.createElement("div");
      row.className = "price-edit-row";
      row.innerHTML = `<div class="price-edit-name">${prod.name}</div><input class="price-edit-input" id="${sid}" type="number" value="${price}"/><button class="price-save-btn" onclick="savePriceEdit('${k}','${sid}')">Simpan</button>`;
      c.appendChild(row);
    }),
  );
}
function savePriceEdit(k, sid) {
  const v = parseFloat($(sid)?.value) || 0;
  if (!v) {
    toast("Harga tidak valid", "error");
    return;
  }
  const p = ls("kp_prices") || {};
  p[k] = v;
  lss("kp_prices", p);
  renderProducts();
  toast("Harga disimpan");
}

/* ── BARCODE ── */
function openBarcodeScanner() {
  openModal("modal-barcode");
  setTimeout(() => $("barcode-input-field")?.focus(), 120);
}
function processBarcodeInput() {
  const input = ($("barcode-input-field")?.value || "").trim();
  if (!input) return;
  const prod = bcMap[input.padStart(6, "0")];
  if (!prod) {
    if ($("barcode-result")) $("barcode-result").innerHTML = '<span class="text-red">Produk tidak ditemukan</span>';
    return;
  }
  const price = getPrice(prod.catId, prod.name);
  addToCart(prod.catId, prod.name, price);
  if ($("barcode-result")) $("barcode-result").innerHTML = `<span class="text-green">✅ ${prod.name} – ${fRp(price)}</span>`;
  if ($("barcode-input-field")) {
    $("barcode-input-field").value = "";
    $("barcode-input-field").focus();
  }
}

/* ── INIT ── */
window.addEventListener("DOMContentLoaded", () => {
  const t = ls("kp_theme") || "dark";
  document.documentElement.setAttribute("data-theme", t);
  if ($("btn-theme")) $("btn-theme").textContent = t === "dark" ? "🌙" : "☀️";
  loadCategoriesFromStorage(); // Load saved categories before init
  initDefaults();
  buildBCMap();
  updateClock();
  setInterval(updateClock, 1000);

  // ── Bind ALL event listeners first (before any early return) ──
  $("login-username")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("login-password")?.focus();
  });
  $("login-password")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doLogin();
  });
  $("prod-search")?.addEventListener("input", renderProducts);
  $("barcode-input-field")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") processBarcodeInput();
  });
  $("price-search")?.addEventListener("input", renderPriceEditor);
  document.addEventListener("keydown", (e) => {
    if (e.key === "F2") {
      e.preventDefault();
      openBarcodeScanner();
    }
  });
  document.querySelectorAll(".modal-overlay").forEach((o) =>
    o.addEventListener("click", (e) => {
      if (e.target === o) o.classList.remove("open");
    }),
  );
  let touchY = 0;
  $("pos-cart")?.addEventListener(
    "touchstart",
    (e) => {
      touchY = e.touches[0].clientY;
    },
    { passive: true },
  );
  $("pos-cart")?.addEventListener(
    "touchend",
    (e) => {
      if (e.changedTouches[0].clientY - touchY > 80) closeMobileCart();
    },
    { passive: true },
  );

  // ── Auto-login (after listeners are ready) ──
  const uid = ls("kp_current");
  if (uid) {
    const u = (ls("kp_users") || []).find((x) => x.id === uid);
    if (u) {
      currentUser = u;
      startApp();
      return;
    }
  }
  $("login-screen").style.display = "flex";
});

/* ── MOBILE CART ── */
function toggleMobileCart() {
  const cart = $("pos-cart"),
    overlay = $("cart-overlay");
  if (!cart) return;
  const isOpen = cart.classList.contains("mobile-open");
  if (isOpen) {
    closeMobileCart();
  } else {
    cart.classList.add("mobile-open");
    if (overlay) overlay.classList.add("active");
  }
}
function closeMobileCart() {
  $("pos-cart")?.classList.remove("mobile-open");
  $("cart-overlay")?.classList.remove("active");
}
function updateMobileFAB() {
  const keys = Object.keys(cart),
    fab = $("cart-fab"),
    badge = $("cart-fab-badge");
  if (!fab) return;
  const isMobile = window.innerWidth <= 768;
  if (isMobile && keys.length > 0) {
    fab.style.display = "flex";
    const total = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
    if (badge) badge.textContent = keys.length + " item · " + fRp(total);
  } else {
    fab.style.display = "none";
  }
}
function mobileNav(id) {
  closeMobileCart();
  showPage(id);
  document.querySelectorAll(".mobile-nav-item").forEach((b) => b.classList.remove("active"));
  $("mnav-" + id)?.classList.add("active");
  // fallback for pages not in bottom nav (members, promos, users)
  if (!$("mnav-" + id)) $("mnav-settings")?.classList.add("active");
}

/* mobile badge + FAB are now called directly inside renderCart() and checkStockAlerts() */

window.addEventListener("resize", updateMobileFAB);
