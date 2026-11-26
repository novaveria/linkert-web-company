/* =========================================================
   Linkert — generator ilustrasi
   Membuat semua ilustrasi SVG di img/gen/.
   Jalankan dari folder linkert-web-company:

       node tools/generate-images.js

   Warna diambil dari logo (emas champagne). Ubah objek C di
   bawah lalu jalankan ulang untuk mengganti warna semua gambar.
   ========================================================= */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "img", "gen");
fs.mkdirSync(OUT, { recursive: true });

const LOGO = "data:image/png;base64," + fs.readFileSync(path.join(ROOT, "img", "logo 140x40.png")).toString("base64");
const LOGO_RATIO = 50 / 111; // tinggi / lebar logo

const C = {
  ink: "#1F1A12", muted: "#6B6253", line: "#E7DFCF",
  bg: "#FBF8F1", tint: "#F4EEE1", surface: "#FFFFFF", cream: "#F7F1E3",
  gold: "#8C6D31", goldMid: "#B8975A", goldLight: "#E3D2A8",
  ok: "#2E7D4F", off: "#B54A3A",
  night: "#241F16", night2: "#2F291F"
};
const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

/* ---------- alat bantu ---------- */
let uid = 0;
const id = (p) => `${p}${++uid}`;

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
  `<defs>` +
  `<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8D8B0"/><stop offset="1" stop-color="#A08958"/></linearGradient>` +
  `<linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1F4FD8"/><stop offset=".35" stop-color="#F2B705"/><stop offset=".7" stop-color="#E2475B"/><stop offset="1" stop-color="#1FA37A"/></linearGradient>` +
  `<filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#1F1A12" flood-opacity=".16"/></filter>` +
  `</defs>${body}</svg>`;

const t = (x, y, size, str, o = {}) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${o.w || 400}" fill="${o.c || C.ink}"` +
  `${o.a ? ` text-anchor="${o.a}"` : ""}${o.ls ? ` letter-spacing="${o.ls}"` : ""}${o.op ? ` opacity="${o.op}"` : ""}>${str}</text>`;

const r = (x, y, w, h, rx, fill, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;

const logo = (x, y, w, op = 1) =>
  `<image href="${LOGO}" x="${x}" y="${y}" width="${w}" height="${(w * LOGO_RATIO).toFixed(1)}"${op < 1 ? ` opacity="${op}"` : ""}/>`;

const nfc = (x, y, s, color) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round">` +
  `<path d="M6.5 9a5 5 0 0 1 0 6M10 6.5a9 9 0 0 1 0 11M13.5 4a13 13 0 0 1 0 16"/></g>`;

const check = (cx, cy, s, color = "#fff") =>
  `<path d="M${cx - s * 0.45} ${cy}l${s * 0.3} ${s * 0.3} ${s * 0.6}-${s * 0.6}" fill="none" stroke="${color}" stroke-width="${s * 0.22}" stroke-linecap="round" stroke-linejoin="round"/>`;

const scene = (w, h, color = C.tint) =>
  r(0, 0, w, h, 0, color) +
  `<circle cx="${w * 0.85}" cy="${h * 0.12}" r="${h * 0.4}" fill="${C.goldMid}" opacity=".10"/>` +
  `<circle cx="${w * 0.08}" cy="${h * 0.95}" r="${h * 0.3}" fill="${C.goldMid}" opacity=".08"/>`;

/* kartu NFC, digambar dari titik (0,0) */
function card(w, h, o = {}) {
  const g = id("cg");
  const fill = o.fill || C.ink;
  const text = o.text || "#F3EAD3";
  let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${fill}"/><stop offset="1" stop-color="${o.fill2 || fill}"/></linearGradient></defs>`;
  s += r(0, 0, w, h, h * 0.08, o.paint || `url(#${g})`, o.stroke ? `stroke="${o.stroke}"` : "");
  s += logo(w * 0.07, h * 0.1, w * 0.28);
  s += nfc(w - h * 0.3, h * 0.1, h * 0.0085, text);
  if (o.tag) {
    const tw = o.tag.length * h * 0.045 + h * 0.12;
    s += r(w - h * 0.36 - tw, h * 0.12, tw, h * 0.13, h * 0.065, "none", `stroke="${text}" stroke-opacity=".6"`);
    s += t(w - h * 0.36 - tw / 2, h * 0.215, h * 0.07, o.tag, { a: "middle", w: 700, c: text, ls: 1 });
  }
  if (o.name) s += t(w * 0.07, h * 0.78, h * 0.1, o.name, { w: 700, c: text });
  if (o.sub) s += t(w * 0.07, h * 0.89, h * 0.065, o.sub, { c: text, op: 0.7 });
  return s;
}

/* ponsel; isi digambar oleh fungsi content(lebarLayar, tinggiLayar) */
function phone(x, y, w, h, content, dark = false) {
  const clip = id("pc");
  const b = Math.round(w * 0.05);
  const sx = x + b, sy = y + b, sw = w - 2 * b, sh = h - 2 * b, rr = Math.round(w * 0.16);
  return (
    `<g filter="url(#sh)">${r(x, y, w, h, rr, "#1B1712")}</g>` +
    `<clipPath id="${clip}">${r(sx, sy, sw, sh, rr - b, "#000")}</clipPath>` +
    `<g clip-path="url(#${clip})">${r(sx, sy, sw, sh, 0, dark ? "#16130E" : C.surface)}` +
    `<g transform="translate(${sx} ${sy})">${content(sw, sh)}</g></g>` +
    r(x + w / 2 - w * 0.14, sy + 4, w * 0.28, Math.max(6, w * 0.05), 99, "#0B0906")
  );
}

/* halaman profil kecil di dalam layar ponsel */
function miniProfile(w, h, p) {
  const cy = h * 0.22, ar = w * 0.16;
  let s = r(0, 0, w, cy, 0, "url(#gold)");
  s += `<circle cx="${w / 2}" cy="${cy}" r="${ar + 3}" fill="${C.surface}"/><circle cx="${w / 2}" cy="${cy}" r="${ar}" fill="${p.color || C.ink}"/>`;
  s += t(w / 2, cy + ar * 0.33, ar * 0.85, p.initials, { a: "middle", w: 700, c: "#fff" });
  let y = cy + ar + w * 0.13;
  s += t(w / 2, y, w * 0.095, p.name, { a: "middle", w: 700 });
  y += w * 0.085;
  s += t(w / 2, y, w * 0.065, p.role, { a: "middle", c: C.muted });
  y += w * 0.07;
  s += r(w * 0.12, y, w * 0.76, w * 0.13, w * 0.04, C.gold);
  s += t(w / 2, y + w * 0.087, w * 0.062, "Simpan kontak", { a: "middle", w: 700, c: "#fff" });
  y += w * 0.21;
  const cols = ["#8C6D31", "#1F1A12", "#C0573E", "#5B7A5A", "#3E6A8A", "#B08D45"];
  const ts = w * 0.18, gap = (w * 0.76 - 3 * ts) / 2;
  for (let i = 0; i < 6; i++) {
    const cx = w * 0.12 + (i % 3) * (ts + gap), yy = y + Math.floor(i / 3) * (ts + w * 0.08);
    if (yy + ts > h - 4) continue;
    s += r(cx, yy, ts, ts, ts * 0.28, cols[i]);
    s += `<circle cx="${cx + ts / 2}" cy="${yy + ts / 2}" r="${ts * 0.2}" fill="none" stroke="#fff" stroke-width="${ts * 0.07}"/>`;
  }
  return s;
}

/* ---------- 1. avatar ilustrasi (IMG-02 s.d. IMG-07, IMG-10) ---------- */
function avatar(o) {
  const W = 280, g = id("ag");
  let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.bg1}"/><stop offset="1" stop-color="${o.bg2}"/></linearGradient></defs>`;
  s += r(0, 0, W, W, 0, `url(#${g})`);
  s += `<circle cx="232" cy="48" r="72" fill="#fff" opacity=".14"/><circle cx="28" cy="252" r="62" fill="#fff" opacity=".08"/>`;
  if (o.style === "long") s += `<path d="M82 132C82 72 110 54 140 54s58 18 58 78l4 80H78z" fill="${o.hair}"/>`;
  s += r(121, 150, 38, 50, 12, o.shade);
  s += `<path d="M36 280c0-62 44-92 104-92s104 30 104 92z" fill="${o.shirt}"/>`;
  let eyeY = 128;
  if (o.style === "hijab") {
    s += `<path d="M76 138c0-60 28-86 64-86s64 26 64 86c0 42-16 68-64 86-48-18-64-44-64-86z" fill="${o.hair}"/>`;
    s += `<path d="M58 280c4-42 32-72 82-74 50 2 78 32 82 74z" fill="${o.hair}"/>`;
    s += `<circle cx="140" cy="132" r="42" fill="${o.skin}"/>`;
    eyeY = 130;
  } else {
    s += `<circle cx="140" cy="124" r="50" fill="${o.skin}"/>`;
    if (o.style === "side") {
      // belah samping
      s += `<path d="M89 122c-6-46 20-70 52-70 34 0 58 22 51 70-6-20-16-32-30-38-16 10-44 14-73 38z" fill="${o.hair}"/>`;
    } else if (o.style === "curly") {
      // rambut ikal
      s += `<g fill="${o.hair}"><circle cx="100" cy="98" r="16"/><circle cx="120" cy="80" r="18"/><circle cx="142" cy="74" r="18"/><circle cx="164" cy="80" r="18"/><circle cx="182" cy="98" r="16"/><path d="M90 118c0-22 20-34 50-34s50 12 50 34c-12-12-28-16-50-16s-38 4-50 16z"/></g>`;
    } else if (o.style === "buzz") {
      // cepak
      s += `<path d="M92 112c2-34 22-52 48-52s46 18 48 52c-12-14-28-20-48-20s-36 6-48 20z" fill="${o.hair}"/>`;
    } else {
      s += `<path d="M89 124c-5-48 22-72 52-72 32 0 57 22 51 72-8-24-28-36-52-36s-42 12-51 36z" fill="${o.hair}"/>`;
    }
  }
  if (o.beard) s += `<path d="M98 136c4 36 20 52 42 52s38-16 42-52c-8 16-22 24-42 24s-34-8-42-24z" fill="${o.hair}"/>`;
  s += `<circle cx="123" cy="${eyeY}" r="4" fill="#2A2118"/><circle cx="157" cy="${eyeY}" r="4" fill="#2A2118"/>`;
  if (o.glasses) {
    s += `<g fill="none" stroke="#2A2118" stroke-width="3"><circle cx="123" cy="${eyeY}" r="13"/><circle cx="157" cy="${eyeY}" r="13"/><path d="M136 ${eyeY}h8"/></g>`;
  }
  s += `<path d="M128 ${eyeY + 22}q12 9 24 0" fill="none" stroke="#7A4A36" stroke-width="3" stroke-linecap="round"/>`;
  return svg(W, W, s);
}

const AVATARS = {
  "avatar-alya": { bg1: "#E9D7B5", bg2: "#C9AE7C", skin: "#E8B996", shade: "#D29E7A", hair: "#2A2118", shirt: "#3E6A8A", style: "side" },
  "avatar-dimas": { bg1: "#D6E0DA", bg2: "#9DB3A6", skin: "#C98E66", shade: "#B27A55", hair: "#2A2118", shirt: "#1F1A12", style: "short" },
  "avatar-nadia": { bg1: "#F1DCCB", bg2: "#D9A98C", skin: "#F0C7A6", shade: "#DBAE8D", hair: "#3B2A1E", shirt: "#8C6D31", style: "curly" },
  "avatar-raka": { bg1: "#DCE3EC", bg2: "#A7B6C8", skin: "#D9A47C", shade: "#C28D66", hair: "#1F1A12", shirt: "#5B7A5A", style: "short", glasses: true },
  "avatar-sekar": { bg1: "#EFE3C8", bg2: "#CFB98A", skin: "#E1AE88", shade: "#CB9874", hair: "#1F1A12", shirt: "#F7F1E3", style: "buzz", glasses: true },
  "avatar-bima": { bg1: "#E6D3C6", bg2: "#BE9A86", skin: "#B97B55", shade: "#A36944", hair: "#1F1A12", shirt: "#C0573E", style: "short", beard: true },
  "avatar-you": { bg1: "#F4EEE1", bg2: "#E3D2A8", skin: "#E3AE8A", shade: "#CC9874", hair: "#2A2118", shirt: "#8C6D31", style: "short" }
};

/* ---------- 2. kartu member (IMG-23) ---------- */
const cardMember = () =>
  svg(340, 214, card(340, 214, { fill: "#2A2419", fill2: "#120F0A", name: "Nama Anggota", sub: "Komunitas Kreatif · LK-0042", tag: "MEMBER" }));

/* ---------- 3. langkah Personal (IMG-24, 25, 26) ---------- */
function stepOrderForm() {
  let s = scene(400, 300);
  s += `<g filter="url(#sh)">${r(40, 26, 320, 248, 16, C.surface)}</g>`;
  s += [58, 70, 82].map((x) => `<circle cx="${x}" cy="44" r="4" fill="#E5D9C2"/>`).join("");
  s += t(64, 80, 15, "Pesan kartu", { w: 700 });
  [["Personal", "Untuk individu", true], ["Community", "Untuk komunitas"], ["Access", "Paket lengkap"]].forEach(([a, b, on], i) => {
    const x = 64 + i * 90;
    s += r(x, 94, 82, 40, 8, on ? C.cream : C.surface, `stroke="${on ? C.gold : C.line}" stroke-width="${on ? 2 : 1.2}"`);
    s += t(x + 9, 111, 10.5, a, { w: 700 }) + t(x + 9, 125, 8, b, { c: C.muted });
  });
  s += t(64, 154, 9, "Nama lengkap", { w: 600, c: C.muted });
  s += r(64, 160, 262, 26, 7, C.bg, `stroke="${C.line}"`) + t(74, 177, 10.5, "Alya Rahma") + r(129, 166, 1.5, 14, 0, C.gold);
  s += t(64, 204, 9, "Warna kartu", { w: 600, c: C.muted });
  ["#F7F7F4", "#14161A", "#1F4FD8", "#F2B705", "url(#rainbow)"].forEach((c, i) => {
    const cx = 76 + i * 26;
    if (i === 1) s += `<circle cx="${cx}" cy="220" r="12.5" fill="none" stroke="${C.gold}" stroke-width="2"/>`;
    s += `<circle cx="${cx}" cy="220" r="9" fill="${c}" stroke="${C.line}"/>`;
  });
  s += r(64, 240, 262, 26, 8, C.gold) + t(195, 257, 11, "Kirim pesanan", { a: "middle", w: 700, c: "#fff" });
  return svg(400, 300, s);
}

function stepProfile() {
  let s = scene(400, 300);
  s += phone(52, 22, 118, 256, (w, h) => miniProfile(w, h, { initials: "AR", name: "Alya Rahma", role: "UI/UX Designer" }));
  s += t(206, 48, 12, "Pilih template", { w: 700 });
  [["url(#gold)", true], [C.ink], ["#5B7A5A"]].forEach(([col, on], i) => {
    const y = 62 + i * 70;
    s += `<g filter="url(#sh)">${r(206, y, 150, 58, 10, C.surface, on ? `stroke="${C.gold}" stroke-width="2"` : `stroke="${C.line}"`)}</g>`;
    s += r(214, y + 8, 36, 42, 6, col);
    s += `<circle cx="232" cy="${y + 24}" r="7" fill="#fff" opacity=".9"/>`;
    s += r(258, y + 14, 70, 6, 3, C.ink, 'opacity=".8"') + r(258, y + 26, 88, 5, 2.5, C.line) + r(258, y + 36, 60, 5, 2.5, C.line);
    if (on) s += `<circle cx="352" cy="${y + 4}" r="9" fill="${C.gold}"/>` + check(352, y + 3, 9);
  });
  return svg(400, 300, s);
}

function stepTap() {
  let s = scene(400, 300);
  s += phone(200, 26, 128, 252, (w, h) => miniProfile(w, h, { initials: "AR", name: "Alya Rahma", role: "UI/UX Designer" }));
  s += nfc(150, 36, 2.2, C.gold);
  s += `<g transform="translate(46 96) rotate(-14 85 53)" filter="url(#sh)">${card(170, 107, { fill: "#2A2419", fill2: "#120F0A", name: "Alya Rahma", sub: "UI/UX Designer" })}</g>`;
  s += `<g filter="url(#sh)">${r(34, 226, 156, 42, 21, C.surface)}</g>`;
  s += `<circle cx="56" cy="247" r="12" fill="${C.ok}"/>` + check(56, 246, 11);
  s += t(76, 244, 11, "Profil terbuka", { w: 700 }) + t(76, 258, 9, "tanpa aplikasi", { c: C.muted });
  return svg(400, 300, s);
}

/* ---------- 4. langkah Community (IMG-27, 28, 29) ---------- */
function stepCommunityDesign() {
  let s = scene(400, 300);
  s += `<g filter="url(#sh)">${r(20, 20, 360, 260, 14, C.surface)}</g>`;
  s += [36, 48, 60].map((x) => `<circle cx="${x}" cy="37" r="4" fill="#E5D9C2"/>`).join("");
  s += t(76, 41, 9, "Editor kartu komunitas", { c: C.muted });
  s += `<path d="M20 54h360M72 54v226M280 54v226" stroke="${C.line}"/>`;
  ["#2F5D50", C.ink, C.gold, "#C0573E"].forEach((c, i) => {
    const cy = 80 + i * 30;
    if (i === 0) s += `<circle cx="46" cy="${cy}" r="12.5" fill="none" stroke="${C.gold}" stroke-width="2"/>`;
    s += `<circle cx="46" cy="${cy}" r="9" fill="${c}"/>`;
  });
  s += `<g transform="translate(94 70)" filter="url(#sh)">${card(170, 107, { fill: "#2F5D50", fill2: "#1E3D35", text: "#F1E9D2", name: "Komunitas Kreatif", sub: "Kartu anggota 2026", tag: "MEMBER" })}</g>`;
  s += t(94, 198, 9, "Kartu anggota · 48", { w: 600, c: C.muted });
  for (let i = 0; i < 6; i++) {
    const x = 94 + (i % 3) * 58, y = 206 + Math.floor(i / 3) * 36;
    s += r(x, y, 52, 31, 4, "#2F5D50") + r(x + 6, y + 21, 24, 3, 1.5, "#F1E9D2", 'opacity=".7"') + `<circle cx="${x + 44}" cy="${y + 8}" r="3" fill="${C.goldLight}"/>`;
  }
  s += t(292, 80, 9, "Warna", { w: 600, c: C.muted });
  ["#2F5D50", C.ink, C.gold, "#C0573E"].forEach((c, i) => (s += `<circle cx="${299 + i * 18}" cy="94" r="6" fill="${c}"/>`));
  s += t(292, 124, 9, "Logo", { w: 600, c: C.muted }) + r(292, 130, 76, 34, 6, C.bg, `stroke="${C.line}"`) + logo(306, 135, 50);
  s += t(292, 186, 9, "Teks", { w: 600, c: C.muted }) + r(292, 192, 76, 20, 5, C.bg, `stroke="${C.line}"`) + t(298, 206, 8.5, "Kom. Kreatif");
  s += r(292, 240, 76, 26, 6, C.gold) + t(330, 257, 9.5, "Simpan", { a: "middle", w: 700, c: "#fff" });
  return svg(400, 300, s);
}

function stepMemberList() {
  let s = scene(400, 300);
  s += `<g filter="url(#sh)">${r(20, 24, 360, 252, 14, C.surface)}</g>`;
  s += t(36, 52, 12, "anggota.xlsx", { w: 700 });
  s += r(266, 34, 98, 26, 13, C.cream, `stroke="${C.gold}"`) + t(315, 51, 10, "48 anggota", { a: "middle", w: 700, c: C.gold });
  s += r(36, 66, 328, 24, 4, C.tint);
  [["Nama", 66], ["Divisi", 178], ["Email", 258]].forEach(([h, x]) => (s += t(x, 82, 9, h, { w: 700, c: C.muted })));
  const rows = [
    ["Alya Rahma", "Desain", "alya@mail.com"], ["Dimas Pratama", "Acara", "dimas@mail.com"],
    ["Nadia Putri", "Humas", "nadia@mail.com"], ["Raka Aditya", "Desain", "raka@mail.com"],
    ["Sekar Ayu", "Dana", "sekar@mail.com"], ["Bima Santoso", "Acara", "bima@mail.com"]
  ];
  rows.forEach(([n, d, e], i) => {
    const y = 90 + i * 24;
    s += t(47, y + 16, 9, String(i + 1), { a: "middle", c: C.muted }) + t(66, y + 16, 10, n) + t(178, y + 16, 9.5, d) + t(258, y + 16, 9.5, e, { c: C.muted });
    s += `<path d="M36 ${y + 24}h328" stroke="${C.line}"/>`;
  });
  s += t(66, 250, 9.5, "+ 42 anggota lainnya", { c: C.muted });
  s += r(60, 114, 112, 24, 3, "none", `stroke="${C.gold}" stroke-width="2"`);
  s += `<path d="M58 66v168M170 66v168M250 66v168" stroke="${C.line}"/>`;
  return svg(400, 300, s);
}

function stepWhatsapp() {
  const clip = id("wc");
  let s = scene(400, 300);
  s += `<g filter="url(#sh)">${r(40, 20, 320, 260, 16, C.surface)}</g>`;
  s += `<clipPath id="${clip}">${r(40, 20, 320, 260, 16, "#000")}</clipPath><g clip-path="url(#${clip})">`;
  s += r(40, 20, 320, 48, 0, C.ink) + r(40, 68, 320, 212, 0, C.tint);
  s += `<circle cx="70" cy="44" r="14" fill="url(#gold)"/>` + t(70, 49, 13, "L", { a: "middle", w: 800, c: C.ink });
  s += t(92, 41, 11, "Tim Linkert", { w: 700, c: "#fff" }) + t(92, 55, 8.5, "online", { c: "#CFC6B4" });
  s += r(56, 82, 214, 44, 10, C.surface) + t(66, 99, 10, "Halo Nadia, kartu member kamu") + t(66, 114, 10, "sudah dikirim hari ini.") + t(262, 120, 7.5, "09.45", { a: "end", c: C.muted });
  s += r(56, 134, 214, 72, 10, C.surface) + r(64, 142, 198, 34, 7, C.tint);
  s += `<g transform="translate(72 150) scale(.75)" fill="none" stroke="${C.gold}" stroke-width="2.2" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></g>`;
  s += t(96, 163, 10, "linkert.id/nadia-putri", { w: 600 });
  s += r(64, 183, 104, 16, 8, "#E3F1E8") + t(116, 195, 8.5, "Akses member aktif", { a: "middle", w: 700, c: C.ok });
  s += r(206, 214, 138, 30, 10, "#E9DDBF") + t(216, 233, 10, "Terima kasih!");
  s += `<path d="M310 229l3 3 6-6M316 229l3 3 6-6" fill="none" stroke="#3E6A8A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += r(52, 254, 264, 20, 10, C.surface) + t(62, 268, 8.5, "Ketik pesan", { c: C.muted });
  s += `<circle cx="334" cy="264" r="11" fill="${C.gold}"/><path d="M330 264h8M335 260l4 4-4 4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += `</g>`;
  return svg(400, 300, s);
}

/* ---------- 5. paket Access (IMG-30, 31) ---------- */
function accessCards() {
  let s = r(0, 0, 560, 420, 0, C.night) + `<circle cx="470" cy="60" r="190" fill="${C.goldMid}" opacity=".10"/>`;
  s += t(40, 50, 14, "Status kartu anggota", { w: 700, c: "#F5F0E6" });
  s += `<g transform="translate(40 76)" filter="url(#sh)">${card(224, 141, { fill: "#3A3022", fill2: "#15110B", name: "Nadia Putri", sub: "LK-0042" })}</g>`;
  s += r(194, 64, 70, 24, 12, C.ok) + t(229, 80, 10, "Aktif", { a: "middle", w: 700, c: "#fff" });
  s += `<g transform="translate(296 76)" opacity=".7">${card(224, 141, { fill: "#4A4740", fill2: "#2B2925", text: "#B9B4A8", name: "Raka Aditya", sub: "LK-0043" })}</g>`;
  s += `<path d="M300 212L516 80" stroke="${C.off}" stroke-width="3" stroke-linecap="round" opacity=".85"/>`;
  s += r(436, 64, 84, 24, 12, C.off) + t(478, 80, 10, "Nonaktif", { a: "middle", w: 700, c: "#fff" });
  s += r(40, 250, 480, 130, 14, C.night2);
  [["Nadia Putri", "Tap terakhir 09.41", true, "NP"], ["Raka Aditya", "Dinonaktifkan 09.32", false, "RA"]].forEach(([n, d, on, ini], i) => {
    const y = 250 + i * 65;
    s += `<circle cx="74" cy="${y + 32}" r="16" fill="${on ? C.gold : "#5A5348"}"/>` + t(74, y + 37, 11, ini, { a: "middle", w: 700, c: "#fff" });
    s += t(102, y + 29, 12, n, { w: 700, c: "#F5F0E6" }) + t(102, y + 45, 10, d, { c: "#A89B82" });
    s += r(450, y + 20, 46, 24, 12, on ? C.ok : "#5A5348") + `<circle cx="${on ? 484 : 462}" cy="${y + 32}" r="9" fill="#fff"/>`;
    if (i === 0) s += `<path d="M56 ${y + 65}h448" stroke="#3E3628"/>`;
  });
  return svg(560, 420, s);
}

function accessAdmin() {
  let s = r(0, 0, 560, 420, 0, C.night) + `<circle cx="80" cy="380" r="170" fill="${C.goldMid}" opacity=".10"/>`;
  s += `<g filter="url(#sh)">${r(24, 24, 512, 372, 14, C.bg)}</g>`;
  s += r(24, 24, 124, 372, 14, C.ink) + r(120, 24, 28, 372, 0, C.ink);
  s += logo(40, 42, 74);
  ["Dasbor", "Anggota", "Kartu", "Laporan"].forEach((n, i) => {
    const y = 110 + i * 30;
    if (i === 0) s += r(34, y - 15, 104, 22, 6, "#3A3124");
    s += t(46, y, 10.5, n, { w: i === 0 ? 700 : 400, c: i === 0 ? "#fff" : "#A89B82" });
  });
  s += t(164, 60, 15, "Dasbor komunitas", { w: 700 }) + t(164, 78, 9.5, "Komunitas Kreatif · minggu ini", { c: C.muted });
  [["Kartu aktif", "248", "+4"], ["Tap kartu", "1.204", "+18%"], ["Anggota baru", "12", "+3"]].forEach(([l, v, d], i) => {
    const x = 164 + i * 122;
    s += r(x, 92, 112, 66, 10, C.surface, `stroke="${C.line}"`);
    s += t(x + 12, 113, 9, l, { c: C.muted }) + t(x + 12, 142, 20, v, { w: 700 }) + t(x + 102, 142, 8.5, d, { a: "end", w: 700, c: C.ok });
  });
  s += r(164, 170, 356, 110, 10, C.surface, `stroke="${C.line}"`) + t(176, 190, 10, "Tap per hari", { w: 700 });
  [32, 45, 38, 56, 50, 24, 18].forEach((v, i) => {
    const x = 186 + i * 46;
    s += r(x, 256 - v, 24, v, 4, i === 3 ? C.gold : C.goldLight);
    s += t(x + 12, 271, 8, ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i], { a: "middle", c: C.muted });
  });
  s += r(164, 290, 356, 92, 10, C.surface, `stroke="${C.line}"`);
  [["Nadia Putri", "LK-0042", true], ["Raka Aditya", "LK-0043", false], ["Sekar Ayu", "LK-0044", true]].forEach(([n, idc, on], i) => {
    const y = 314 + i * 28;
    s += `<circle cx="184" cy="${y - 4}" r="8" fill="${on ? C.goldLight : C.line}"/>` + t(200, y, 10, n) + t(330, y, 9.5, idc, { c: C.muted });
    s += r(436, y - 13, 66, 18, 9, on ? "#E3F1E8" : "#F6E1DC") + t(469, y, 8.5, on ? "Aktif" : "Nonaktif", { a: "middle", w: 700, c: on ? C.ok : C.off });
    if (i < 2) s += `<path d="M176 ${y + 10}h332" stroke="${C.line}"/>`;
  });
  return svg(560, 420, s);
}

/* ---------- 6. kartu promo (IMG-32, 33, 34) ---------- */
function promoLaser() {
  let s = `<defs><linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34302A"/><stop offset=".5" stop-color="#1A1714"/><stop offset="1" stop-color="#2A2622"/></linearGradient>` +
    `<pattern id="brush" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#fff" opacity=".04"/></pattern>` +
    `<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".09"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
  s += r(0, 0, 340, 214, 0, "url(#metal)") + r(0, 0, 340, 214, 0, "url(#brush)");
  s += `<path d="M120 0h70L110 214H40z" fill="url(#sheen)"/>`;
  s += r(14, 14, 312, 186, 10, "none", `stroke="${C.goldLight}" stroke-opacity=".3"`);
  s += logo(110, 66, 120);
  s += t(170, 148, 9, "CETAK LASER", { a: "middle", w: 700, ls: 4, c: C.goldLight });
  s += nfc(292, 168, 0.9, C.goldLight);
  return svg(340, 214, s);
}

function promoComb() {
  let s = scene(340, 214);
  let comb = r(40, 44, 260, 80, 18, C.ink);
  for (let i = 0; i < 24; i++) comb += r(52 + i * 10.3, 112, 6, 66 - (i % 2) * 8, 3, C.ink);
  s += `<g filter="url(#sh)">${comb}</g>`;
  s += logo(62, 64, 90);
  s += t(282, 92, 9, "BARBERSHOP", { a: "end", w: 700, ls: 3, c: C.goldLight });
  s += nfc(262, 54, 0.75, C.goldLight);
  return svg(340, 214, s);
}

function promoScrewdriver() {
  let s = scene(340, 214);
  s += `<defs><linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4E0D6"/><stop offset=".5" stop-color="#A9A398"/><stop offset="1" stop-color="#D3CEC3"/></linearGradient></defs>`;
  let tool = r(24, 70, 160, 74, 37, C.ink);
  for (let i = 0; i < 5; i++) tool += r(124 + i * 9, 80, 4, 54, 2, "#3A3124");
  tool += r(182, 92, 18, 30, 4, "#8A8578") + r(198, 100, 102, 14, 3, "url(#steel)");
  tool += `<path d="M300 100l22 7-22 7z" fill="#A9A398"/>`;
  s += `<g filter="url(#sh)">${tool}</g>`;
  s += logo(46, 92, 70);
  s += t(170, 178, 9, "TOKO BANGUNAN", { a: "middle", w: 700, ls: 3, c: C.muted });
  return svg(340, 214, s);
}

/* ---------- 7. pilih warna kartu (IMG-44) ---------- */
function howPick() {
  let s = scene(400, 300);
  const cards = [
    { fill: "#F7F7F4", text: C.ink, stroke: C.line }, { fill: "#14161A" }, { fill: "#1F4FD8", fill2: "#173CA8" },
    { fill: "#F2B705", fill2: "#D9A204", text: C.ink }, { paint: "url(#rainbow)" }
  ];
  [-28, -14, 0, 14, 28].forEach((a, i) => {
    s += `<g transform="rotate(${a} 200 330) translate(125 90)" filter="url(#sh)">${card(150, 94, cards[i])}</g>`;
  });
  s += `<g filter="url(#sh)">${r(130, 236, 140, 36, 18, C.surface)}</g>` + t(200, 259, 11, "5 pilihan warna", { a: "middle", w: 700 });
  return svg(400, 300, s);
}

/* ---------- tulis semua file ---------- */
const FILES = {
  ...Object.fromEntries(Object.entries(AVATARS).map(([k, o]) => [k, () => avatar(o)])),
  "card-member": cardMember,
  "step-order-form": stepOrderForm,
  "step-profile": stepProfile,
  "step-tap": stepTap,
  "step-community-design": stepCommunityDesign,
  "step-member-list": stepMemberList,
  "step-message": stepWhatsapp,
  "access-cards": accessCards,
  "access-admin": accessAdmin,
  "promo-laser": promoLaser,
  "promo-comb": promoComb,
  "promo-screwdriver": promoScrewdriver,
  "how-pick": howPick
};

for (const [name, make] of Object.entries(FILES)) {
  const file = path.join(OUT, `${name}.svg`);
  fs.writeFileSync(file, make(), "utf8");
  console.log(`img/gen/${name}.svg  ${(fs.statSync(file).size / 1024).toFixed(1)} KB`);
}
