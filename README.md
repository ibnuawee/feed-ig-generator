# KGO Shop Content Generator

Website statis untuk membuat konten Instagram bergaya KGO Shop/MLBB. Tool ini berjalan langsung di browser dan bisa dipakai untuk membuat poster feed, template video, dan beberapa variasi desain event.

## Fitur

- Generate poster Instagram ukuran 4:5.
- Generate video template 9:16 berbasis canvas dan export ke WEBM.
- Upload gambar/video langsung dari browser.
- Download hasil poster sebagai PNG.
- Template konten:
  - News MLBB
  - Recharge Event
  - Grid Collector
  - Skin Starlight
  - Video template 9:16
- Asset brand KGO dan logo Starlight tersimpan di folder `assets`.

## Struktur Project

```text
.
├── assets/
│   ├── kgo-logo.png
│   └── starlight-logo.png
├── index.html
├── script.js
├── styles.css
├── vercel.json
└── README.md
```

## Menjalankan Lokal

Karena project ini statis, cukup jalankan server HTTP sederhana:

```bash
python3 -m http.server 5173
```

Lalu buka:

```text
http://127.0.0.1:5173
```

## Cara Pakai

1. Pilih `Jenis output`.
2. Pilih `Tema`.
3. Upload gambar/video sesuai field yang muncul.
4. Edit teks seperti judul, badge, website, phase, atau nama skin.
5. Klik `Generate gambar`.
6. Klik `Download PNG` untuk poster atau `Export WEBM` untuk video.


## Catatan Teknis

- Semua proses upload gambar/video terjadi lokal di browser.
- File upload user tidak dikirim atau disimpan ke server.
- Export video memakai `MediaRecorder`, sehingga hasil default-nya adalah `.webm`.
- Dukungan export video bergantung pada browser. Chrome/Edge biasanya paling stabil.
