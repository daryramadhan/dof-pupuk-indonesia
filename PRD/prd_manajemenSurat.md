# PRD — Manajemen Surat (Worklist)
## DOF Digital Office Platform

**Versi:** 1.0 — Draft untuk Review
**Tanggal:** Mei 2026
**Scope:** Halaman Manajemen Surat — update UX dari existing prototype

---

## 1. Product Intent

Manajemen Surat adalah worklist utama Drafter untuk menemukan, memantau, dan menindaklanjuti surat berdasarkan status dan kebutuhan.

Halaman ini harus menjawab:

> **"Surat mana yang perlu saya kerjakan sekarang, dan surat mana yang sedang diproses?"**

---

## 2. Perubahan dari Versi Sebelumnya

| Area | Sebelumnya | Sesudahnya |
|---|---|---|
| Filter status | Semua surat dicampur satu tabel | Tab per status — Draft, Menunggu Persetujuan, dll |
| Kolom tabel | Judul, Sifat, Kecepatan, Status, Tanggal Dibuat | Tambah kolom Diproses Oleh dan Last Updated |
| Kolom tanggal | Tanggal Dibuat | Last Updated — lebih relevan untuk prioritas |
| Aksi per row | "Lihat Detail" untuk semua | Contextual — Revisi, Lanjutkan, atau Pantau sesuai status |
| Bulk action | Checkbox tanpa aksi | Dihapus — false affordance |

---

## 3. Layout

```
Header: Judul halaman + breadcrumb
↓
Action bar: Search + Filter + Export + Buat Surat Baru
↓
Tabs status
↓
Tabel surat
```

**Sidebar:** Visible — halaman ini adalah browse/navigate context, bukan focus task.

---

## 4. Action Bar

**Kiri:**
- Search — placeholder: "Cari judul, nomor surat, atau pembuat..."
- Filter Sifat — dropdown: Semua, Biasa, Terbatas, Rahasia, Sangat Rahasia
- Filter Kecepatan — dropdown: Semua, Biasa, Segera, Sangat Segera
- Rentang Tanggal — date range picker

**Kanan:**
- Export — secondary button
- Buat Surat Baru — primary button, selalu visible

---

## 5. Tabs Status

Tab memfilter tabel berdasarkan status surat. Badge counter menunjukkan jumlah surat per tab.

| Tab | Status yang Ditampilkan | Badge Counter |
|---|---|---|
| Semua | Semua status | Total surat |
| Draft | DRAFT | Ya |
| Menunggu Persetujuan | MENUNGGU_REVIEW, MENUNGGU_APPROVAL | Ya |
| Dikembalikan | DIREVISI_REVIEWER | Ya — highlight warning |
| Disetujui | DISETUJUI_APPROVER, SUDAH_UPLOAD | Tidak |
| Dibatalkan | DIBATALKAN, CANCELLED | Tidak |

**Rules:**
- Tab aktif default: "Semua"
- Tab "Dikembalikan" badge berwarna warning jika ada isi — untuk menarik perhatian
- Tab tetap visible meskipun kosong — counter menampilkan 0

---

## 6. Kolom Tabel

| Kolom | Konten | Sortable |
|---|---|---|
| Judul Surat | Judul + nomor surat + nama pembuat | Ya |
| Sifat | Badge: Biasa, Terbatas, Rahasia, Sangat Rahasia | Tidak |
| Kecepatan Tanggapan | Badge: Biasa, Segera, Sangat Segera | Ya |
| Status | Badge human-readable sesuai status mapping | Tidak |
| Diproses Oleh | Nama current owner surat | Tidak |
| Last Updated | Tanggal & jam terakhir ada perubahan | Ya — default sort |
| Aksi | Contextual button per status | Tidak |

**Rules:**
- Default sort: Last Updated — terbaru di atas
- Kolom "Diproses Oleh" kosong jika surat sudah Closed atau Dibatalkan
- Judul surat truncate jika terlalu panjang — full text di tooltip on hover

---

## 7. Contextual Action Button

Tombol aksi per row berubah sesuai status surat — bukan satu tombol generic untuk semua.

| Status Surat | Tombol | Behavior |
|---|---|---|
| Draft | Lanjutkan | Masuk ke form Buat Surat Baru dengan data tersimpan |
| Dikembalikan | Revisi | Masuk ke Detail Surat dalam mode edit |
| Menunggu Review / Approval | Pantau | Masuk ke Detail Surat read-only |
| Disetujui | Lihat Detail | Masuk ke Detail Surat read-only |
| Dibatalkan | Lihat Detail | Masuk ke Detail Surat read-only |

**Rules:**
- Tombol selalu satu per row — tidak ada dropdown aksi
- Style tombol mengikuti urgency: Revisi = warning style, Lanjutkan = neutral, Pantau = neutral, Lihat Detail = ghost

---

## 8. Row Design

Setiap row menampilkan:

```
[Judul Surat]          [Sifat]  [Kecepatan]  [Status]  [Diproses Oleh]  [Last Updated]  [Aksi]
[Nomor · Pembuat]
```

**Untuk surat dikembalikan** — tambahkan inline note di bawah meta:

```
[Judul Surat]
[Nomor · Pembuat]
↳ Catatan: "[preview catatan revisi...]"     [Revisi]
```

Ini memungkinkan Drafter langsung tahu alasan dikembalikan tanpa masuk ke detail.

---

## 9. Empty State per Tab

Setiap tab harus punya empty state yang informatif.

| Tab | Empty State |
|---|---|
| Draft | "Tidak ada draft yang tersimpan. Mulai buat surat baru." + tombol Buat Surat Baru |
| Menunggu Persetujuan | "Tidak ada surat yang sedang dalam proses review atau approval." |
| Dikembalikan | "Tidak ada surat yang dikembalikan. Semua surat sudah diproses dengan baik." |
| Disetujui | "Belum ada surat yang disetujui bulan ini." |
| Dibatalkan | "Tidak ada surat yang dibatalkan." |

---

## 10. Hal yang Dihapus dari Versi Sebelumnya

- **Checkbox bulk select** — dihapus karena tidak ada bulk action yang didefinisikan. False affordance.
- **Kolom Tanggal Dibuat** — diganti Last Updated yang lebih relevan untuk prioritas kerja.
- **Tombol "Lihat Detail" untuk semua status** — diganti contextual action sesuai status.

---

## 11. Open Questions

1. Apakah ada kebutuhan bulk action di masa depan — misalnya bulk export atau bulk cancel? Jika ya, checkbox perlu dikembalikan.
2. Apakah kolom "Diproses Oleh" perlu menampilkan foto/avatar atau cukup nama teks?
3. Berapa jumlah surat per halaman — apakah pakai pagination atau infinite scroll?
4. Apakah filter search bisa mencari berdasarkan nama Reviewer atau Approver, atau hanya judul dan nomor surat?

---

*PRD Manajemen Surat v1.0 — bagian dari PRD DOF Full Flow Persuratan.*