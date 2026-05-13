# PRD — Flow Surat Digital Sign & Stempel
## DOF Digital Office Platform

**Versi:** 1.0 — Draft untuk Review
**Tanggal:** Mei 2026
**Scope:** Flow penciptaan surat yang membutuhkan tanda tangan digital dan stempel digital — integrasi dengan Peruri

---

## 1. Product Intent

Flow Digital Sign & Stempel adalah flow khusus untuk surat yang membutuhkan tanda tangan digital dan stempel digital dari Approver. Flow ini umumnya digunakan untuk surat eksternal — ke perusahaan luar, email eksternal, atau intercompany antar perusahaan dalam PI Group.

> Flow ini berbeda dari flow surat biasa di bagian **setelah Approver menyetujui** — ada proses OTP, integrasi Peruri, dan role tambahan Admin Stempel sebelum surat sampai ke tujuan.

---

## 2. Kapan Flow Ini Digunakan

- Surat eksternal ke perusahaan luar
- Surat eksternal via email (Gmail, Zimbra, dll)
- Surat intercompany — antar perusahaan dalam PI Group (contoh: Pupuk Indonesia ke Pupuk Kaltim)

**Ditentukan oleh:** konfigurasi template surat di Master Data. Jika template memiliki flag "Ttd Digital" dan "Stamp Digital" aktif, flow ini yang digunakan.

---

## 3. Flow Lengkap

```
Drafter
↓ isi form + badan surat (sama seperti flow biasa)
Kirim ke Reviewer
↓
Reviewer 1 → Reviewer 2 (opsional)
↓ review, edit, setujui / kembalikan / batalkan
Approver
↓ membaca surat, memutuskan
Setujui → pop-up OTP muncul
↓ Approver input kode OTP (dikirim ke email + nomor HP)
Peruri memproses tanda tangan digital
↓ proses terjadi di luar sistem DOF
Dokumen kembali ke DOF dengan TTD digital terpasang
↓
Admin Stempel
↓ menempelkan stempel digital (tanpa OTP)
↓ klik Verifikasi Stempel Digital
Peruri memproses stempel
↓
Surat terkirim ke Tujuan
```

---

## 4. Perbedaan dengan Flow Biasa

| Area | Flow Biasa | Flow Digital Sign & Stempel |
|---|---|---|
| Jenis surat | Internal | Eksternal / Intercompany |
| Setelah Approver setujui | Langsung ke Tujuan | OTP → Peruri TTD → Admin Stempel → Peruri Stempel → Tujuan |
| Role tambahan | Tidak ada | Admin Stempel |
| Integrasi eksternal | Tidak ada | Peruri — tanda tangan & stempel |
| OTP | Tidak ada | Wajib — dikirim ke email + nomor HP Approver |
| Penerima | Inbox DOF | Email eksternal / Inbox DOF perusahaan lain |
| Tanda tangan | Tanda tangan basah (manual) | Tanda tangan digital via Peruri |

---

## 5. Tahapan Detail

### 5.1 Drafter

Sama seperti flow biasa — tidak ada perbedaan di sisi Drafter.

- Isi form: Jenis Surat, Template, Klasifikasi, Sifat, Kecepatan Tanggapan, Judul
- Isi Reviewer dan Approver — auto-fill berdasarkan direct superior, bisa diubah
- Isi Tujuan — menentukan jalur pengiriman akhir (lihat Section 7)
- Isi badan surat via text editor
- Kirim ke Reviewer

### 5.2 Reviewer

Sama seperti flow biasa.

- Review dan edit dokumen jika diperlukan
- Setujui → lanjut ke Reviewer berikutnya atau Approver
- Kembalikan → surat kembali ke Drafter, flow mengulang dari awal
- Batalkan → surat langsung close

### 5.3 Approver — OTP Flow

Ini yang membedakan flow ini dari flow biasa.

**Setelah Approver klik Setujui:**

1. Sistem menampilkan pop-up OTP
2. Kode OTP dikirim otomatis ke email dan nomor HP Approver
3. Approver input kode OTP di pop-up
4. Sistem mengirim request ke Peruri untuk memproses tanda tangan digital
5. Proses tanda tangan terjadi di sistem Peruri — di luar DOF
6. Setelah Peruri selesai, dokumen dengan TTD digital kembali ke DOF
7. Surat masuk ke antrian Admin Stempel

**Rules OTP:**
- OTP dikirim ke dua channel sekaligus — email dan nomor HP
- Jika OTP salah, user bisa request kirim ulang
- OTP memiliki masa berlaku — perlu dikonfirmasi ke client berapa menit
- Jika proses Peruri gagal, sistem harus menampilkan pesan error yang jelas dengan opsi coba ulang

### 5.4 Admin Stempel

Role ini dipegang oleh departemen BPO. Satu perusahaan hanya punya satu role Admin Stempel.

**Flow Admin Stempel:**
1. Surat masuk ke antrian Admin Stempel setelah TTD digital sukses
2. Admin Stempel membuka surat
3. Admin Stempel menempelkan stempel digital — tanpa OTP
4. Admin Stempel klik "Verifikasi Stempel Digital"
5. Sistem mengirim request ke Peruri untuk memproses stempel
6. Setelah Peruri selesai, surat dikirim ke Tujuan sesuai jalur pengiriman

**Rules Admin Stempel:**
- Tidak memerlukan OTP — satu perusahaan satu role, sudah terverifikasi
- Admin Stempel tidak bisa mengedit isi dokumen
- Admin Stempel tidak bisa mengembalikan atau membatalkan surat di tahap ini

---

## 6. Jalur Pengiriman ke Tujuan

Setelah stempel digital sukses, surat dikirim ke tujuan sesuai tipe tujuan yang dipilih Drafter.

### 6.1 Tujuan Manual (Ketik Langsung)

- Tujuan diketik manual oleh Drafter — tidak terdaftar di sistem manapun
- Surat **tidak terkirim otomatis** ke siapapun
- Drafter harus download surat dan kirim secara manual (email, pos, dll)
- Status surat di DOF: Selesai setelah proses stempel

### 6.2 Tujuan Email Eksternal

- Email tujuan terdaftar di master data perusahaan
- Setelah stempel sukses → surat otomatis terkirim ke inbox email tujuan (Gmail, Zimbra, dll)
- Tidak perlu aksi manual dari Drafter atau Admin Stempel

### 6.3 Tujuan Intercompany (PI Group)

- Surat dikirim ke perusahaan lain dalam PI Group (contoh: dari Pupuk Indonesia ke Pupuk Kaltim)
- Setelah stempel sukses → surat masuk ke **inbox DOF** perusahaan penerima
- Di perusahaan penerima, surat diterima oleh **Admin Pendok** — role khusus yang punya akses menerima dokumen eksternal
- Admin Pendok yang mendistribusikan surat ke internal perusahaannya
- Flow di sisi penerima sama seperti flow surat internal biasa setelah masuk inbox

---

## 7. Role Admin Stempel

| Aspek | Detail |
|---|---|
| Dipegang oleh | Departemen BPO |
| Jumlah per perusahaan | Satu role saja |
| Kapan aktif | Setelah TTD digital dari Peruri sukses |
| Bisa edit dokumen | Tidak |
| Bisa batalkan surat | Tidak |
| Perlu OTP | Tidak |
| Action utama | Tempelkan stempel → Verifikasi Stempel Digital |

---

## 8. Integrasi Peruri

DOF terintegrasi dengan Peruri untuk dua proses: tanda tangan digital dan stempel digital.

| Proses | Trigger | Dilakukan Oleh | OTP |
|---|---|---|---|
| Tanda tangan digital | Approver klik Setujui + input OTP | Peruri (eksternal) | Ya — dikirim ke email + HP Approver |
| Stempel digital | Admin Stempel klik Verifikasi Stempel Digital | Peruri (eksternal) | Tidak |

**Rules integrasi:**
- Proses Peruri terjadi di luar sistem DOF — DOF hanya mengirim request dan menerima hasil
- Jika proses Peruri timeout atau gagal, DOF menampilkan pesan error dengan opsi retry
- Dokumen yang sudah di-TTD tidak bisa diedit — read-only total
- Status surat selama proses Peruri berlangsung: dalam antrian, tidak bisa diinterupsi

---

## 9. Konfigurasi Template — Master Data

Flow ini hanya aktif jika template surat dikonfigurasi dengan flag berikut di Master Data:

| Flag | Fungsi |
|---|---|
| Ttd Digital | Mengaktifkan proses tanda tangan digital via Peruri |
| Stamp Digital | Mengaktifkan proses stempel digital via Peruri |
| Tujuan Internal | Harus tidak dicentang untuk surat eksternal |
| QR All Page | Opsional — QR code di semua halaman dokumen |

**Rules:**
- Jika Ttd Digital dan Stamp Digital tidak dicentang → template menggunakan tanda tangan basah (manual)
- Admin yang mengatur konfigurasi template — bukan Drafter
- Template bisa dibatasi per unit kerja

---

## 10. UI Requirements

### Approver — Pop-up OTP

- Muncul otomatis setelah Approver klik Setujui
- Judul: "Verifikasi Tanda Tangan Digital"
- Body: "Kode OTP telah dikirim ke email dan nomor HP Anda. Masukkan kode untuk melanjutkan."
- Field: input 6 digit OTP
- CTA: Verifikasi | Kirim Ulang OTP | Batal
- Jika OTP salah: inline error "Kode OTP tidak valid. Silakan coba lagi."
- Jika OTP expired: inline error "Kode OTP sudah kadaluarsa." + tombol Kirim Ulang aktif

### Loading State — Proses Peruri

Saat menunggu Peruri memproses TTD atau stempel, tampilkan loading state yang jelas:

- Indikator loading dengan pesan: "Sedang memproses tanda tangan digital..." atau "Sedang memproses stempel digital..."
- User tidak bisa melakukan aksi lain selama proses berlangsung
- Jika proses selesai: notifikasi sukses + status surat update otomatis
- Jika proses gagal: notifikasi error + tombol Coba Lagi

### Admin Stempel — Action Bar

- Tombol utama: "Verifikasi Stempel Digital" — primary style
- Tidak ada tombol Simpan, Edit, atau Kembalikan
- Read-only untuk seluruh konten dokumen

---

## 11. Status Surat — Flow Digital Sign & Stempel

| Tahap | Status UI |
|---|---|
| Drafter submit | Menunggu Review |
| Reviewer menyetujui | Menunggu Approval |
| Approver menyetujui, menunggu OTP | Menunggu Tanda Tangan Digital |
| Peruri memproses TTD | Diproses Peruri |
| TTD sukses, menunggu Admin Stempel | Menunggu Stempel |
| Admin Stempel verifikasi, menunggu Peruri | Diproses Stempel |
| Stempel sukses, surat terkirim | Disetujui / Terkirim |
| Gagal di Peruri | Gagal — perlu tindakan |

---

## 12. Error Handling

| Kondisi Error | Pesan UI | Aksi yang Tersedia |
|---|---|---|
| OTP salah | "Kode OTP tidak valid. Silakan coba lagi." | Input ulang OTP |
| OTP expired | "Kode OTP sudah kadaluarsa." | Kirim Ulang OTP |
| Peruri TTD timeout | "Proses tanda tangan gagal. Silakan coba lagi." | Coba Lagi / Hubungi Admin |
| Peruri Stempel gagal | "Proses stempel gagal. Silakan coba lagi." | Coba Lagi / Hubungi Admin |
| File PDF tidak valid | "Format dokumen tidak didukung oleh Peruri." | Kembali ke Drafter untuk perbaiki dokumen |

---

## 13. Open Questions

1. Berapa menit masa berlaku OTP sebelum expired?
2. Berapa maksimal percobaan input OTP yang salah sebelum di-lock?
3. Jika proses Peruri gagal berulang kali — apakah ada escalation flow ke Admin atau hanya retry?
4. Apakah Admin Stempel bisa menolak atau mengembalikan surat ke Approver jika ada masalah di dokumen?
5. Apakah history proses OTP dan stempel masuk ke tab Riwayat di Detail Surat?
6. Untuk tujuan intercompany — apakah Admin Pendok bisa mendistribusikan surat ke lebih dari satu orang internal?
7. Apakah ada notifikasi ke Drafter ketika TTD dan stempel sudah sukses?

---

*PRD Flow Digital Sign & Stempel v1.0 — bagian dari PRD DOF Full Flow Persuratan.*