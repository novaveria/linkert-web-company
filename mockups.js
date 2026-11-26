/* =========================================================
   Linkert — mockups.js
   Ilustrasi HTML/CSS (gaya di mockups.css) yang menggantikan
   tiga gambar di index.html. Isi mockup diambil dari data di
   bawah, jadi tinggal ganti datanya.

     IMG-11  <div class="mk-solo" data-mockup="qr-phone"></div>
     IMG-13  <div class="mk" data-mockup="profile"></div>
     IMG-14  <div class="mk" data-mockup="lost-flow"></div>
   ========================================================= */

const MOCKUP_DATA = {
    person: { name: "Alya Rahma", role: "UI/UX Designer", org: "Universitas Indonesia", photo: null },
    links: [
      { type: "instagram", label: "Instagram" },
      { type: "linkedin", label: "LinkedIn" },
      { type: "tiktok", label: "TikTok" },
      { type: "portfolio", label: "Portofolio" },
      { type: "github", label: "GitHub" },
      { type: "whatsapp", label: "WhatsApp" }
    ],
    portfolioCount: 12,
    host: "linkert.id",
    slug: "alya-rahma",
    newSlug: "alya-rahma-2",
    cardId: "LK-0042",
    times: ["09.30", "09.32", "09.45"]
};

/* ---------- ikon (garis sederhana, bukan logo merek) ---------- */
const MK_ICONS = {
  instagram: '<path d="M4 8.5h3l1.8-2.5h6.4L17 8.5h3v10.5H4z"/><circle cx="12" cy="13.5" r="3.4"/>',
  linkedin: '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5V5.5h6v2M3.5 12.5h17"/>',
  tiktok: '<path d="M9 18V5.5l10-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  portfolio: '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
  github: '<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5"/>',
  whatsapp: '<path d="M5 19l1.3-3.7A7.6 7.6 0 1 1 9.6 18.4z"/>',
  email: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5"/>',
  website: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.5 3.4 5.4 3.4 8.5s-1 6-3.4 8.5c-2.4-2.5-3.4-5.4-3.4-8.5s1-6 3.4-8.5z"/>',
  youtube: '<rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 10.5l6-3.5v10l-6-3.5"/>',
  nfc: '<path d="M6.5 9a5 5 0 0 1 0 6M10 6.5a9 9 0 0 1 0 11M13.5 4a13 13 0 0 1 0 16M17 2.5a16 16 0 0 1 0 19"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  stack: '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M7 5h10M9 2.5h6"/>'
};
const MK_TILE_COLORS = ["#8C6D31", "#1F1A12", "#C0573E", "#5B7A5A", "#3E6A8A", "#B08D45"];

/* ---------- alat bantu ---------- */
function mkEl(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}
function mkIcon(name) {
  const span = mkEl("span", "mk-ico");
  span.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${MK_ICONS[name] || MK_ICONS.link}</svg>`;
  return span;
}

/* Inisial dari huruf (grapheme) pertama kata depan dan kata terakhir,
   melewati gelar seperti Jr, II, III. */
function mkInitials(name) {
  // gelar di belakang nama: Jr, Sr, II, III, IV, S.Kom, M.Sc, dsb.
  const SUFFIX = /^(jr|sr|ii|iii|iv)\.?$|^[sm]\.[\w.]+$/i;
  const words = name.trim().split(/\s+/).filter(Boolean);
  const core = words.length > 1 ? words.filter((w, i) => i === 0 || !SUFFIX.test(w.replace(/,$/, ""))) : words;
  const first = (w) => {
    if (!w) return "";
    if (window.Intl && Intl.Segmenter) {
      const it = new Intl.Segmenter("id", { granularity: "grapheme" }).segment(w)[Symbol.iterator]();
      return it.next().value?.segment || "";
    }
    return Array.from(w)[0] || "";
  };
  const a = first(core[0]);
  const b = core.length > 1 ? first(core[core.length - 1]) : "";
  return (a + b).toLocaleUpperCase("id");
}

/* URL dipotong di tengah: awal boleh terpotong, akhir selalu terlihat,
   karena tautan lama dan baru berbeda di ujungnya. */
function mkUrl(host, slug, variant) {
  const full = `${host}/${slug}`;
  const tail = Math.min(7, slug.length);
  const pill = mkEl("span", "mk-url" + (variant ? ` mk-url--${variant}` : ""));
  pill.title = full;
  pill.append(mkEl("span", "mk-url__start", full.slice(0, full.length - tail)), mkEl("span", "mk-url__end", full.slice(-tail)));
  return pill;
}

/* QR dekoratif yang selalu sama untuk teks yang sama.
   Ini ilustrasi, bukan QR yang bisa dipindai. */
function mkQr(text) {
  let h = 2166136261;
  for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
  const rand = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
  const N = 25;
  const inFinder = (x, y) => [[0, 0], [N - 7, 0], [0, N - 7]].some(([fx, fy]) => x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7);
  let d = "";
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (!inFinder(x, y) && rand() > 0.52) d += `M${x} ${y}h1v1h-1z`;
  }
  const finder = ([fx, fy]) => `<path d="M${fx} ${fy}h7v7h-7zM${fx + 1} ${fy + 1}v5h5v-5z" fill-rule="evenodd"/><rect x="${fx + 2}" y="${fy + 2}" width="3" height="3"/>`;
  const box = mkEl("span", "mk-qr");
  box.innerHTML = `<svg viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" aria-hidden="true"><path d="${d}"/>${[[0, 0], [N - 7, 0], [0, N - 7]].map(finder).join("")}</svg>`;
  return box;
}

function mkPhone(parent) {
  const phone = mkEl("div", "mk-phone");
  const screen = mkEl("div", "mk-screen");
  const status = mkEl("div", "mk-status");
  const icons = mkEl("span", "mk-status__icons");
  icons.append(mkEl("i", "mk-sig"), mkEl("i", "mk-bat"));
  status.append(mkEl("span", null, "09.41"), icons);
  screen.append(mkEl("span", "mk-island"), status);
  phone.append(screen);
  parent.append(phone);
  return screen;
}

function mkAvatar(person) {
  const av = mkEl("div", "mk-avatar");
  const fallback = () => { av.textContent = mkInitials(person.name); };
  if (person.photo) {
    const img = new Image();
    img.alt = "";
    img.onerror = () => { img.remove(); fallback(); };
    img.src = person.photo;
    av.append(img);
  } else {
    fallback();
  }
  return av;
}

/* =========================================================
   1. PROFIL DI PONSEL + IKON SOSIAL
   ========================================================= */
function renderProfile(root, d) {
  const p = d.person;
  root.replaceChildren();
  root.classList.add("mk", "mk--profile");
  root.setAttribute("role", "img");
  root.setAttribute("aria-label", `Ilustrasi profil Linkert milik ${p.name} di ponsel, dengan ${d.links.length} tautan sosial`);

  const screen = mkPhone(root);
  screen.append(mkEl("div", "mk-cover"));

  const prof = mkEl("div", "mk-profile");
  prof.append(mkAvatar(p));
  const name = mkEl("p", "mk-name", p.name);
  name.title = p.name;
  prof.append(name);
  if (p.role) { const r = mkEl("p", "mk-role", p.role); r.title = p.role; prof.append(r); }
  if (p.org) { const o = mkEl("p", "mk-org", p.org); o.title = p.org; prof.append(o); }
  prof.append(mkEl("span", "mk-save", "Simpan kontak"));

  if (d.links.length) {
    const grid = mkEl("div", "mk-links");
    const MAX = 6;
    const shown = d.links.length > MAX ? d.links.slice(0, MAX - 1) : d.links;
    shown.forEach((l, i) => {
      const tile = mkEl("span", "mk-link");
      const ico = mkIcon(l.type);
      ico.classList.add("mk-link__icon");
      ico.style.setProperty("--c", MK_TILE_COLORS[i % MK_TILE_COLORS.length]);
      const label = mkEl("span", "mk-link__label", l.label);
      label.title = l.label;
      tile.append(ico, label);
      grid.append(tile);
    });
    if (d.links.length > MAX) {
      const more = mkEl("span", "mk-link mk-link--more");
      const rest = d.links.length - (MAX - 1);
      const box = mkEl("span", "mk-ico mk-link__icon", `+${rest}`);
      more.append(box, mkEl("span", "mk-link__label", "lainnya"));
      grid.append(more);
    }
    prof.append(grid);
  }
  screen.append(prof);

  // kaca melayang di luar ponsel
  if (d.portfolioCount > 0) {
    const chip = mkEl("div", "mk-chip mk-chip--l");
    const t = mkEl("span", "mk-chip__text");
    t.append(
      mkEl("strong", null, `${d.portfolioCount.toLocaleString("id-ID")} karya`),
      mkEl("small", null, "di portofolio")
    );
    const ico = mkIcon("stack"); ico.classList.add("mk-chip__icon");
    chip.append(ico, t);
    root.append(chip);
  }
  const nfc = mkEl("div", "mk-chip mk-chip--r");
  const nt = mkEl("span", "mk-chip__text");
  nt.append(mkEl("strong", null, "Dibuka lewat NFC"), mkEl("small", null, "tanpa aplikasi"));
  const ni = mkIcon("nfc"); ni.classList.add("mk-chip__icon");
  nfc.append(ni, nt);
  root.append(nfc);
}

/* =========================================================
   2. ALUR TIGA LANGKAH SAAT KARTU HILANG
   ========================================================= */
function renderLostFlow(root, d) {
  root.replaceChildren();
  root.classList.add("mk", "mk--flow");
  root.setAttribute("role", "img");
  root.setAttribute("aria-label", `Ilustrasi alur kartu hilang: laporan diterima, tautan lama ${d.host}/${d.slug} dinonaktifkan, kartu baru dengan tautan ${d.host}/${d.newSlug} dikirim`);

  const flow = mkEl("ol", "mk-flow");
  const step = (n, mod, title, detail, time) => {
    const li = mkEl("li", `mk-step mk-step--${mod}`);
    const body = mkEl("div", "mk-step__body");
    body.append(mkEl("strong", "mk-step__title", title), detail);
    li.append(mkEl("span", "mk-step__num", String(n)), body, mkEl("span", "mk-step__time", time));
    return li;
  };

  const d1 = mkEl("span", "mk-step__detail");
  d1.append("Kartu ", mkEl("b", "mk-mono", d.cardId), " dilaporkan hilang");

  const d2 = mkEl("span", "mk-step__row");
  d2.append(mkUrl(d.host, d.slug, "off"), mkEl("span", "mk-badge mk-badge--off", "Nonaktif"));

  const d3 = mkEl("span", "mk-step__row");
  d3.append(mkUrl(d.host, d.newSlug, "ok"), mkEl("span", "mk-badge mk-badge--ok", "Aktif"));

  flow.append(
    step(1, "info", "Laporan diterima", d1, d.times[0]),
    step(2, "off", "Tautan lama dinonaktifkan", d2, d.times[1]),
    step(3, "ok", "Kartu baru dikirim", d3, d.times[2])
  );
  root.append(flow);
}

/* =========================================================
   3. PONSEL MEMINDAI QR
   ========================================================= */
function renderQrPhone(root, d) {
  root.replaceChildren();
  root.classList.add("mk-solo");
  root.setAttribute("role", "img");
  root.setAttribute("aria-label", `Ilustrasi kamera ponsel memindai QR kartu Linkert dan menampilkan tautan ${d.host}/${d.slug}`);

  const screen = mkPhone(root);
  screen.classList.add("mk-screen--dark");
  const cam = mkEl("div", "mk-cam");
  const card = mkEl("div", "mk-cam__card");
  card.append(mkQr(`${d.host}/${d.slug}`));
  const frame = mkEl("div", "mk-cam__frame");
  for (let i = 0; i < 4; i++) frame.append(mkEl("i"));
  const pill = mkEl("div", "mk-cam__pill");
  const pi = mkIcon("link"); pi.classList.add("mk-cam__pill-ico");
  const pt = mkEl("span", "mk-cam__pill-text");
  pt.append(mkEl("small", null, "Buka di browser"), mkUrl(d.host, d.slug, "bare"));
  pill.append(pi, pt);
  const modes = mkEl("div", "mk-cam__modes");
  modes.append(mkEl("span", null, "VIDEO"), mkEl("span", "is-on", "FOTO"), mkEl("span", null, "POTRET"));
  cam.append(card, frame, pill, modes, mkEl("span", "mk-cam__shutter"));
  screen.append(cam);
}

/* ---------- render ---------- */
const MOCKUP_RENDERERS = {
  "qr-phone": renderQrPhone,   // IMG-11
  "profile": renderProfile,    // IMG-13
  "lost-flow": renderLostFlow  // IMG-14
};

function renderMockups() {
  document.querySelectorAll("[data-mockup]").forEach((node) => {
    const render = MOCKUP_RENDERERS[node.dataset.mockup];
    if (render) render(node, MOCKUP_DATA);
  });
}

document.addEventListener("DOMContentLoaded", renderMockups);
