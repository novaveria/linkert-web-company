/* =========================================================
   Linkert — script.js (dipakai index.html, pricing.html,
   nfc-business-card.html)
   ========================================================= */

/* ---------- PENGATURAN — ubah di sini ---------- */
const CONFIG = {
  // Sembunyikan section yang datanya belum asli (ubah ke false)
  // Strip logo mitra (index & pricing). Nyalakan (true) setelah ada logo
  // komunitas asli yang sudah memberi izin; jangan isi dengan logo karangan.
  showPartners: false,
  showReviews: true,       // ulasan (halaman produk)

  // Nomor WhatsApp Linkert, format internasional tanpa "+", contoh "6281234567890".
  // Kosong = tombol "Buka WhatsApp" disembunyikan, pemesan hanya bisa menyalin pesan.
  whatsappNumber: "",

  // Harga dalam rupiah. null = "Harga menyusul", "custom" = harga sesuai kebutuhan.
  prices: {
    personal: null,
    community: null,
    access: "custom",
    "nfc-business-card": null,
    "kartu-member": null,
    "desain-custom": null,
    "kartu-premium": null,
    "kartu-bentuk": null
  },
  priceUnits: {
    personal: "per kartu",
    community: "per anggota",
    "nfc-business-card": "per kartu",
    "kartu-member": "per anggota",
    "desain-custom": "per desain",
    "kartu-premium": "per kartu",
    "kartu-bentuk": "per kartu"
  }
};

const PLANS = { personal: "Personal", community: "Community", access: "Access" };
const PRODUCTS = {
  "nfc-business-card": "Kartu NFC Business Card",
  "kartu-member": "Kartu Member Komunitas",
  "desain-custom": "Desain Kartu Custom"
};

/* ---------- posisi scroll saat pindah halaman ----------
   Browser biasanya memulihkan posisi scroll lama (reload / tombol Back),
   sehingga halaman terbuka di section bawah. Tanpa #anchor di URL,
   halaman selalu dibuka dari paling atas. */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("pageshow", () => {
  if (!location.hash) window.scrollTo({ top: 0, behavior: "instant" });
});

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  renderPrices();
  initMobileMenu();
  initMarquee();
  initFaq();
  initToasts();
  initFooter();
  initOrderForm();
  initGallery();
  initProductOptions();
});

/* ---------- section yang bisa disembunyikan ---------- */
function applyConfig() {
  const hide = (id) => document.getElementById(id)?.classList.add("is-hidden");
  if (!CONFIG.showPartners) hide("partners");
  if (!CONFIG.showReviews) hide("ulasan");
}

/* ---------- harga ---------- */
function formatPrice(key) {
  const value = CONFIG.prices[key];
  if (value === "custom") return { main: "Custom", unit: "Sesuai kebutuhan" };
  if (typeof value === "number") {
    return { main: "Rp " + value.toLocaleString("id-ID"), unit: CONFIG.priceUnits[key] || "" };
  }
  return { main: "Rp —", unit: "Harga menyusul" };
}

function renderPrices() {
  document.querySelectorAll("[data-price]").forEach((el) => {
    const { main, unit } = formatPrice(el.dataset.price);
    const strong = el.querySelector("strong");
    const span = el.querySelector("span");
    if (strong) strong.textContent = main;
    if (span) span.textContent = unit;
  });
}

/* ---------- menu mobile ---------- */
function initMobileMenu() {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("navMenu");
  if (!burger || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  };

  burger.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
}

/* ---------- strip logo bergerak ---------- */
function initMarquee() {
  const track = document.getElementById("marqueeTrack");
  if (!track) return;
  Array.from(track.children).forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
}

/* ---------- akordeon (FAQ & detail produk) ---------- */
function initFaq() {
  const items = document.querySelectorAll(".faq__item");
  items.forEach((item) => {
    const q = item.querySelector(".faq__q");
    if (item.classList.contains("is-open")) q.setAttribute("aria-expanded", "true");
    q.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      items.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        item.classList.add("is-open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ---------- pesan singkat ---------- */
function initToasts() {
  document.querySelectorAll(".js-save").forEach((btn) =>
    btn.addEventListener("click", () =>
      showToast("Contoh saja. Di kartu asli, kontak tersimpan langsung ke ponsel penerima.")
    )
  );
  document.querySelectorAll(".js-video").forEach((btn) =>
    btn.addEventListener("click", () => showToast("Video belum tersedia."))
  );
  // tautan yang belum punya tujuan (dicek saat diklik)
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a && a.getAttribute("href") === "#") {
      e.preventDefault();
      showToast("Halaman ini sedang disiapkan.");
    }
  });
}

let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-show"), 2600);
}

/* ---------- footer ---------- */
function initFooter() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const lang = document.getElementById("langSelect");
  lang?.addEventListener("change", () => {
    if (lang.value === "en") {
      showToast("Versi English belum tersedia.");
      lang.value = "id";
    }
  });
}

/* =========================================================
   FORM PESAN (index.html#pesan)
   Bisa diisi otomatis lewat URL:
   index.html?paket=community&produk=kartu-member&warna=Hitam&jumlah=20#pesan
   ========================================================= */
function initOrderForm() {
  const form = document.getElementById("orderForm");
  if (!form) return;

  const f = form.elements;
  const komField = document.getElementById("komunitasField");
  const errorEl = document.getElementById("orderError");
  const done = document.getElementById("orderDone");

  const setPlan = (plan) => {
    if (!PLANS[plan]) return;
    form.querySelector(`input[name="paket"][value="${plan}"]`).checked = true;
    if (plan !== "personal" && f.produk.value === "nfc-business-card") f.produk.value = "kartu-member";
    syncPlan();
  };
  const syncPlan = () => { komField.hidden = f.paket.value === "personal"; };

  form.querySelectorAll('input[name="paket"]').forEach((r) => r.addEventListener("change", syncPlan));

  // tombol "Pesan ..." di halaman ini memilih paketnya
  document.querySelectorAll("[data-plan]").forEach((el) =>
    el.addEventListener("click", () => setPlan(el.dataset.plan))
  );

  // isi otomatis dari URL (dari halaman produk & pricing)
  const q = new URLSearchParams(location.search);
  if (q.get("paket")) setPlan(q.get("paket"));
  if (PRODUCTS[q.get("produk")]) f.produk.value = q.get("produk");
  if (q.get("warna") && [...f.warna.options].some((o) => o.value === q.get("warna"))) f.warna.value = q.get("warna");
  if (Number(q.get("jumlah")) >= 1) f.jumlah.value = Math.min(999, Math.floor(Number(q.get("jumlah"))));
  syncPlan();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));

    const problems = [];
    const nama = f.nama.value.trim();
    const wa = f.wa.value.replace(/[\s.-]/g, "");
    const jumlah = Number(f.jumlah.value);
    const komunitas = f.komunitas.value.trim();

    if (nama.length < 2) problems.push([f.nama, "Isi nama lengkapmu."]);
    if (!/^(\+62|62|0)8\d{7,12}$/.test(wa)) problems.push([f.wa, "Nomor WhatsApp belum benar. Contoh: 081234567890."]);
    if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 999) problems.push([f.jumlah, "Jumlah kartu antara 1 dan 999."]);
    if (!komField.hidden && komunitas.length < 2) problems.push([f.komunitas, "Isi nama komunitas atau organisasimu."]);

    if (problems.length) {
      problems.forEach(([el]) => el.setAttribute("aria-invalid", "true"));
      errorEl.textContent = problems[0][1];
      problems[0][0].focus();
      done.hidden = true;
      return;
    }
    errorEl.textContent = "";

    const lines = [
      "Halo Linkert, saya mau pesan kartu.",
      `Paket: ${PLANS[f.paket.value]}`,
      `Produk: ${PRODUCTS[f.produk.value]}`,
      `Warna: ${f.warna.value}`,
      `Jumlah: ${jumlah}`,
      `Nama: ${nama}`,
      `WhatsApp: ${wa}`
    ];
    if (!komField.hidden) lines.push(`Komunitas: ${komunitas}`);
    if (f.catatan.value.trim()) lines.push(`Catatan: ${f.catatan.value.trim()}`);
    const message = lines.join("\n");

    document.getElementById("orderMessage").textContent = message;
    const waLink = document.getElementById("orderWa");
    const doneText = document.getElementById("orderDoneText");
    if (CONFIG.whatsappNumber) {
      waLink.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
      waLink.hidden = false;
      doneText.textContent = "Lanjutkan ke WhatsApp untuk mengirim pesan ini ke tim Linkert.";
    } else {
      waLink.hidden = true;
      doneText.textContent = "Nomor WhatsApp Linkert belum diatur. Salin pesan ini untuk dikirim ke tim Linkert.";
    }
    done.hidden = false;
    done.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  document.getElementById("orderCopy")?.addEventListener("click", () => {
    const text = document.getElementById("orderMessage").textContent;
    navigator.clipboard?.writeText(text)
      .then(() => showToast("Pesan disalin."))
      .catch(() => showToast("Tidak bisa menyalin otomatis. Blok teksnya lalu salin manual."));
  });
}

/* =========================================================
   HALAMAN PRODUK — galeri foto
   Saat foto asli siap: ganti isi tiap .ph dengan <img>, lalu
   isi data-src pada tombol thumbnail dengan alamat gambarnya.
   ========================================================= */
function initGallery() {
  const main = document.getElementById("galleryMain");
  const thumbs = document.querySelectorAll("#thumbs button");
  if (!main || !thumbs.length) return;

  let index = 0;
  const show = (i) => {
    index = (i + thumbs.length) % thumbs.length;
    const t = thumbs[index];
    main.innerHTML = t.dataset.src
      ? `<img src="${t.dataset.src}" alt="${t.dataset.label}">`
      : `<span>${t.dataset.id}</span><small>${t.dataset.label} · 1200 × 900</small>`;
    thumbs.forEach((b, n) => b.setAttribute("aria-current", String(n === index)));
  };

  thumbs.forEach((t, i) => t.addEventListener("click", () => show(i)));
  document.getElementById("galleryPrev")?.addEventListener("click", () => show(index - 1));
  document.getElementById("galleryNext")?.addEventListener("click", () => show(index + 1));
  main.parentElement.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  show(0); // tampilkan foto pertama saat halaman dibuka
}

/* ---------- HALAMAN PRODUK — warna, jumlah, tombol Pesan ---------- */
function initProductOptions() {
  const swatches = document.querySelectorAll(".swatch");
  const colorName = document.getElementById("colorName");
  const qty = document.getElementById("qty");
  const orderNow = document.getElementById("orderNow");
  if (!orderNow) return;

  let color = document.querySelector('.swatch[aria-checked="true"]')?.dataset.name || "Hitam";

  const updateLink = () => {
    const params = new URLSearchParams({
      paket: "personal",
      produk: orderNow.dataset.product,
      warna: color,
      jumlah: qty.value
    });
    orderNow.href = `index.html?${params.toString()}#pesan`;
  };

  swatches.forEach((s) =>
    s.addEventListener("click", () => {
      swatches.forEach((o) => o.setAttribute("aria-checked", "false"));
      s.setAttribute("aria-checked", "true");
      color = s.dataset.name;
      colorName.textContent = color;
      updateLink();
    })
  );

  const clamp = () => {
    const n = Math.floor(Number(qty.value));
    qty.value = Number.isFinite(n) ? Math.min(999, Math.max(1, n)) : 1;
    updateLink();
  };
  document.querySelectorAll("[data-step]").forEach((b) =>
    b.addEventListener("click", () => {
      qty.value = Number(qty.value) + Number(b.dataset.step);
      clamp();
    })
  );
  qty.addEventListener("change", clamp);
  updateLink();
}
