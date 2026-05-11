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

const NAV = [
  { key: 'dashboard',  label: 'Dashboard', viewKey: 'dashboard' },
  { key: 'profil',     label: 'Profil', children: [
      { key: 'profil-saya',     label: 'Profil Saya', viewKey: 'profil-saya' },
      { key: 'profil-jabatan',  label: 'Riwayat Jabatan', viewKey: 'profil-jabatan' },
  ]},
  { key: 'penciptaan', label: 'Penciptaan Surat', expanded: true, children: [
      { key: 'buat-surat',     label: 'Manajemen Surat', viewKey: 'manajemen-surat' },
      { key: 'buat-sp',        label: 'Buat SP/ASP', viewKey: 'buat-sp' },
  ]},
  { key: 'master',     label: 'Master Data', children: [
      { key: 'master-jenis',   label: 'Jenis Surat', viewKey: 'master-jenis' },
      { key: 'master-klasif',  label: 'Klasifikasi', viewKey: 'master-klasif' },
      { key: 'master-unit',    label: 'Unit Kerja', viewKey: 'master-unit' },
  ]},
  { key: 'arsip-aktif',  label: 'Manajemen Arsip Aktif', children: [
      { key: 'arsip-a-list',   label: 'Daftar Arsip', viewKey: 'arsip-a-list' },
      { key: 'arsip-a-pinjam', label: 'Peminjaman', viewKey: 'arsip-a-pinjam' },
  ]},
  { key: 'arsip-inaktif',label: 'Manajemen Arsip Inaktif', children: [
      { key: 'arsip-i-list',   label: 'Daftar Arsip', viewKey: 'arsip-i-list' },
      { key: 'arsip-i-musnah', label: 'Pemusnahan', viewKey: 'arsip-i-musnah' },
  ]},
  { key: 'permission', label: 'Permission Document', viewKey: 'permission' },
  { key: 'inbox',      label: 'Inbox', badge: 8, viewKey: 'inbox' },
  { key: 'notif',      label: 'Notifikasi', badge: 15, viewKey: 'notif' },
  { key: 'rekap',      label: 'Rekap', viewKey: 'rekap' },
  { key: 'pencarian',  label: 'Pencarian', viewKey: 'pencarian' },
  { key: 'rekap-arsip',label: 'Rekap Arsip', viewKey: 'rekap-arsip' },
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
  'draft':              { lbl: 'Draft',              cls: 'gray'  },
  'menunggu-review':    { lbl: 'Menunggu Review',    cls: 'amber' },
  'menunggu-approval':  { lbl: 'Menunggu Approval',  cls: 'blue'  },
};

const SURAT = [
  { id: 'SR-2026-0512', no: '001/PI/HR/V/2026', judul: 'Permohonan Penambahan Kuota Subsidi Pupuk Q3 2026',         sifat: 'biasa',          kecepatan: 'segera',        status: 'menunggu-approval',  tanggal: '10 Mei 2026', pembuat: 'Ahmad Fauzi', av: 4, init: 'AF' },
  { id: 'SR-2026-0511', no: '002/PI/DIR/V/2026', judul: 'Surat Edaran Implementasi SOP K3 Plant Bontang',           sifat: 'biasa',          kecepatan: 'biasa',         status: 'draft',              tanggal: '09 Mei 2026', pembuat: 'Andi Pratama', av: 2, init: 'AP' },
  { id: 'SR-2026-0510', no: '003/PI/AUD/V/2026', judul: 'Laporan Hasil Audit Internal Q1 2026 — Rahasia',           sifat: 'sangat-rahasia', kecepatan: 'sangat-segera', status: 'menunggu-review',    tanggal: '09 Mei 2026', pembuat: 'Cahyo Nugroho', av: 6, init: 'CN' },
  { id: 'SR-2026-0509', no: '004/PI/PROC/V/2026',judul: 'Surat Pesanan Bahan Baku Amoniak — Petrokimia Gresik',     sifat: 'rahasia',        kecepatan: 'segera',        status: 'menunggu-approval',  tanggal: '08 Mei 2026', pembuat: 'Putri Maharani', av: 4, init: 'PM' },
  { id: 'SR-2026-0508', no: '005/PI/HR/V/2026',  judul: 'Pengumuman Rekrutmen Manajemen Trainee Batch 12',          sifat: 'biasa',          kecepatan: 'biasa',         status: 'menunggu-approval',  tanggal: '08 Mei 2026', pembuat: 'Dewi Lestari', av: 5, init: 'DL' },
  { id: 'SR-2026-0507', no: '006/PI/IT/V/2026',  judul: 'Permintaan Akses Data Center Plant Lhokseumawe',           sifat: 'terbatas',       kecepatan: 'segera',        status: 'menunggu-review',    tanggal: '07 Mei 2026', pembuat: 'Lestari Wibowo', av: 5, init: 'LW' },
  { id: 'SR-2026-0506', no: '007/PI/MKT/V/2026', judul: 'Undangan Town Hall Q2 — Direksi & Senior Management',      sifat: 'biasa',          kecepatan: 'biasa',         status: 'menunggu-approval',  tanggal: '07 Mei 2026', pembuat: 'Hendra Setiawan', av: 6, init: 'HS' },
  { id: 'SR-2026-0505', no: '008/PI/FIN/V/2026', judul: 'Memo Rekonsiliasi Kas Bank Bulan April 2026',              sifat: 'terbatas',       kecepatan: 'biasa',         status: 'draft',              tanggal: '06 Mei 2026', pembuat: 'Rini Anggraini', av: 3, init: 'RA' },
  { id: 'SR-2026-0504', no: '009/PI/RND/V/2026', judul: 'Proposal Riset Formula NPK Premium Generasi 3',            sifat: 'rahasia',        kecepatan: 'segera',        status: 'menunggu-review',    tanggal: '06 Mei 2026', pembuat: 'Maya Putri', av: 1, init: 'MP' },
  { id: 'SR-2026-0503', no: '010/PI/QC/V/2026',  judul: 'Berita Acara Pengujian Kualitas Urea Granular Mei 2026',   sifat: 'biasa',          kecepatan: 'biasa',         status: 'menunggu-approval',  tanggal: '05 Mei 2026', pembuat: 'Joko Susanto', av: 3, init: 'JS' },
  { id: 'SR-2026-0502', no: '011/PI/DIR/V/2026', judul: 'Nota Dinas Penyesuaian Tarif Distribusi Pupuk Bersubsidi', sifat: 'sangat-rahasia', kecepatan: 'sangat-segera', status: 'menunggu-approval',  tanggal: '05 Mei 2026', pembuat: 'Bambang Triyanto', av: 2, init: 'BT' },
  { id: 'SR-2026-0501', no: '012/PI/HR/V/2026',  judul: 'Surat Mutasi Karyawan Antar Anak Perusahaan Per Juni',     sifat: 'terbatas',       kecepatan: 'segera',        status: 'draft',              tanggal: '04 Mei 2026', pembuat: 'Siti Nurhaliza', av: 1, init: 'SN' },
];

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

Object.assign(window, {
  ANAK_PERUSAHAAN, TOTAL_HEADCOUNT, HC_DISPLAY,
  HEADCOUNT_TREND, HIRE_EXIT,
  DEMOGRAFI_USIA, PENDING_APPROVALS, UPCOMING,
  EMPLOYEES, STATUS_CHIP, NAV, PERSONNEL,
  SURAT, SIFAT_CHIP, KECEPATAN_CHIP, STATUS_SURAT_CHIP,
});
