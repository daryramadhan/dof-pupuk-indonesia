# PRD — Manajemen Surat (Worklist) & Detail Surat
## DOF Digital Office Platform

**Versi:** 1.1 — Updated
**Tanggal:** Mei 2026
**Scope:** Halaman Manajemen Surat + Detail Surat — navigation behavior, layout, UX update

---

## 1. Product Intent

### Manajemen Surat
Worklist utama Drafter untuk menemukan, memantau, dan menindaklanjuti surat berdasarkan status dan kebutuhan.

> **"Surat mana yang perlu saya kerjakan sekarang, dan surat mana yang sedang diproses?"**

### Detail Surat
Halaman sentral DOF untuk membaca, memproses, dan mengambil keputusan terhadap satu surat.

> **"Surat ini tentang apa, statusnya apa, apa yang harus saya lakukan, dan ke mana surat ini setelah saya action?"**

---

## 2. Navigation Behavior — Sidebar

Sidebar tidak punya memory state. Behavior selalu mengikuti konteks halaman, bukan preferensi terakhir user.

| Konteks | Sidebar State |
|---|---|
| List Page (Manajemen Surat) | Full width — label visible |
| Masuk Detail Surat | Auto-collapse ke icon-only |
| Di dalam Detail Surat | User bisa toggle manual (expand/collapse) |
| Kembali ke List dari Detail | Selalu expand full — tidak peduli state manual user |

**Rules:**
- Collapse terjadi otomatis saat user masuk ke Detail Surat — tidak perlu user action
- Toggle manual di Detail Surat hanya berlaku selama session di halaman tersebut
- Saat kembali ke list, sidebar selalu reset ke full width
- Sidebar icon-only tetap functional — user bisa navigasi ke menu lain dari icon

**Pattern referensi:** Gmail sidebar behavior saat membuka email.

---

## 3. Manajemen Surat — Layout

```
Header: Judul halaman + breadcrumb
↓
Action bar: Search + Filter + Export + Buat Surat Baru
↓
Tabs status
↓
Tabel surat
```

**Sidebar:** Visible full — halaman ini adalah browse/navigate context, bukan focus task.

---

## 4. Manajemen Surat — Action Bar

**Kiri:**
- Search — placeholder: "Cari judul, nomor surat, atau pembuat..."
- Filter Sifat — dropdown: Semua, Biasa, Terbatas, Rahasia, Sangat Rahasia
- Filter Kecepatan — dropdown: Semua, Biasa, Segera, Sangat Segera
- Rentang Tanggal — date range picker

**Kanan:**
- Export — secondary button
- Buat Surat Baru — primary button, selalu visible

---

## 5. Manajemen Surat — Tabs Status

| Tab | Status yang Ditampilkan | Badge Counter |
|---|---|---|
| Semua | Semua status | Total surat |
| Draft | DRAFT | Ya |
| Menunggu Persetujuan | MENUNGGU_REVIEW, MENUNGGU_APPROVAL | Ya |
| Dikembalikan | DIREVISI_REVIEWER | Ya — highlight warning jika ada isi |
| Disetujui | DISETUJUI_APPROVER | Tidak |
| Dibatalkan | DIBATALKAN, CANCELLED | Tidak |

**Rules:**
- Tab aktif default: "Semua"
- Tab "Dikembalikan" badge berwarna warning jika ada isi
- Tab tetap visible meskipun kosong — counter menampilkan 0

---

## 6. Manajemen Surat — Kolom Tabel

| Kolom | Konten | Sortable |
|---|---|---|
| Judul Surat | Judul + nomor surat + nama pembuat | Ya |
| Sifat | Badge: Biasa, Terbatas, Rahasia, Sangat Rahasia | Tidak |
| Kecepatan Tanggapan | Badge: Biasa, Segera, Sangat Segera | Ya |
| Status | Badge human-readable | Tidak |
| Diproses Oleh | Nama current owner surat | Tidak |
| Last Updated | Tanggal & jam terakhir ada perubahan | Ya — default sort |
| Aksi | Contextual button per status | Tidak |

**Rules:**
- Default sort: Last Updated — terbaru di atas
- Kolom "Diproses Oleh" menampilkan dash (—) jika surat sudah Closed atau Dibatalkan
- Judul surat truncate jika terlalu panjang

---

## 7. Manajemen Surat — Contextual Action Button

| Status Surat | Tombol | Behavior |
|---|---|---|
| Draft | Lanjutkan | Masuk ke form Buat Surat Baru dengan data tersimpan |
| Dikembalikan | Revisi | Masuk ke Detail Surat — sidebar auto-collapse |
| Menunggu Review / Approval | Pantau | Masuk ke Detail Surat read-only — sidebar auto-collapse |
| Disetujui | Lihat Detail | Masuk ke Detail Surat read-only — sidebar auto-collapse |
| Dibatalkan | Lihat Detail | Masuk ke Detail Surat read-only — sidebar auto-collapse |

**Rules:**
- Semua aksi yang membuka Detail Surat → sidebar auto-collapse
- Tidak ada modal konfirmasi sebelum masuk Detail Surat — langsung navigate
- Tombol "Lanjutkan" (Draft) tidak membuka Detail Surat — membuka form edit

---

## 8. Manajemen Surat — Perubahan dari Versi Sebelumnya

| Area | Sebelumnya | Sesudahnya |
|---|---|---|
| Filter status | Semua surat satu tabel | Tab per status |
| Kolom tabel | Tanpa current owner | Tambah kolom Diproses Oleh |
| Kolom tanggal | Tanggal Dibuat | Last Updated |
| Aksi per row | "Lihat Detail" semua | Contextual per status |
| Modal preview | Ada — muncul sebelum Detail | Dihapus — langsung ke Detail |
| Checkbox bulk | Ada tanpa aksi | Dihapus — false affordance |
| Sidebar saat buka detail | Tetap full | Auto-collapse ke icon-only |

---

## 9. Manajemen Surat — Empty State per Tab

| Tab | Empty State |
|---|---|
| Draft | "Tidak ada draft yang tersimpan. Mulai buat surat baru." + tombol Buat Surat Baru |
| Menunggu Persetujuan | "Tidak ada surat yang sedang dalam proses review atau approval." |
| Dikembalikan | "Tidak ada surat yang dikembalikan. Semua surat sudah diproses dengan baik." |
| Disetujui | "Belum ada surat yang disetujui bulan ini." |
| Dibatalkan | "Tidak ada surat yang dibatalkan." |

---

## 10. Detail Surat — Layout

- Split dua kolom: **Left area fluid (1fr)** + **Right panel fixed 320px**
- Right panel tidak ikut membesar saat viewport lebar — hanya left area yang tumbuh
- Sidebar auto-collapse saat halaman ini dibuka
- Minimum viewport: 1024px (desktop only)

```
grid-template-columns: 1fr 320px;
```

**Top bar:**
- Tombol Kembali — kembali ke list, sidebar expand otomatis
- Breadcrumb: Manajemen Surat → Detail · [Nomor Surat]
- Print Preview
- Unduh

---

## 11. Detail Surat — Left Area

### Document Summary Card
- Judul surat, Nomor surat
- Jenis, Sifat, Kecepatan Tanggapan, Klasifikasi
- Drafter — nama pembuat
- Tujuan — nama penerima akhir
- Jumlah lampiran, Versi dokumen, Tanggal dibuat

> Status badge TIDAK ditampilkan di summary card kiri — hanya ada di right panel.

### Save State Indicator (Reviewer only)
- Ditampilkan di atas tabs, dekat editor
- Right panel tidak menampilkan save state dalam kondisi apapun
- State unsaved: warning bar + tombol "Simpan sekarang" inline
- State saved: success indicator

### Tabs

| Nama Tab | Konten |
|---|---|
| Isi Surat | Dokumen utama. Editable untuk Reviewer/Drafter, read-only untuk Approver/Tujuan. Edit mode bar muncul di atas canvas untuk Reviewer. |
| Catatan | Note card per orang — avatar, nama, role, badge aksi, isi catatan, timestamp. Empty state informatif jika belum ada catatan. |
| Riwayat | Timeline human-readable — icon per event, label natural language, catatan revisi inline. |
| Versi Dokumen | Version card per versi — label jelas (Versi Awal, Versi Reviewer 1, Versi Final). Badge "Terbaru". Tombol Lihat & Unduh. |
| Alur Persetujuan | Stepper vertikal — nama, role, status, timestamp. Hijau = selesai, Biru = current, Abu = pending. |

---

## 12. Detail Surat — Right Panel (Dua Varian)

### Varian A — Approval Panel (Reviewer, Approver, Drafter)

**Blok: Konteks Surat**
- Status — satu-satunya badge status di seluruh halaman
- Diproses oleh — nama current owner
- Berikutnya — nama dan role step selanjutnya (hidden untuk Drafter)

**Blok: Alur Persetujuan (Tracker)**
- Stepper ringkas — nama, role, status, timestamp
- Label micro: "Reviewer 1", "Approver · SVP", "Tujuan · Direktur"

**Blok: Tindakan Saya**

| Role | Actions |
|---|---|
| Reviewer | Setujui & Teruskan (primary) · Kembalikan untuk Revisi (warning) · —— · Batalkan Surat (danger) |
| Approver | Setujui & Kirim (primary) · Kembalikan untuk Revisi (warning) · —— · Batalkan Surat (danger) |
| Drafter | Empty state: "Surat sedang diproses. Tidak ada tindakan saat ini." |

### Varian B — Tindak Lanjut Panel (Tujuan/Penerima)

**Blok: Informasi Surat**
- Dari: nama Drafter
- Disetujui oleh: nama Approver
- Diterima: timestamp
- Status badge

**Blok: Tindakan Saya**
- ACC Surat (primary, full width)
- Disposisi _(hanya atasan — VP/SVP/Direksi. Hidden total untuk non-atasan.)_
- Teruskan
- CC
- Alihkan
- Submit Tindak Lanjut
- —— divider ——
- Tolak Surat (danger)

**Blok: Status Tindak Lanjut**
- History tindakan yang sudah dilakukan

---

## 13. Detail Surat — Action Button Hierarchy

| Jenis | Visual Treatment | Contoh |
|---|---|---|
| Primary | Background filled hijau, teks putih, font weight 500 | Setujui & Teruskan, ACC Surat |
| Warning | Outline border warning, teks warning | Kembalikan untuk Revisi |
| Destructive | Tanpa border, teks merah, font size lebih kecil, dipisah divider | Batalkan Surat, Tolak Surat |

---

## 14. Detail Surat — Confirmation Modal System

> Tidak boleh ada modal generik "YA / TIDAK". Setiap modal harus kontekstual.

Setiap modal menjelaskan: action apa, konsekuensi, ke mana surat bergerak, apakah bisa dibatalkan, apakah catatan wajib.

| Action | CTA | Catatan Wajib? |
|---|---|---|
| Setujui (Reviewer) | Setujui & Teruskan | Tidak |
| Setujui (Approver) | Setujui & Kirim | Tidak |
| Kembalikan | Kembalikan untuk Revisi | Ya |
| Batalkan | Batalkan Surat | Ya |
| Tolak | Tolak Surat | Ya |

---

## 15. Detail Surat — Role Behavior Summary

| Area | Reviewer | Approver | Drafter | Tujuan |
|---|---|---|---|---|
| Dokumen | Editable | Read-only | Read-only | Read-only |
| Edit mode bar | Tampil | Tidak | Tidak | Tidak |
| Save state | Tampil di kiri | Tidak ada | Tidak ada | Tidak ada |
| Right panel | Approval Panel | Approval Panel | Approval Panel | Tindak Lanjut Panel |
| Sidebar saat buka | Auto-collapse | Auto-collapse | Auto-collapse | Auto-collapse |

---

## 16. Hal yang Dihapus

- **Modal preview** antara list dan detail — tidak menambah nilai, hanya menambah klik
- **Checkbox bulk select** di list — false affordance, tidak ada bulk action
- **Kolom Tanggal Dibuat** — diganti Last Updated
- **Tombol "Lihat Detail" generic** — diganti contextual action per status
- **Status badge di summary card kiri** — cukup di right panel, hindari duplikasi

---

## 17. Open Questions

1. Apakah ada kebutuhan bulk action di masa depan? Jika ya, checkbox perlu dikembalikan.
2. Berapa jumlah item per halaman di tabel — pagination atau infinite scroll?
3. Apakah search bisa mencari berdasarkan nama Reviewer atau Approver?
4. Setelah ACC, status surat berubah menjadi apa — Read, On Progress, atau Closed?
5. Apakah Reviewer bisa mengedit metadata surat atau hanya isi dokumen?
6. Apakah Approver bisa menambahkan catatan tanpa harus mengembalikan surat?

---

*PRD Manajemen Surat & Detail Surat v1.1 — bagian dari PRD DOF Full Flow Persuratan.*