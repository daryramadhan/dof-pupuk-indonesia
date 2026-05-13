# PRD — DOF Side Navigation Bar per Role

**Product:** DOF / Digital Office  
**Scope:** Side Navigation Bar redesign for role-based experience  
**Version:** 1.0  
**Context:** Rebuild UX DOF while preserving existing backend roles, permissions, and workflow logic.

---

## 1. Product Context

DOF adalah platform internal untuk mengelola lifecycle surat/dokumen perusahaan, mulai dari penciptaan surat, review, approval, pengiriman ke tujuan, tindak lanjut, arsip, permission, reporting, hingga administrasi sistem.

Existing sidebar menampilkan banyak menu sekaligus, sehingga user perlu melakukan scanning panjang untuk menemukan tugas utama mereka. Dalam rebuild UX, side navigation harus mengikuti **pekerjaan utama tiap role**, bukan sekadar menampilkan semua fitur yang tersedia.

Prinsip utama:

> Sidebar harus membantu user menemukan pekerjaan paling penting sesuai role mereka dalam waktu cepat.

---

## 2. Objective

Redesign side navigation bar agar:

1. Lebih mudah dipahami oleh masing-masing role.
2. Mengurangi cognitive load dari menu yang terlalu banyak.
3. Memprioritaskan task utama setiap role.
4. Menyatukan menu yang sebelumnya terpecah berdasarkan status menjadi satu area kerja berbasis status/filter.
5. Tetap compatible dengan backend dan permission existing.
6. Mendukung mode **minimized / collapsed navigation** untuk memperluas area kerja.

---

## 3. Core UX Principles

### 3.1 Role-based priority

Setiap role memiliki sidebar yang berbeda berdasarkan pekerjaan utamanya.

- Drafter fokus ke penciptaan dan manajemen surat.
- Reviewer fokus ke review surat.
- Approver fokus ke approval surat.
- Tujuan fokus ke inbox dan tindak lanjut.
- Admin fokus ke administrasi dan konfigurasi sistem.

### 3.2 Status should live inside page, not sidebar

Status seperti Draft, Menunggu Review, Menunggu Approval, Direvisi, Dibatalkan, Disetujui, Belum Upload, dan Sudah Upload tidak perlu menjadi menu utama di sidebar.

Status tersebut lebih tepat menjadi filter, tab, atau segmented control di halaman **Manajemen Surat**.

### 3.3 Sidebar is for destination, not every state

Sidebar harus berisi destination page utama, bukan semua kemungkinan state dokumen.

Contoh:
- Gunakan **Manajemen Surat** sebagai hub.
- Jangan membuat menu terpisah untuk semua status.

### 3.4 Badge only for actionable count

Badge hanya digunakan untuk item yang membutuhkan perhatian atau action.

Contoh:
- Menunggu Review Saya
- Menunggu Approval Saya
- Inbox
- Notifikasi di header

Jangan gunakan badge untuk total data besar yang tidak actionable.

### 3.5 Keep creation discoverable

Walaupun **Buat Surat Baru** tidak harus muncul sebagai sidebar item, CTA untuk membuat surat baru harus tetap sangat terlihat di halaman Manajemen Surat.

---

## 4. Global Sidebar Structure

Semua role menggunakan struktur visual yang konsisten:

1. Brand area
2. Dashboard
3. Role-primary group
4. Penciptaan Surat group jika role bisa membuat surat
5. Inbox jika relevan
6. Dokumen & Arsip
7. Laporan / Pencarian
8. Admin group khusus role admin
9. Optional minimized state

---

## 5. Global Sidebar Components

### 5.1 Brand Area

Menampilkan:
- Logo / company mark
- Company name: **Pupuk Indonesia**
- Product label: **Digital Office**

Example:

```text
[PI] Pupuk Indonesia
     Digital Office
```

### 5.2 Navigation Item Anatomy

Setiap navigation item dapat berisi:

- Icon
- Label
- Active state
- Optional badge
- Optional chevron jika expandable

Example:

```text
[icon] Manajemen Surat
```

### 5.3 Section Label

Section label digunakan untuk mengelompokkan menu.

Example:
- PENCIPTAAN SURAT
- REVIEW SURAT
- APPROVAL SURAT
- DOKUMEN & ARSIP
- ADMINISTRASI
- LAPORAN

### 5.4 Active State

Active state harus jelas dan konsisten.

Recommendation:
- Background highlight
- Strong label color
- Optional left border or icon color
- Do not rely only on color if possible

### 5.5 Badge

Badge digunakan untuk count yang actionable.

Rules:
- Use badge for unread inbox, pending review, pending approval.
- Do not use badge for total records.
- Use cap: `99+` if number is too large.
- Badge color:
  - Warning / orange for pending task
  - Critical / red for urgent/unread
  - Neutral only if non-critical

---

## 6. Sidebar Minimize / Collapse Requirement

### 6.1 Objective

Side navigation harus bisa di-minimize agar user memiliki area kerja yang lebih luas, terutama saat membaca dokumen, review surat, approval surat, atau bekerja dengan tabel besar.

### 6.2 Trigger Placement

Tambahkan button minimize/collapse di **bagian kanan atas navigation bar**.

Posisi:
- Top-right inside sidebar
- Dekat brand area
- Tetap visible saat sidebar expanded

Example:

```text
[PI] Pupuk Indonesia                         [collapse button]
     Digital Office
```

### 6.3 Expanded State

Saat expanded, sidebar menampilkan:
- Logo
- Product name
- Section labels
- Icon + label
- Badge
- Chevron
- Optional nested menu

### 6.4 Minimized State

Saat minimized, sidebar menampilkan:
- Icon-only navigation
- Badge tetap tampil sebagai dot/count kecil
- Tooltip on hover
- Active state tetap terlihat
- Section label disembunyikan
- Brand dapat disingkat menjadi logo saja

Example minimized item:

```text
[home icon]
[document icon] 8
[inbox icon] 3
```

### 6.5 Interaction Rules

- Click collapse button → sidebar becomes minimized.
- Click expand button → sidebar returns to full width.
- User preference should persist during session.
- On smaller screens, sidebar can behave as overlay/drawer.
- Tooltip appears when user hovers over icon in minimized state.

### 6.6 Acceptance Criteria

- User can collapse sidebar from the top-right button.
- User can expand sidebar again.
- Active menu remains identifiable in minimized state.
- Badges remain visible in minimized state.
- Tooltip shows full menu name when collapsed.
- Main content area expands when sidebar is minimized.

---

# 7. Role: Drafter

## 7.1 Role Summary

Drafter adalah user yang membuat surat dan memantau status surat yang dibuatnya.

Primary jobs:
- Membuat surat.
- Mengelola draft.
- Melihat surat yang sedang menunggu review/approval.
- Melihat surat yang dikembalikan/revisi.
- Mengakses inbox jika menerima surat.
- Mengakses arsip dan dokumen jika punya permission.

## 7.2 Sidebar Recommendation — Drafter

```text
Pupuk Indonesia
Digital Office

Dashboard

PENCIPTAAN SURAT
- Manajemen Surat
- Buat SP/ASP

Inbox

DOKUMEN & ARSIP
- Manajemen Arsip Aktif
- Manajemen Arsip Inaktif
- Permission Document
- Rekap Arsip

LAPORAN
- Rekap

Pencarian
```

## 7.3 Notes

- **Tidak ada Master Data** untuk Drafter, karena konfigurasi sistem hanya untuk Admin.
- **Inbox tetap di sidebar** karena Drafter juga bisa menjadi penerima surat.
- **Notifikasi dipindah ke header**, cukup berupa bell icon di topbar.
- **Penciptaan Surat hanya berisi Manajemen Surat + Buat SP/ASP.**
- **Buat Surat Baru tidak menjadi sidebar item**, tetapi menjadi primary CTA di halaman Manajemen Surat.
- **Dokumen & Arsip** mengelompokkan Arsip Aktif, Arsip Inaktif, Permission Document, dan Rekap Arsip dalam satu group.

## 7.4 Manajemen Surat Page Requirement for Drafter

Karena **Buat Surat Baru** tidak muncul di sidebar, halaman Manajemen Surat wajib memiliki CTA yang sangat jelas.

Header page:

```text
Manajemen Surat
Kelola surat yang Anda buat, revisi, atau sedang dalam proses.

[+ Buat Surat Baru] [Buat SP/ASP]
```

Status filters inside page:
- Semua
- Draft
- Direvisi
- Menunggu Review
- Menunggu Approval
- Disetujui
- Dibatalkan
- Belum Upload
- Sudah Upload

## 7.5 Badge Rules — Drafter

Badge boleh tampil di:
- Inbox: jumlah unread/actionable inbox
- Manajemen Surat: hanya jika ada surat yang perlu action, misalnya direvisi atau perlu upload

Badge tidak perlu tampil di:
- Rekap
- Pencarian
- Arsip
- Permission Document, kecuali ada pending request

## 7.6 Acceptance Criteria — Drafter

- Drafter dapat menemukan Manajemen Surat dari sidebar.
- Drafter dapat membuat surat baru dari CTA di halaman Manajemen Surat.
- Drafter tidak melihat Master Data.
- Drafter dapat membuka Inbox dari sidebar.
- Drafter dapat mengakses Dokumen & Arsip sesuai permission.
- Notifikasi tidak muncul sebagai sidebar item, tetapi muncul di header.

---

# 8. Role: Reviewer

## 8.1 Role Summary

Reviewer adalah user yang meninjau dan dapat mengedit isi dokumen sebelum surat lanjut ke approval.

Reviewer juga dapat menjadi Drafter untuk surat lain, sehingga masih membutuhkan akses ke Penciptaan Surat.

Primary jobs:
- Melihat surat yang menunggu review.
- Review dan edit dokumen.
- Menyetujui, mengembalikan, atau membatalkan surat.
- Melihat surat yang sudah direview.
- Membuat dan mengelola surat jika bertindak sebagai Drafter.

## 8.2 Sidebar Recommendation — Reviewer

```text
Pupuk Indonesia
Digital Office

Dashboard

REVIEW SURAT
- Menunggu Review Saya
- Telah Saya Review

PENCIPTAAN SURAT
- Manajemen Surat
- Buat SP/ASP

Inbox

DOKUMEN & ARSIP
- Manajemen Arsip Aktif
- Manajemen Arsip Inaktif
- Permission Document

Pencarian
```

## 8.3 Notes

- **Review Surat** adalah group utama Reviewer dan ditampilkan paling atas setelah Dashboard.
- **Menunggu Review Saya** memiliki badge counter warning dan selalu visible.
- Reviewer tetap punya akses **Manajemen Surat** karena reviewer juga bisa menjadi Drafter di surat lain.
- Rekap Arsip dan Laporan tidak ditampilkan jika tidak relevan untuk role Reviewer.
- Notifikasi tetap berada di header.

## 8.4 Review Surat Page Requirement

**Menunggu Review Saya** adalah task-specific destination.

It should show:
- Surat yang membutuhkan action reviewer.
- Review level jika relevan.
- Kecepatan tanggapan.
- Status.
- Pengirim/Drafter.
- Tanggal masuk.
- CTA: Lihat Detail / Review.

**Telah Saya Review** should show:
- Surat yang sudah diproses reviewer.
- Status terakhir.
- Latest activity.
- Action: Lihat Detail.

## 8.5 Badge Rules — Reviewer

Badge boleh tampil di:
- Menunggu Review Saya: jumlah surat yang perlu review
- Inbox: jumlah unread/actionable inbox

Badge tidak perlu tampil di:
- Telah Saya Review
- Manajemen Surat, kecuali ada item yang perlu action sebagai Drafter
- Arsip
- Pencarian

## 8.6 Acceptance Criteria — Reviewer

- Reviewer langsung melihat menu Menunggu Review Saya.
- Reviewer dapat melihat jumlah surat menunggu review dari badge.
- Reviewer dapat membuka surat yang sudah direview.
- Reviewer tetap bisa mengakses Manajemen Surat untuk surat yang dibuatnya.
- Reviewer tidak melihat menu laporan yang tidak relevan jika permission tidak membutuhkan.

---

# 9. Role: Approver

## 9.1 Role Summary

Approver adalah decision maker yang memutuskan apakah surat boleh diteruskan ke tujuan. Approver tidak mengedit dokumen.

Approver juga dapat menjadi Drafter untuk surat lain, sehingga masih membutuhkan akses ke Penciptaan Surat.

Primary jobs:
- Melihat surat yang menunggu approval.
- Membaca dokumen dan catatan reviewer.
- Menyetujui, mengembalikan, atau membatalkan surat.
- Melihat surat yang sudah diperiksa.
- Membuat dan mengelola surat jika bertindak sebagai Drafter.

## 9.2 Sidebar Recommendation — Approver

```text
Pupuk Indonesia
Digital Office

Dashboard

APPROVAL SURAT
- Menunggu Approval Saya
- Telah Saya Periksa

PENCIPTAAN SURAT
- Manajemen Surat
- Buat SP/ASP

Inbox

DOKUMEN & ARSIP
- Manajemen Arsip Aktif
- Manajemen Arsip Inaktif
- Permission Document

Pencarian
```

## 9.3 Notes

- **Approval Surat** adalah group utama Approver dan ditampilkan paling atas setelah Dashboard.
- **Menunggu Approval Saya** memiliki badge counter warning.
- Approver tetap punya akses **Manajemen Surat** karena approver juga bisa menjadi Drafter.
- Master Data tidak ditampilkan untuk Approver.
- Notifikasi berada di header.
- Approver tidak membutuhkan menu Review Surat jika tidak punya role reviewer.

## 9.4 Approval Surat Page Requirement

**Menunggu Approval Saya** should show:
- Surat yang membutuhkan keputusan approver.
- Status.
- Kecepatan.
- Reviewer terakhir.
- Tanggal masuk.
- CTA: Lihat Detail / Periksa.

**Telah Saya Periksa** should show:
- Surat yang sudah diputuskan approver.
- Status terakhir.
- Action history.
- CTA: Lihat Detail.

## 9.5 Badge Rules — Approver

Badge boleh tampil di:
- Menunggu Approval Saya: jumlah surat yang perlu approval
- Inbox: jumlah unread/actionable inbox

Badge tidak perlu tampil di:
- Telah Saya Periksa
- Arsip
- Pencarian
- Manajemen Surat, kecuali ada item yang perlu action sebagai Drafter

## 9.6 Acceptance Criteria — Approver

- Approver langsung melihat menu Menunggu Approval Saya.
- Approver dapat melihat jumlah approval pending dari badge.
- Approver dapat membuka riwayat surat yang sudah diperiksa.
- Approver tetap bisa mengakses Manajemen Surat untuk surat yang dibuatnya.
- Approver tidak melihat Master Data.

---

# 10. Role: Tujuan / Penerima

## 10.1 Role Summary

Tujuan atau Penerima adalah user yang menerima surat setelah proses approval selesai.

Primary jobs:
- Membaca surat masuk.
- ACC surat.
- Tolak surat.
- Disposisi.
- Alihkan.
- CC.
- Submit tindak lanjut.
- Membuat surat tindak lanjut jika diperlukan.

## 10.2 Sidebar Recommendation — Tujuan

```text
Pupuk Indonesia
Digital Office

Dashboard

Inbox

PENCIPTAAN SURAT
- Manajemen Surat
- Buat SP/ASP

DOKUMEN & ARSIP
- Manajemen Arsip Aktif
- Manajemen Arsip Inaktif
- Permission Document
- Rekap Arsip

Pencarian
```

## 10.3 Notes

- **Inbox naik ke posisi kedua setelah Dashboard** karena ini primary destination untuk Tujuan/Penerima.
- Badge counter Inbox harus prominent karena user perlu tahu berapa surat yang belum dibaca.
- Tidak ada group Review atau Approval jika role tersebut tidak relevan.
- Tujuan tetap punya akses **Manajemen Surat** karena bisa juga membuat surat atau membuat surat tindak lanjut.
- Flow tindak lanjut dengan surat harus dimulai dari Inbox Detail, bukan memaksa user keluar ke Manajemen Surat.

## 10.4 Inbox Page Requirement

Inbox should show:
- Unread
- Read
- On Progress
- Closed
- Cancelled

Actions available from detail:
- ACC
- Tolak
- Disposisi
- Alihkan
- CC
- Submit Tindak Lanjut

## 10.5 Badge Rules — Tujuan

Badge boleh tampil di:
- Inbox: jumlah surat unread atau actionable
- Optional: tindak lanjut pending jika dipisahkan

Badge tidak perlu tampil di:
- Manajemen Surat
- Arsip
- Pencarian

## 10.6 Acceptance Criteria — Tujuan

- Tujuan dapat membuka Inbox langsung dari sidebar.
- Inbox badge menunjukkan jumlah surat yang membutuhkan perhatian.
- Tidak ada menu Review/Approval jika tidak relevan.
- Tujuan tetap dapat membuat surat/tindak lanjut melalui Manajemen Surat atau dari Inbox Detail.
- Pencarian tetap tersedia untuk menemukan dokumen.

---

# 11. Role: Admin

## 11.1 Role Summary

Admin adalah user yang mengelola konfigurasi sistem dan data master. Admin juga dapat melakukan aktivitas operasional seperti membuat surat, tergantung permission.

Primary jobs:
- Mengelola user.
- Mengelola master data.
- Mengelola template surat.
- Mengelola setting meterai.
- Mengelola e-meterai jika memiliki akses operasional.
- Mengelola migrasi dan registrasi surat masuk.
- Mengakses penciptaan surat jika diperlukan.

## 11.2 Sidebar Recommendation — Admin

```text
Pupuk Indonesia
Digital Office

Dashboard

ADMINISTRASI
- User Management
- Master Data
- Setting Meterai
- E-Meterai
- Migrasi
- Reg Surat Masuk

PENCIPTAAN SURAT
- Manajemen Surat

Inbox

DOKUMEN & ARSIP
- Manajemen Arsip Aktif
- Manajemen Arsip Inaktif
- Permission Document
- Rekap Arsip

LAPORAN
- Rekap

Pencarian
```

## 11.3 Notes

- **Administrasi** adalah group utama Admin dan berada paling atas setelah Dashboard.
- Admin memiliki akses penuh ke menu konfigurasi seperti Master Data, User Management, Setting Meterai, dan E-Meterai.
- Penciptaan Surat tetap ada karena Admin bisa membuat surat juga.
- Badge counter tidak perlu ditampilkan untuk menu Administrasi karena area ini config-based, bukan task-based.
- Jika E-Meterai memiliki dua konteks, pertimbangkan pemisahan:
  - **Setting Meterai** untuk konfigurasi kuota/account.
  - **E-Meterai** untuk upload dokumen dan pembubuhan.

## 11.4 Admin Page Requirement

Admin navigation should prioritize:
- Configuration
- Master data maintenance
- User and role management
- Meterai quota and account management

Admin pages should use:
- Search
- Filter
- Table
- Edit modal/page
- Clear active/inactive status
- Confirmation for risky configuration changes

## 11.5 Badge Rules — Admin

Badge boleh tampil di:
- Inbox, if admin receives letters
- Optional system warning if there are failed configurations or pending admin tasks

Badge tidak perlu tampil di:
- Master Data
- User Management
- Setting Meterai
- E-Meterai
- Migrasi
- Reg Surat Masuk

## 11.6 Acceptance Criteria — Admin

- Admin sees Administrasi group immediately after Dashboard.
- Admin can access User Management and Master Data quickly.
- Admin still has access to Manajemen Surat and Inbox if needed.
- Admin sidebar does not use unnecessary badge counts for configuration menus.
- Admin can collapse/minimize sidebar like all other roles.

---

# 12. Cross-Role Navigation Matrix

| Menu / Group | Drafter | Reviewer | Approver | Tujuan | Admin |
|---|---:|---:|---:|---:|---:|
| Dashboard | Yes | Yes | Yes | Yes | Yes |
| Review Surat | No | Yes | No | No | No |
| Approval Surat | No | No | Yes | No | No |
| Inbox | Yes | Yes | Yes | Yes | Yes |
| Manajemen Surat | Yes | Yes | Yes | Yes | Yes |
| Buat SP/ASP | Yes | Yes | Yes | Yes | Optional |
| Dokumen & Arsip | Yes | Yes | Yes | Yes | Yes |
| Rekap Arsip | Yes | Optional | Optional | Yes | Yes |
| Laporan / Rekap | Yes | No/Optional | No/Optional | No/Optional | Yes |
| Pencarian | Yes | Yes | Yes | Yes | Yes |
| Administrasi | No | No | No | No | Yes |
| User Management | No | No | No | No | Yes |
| Master Data | No | No | No | No | Yes |
| Setting Meterai | No | No | No | No | Yes |
| E-Meterai | Optional by role | Optional by role | Optional by role | Optional by role | Yes |
| Notifikasi | Header | Header | Header | Header | Header |
| Profil | Header/Profile menu | Header/Profile menu | Header/Profile menu | Header/Profile menu | Header/Profile menu |

---

# 13. Header Relationship

To keep sidebar focused, several utilities should move to header/topbar.

## 13.1 Header Items

- Global search / quick search
- Notification bell
- User profile dropdown
- Help/support if needed
- Company context if multi-company
- Minimize sidebar control can be placed in sidebar top-right or near sidebar boundary

## 13.2 Profile Menu

Profil should be accessible through user avatar dropdown, not primary sidebar.

Dropdown items:
- Edit Profil
- Change Password
- Logout

## 13.3 Notification

Notifikasi should be a bell icon with badge.

Notification menu should group:
- Need action
- Informational
- Returned/Revised
- Completed
- Cancelled/Rejected

---

# 14. Sidebar Behavior

## 14.1 Expanded Behavior

- Displays full label.
- Displays section groups.
- Displays badges.
- Displays active item.
- Supports scroll if menu exceeds viewport.
- Keeps active state visible.

## 14.2 Minimized Behavior

- Displays icons only.
- Displays badge dots/counts.
- Shows tooltip on hover.
- Expands on click of expand button.
- Main content uses extra horizontal space.

## 14.3 Responsive Behavior

Desktop:
- Sidebar expanded by default.
- User can collapse manually.

Tablet/smaller screens:
- Sidebar can become drawer.
- Overlay can be used.
- Collapse button remains accessible.

## 14.4 Persistence

- Sidebar state should persist for current session.
- Optional: persist user preference across login if backend/frontend local storage supports it.

---

# 15. Accessibility Requirements

- Navigation must be keyboard accessible.
- Active state should not rely only on color.
- Badges should have accessible labels.
- Collapse/expand button should have clear aria-label.
- Tooltip in collapsed mode should be readable.
- Icon-only mode should still be understandable with tooltip.
- Color contrast must meet WCAG AA where possible.

Example accessible labels:
- `Collapse sidebar`
- `Expand sidebar`
- `Inbox, 3 unread items`
- `Menunggu Review Saya, 8 pending items`

---

# 16. Content & Labeling Guidelines

## 16.1 Recommended Labels

| Existing / Possible Label | Recommended Label |
|---|---|
| Daftar Surat | Manajemen Surat |
| Menunggu Review | Menunggu Review Saya |
| Menunggu Approval | Menunggu Approval Saya |
| Telah Anda Review | Telah Saya Review |
| Telah Anda Periksa | Telah Saya Periksa |
| Arsip & Dokumen | Dokumen & Arsip |
| History | Riwayat |
| Doc History | Versi Dokumen / Riwayat Dokumen |
| Notifikasi | Header Bell Notification |
| Profil | User Profile Menu |

## 16.2 Tone

Use clear, direct Indonesian labels.

Avoid:
- backend status names
- overly technical labels
- mixed English/Indonesian if avoidable

Allowed if already familiar:
- Inbox
- Permission Document
- E-Meterai

---

# 17. Implementation Notes

## 17.1 Backend Compatibility

This redesign should not require major backend changes.

Expected changes are mostly:
- role-based menu configuration
- frontend route grouping
- UI label mapping
- badge source mapping
- sidebar collapse state

## 17.2 Data Needed

For sidebar badges:
- Pending review count for current user
- Pending approval count for current user
- Inbox unread/actionable count
- Optional pending management surat count

For role-based menu:
- User role(s)
- Permission matrix
- Feature access flags

## 17.3 Multi-role Users

Some users can have multiple roles.

Rules:
- Show highest priority task group based on active role or pending task.
- If user has Reviewer + Drafter access, show Review Surat above Penciptaan Surat.
- If user has Approver + Drafter access, show Approval Surat above Penciptaan Surat.
- If user has Admin + operational access, show Administrasi above Penciptaan Surat.
- Consider an active role/context switch only if needed, but avoid making it feel like users can freely bypass permissions.

---

# 18. Risks & Mitigation

## Risk 1 — User lama mencari menu lama seperti “Daftar Surat”

Mitigation:
- Use Manajemen Surat as label but include subtitle in page.
- Add status filters inside Manajemen Surat.
- During transition, add helper text: “Daftar Surat, Draft, Menunggu Review, dan Menunggu Approval kini berada di Manajemen Surat.”

## Risk 2 — Buat Surat Baru tidak terlihat

Mitigation:
- Put primary CTA `+ Buat Surat Baru` in Manajemen Surat header.
- Optionally include quick create button in dashboard.

## Risk 3 — Role-based sidebar hides menu user expects

Mitigation:
- Validate menu per role with real users.
- Provide search/command palette if possible.
- Keep permission-based access but avoid showing irrelevant menus.

## Risk 4 — Badge count becomes noise

Mitigation:
- Only show actionable count.
- Cap large numbers with `99+`.
- Move notification to header.

## Risk 5 — Minimized sidebar reduces discoverability

Mitigation:
- Provide tooltip.
- Keep active state visible.
- Use recognizable icons.
- Persist user preference.

---

# 19. Success Metrics

## 19.1 Navigation Efficiency

- Time to find primary task decreases.
- Fewer clicks to open pending review/approval/inbox.
- Fewer users ask where “Buat Surat Baru” is.

## 19.2 Task Discovery

- Increase click-through from sidebar task menus.
- Increase use of Manajemen Surat status filters.
- Increase use of role-specific pages like Menunggu Review Saya and Menunggu Approval Saya.

## 19.3 Cognitive Load

- User can explain where to find draft/review/approval status.
- User understands difference between Manajemen Surat and Menunggu Review/Approval Saya.

## 19.4 Sidebar Usage

- Collapse feature adoption rate.
- User retention of collapsed preference.
- Fewer navigation errors in collapsed mode.

---

# 20. Final Recommendation

Use the new sidebar architecture as the baseline.

The final direction should be:

1. **Role-based sidebar**, not one universal sidebar.
2. **Manajemen Surat as the central hub** for letter states.
3. **Review Surat** and **Approval Surat** as task groups only for relevant roles.
4. **Inbox prioritized for Tujuan/Penerima.**
5. **Administrasi prioritized for Admin.**
6. **Notifikasi and Profil moved to header.**
7. **Dokumen & Arsip used as a group for archive, permission, and archive recap.**
8. **Badge only for actionable work.**
9. **Navigation can be minimized from the top-right button of the sidebar.**
10. **Minimized state must preserve icons, active state, badge, and tooltip.**

This approach improves clarity without requiring major backend changes and aligns with the rebuild goal: one cleaner role-based navigation system that supports the existing DOF workflow.
