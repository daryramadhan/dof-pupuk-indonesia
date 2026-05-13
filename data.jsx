// data.jsx — realistic dummy data for Pupuk Indonesia HR dashboard.

const ANAK_PERUSAHAAN = [
  { id: 'pkg', name: 'Petrokimia Gresik',   short: 'PKG',  color: '#00A76F', headcount: 3486 },
  { id: 'pkt', name: 'Pupuk Kaltim',        short: 'PKT',  color: '#0095D9', headcount: 2914 },
  { id: 'psp', name: 'Pupuk Sriwidjaja',    short: 'Pusri',color: '#B76E00', headcount: 2247 },
  { id: 'pkj', name: 'Pupuk Kujang',        short: 'PKC',  color: '#5119B7', headcount: 1532 },
  { id: 'pim', name: 'Pupuk Iskandar Muda', short: 'PIM',  color: '#B71D18', headcount:  988 },
  { id: 'phq', name: 'Holding (HQ Jakarta)',short: 'PI HQ',color: '#1939B7', headcount:  680 },
];

const TOTAL_HEADCOUNT = ANAK_PERUSAHAAN.reduce((s,a) => s + a.headcount, 0); // 11,847
const HC_DISPLAY = 12847;

// 12 months headcount trend (dummy)
const HEADCOUNT_TREND = [
  { m: 'Jun', v: 12180 },
  { m: 'Jul', v: 12245 },
  { m: 'Agu', v: 12298 },
  { m: 'Sep', v: 12356 },
  { m: 'Okt', v: 12412 },
  { m: 'Nov', v: 12489 },
  { m: 'Des', v: 12541 },
  { m: 'Jan', v: 12604 },
  { m: 'Feb', v: 12671 },
  { m: 'Mar', v: 12728 },
  { m: 'Apr', v: 12798 },
  { m: 'Mei', v: 12847 },
];

// Hires vs exits per month (last 6 months)
const HIRE_EXIT = [
  { m: 'Des', hire: 84, exit: 32 },
  { m: 'Jan', hire: 92, exit: 29 },
  { m: 'Feb', hire: 78, exit: 11 },
  { m: 'Mar', hire: 110,exit: 53 },
  { m: 'Apr', hire: 97, exit: 27 },
  { m: 'Mei', hire: 121, exit: 72 },
];

const DEMOGRAFI_USIA = [
  { lbl: '<25 tahun',    pct: 12, count: 1542 },
  { lbl: '25–34 tahun',  pct: 34, count: 4368 },
  { lbl: '35–44 tahun',  pct: 28, count: 3597 },
  { lbl: '45–54 tahun',  pct: 18, count: 2312 },
  { lbl: '≥55 tahun',    pct:  8, count: 1028 },
];

const PENDING_APPROVALS = [
  { id: 1, name: 'Siti Nurhaliza',     unit: 'Petrokimia Gresik · Produksi', tipe: 'Cuti Tahunan',  durasi: '12–16 Mei',  hari: 5, status: 'pending', av: 1, init: 'SN' },
  { id: 2, name: 'Bambang Triyanto',   unit: 'Pupuk Kaltim · Distribusi',    tipe: 'Klaim Lembur',  durasi: '8–10 Mei',   hari: 18, status: 'pending', av: 2, init: 'BT' },
  { id: 3, name: 'Rini Anggraini',     unit: 'Pusri · Keuangan',             tipe: 'Cuti Sakit',    durasi: '11 Mei',     hari: 1, status: 'pending', av: 3, init: 'RA' },
  { id: 4, name: 'Ahmad Fauzi',        unit: 'PI HQ · IT',                   tipe: 'Reimburse',     durasi: 'Rp 4.2 Jt',   hari: null, status: 'pending', av: 4, init: 'AF' },
  { id: 5, name: 'Dewi Lestari',       unit: 'Pupuk Kujang · HR',            tipe: 'Pelatihan',     durasi: 'Sertifikasi K3', hari: null, status: 'pending', av: 5, init: 'DL' },
];

const UPCOMING = [
  { id: 1, type: 'birthday', who: 'Hendra Setiawan',   meta: 'PI HQ · 15 Mei', av: 6, init: 'HS' },
  { id: 2, type: 'anniv',    who: 'Maya Putri',        meta: '10 tahun · 16 Mei', av: 1, init: 'MP' },
  { id: 3, type: 'event',    who: 'Town Hall Q2',      meta: 'Auditorium · 17 Mei 09:00', av: null },
  { id: 4, type: 'birthday', who: 'Joko Susanto',      meta: 'Petrokimia Gresik · 18 Mei', av: 3, init: 'JS' },
  { id: 5, type: 'training', who: 'Pelatihan Safety',  meta: 'Bontang · 20 Mei', av: null },
];

const EMPLOYEES = [
  { id: 'PI-08421', name: 'Bambang Triyanto',     email: 'bambang.t@pupuk-indonesia.com',     unit: 'Pupuk Kaltim',         dept: 'Distribusi & Logistik', jabatan: 'Senior Manager',       lokasi: 'Bontang',     status: 'active',  joined: '14 Mar 2012', av: 2, init: 'BT' },
  { id: 'PI-12903', name: 'Siti Nurhaliza',       email: 'siti.n@petrokimia-gresik.com',       unit: 'Petrokimia Gresik',    dept: 'Produksi Urea',          jabatan: 'Operator Sr.',         lokasi: 'Gresik',      status: 'on-leave',joined: '02 Jul 2018', av: 1, init: 'SN' },
  { id: 'PI-09112', name: 'Ahmad Fauzi',          email: 'ahmad.fauzi@pupuk-indonesia.com',    unit: 'Holding HQ',           dept: 'Information Technology', jabatan: 'Lead Engineer',        lokasi: 'Jakarta',     status: 'active',  joined: '21 Sep 2015', av: 4, init: 'AF' },
  { id: 'PI-14580', name: 'Rini Anggraini',       email: 'rini.a@pusri.co.id',                 unit: 'Pupuk Sriwidjaja',     dept: 'Keuangan',               jabatan: 'Accounting Officer',   lokasi: 'Palembang',   status: 'active',  joined: '11 Nov 2020', av: 3, init: 'RA' },
  { id: 'PI-06234', name: 'Dewi Lestari',         email: 'dewi.l@pupuk-kujang.co.id',          unit: 'Pupuk Kujang',         dept: 'Human Resources',        jabatan: 'HR Business Partner',  lokasi: 'Cikampek',    status: 'active',  joined: '05 Apr 2010', av: 5, init: 'DL' },
  { id: 'PI-15721', name: 'Hendra Setiawan',      email: 'hendra.s@pupuk-indonesia.com',       unit: 'Holding HQ',           dept: 'Pemasaran',              jabatan: 'Brand Manager',        lokasi: 'Jakarta',     status: 'active',  joined: '17 Jan 2021', av: 6, init: 'HS' },
  { id: 'PI-04812', name: 'Maya Putri',           email: 'maya.p@petrokimia-gresik.com',       unit: 'Petrokimia Gresik',    dept: 'R&D',                    jabatan: 'Research Scientist',   lokasi: 'Gresik',      status: 'active',  joined: '16 May 2014', av: 1, init: 'MP' },
  { id: 'PI-13290', name: 'Joko Susanto',         email: 'joko.s@petrokimia-gresik.com',       unit: 'Petrokimia Gresik',    dept: 'Quality Control',        jabatan: 'QC Supervisor',        lokasi: 'Gresik',      status: 'active',  joined: '08 Aug 2019', av: 3, init: 'JS' },
  { id: 'PI-11055', name: 'Lestari Wibowo',       email: 'lestari.w@pim.co.id',                unit: 'Pupuk Iskandar Muda',  dept: 'Produksi NPK',           jabatan: 'Plant Engineer',       lokasi: 'Lhokseumawe', status: 'probation',joined: '03 Feb 2025', av: 5, init: 'LW' },
  { id: 'PI-07863', name: 'Andi Pratama',         email: 'andi.p@pupuk-kaltim.com',            unit: 'Pupuk Kaltim',         dept: 'K3LL',                   jabatan: 'Safety Officer',       lokasi: 'Bontang',     status: 'active',  joined: '29 Oct 2017', av: 2, init: 'AP' },
  { id: 'PI-15912', name: 'Cahyo Nugroho',        email: 'cahyo.n@pupuk-indonesia.com',        unit: 'Holding HQ',           dept: 'Audit Internal',         jabatan: 'Senior Auditor',       lokasi: 'Jakarta',     status: 'active',  joined: '12 Dec 2021', av: 6, init: 'CN' },
  { id: 'PI-16001', name: 'Putri Maharani',       email: 'putri.m@pusri.co.id',                unit: 'Pupuk Sriwidjaja',     dept: 'Pengadaan',              jabatan: 'Procurement Spec.',    lokasi: 'Palembang',   status: 'inactive',joined: '07 Jun 2016', av: 4, init: 'PM' },
];

const STATUS_CHIP = {
  'active':    { lbl: 'Aktif',    cls: 'green' },
  'on-leave':  { lbl: 'Cuti',     cls: 'amber' },
  'probation': { lbl: 'Probasi',  cls: 'blue'  },
  'inactive':  { lbl: 'Non-aktif',cls: 'gray'  },
};

/** Map POV `type` (data.jsx / components POV_OPTIONS) ke kunci navigasi PRD navigation v2. */
const mapPovTypeToNavRole = (povType) => {
  const m = {
    drafter: 'drafter',
    reviewer: 'reviewer',
    approver: 'approver',
    tujuan: 'tujuan',
    admin: 'admin',
    'admin-stempel': 'admin-stempel',
  };
  return m[povType] || 'drafter';
};

const NAV_MASTER_CHILDREN = [
  { key: 'master-jenis', label: 'Jenis Surat', viewKey: 'master-jenis' },
  { key: 'master-template', label: 'Template Surat', viewKey: 'master-template' },
  { key: 'master-klasif', label: 'Klasifikasi', viewKey: 'master-klasif' },
  { key: 'master-unit', label: 'Unit Kerja', viewKey: 'master-unit' },
];

const NAV_ARSIP_AKTIF_CH = [
  { key: 'arsip-a-list', label: 'Daftar Arsip', viewKey: 'arsip-a-list' },
  { key: 'arsip-a-pinjam', label: 'Peminjaman', viewKey: 'arsip-a-pinjam' },
];
const NAV_ARSIP_INAKTIF_CH = [
  { key: 'arsip-i-list', label: 'Daftar Arsip', viewKey: 'arsip-i-list' },
  { key: 'arsip-i-musnah', label: 'Pemusnahan', viewKey: 'arsip-i-musnah' },
];

const navBlockDokumenArsip = (includeRekapArsip) => {
  const items = [
    { key: 'arsip-aktif', label: 'Manajemen Arsip Aktif', children: NAV_ARSIP_AKTIF_CH },
    { key: 'arsip-inaktif', label: 'Manajemen Arsip Inaktif', children: NAV_ARSIP_INAKTIF_CH },
    { key: 'permission', label: 'Permission Document', viewKey: 'permission' },
  ];
  if (includeRekapArsip) items.push({ key: 'rekap-arsip', label: 'Rekap Arsip', viewKey: 'rekap-arsip' });
  return { section: 'DOKUMEN & ARSIP', items };
};

/**
 * Pohon navigasi sidebar per PRD `prd_navigation-v2.md` (role-based, section labels).
 * Tiap blok: { section: string | null, items: NavItem[] }
 * NavItem: { key, label, viewKey?, badgeKey?, children? }
 */
const getNavTreeForRole = (navRole) => {
  const dash = { section: null, items: [{ key: 'dashboard', label: 'Dashboard', viewKey: 'dashboard' }] };

  const penciptaan = (opts = {}) => {
    const items = [
      {
        key: 'buat-surat',
        label: 'Manajemen Surat',
        viewKey: 'manajemen-surat',
        badgeKey: opts.manajemenBadgeKey || null,
      },
    ];
    if (!opts.hideBuatSp) items.push({ key: 'buat-sp', label: 'Buat SP/ASP', viewKey: 'buat-sp' });
    return { section: 'PENCIPTAAN SURAT', items };
  };

  const administrasi = {
    section: 'ADMINISTRASI',
    items: [
      { key: 'admin-users', label: 'User Management', viewKey: 'admin-user-mgmt' },
      { key: 'master', label: 'Master Data', children: NAV_MASTER_CHILDREN },
      { key: 'admin-meterai', label: 'Setting Meterai', viewKey: 'admin-meterai' },
      { key: 'admin-emeterai', label: 'E-Meterai', viewKey: 'admin-emeterai' },
      { key: 'admin-migrasi', label: 'Migrasi', viewKey: 'admin-migrasi' },
      { key: 'admin-reg', label: 'Reg Surat Masuk', viewKey: 'admin-reg-masuk' },
    ],
  };

  if (navRole === 'drafter') {
    return [
      dash,
      penciptaan({ manajemenBadgeKey: 'manajemen-action' }),
      { section: null, items: [{ key: 'inbox', label: 'Inbox', viewKey: 'inbox', badgeKey: 'inbox' }] },
      navBlockDokumenArsip(true),
      { section: 'LAPORAN', items: [{ key: 'rekap', label: 'Rekap', viewKey: 'rekap' }] },
      { section: null, items: [{ key: 'pencarian', label: 'Pencarian', viewKey: 'pencarian' }] },
    ];
  }
  if (navRole === 'reviewer') {
    return [
      dash,
      penciptaan({ manajemenBadgeKey: 'manajemen-action' }),
      { section: null, items: [{ key: 'inbox', label: 'Inbox', viewKey: 'inbox', badgeKey: 'inbox' }] },
      navBlockDokumenArsip(false),
      { section: null, items: [{ key: 'pencarian', label: 'Pencarian', viewKey: 'pencarian' }] },
    ];
  }
  if (navRole === 'approver') {
    return [
      dash,
      penciptaan({ manajemenBadgeKey: 'manajemen-action' }),
      { section: null, items: [{ key: 'inbox', label: 'Inbox', viewKey: 'inbox', badgeKey: 'inbox' }] },
      navBlockDokumenArsip(false),
      { section: null, items: [{ key: 'pencarian', label: 'Pencarian', viewKey: 'pencarian' }] },
    ];
  }
  if (navRole === 'tujuan') {
    return [
      dash,
      { section: null, items: [{ key: 'inbox', label: 'Inbox', viewKey: 'inbox', badgeKey: 'inbox' }] },
      penciptaan({}),
      navBlockDokumenArsip(true),
      { section: null, items: [{ key: 'pencarian', label: 'Pencarian', viewKey: 'pencarian' }] },
    ];
  }
  if (navRole === 'admin') {
    return [
      dash,
      administrasi,
      penciptaan({ hideBuatSp: true }),
      { section: null, items: [{ key: 'inbox', label: 'Inbox', viewKey: 'inbox', badgeKey: 'inbox' }] },
      navBlockDokumenArsip(true),
      { section: 'LAPORAN', items: [{ key: 'rekap', label: 'Rekap', viewKey: 'rekap' }] },
      { section: null, items: [{ key: 'pencarian', label: 'Pencarian', viewKey: 'pencarian' }] },
    ];
  }
  if (navRole === 'admin-stempel') {
    return [
      dash,
      penciptaan({ manajemenBadgeKey: 'stempel-queue' }),
      { section: null, items: [{ key: 'inbox', label: 'Inbox', viewKey: 'inbox', badgeKey: 'inbox' }] },
      navBlockDokumenArsip(false),
      { section: null, items: [{ key: 'pencarian', label: 'Pencarian', viewKey: 'pencarian' }] },
    ];
  }
  return getNavTreeForRole('drafter');
};

/** Semua viewKey yang boleh diakses role (untuk reset POV). */
const getNavViewKeysForRole = (navRole) => {
  const keys = new Set();
  getNavTreeForRole(navRole).forEach((block) => {
    (block.items || []).forEach((item) => {
      if (item.viewKey) keys.add(item.viewKey);
      (item.children || []).forEach((c) => {
        if (c.viewKey) keys.add(c.viewKey);
      });
    });
  });
  return keys;
};

/** Legacy flat NAV (profil + notifikasi) — hanya untuk kompatibilitas; sidebar memakai getNavTreeForRole. */
const NAV = [
  { key: 'dashboard', label: 'Dashboard', viewKey: 'dashboard' },
  { key: 'profil', label: 'Profil', children: [
    { key: 'profil-saya', label: 'Profil Saya', viewKey: 'profil-saya' },
    { key: 'profil-jabatan', label: 'Riwayat Jabatan', viewKey: 'profil-jabatan' },
  ]},
];

const SIFAT_CHIP = {
  'rahasia':        { lbl: 'Rahasia',        cls: 'amber' },
  'biasa':          { lbl: 'Biasa',          cls: 'gray'  },
  'sangat-rahasia': { lbl: 'Sangat Rahasia', cls: 'red'   },
  'terbatas':       { lbl: 'Terbatas',       cls: 'blue'  },
};
const KECEPATAN_CHIP = {
  'sangat-segera': { lbl: 'Sangat Segera', cls: 'red'   },
  'segera':        { lbl: 'Segera',        cls: 'amber' },
  'biasa':         { lbl: 'Biasa',         cls: 'gray'  },
};
const STATUS_SURAT_CHIP = {
  'draft':                    { lbl: 'Draft',                            cls: 'gray'  },
  'menunggu-review':          { lbl: 'Menunggu Review',                  cls: 'amber' },
  'menunggu-approval':        { lbl: 'Menunggu Approval',                cls: 'blue'  },
  'menunggu-ttd-digital':     { lbl: 'Menunggu Tanda Tangan Digital',      cls: 'blue'  },
  'diproses-peruri-ttd':      { lbl: 'Diproses Peruri',                    cls: 'amber' },
  'menunggu-stempel':         { lbl: 'Menunggu Stempel',                   cls: 'amber' },
  'diproses-peruri-stempel':  { lbl: 'Diproses Stempel',                   cls: 'amber' },
  'terkirim':                 { lbl: 'Terkirim',                           cls: 'green' },
  'disetujui':                { lbl: 'Disetujui',                          cls: 'green' },
  'ditolak':                  { lbl: 'Ditolak',                            cls: 'red'   },
  'dibatalkan':               { lbl: 'Dibatalkan',                         cls: 'red'   },
  'gagal-peruri':             { lbl: 'Gagal — perlu tindakan',           cls: 'red'   },
};

// ID pengguna Reviewer 1 aktif (Yetty Endarwati — SVP Digitalisasi & Data Science)
const CURRENT_USER_ID = '1120084';

// Pemetaan nama pembuat surat → ID pegawai
const PEMBUAT_ID_MAP = {
  'Ahmad Fauzi':      'PI-09112',
  'Andi Pratama':     'PI-07863',
  'Cahyo Nugroho':    'PI-15912',
  'Putri Maharani':   'PI-16001',
  'Dewi Lestari':     'PI-06234',
  'Lestari Wibowo':   'PI-11055',
  'Hendra Setiawan':  'PI-15721',
  'Rini Anggraini':   'PI-14580',
  'Maya Putri':       'PI-04812',
  'Joko Susanto':     'PI-13290',
  'Bambang Triyanto': 'PI-08421',
  'Siti Nurhaliza':   'PI-12903',
};

const SURAT = [
  {
    id: 'SR-2026-DIG1', no: '—/PI/MKT/V/2026',
    judul: 'Surat Penawaran Kerja Sama — Pupuk Kaltim (Digital Sign & Stempel)',
    jenis: 'Surat Permohonan',
    sifat: 'biasa', kecepatan: 'segera', status: 'menunggu-approval',
    tanggal: '12 Mei 2026', pembuat: 'Putri Maharani', av: 4, init: 'PM',
    flowDigitalSign: true,
    tujuanKirim: 'intercompany',
    tujuanNama: 'Direktur Utama · Pupuk Kaltim',
    lampiranCount: 1,
    versiDokumen: 'v1',
    reviewers: [
      { id: CURRENT_USER_ID, name: 'Yetty Endarwati', role: 'SVP Digitalisasi & Data Science', reviewStatus: 'approved' },
      { id: '2811854', name: 'Anita Wijayanti', role: 'SVP Sumber Daya Manusia', reviewStatus: 'approved' },
    ],
    approvers: [{ id: '2511437', name: 'Dr. Indra Permana', role: 'Direktur Operasi & Produksi', approveStatus: 'pending' }],
  },
  {
    id: 'SR-2026-DIG2', no: '110/PI/LEG/V/2026',
    judul: 'Perjanjian Kerahasiaan (NDA) — Vendor Eksternal Asia Chem',
    jenis: 'Nota Dinas',
    sifat: 'terbatas', kecepatan: 'sangat-segera', status: 'menunggu-stempel',
    tanggal: '11 Mei 2026', pembuat: 'Ahmad Fauzi', av: 4, init: 'AF',
    flowDigitalSign: true,
    tujuanKirim: 'email-eksternal',
    tujuanNama: 'legal@asiachem.co.id',
    lampiranCount: 0,
    versiDokumen: 'v2 (TTD digital terpasang)',
    reviewers: [
      { id: CURRENT_USER_ID, name: 'Yetty Endarwati', role: 'SVP Digitalisasi & Data Science', reviewStatus: 'approved' },
    ],
    approvers: [{ id: '2511437', name: 'Dr. Indra Permana', role: 'Direktur Operasi & Produksi', approveStatus: 'approved' }],
  },
  {
    id: 'SR-2026-0512', no: '001/PI/HR/V/2026',
    judul: 'Permohonan Penambahan Kuota Subsidi Pupuk Q3 2026',
    jenis: 'Surat Permohonan',
    sifat: 'biasa', kecepatan: 'segera', status: 'menunggu-approval',
    tanggal: '10 Mei 2026', pembuat: 'Ahmad Fauzi', av: 4, init: 'AF',
    tujuanNama: 'Direktur Pemasaran & Logistik',
    lampiranCount: 2,
    versiDokumen: 'v3 (final review)',
    reviewers: [
      { id: CURRENT_USER_ID, name: 'Yetty Endarwati',  role: 'SVP Digitalisasi & Data Science', reviewStatus: 'approved' },
      { id: '2811854',        name: 'Anita Wijayanti',  role: 'SVP Sumber Daya Manusia',         reviewStatus: 'approved' },
    ],
    approvers: [{ id: '2511437', name: 'Dr. Indra Permana', role: 'Direktur Operasi & Produksi', approveStatus: 'pending' }],
  },
  {
    id: 'SR-2026-0511', no: '002/PI/DIR/V/2026',
    judul: 'Surat Edaran Implementasi SOP K3 Plant Bontang',
    sifat: 'biasa', kecepatan: 'biasa', status: 'draft',
    tanggal: '09 Mei 2026', pembuat: 'Andi Pratama', av: 2, init: 'AP',
    reviewers: [],
    approvers: [],
    catatanRevisi: null,
  },
  {
    id: 'SR-2026-0510', no: '003/PI/AUD/V/2026',
    judul: 'Laporan Hasil Audit Internal Q1 2026 — Rahasia',
    sifat: 'sangat-rahasia', kecepatan: 'sangat-segera', status: 'menunggu-review',
    tanggal: '09 Mei 2026', pembuat: 'Cahyo Nugroho', av: 6, init: 'CN',
    reviewers: [
      { id: CURRENT_USER_ID, name: 'Yetty Endarwati',      role: 'SVP Digitalisasi & Data Science',        reviewStatus: 'pending'  },
      { id: '2611582',        name: 'Linda Kurniawati', role: 'VP Legal & Compliance',   reviewStatus: 'pending'  },
    ],
    approvers: [{ id: '2511437', name: 'Dr. Indra Permana', role: 'Direktur Operasi & Produksi', approveStatus: 'pending' }],
  },
  {
    id: 'SR-2026-0509', no: '004/PI/PROC/V/2026',
    judul: 'Surat Pesanan Bahan Baku Amoniak — Petrokimia Gresik',
    sifat: 'rahasia', kecepatan: 'segera', status: 'menunggu-approval',
    tanggal: '08 Mei 2026', pembuat: 'Putri Maharani', av: 4, init: 'PM',
    reviewers: [
      { id: CURRENT_USER_ID, name: 'Yetty Endarwati',      role: 'SVP Digitalisasi & Data Science',              reviewStatus: 'approved' },
      { id: '1210019',        name: 'Muhammad Ridha Fahlawy', role: 'VP Digitalisasi',         reviewStatus: 'approved' },
    ],
    approvers: [{ id: '2511437', name: 'Dr. Indra Permana', role: 'Direktur Operasi & Produksi', approveStatus: 'pending' }],
  },
  {
    id: 'SR-2026-0508', no: '005/PI/HR/V/2026',
    judul: 'Pengumuman Rekrutmen Manajemen Trainee Batch 12',
    sifat: 'biasa', kecepatan: 'biasa', status: 'menunggu-approval',
    tanggal: '08 Mei 2026', pembuat: 'Dewi Lestari', av: 5, init: 'DL',
    reviewers: [
      { id: CURRENT_USER_ID, name: 'Yetty Endarwati',     role: 'SVP Digitalisasi & Data Science',                reviewStatus: 'approved' },
      { id: '2811854',        name: 'Anita Wijayanti', role: 'SVP Sumber Daya Manusia',         reviewStatus: 'approved' },
    ],
    approvers: [{ id: '2511437', name: 'Dr. Indra Permana', role: 'Direktur Operasi & Produksi', approveStatus: 'pending' }],
  },
  {
    id: 'SR-2026-0507', no: '006/PI/IT/V/2026',
    judul: 'Permintaan Akses Data Center Plant Lhokseumawe',
    sifat: 'terbatas', kecepatan: 'segera', status: 'menunggu-review',
    tanggal: '07 Mei 2026', pembuat: 'Lestari Wibowo', av: 5, init: 'LW',
    reviewers: [
      { id: CURRENT_USER_ID, name: 'Yetty Endarwati',           role: 'SVP Digitalisasi & Data Science',      reviewStatus: 'approved' },
      { id: '1410512',        name: 'Ahmad Fauzi',           role: 'Lead Engineer IT',      reviewStatus: 'pending'  },
    ],
    approvers: [{ id: '2611582', name: 'Linda Kurniawati', role: 'VP Legal & Compliance', approveStatus: 'pending' }],
  },
  {
    id: 'SR-2026-0506', no: '007/PI/MKT/V/2026',
    judul: 'Undangan Town Hall Q2 — Direksi & Senior Management',
    sifat: 'biasa', kecepatan: 'biasa', status: 'menunggu-approval',
    tanggal: '07 Mei 2026', pembuat: 'Hendra Setiawan', av: 6, init: 'HS',
    reviewers: [
      { id: CURRENT_USER_ID, name: 'Yetty Endarwati',     role: 'SVP Digitalisasi & Data Science',   reviewStatus: 'approved' },
      { id: '2711729',        name: 'Rahmat Hidayat',  role: 'GM Pemasaran',       reviewStatus: 'approved' },
    ],
    approvers: [{ id: '2511437', name: 'Dr. Indra Permana', role: 'Direktur Operasi & Produksi', approveStatus: 'pending' }],
  },
  {
    id: 'SR-2026-0505', no: '008/PI/FIN/V/2026',
    judul: 'Memo Rekonsiliasi Kas Bank Bulan April 2026',
    sifat: 'terbatas', kecepatan: 'biasa', status: 'draft',
    tanggal: '06 Mei 2026', pembuat: 'Rini Anggraini', av: 3, init: 'RA',
    reviewers: [], approvers: [],
  },
  {
    id: 'SR-2026-0504', no: '009/PI/RND/V/2026',
    judul: 'Proposal Riset Formula NPK Premium Generasi 3',
    sifat: 'rahasia', kecepatan: 'segera', status: 'menunggu-review',
    tanggal: '06 Mei 2026', pembuat: 'Maya Putri', av: 1, init: 'MP',
    reviewers: [
      { id: '2711729',        name: 'Rahmat Hidayat',  role: 'GM Pemasaran',             reviewStatus: 'approved' },
      { id: CURRENT_USER_ID, name: 'Yetty Endarwati',      role: 'SVP Digitalisasi & Data Science',         reviewStatus: 'pending'  },
    ],
    approvers: [{ id: '2811854', name: 'Anita Wijayanti', role: 'SVP Sumber Daya Manusia', approveStatus: 'pending' }],
  },
  { id: 'SR-2026-0503', no: '010/PI/QC/V/2026',  judul: 'Berita Acara Pengujian Kualitas Urea Granular Mei 2026',   sifat: 'biasa',          kecepatan: 'biasa',         status: 'menunggu-approval',  tanggal: '05 Mei 2026', pembuat: 'Joko Susanto', av: 3, init: 'JS' },
  { id: 'SR-2026-0502', no: '011/PI/DIR/V/2026', judul: 'Nota Dinas Penyesuaian Tarif Distribusi Pupuk Bersubsidi', sifat: 'sangat-rahasia', kecepatan: 'sangat-segera', status: 'menunggu-approval',  tanggal: '05 Mei 2026', pembuat: 'Bambang Triyanto', av: 2, init: 'BT' },
  { id: 'SR-2026-0501', no: '012/PI/HR/V/2026',  judul: 'Surat Mutasi Karyawan Antar Anak Perusahaan Per Juni',     sifat: 'terbatas',       kecepatan: 'segera',        status: 'draft',              tanggal: '04 Mei 2026', pembuat: 'Siti Nurhaliza', av: 1, init: 'SN' },
  // Surat milik Cahyo Nugroho (demo drafter POV)
  {
    id: 'SR-2026-0513', no: '013/PI/AUD/V/2026',
    judul: 'Draft Surat Undangan Rapat Evaluasi Audit Internal Semester 1',
    sifat: 'biasa', kecepatan: 'biasa', status: 'draft',
    tanggal: '11 Mei 2026', pembuat: 'Cahyo Nugroho', av: 6, init: 'CN',
    reviewers: [
      { id: CURRENT_USER_ID, name: 'Yetty Endarwati', role: 'SVP Digitalisasi & Data Science', reviewStatus: 'returned' },
    ],
    approvers: [],
    catatanRevisi: 'Mohon sertakan agenda rapat terperinci, daftar undangan resmi per divisi, dan lampirkan notulensi rapat pra-evaluasi terakhir.',
  },
  {
    id: 'SR-2026-0514', no: '014/PI/AUD/V/2026',
    judul: 'Laporan Tindak Lanjut Temuan Audit Internal Divisi Pemasaran',
    sifat: 'terbatas', kecepatan: 'biasa', status: 'disetujui',
    tanggal: '03 Mei 2026', pembuat: 'Cahyo Nugroho', av: 6, init: 'CN',
    reviewers: [
      { id: CURRENT_USER_ID, name: 'Yetty Endarwati',      role: 'SVP Digitalisasi & Data Science',        reviewStatus: 'approved' },
      { id: '2611582',        name: 'Linda Kurniawati', role: 'VP Legal & Compliance',   reviewStatus: 'approved' },
    ],
    approvers: [{ id: '2511437', name: 'Dr. Indra Permana', role: 'Direktur Operasi & Produksi', approveStatus: 'approved' }],
  },
];

// Tambahkan pembuatId ke setiap surat berdasarkan PEMBUAT_ID_MAP
SURAT.forEach(s => { if (!s.pembuatId) s.pembuatId = PEMBUAT_ID_MAP[s.pembuat] || null; });

(function enrichSuratWorklistMeta() {
  const bln = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const baseTs = new Date('2026-05-13T10:30:00').getTime();
  SURAT.forEach((s, i) => {
    if (s.catatanRevisi === undefined) s.catatanRevisi = null;
    s.lastUpdatedTs = baseTs - i * 117 * 60000;
    const d = new Date(s.lastUpdatedTs);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    s.lastUpdated = `${d.getDate()} ${bln[d.getMonth()]} ${d.getFullYear()} · ${hh}.${mm}`;
  });
})();

// Daftar pegawai yang dapat menjadi reviewer/approver (untuk searchable dropdown)
const PERSONNEL = [
  { id: '1210019', name: 'Muhammad Ridha Fahlawy', role: 'VP Digitalisasi Corporate Services', unit: 'Holding HQ' },
  { id: '1120084', name: 'Yetty Endarwati',         role: 'SVP Digitalisasi & Data Science',     unit: 'Holding HQ' },
  { id: '1310245', name: 'Bambang Triyanto',        role: 'Senior Manager Distribusi',           unit: 'Pupuk Kaltim' },
  { id: '1410512', name: 'Ahmad Fauzi',             role: 'Lead Engineer IT',                    unit: 'Holding HQ' },
  { id: '1510889', name: 'Dewi Lestari',            role: 'HR Business Partner',                 unit: 'Pupuk Kujang' },
  { id: '1620031', name: 'Hendra Setiawan',         role: 'Brand Manager',                       unit: 'Holding HQ' },
  { id: '1710147', name: 'Maya Putri',              role: 'Research Scientist',                  unit: 'Petrokimia Gresik' },
  { id: '1810392', name: 'Joko Susanto',            role: 'QC Supervisor',                       unit: 'Petrokimia Gresik' },
  { id: '1910578', name: 'Cahyo Nugroho',           role: 'Senior Auditor',                      unit: 'Holding HQ' },
  { id: '2010624', name: 'Putri Maharani',          role: 'Procurement Specialist',              unit: 'Pupuk Sriwidjaja' },
  { id: '2110765', name: 'Andi Pratama',            role: 'Safety Officer',                      unit: 'Pupuk Kaltim' },
  { id: '2210981', name: 'Rini Anggraini',          role: 'Accounting Officer',                  unit: 'Pupuk Sriwidjaja' },
  { id: '2311126', name: 'Siti Nurhaliza',          role: 'Operator Sr. Produksi Urea',          unit: 'Petrokimia Gresik' },
  { id: '2411289', name: 'Lestari Wibowo',          role: 'Plant Engineer NPK',                  unit: 'Pupuk Iskandar Muda' },
  { id: '2511437', name: 'Dr. Indra Permana',       role: 'Direktur Operasi & Produksi',         unit: 'Holding HQ' },
  { id: '2611582', name: 'Linda Kurniawati',        role: 'VP Legal & Compliance',               unit: 'Holding HQ' },
  { id: '2711729', name: 'Rahmat Hidayat',          role: 'GM Pemasaran Domestik',               unit: 'Holding HQ' },
  { id: '2811854', name: 'Anita Wijayanti',         role: 'SVP Sumber Daya Manusia',             unit: 'Holding HQ' },
];

const INBOX = [
  { id: 'MSG-001', from: 'Muhammad Ridha Fahlawy', fromRole: 'VP Digitalisasi Corporate Services', fromUnit: 'Holding HQ', init: 'MR', av: null, subject: 'Review: Proposal Riset Formula NPK Premium Generasi 3', preview: 'Mohon dilakukan review atas proposal riset berikut sebelum diserahkan ke direksi.', date: '10 Mei 2026', time: '09:41', unread: true, type: 'review', ref: 'SR-2026-0504' },
  { id: 'MSG-002', from: 'Anita Wijayanti', fromRole: 'SVP Sumber Daya Manusia', fromUnit: 'Holding HQ', init: 'AW', av: null, subject: 'Pengumuman: Kebijakan Baru Tunjangan Hari Raya 2026', preview: 'Bersama ini kami sampaikan kebijakan tunjangan hari raya yang berlaku mulai Juni 2026.', date: '09 Mei 2026', time: '14:15', unread: true, type: 'announcement', ref: null },
  { id: 'MSG-003', from: 'Bambang Triyanto', fromRole: 'Senior Manager Distribusi', fromUnit: 'Pupuk Kaltim', init: 'BT', av: 2, subject: 'Tindak Lanjut: Surat Edaran SOP K3 Plant Bontang', preview: 'Terima kasih atas surat edaran yang telah dikirimkan. Kami akan segera menindaklanjuti.', date: '09 Mei 2026', time: '11:02', unread: true, type: 'reply', ref: 'SR-2026-0511' },
  { id: 'MSG-004', from: 'Linda Kurniawati', fromRole: 'VP Legal & Compliance', fromUnit: 'Holding HQ', init: 'LK', av: null, subject: 'Permohonan Dokumen: Due Diligence Akuisisi Q2', preview: 'Sehubungan dengan proses due diligence, mohon menyiapkan dokumen-dokumen berikut ini.', date: '08 Mei 2026', time: '16:30', unread: false, type: 'request', ref: null },
  { id: 'MSG-005', from: 'Sistem HRIS', fromRole: 'Notifikasi Otomatis', fromUnit: 'IT', init: 'HR', av: null, subject: 'Pengingat: 12 Pengajuan Cuti Menunggu Approval Anda', preview: 'Terdapat 12 pengajuan cuti yang belum diproses lebih dari 3 hari kerja.', date: '08 Mei 2026', time: '08:00', unread: false, type: 'system', ref: null },
  { id: 'MSG-006', from: 'Rahmat Hidayat', fromRole: 'GM Pemasaran Domestik', fromUnit: 'Holding HQ', init: 'RH', av: null, subject: 'Undangan Rapat: Strategi Distribusi Pupuk Bersubsidi Q3', preview: 'Mengundang Bapak/Ibu untuk hadir dalam rapat koordinasi distribusi pupuk bersubsidi.', date: '07 Mei 2026', time: '10:22', unread: false, type: 'invitation', ref: null },
  { id: 'MSG-007', from: 'Dr. Indra Permana', fromRole: 'Direktur Operasi & Produksi', fromUnit: 'Holding HQ', init: 'IP', av: null, subject: 'Approval Disetujui: Permohonan Penambahan Kuota Subsidi Q3', preview: 'Dengan hormat, surat permohonan penambahan kuota subsidi Q3 telah disetujui.', date: '06 Mei 2026', time: '15:48', unread: false, type: 'approved', ref: 'SR-2026-0512' },
  { id: 'MSG-008', from: 'Yetty Endarwati', fromRole: 'SVP Digitalisasi & Data Science', fromUnit: 'Holding HQ', init: 'YE', av: null, subject: 'Update: Implementasi Modul HRIS Baru — Jadwal Go-Live', preview: 'Menginformasikan bahwa modul rekrutmen digital akan go-live pada 1 Juli 2026.', date: '05 Mei 2026', time: '13:00', unread: false, type: 'announcement', ref: null },
];

const NOTIFIKASI = [
  { id: 'N001', type: 'success', icon: 'check', title: 'Surat Disetujui', msg: 'Surat "Permohonan Penambahan Kuota Subsidi Pupuk Q3 2026" telah disetujui oleh Dr. Indra Permana.', time: '2 jam lalu', unread: true },
  { id: 'N002', type: 'info', icon: 'info', title: 'Anda Ditunjuk sebagai Reviewer', msg: 'Cahyo Nugroho menugaskan Anda untuk mereview "Laporan Hasil Audit Internal Q1 2026".', time: '4 jam lalu', unread: true },
  { id: 'N003', type: 'warning', icon: 'cal', title: 'Pengajuan Cuti Menunggu', msg: '5 pengajuan cuti dari anak perusahaan belum diproses lebih dari 3 hari kerja.', time: '5 jam lalu', unread: true },
  { id: 'N004', type: 'info', icon: 'bell', title: 'Town Hall Q2 — Besok Pukul 09:00', msg: 'Acara Town Hall Q2 akan diselenggarakan di Auditorium besok. Pastikan hadir tepat waktu.', time: '6 jam lalu', unread: true },
  { id: 'N005', type: 'success', icon: 'users', title: 'Karyawan Baru Bergabung', msg: 'Lestari Wibowo resmi bergabung di Pupuk Iskandar Muda sebagai Plant Engineer NPK.', time: '1 hari lalu', unread: true },
  { id: 'N006', type: 'warning', icon: 'info', title: 'Surat Ditarik Kembali', msg: 'Andi Pratama menarik kembali surat "Surat Edaran Implementasi SOP K3 Plant Bontang" untuk direvisi.', time: '1 hari lalu', unread: true },
  { id: 'N007', type: 'info', icon: 'party', title: 'Ulang Tahun Hari Ini', msg: 'Hendra Setiawan (PI HQ · Pemasaran) berulang tahun hari ini. Jangan lupa ucapkan selamat!', time: '1 hari lalu', unread: false },
  { id: 'N008', type: 'success', icon: 'award', title: 'Anniversary 10 Tahun', msg: 'Maya Putri merayakan 10 tahun masa bakti di Petrokimia Gresik. Selamat!', time: '2 hari lalu', unread: false },
  { id: 'N009', type: 'info', icon: 'briefc', title: 'Lowongan Baru Dibuka', msg: '8 lowongan baru dibuka minggu ini: 3 di PKT, 3 di PKG, 2 di Holding HQ.', time: '2 hari lalu', unread: false },
  { id: 'N010', type: 'warning', icon: 'cal', title: 'Pelatihan Safety — Pendaftaran Ditutup', msg: 'Pendaftaran Pelatihan Safety di Bontang (20 Mei) ditutup dalam 2 hari. Segera daftarkan peserta.', time: '3 hari lalu', unread: false },
  { id: 'N011', type: 'success', icon: 'check', title: 'Import Karyawan Selesai', msg: '142 data karyawan berhasil diimport dari sistem lama. Tidak ada duplikasi terdeteksi.', time: '3 hari lalu', unread: false },
  { id: 'N012', type: 'info', icon: 'download', title: 'Laporan Bulanan Tersedia', msg: 'Laporan HR bulan April 2026 sudah dapat diunduh. Klik untuk mengakses laporan.', time: '4 hari lalu', unread: false },
  { id: 'N013', type: 'warning', icon: 'info', title: 'Kontrak Karyawan Segera Berakhir', msg: '3 karyawan kontrak akan berakhir masa kerjanya dalam 30 hari ke depan.', time: '4 hari lalu', unread: false },
  { id: 'N014', type: 'success', icon: 'check', title: 'Cuti Disetujui', msg: 'Pengajuan cuti Siti Nurhaliza (12–16 Mei) telah disetujui oleh atasan terkait.', time: '5 hari lalu', unread: false },
  { id: 'N015', type: 'info', icon: 'book', title: 'Sertifikasi K3 — Pendaftaran Dibuka', msg: 'Program sertifikasi K3 batch baru dibuka. Kuota tersedia untuk 20 peserta dari seluruh anak perusahaan.', time: '5 hari lalu', unread: false },
];

const ARSIP_AKTIF = [
  { id: 'ARS-A-001', kode: 'HR/2026/001', judul: 'Dokumen Rekrutmen Manajemen Trainee Batch 11', unit: 'Holding HQ · HR', jenis: 'Berkas Rekrutmen', tgl_masuk: '02 Jan 2026', retensi: '5 tahun', lokasi: 'Rak A-01', status: 'tersedia' },
  { id: 'ARS-A-002', kode: 'PKT/2026/012', judul: 'Kontrak Kerja Karyawan Baru — Pupuk Kaltim Jan 2026', unit: 'Pupuk Kaltim · HR', jenis: 'Kontrak', tgl_masuk: '15 Jan 2026', retensi: '10 tahun', lokasi: 'Rak B-03', status: 'tersedia' },
  { id: 'ARS-A-003', kode: 'PKG/2026/008', judul: 'Laporan Produksi Urea Petrokimia Gresik Q1 2026', unit: 'Petrokimia Gresik · Produksi', jenis: 'Laporan', tgl_masuk: '05 Apr 2026', retensi: '7 tahun', lokasi: 'Rak C-02', status: 'dipinjam' },
  { id: 'ARS-A-004', kode: 'PI/2026/034', judul: 'Notulensi Rapat Direksi — Maret 2026', unit: 'Holding HQ · Sekretariat', jenis: 'Notulensi', tgl_masuk: '31 Mar 2026', retensi: 'Permanen', lokasi: 'Rak A-05', status: 'tersedia' },
  { id: 'ARS-A-005', kode: 'PUSRI/2026/019', judul: 'Dokumen Pengadaan Bahan Baku Amoniak Q2 2026', unit: 'Pupuk Sriwidjaja · Pengadaan', jenis: 'Pengadaan', tgl_masuk: '08 Apr 2026', retensi: '5 tahun', lokasi: 'Rak D-01', status: 'tersedia' },
  { id: 'ARS-A-006', kode: 'PIM/2026/007', judul: 'Laporan Audit K3LL Pupuk Iskandar Muda 2025', unit: 'Pupuk Iskandar Muda · K3LL', jenis: 'Laporan Audit', tgl_masuk: '20 Feb 2026', retensi: '10 tahun', lokasi: 'Rak E-02', status: 'tersedia' },
];

const ARSIP_INAKTIF = [
  { id: 'ARS-I-001', kode: 'PI/2019/088', judul: 'Laporan Keuangan Konsolidasi 2019', unit: 'Holding HQ · Keuangan', jenis: 'Laporan Keuangan', tgl_pindah: '15 Mar 2021', retensi: 'Permanen', lokasi: 'Gudang B-11', status: 'aktif' },
  { id: 'ARS-I-002', kode: 'PKG/2018/041', judul: 'Kontrak EPC Proyek Ammonia-2 Gresik', unit: 'Petrokimia Gresik · Proyek', jenis: 'Kontrak', tgl_pindah: '10 Jan 2020', retensi: 'Permanen', lokasi: 'Gudang A-03', status: 'aktif' },
  { id: 'ARS-I-003', kode: 'HR/2015/022', judul: 'Rekap Pensiun Karyawan 2015–2018', unit: 'Holding HQ · HR', jenis: 'Berkas SDM', tgl_pindah: '05 Jun 2019', retensi: '10 tahun', lokasi: 'Gudang C-07', status: 'jadwal-musnah' },
  { id: 'ARS-I-004', kode: 'PKT/2016/055', judul: 'Dokumen Tender Pengadaan Alat Berat PKT 2016', unit: 'Pupuk Kaltim · Pengadaan', jenis: 'Pengadaan', tgl_pindah: '22 Aug 2018', retensi: '10 tahun', lokasi: 'Gudang D-02', status: 'jadwal-musnah' },
  { id: 'ARS-I-005', kode: 'PI/2020/099', judul: 'Notulensi RUPS Tahunan 2020', unit: 'Holding HQ · Sekretariat', jenis: 'Notulensi', tgl_pindah: '30 Apr 2022', retensi: 'Permanen', lokasi: 'Gudang A-01', status: 'aktif' },
];

/** Template surat — flag mengaktifkan alur Digital Sign & Stempel (Peruri), PRD §9 */
const MASTER_SURAT_TEMPLATE = [
  { id: 'TM-001', nama: 'Template Default', unit: 'Semua unit', ttdDigital: false, stampDigital: false, tujuanInternal: true, qrAllPage: false, aktif: true },
  { id: 'TM-002', nama: 'Template SK Direksi', unit: 'Holding HQ', ttdDigital: false, stampDigital: false, tujuanInternal: true, qrAllPage: true, aktif: true },
  { id: 'TM-003', nama: 'Template Memo Internal', unit: 'Semua unit', ttdDigital: false, stampDigital: false, tujuanInternal: true, qrAllPage: false, aktif: true },
  { id: 'TM-004', nama: 'Template Eksternal — Digital Sign & Stempel', unit: 'Holding HQ', ttdDigital: true, stampDigital: true, tujuanInternal: false, qrAllPage: true, aktif: true },
  { id: 'TM-005', nama: 'Template Intercompany — Digital Sign', unit: 'Grup PI', ttdDigital: true, stampDigital: true, tujuanInternal: false, qrAllPage: false, aktif: true },
];

const MASTER_JENIS_SURAT = [
  { id: 'JS-001', kode: 'SK', nama: 'Surat Keputusan', deskripsi: 'Keputusan resmi dari pejabat berwenang', kategori: 'Formal', aktif: true },
  { id: 'JS-002', kode: 'SE', nama: 'Surat Edaran', deskripsi: 'Penyampaian informasi/kebijakan ke seluruh unit', kategori: 'Formal', aktif: true },
  { id: 'JS-003', kode: 'SM', nama: 'Surat Memo', deskripsi: 'Komunikasi internal antar unit/departemen', kategori: 'Internal', aktif: true },
  { id: 'JS-004', kode: 'ND', nama: 'Nota Dinas', deskripsi: 'Penugasan/laporan resmi internal', kategori: 'Internal', aktif: true },
  { id: 'JS-005', kode: 'BA', nama: 'Berita Acara', deskripsi: 'Dokumentasi hasil kegiatan/rapat', kategori: 'Formal', aktif: true },
  { id: 'JS-006', kode: 'PP', nama: 'Proposal', deskripsi: 'Usulan kegiatan atau proyek', kategori: 'Internal', aktif: true },
  { id: 'JS-007', kode: 'LPR', nama: 'Laporan', deskripsi: 'Laporan kegiatan, keuangan, atau operasional', kategori: 'Formal', aktif: true },
  { id: 'JS-008', kode: 'UND', nama: 'Undangan', deskripsi: 'Undangan rapat, acara, atau pelatihan', kategori: 'Internal', aktif: false },
];

const MASTER_KLASIFIKASI = [
  { id: 'KL-001', kode: 'HR', nama: 'Sumber Daya Manusia', parent: null, aktif: true },
  { id: 'KL-002', kode: 'FIN', nama: 'Keuangan & Akuntansi', parent: null, aktif: true },
  { id: 'KL-003', kode: 'OPS', nama: 'Operasional & Produksi', parent: null, aktif: true },
  { id: 'KL-004', kode: 'PROC', nama: 'Pengadaan', parent: null, aktif: true },
  { id: 'KL-005', kode: 'MKT', nama: 'Pemasaran & Distribusi', parent: null, aktif: true },
  { id: 'KL-006', kode: 'IT', nama: 'Teknologi Informasi', parent: null, aktif: true },
  { id: 'KL-007', kode: 'AUD', nama: 'Audit Internal', parent: null, aktif: true },
  { id: 'KL-008', kode: 'LEG', nama: 'Legal & Kepatuhan', parent: null, aktif: true },
];

const MASTER_UNIT = [
  { id: 'UN-001', kode: 'PI-HQ', nama: 'Holding HQ Jakarta', tipe: 'Holding', lokasi: 'Jakarta', aktif: true },
  { id: 'UN-002', kode: 'PKG', nama: 'Petrokimia Gresik', tipe: 'Anak Perusahaan', lokasi: 'Gresik', aktif: true },
  { id: 'UN-003', kode: 'PKT', nama: 'Pupuk Kaltim', tipe: 'Anak Perusahaan', lokasi: 'Bontang', aktif: true },
  { id: 'UN-004', kode: 'PSP', nama: 'Pupuk Sriwidjaja (Pusri)', tipe: 'Anak Perusahaan', lokasi: 'Palembang', aktif: true },
  { id: 'UN-005', kode: 'PKC', nama: 'Pupuk Kujang', tipe: 'Anak Perusahaan', lokasi: 'Cikampek', aktif: true },
  { id: 'UN-006', kode: 'PIM', nama: 'Pupuk Iskandar Muda', tipe: 'Anak Perusahaan', lokasi: 'Lhokseumawe', aktif: true },
  { id: 'UN-007', kode: 'PPP', nama: 'Pupuk Papua Pasifik', tipe: 'Anak Perusahaan', lokasi: 'Papua Barat', aktif: false },
];

Object.assign(window, {
  CURRENT_USER_ID, PEMBUAT_ID_MAP,
  ANAK_PERUSAHAAN, TOTAL_HEADCOUNT, HC_DISPLAY,
  HEADCOUNT_TREND, HIRE_EXIT,
  DEMOGRAFI_USIA, PENDING_APPROVALS, UPCOMING,
  EMPLOYEES, STATUS_CHIP, NAV, NAV_MASTER_CHILDREN, getNavTreeForRole, mapPovTypeToNavRole, getNavViewKeysForRole, PERSONNEL,
  SURAT, SIFAT_CHIP, KECEPATAN_CHIP, STATUS_SURAT_CHIP,
  INBOX, NOTIFIKASI,
  ARSIP_AKTIF, ARSIP_INAKTIF,
  MASTER_JENIS_SURAT, MASTER_KLASIFIKASI, MASTER_UNIT, MASTER_SURAT_TEMPLATE,
});
