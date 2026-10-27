# Sultan Bagus Permadi — Portfolio (tema pause-menu "Persona 3 Reload")

Next.js 16 · TypeScript · Tailwind v4 · Framer Motion (`LazyMotion`, tanpa GSAP).
Tiga bahasa: Indonesia · English · العربية (RTL native). Tepat dua proyek: **Lughoti Vokasi** dan **Arabic Scrabble**.

Terinspirasi *bahasa visual dan mekanik* menu pause P3R, dengan aset 100% orisinal:
tanpa font Atlus, tanpa video/audio gim, SFX disintesis lewat Web Audio.

```bash
npm install && cp .env.example .env.local   # isi URL asli
npm run dev                                 # http://localhost:3000
npm run typecheck && npm test && npm run build
```

## Yang perlu kamu cek / ganti
1. **Ejaan nama.** Sampul aplikasimu bertuliskan **"Lughati" Vokasi** (لغتي), sedangkan PRD memakai "Lughoti Vokasi".
   Portfolio mengikuti PRD; ubah satu baris di `src/content/site.ts` (`title`) bila ingin sama dengan aplikasinya.
2. **URL**: `.env.local` (`NEXT_PUBLIC_GITHUB_URL`, `_LUGHOTI_URL`, `_SCRABBLE_URL`, `_SITE_URL`). Default-nya masih `https://github.com`.
3. **Screenshot** di `public/projects/*.webp` diambil dari build asli kedua proyekmu (kamus: pencarian "jaringan" di RPL; Scrabble: papan dengan 4 huruf).
   Ganti kapan saja, lalu sesuaikan `aspect` di `site.ts`.
4. **Deskripsi** ditulis dari README kedua proyek; periksa kata-katanya. Arcana kartu (Hierophant V / Magician I) hanya bingkai dekoratif.
   Aksen Scrabble `#D4AF37` = emas tema Classic game-nya; aksen Lughoti `#8ECDF4` dari PRD.
5. Halaman **Tentang** hanya memuat konten dari PRD; belum ada bio/foto.

## Backdrop WebGL (tanpa Three.js)
`src/lib/dark-hour-gl.ts`: satu fragment shader (bulan 3D dengan fase hari ini, berkas cahaya miring, partikel) lewat WebGL mentah.
Dimuat malas saat browser idle, memudar masuk di atas latar CSS. Hemat: DPR dibatasi, resolusi lebih rendah di layar kecil,
30–45 fps, berhenti saat tab tersembunyi, satu frame statis untuk reduced-motion. Tanpa WebGL / konteks hilang → latar CSS tetap.

## Cara kerja
- **Layar, bukan scroll**: Home (menu) → Projects / About / Contact / Language. URL memakai hash (`#projects`), tombol Back browser bekerja.
- **Kontrol**: ↑↓ (atau W/S) pilih, Enter konfirmasi, Esc kembali; mouse/sentuh penuh (tombol "Back" tampil di layar).
  Item tetap `<button>`/`<a>` asli sehingga Tab, Enter, dan screen reader normal.
- **Transisi pecahan kaca** menutupi pergantian layar dan bahasa. `prefers-reduced-motion`: tanpa pecahan/gerak, hanya fade.
- **Suara**: default mati, tombol di pojok kanan atas (tersimpan di localStorage).
- **HUD tanggal + fase bulan** dari tanggal asli; mode Arab memakai kalender **Hijriah** dan angka Arab-Indic.
- **Loading** terikat pemuatan font (bukan progress palsu); font Arab hanya diunduh saat dibutuhkan.

## Tipografi Arab
Arab tidak pernah di-skew, dimiringkan, atau diberi letter-spacing; hanya bentuk di belakang teks yang miring (clip-path).
Kufi 700 (menu/judul), Plex Sans Arabic (UI), Naskh (ringkasan proyek), Ruq'ah (nama arcana), Nastaliq (baris kedua headline).
Lisensi font: `src/fonts/LICENSE-*.txt` (SIL OFL).

## Catatan
- Metadata SSR berbahasa Indonesia; `document.title` mengikuti bahasa dan layar. Untuk SEO per bahasa sempurna, pindahkan ke route `/id` `/en` `/ar`.
- Konten juga tersedia untuk crawler/no-JS lewat blok `sr-only`, tetapi UI penuh membutuhkan JavaScript.
