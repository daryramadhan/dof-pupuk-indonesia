// components.jsx — building blocks (Sidebar, Topbar, KPI card, Tables)

const NavList = ({ activeView, onNav }) => {
  const initial = {};
  NAV.forEach((n) => {if (n.children && n.expanded) initial[n.key] = true;});
  const [open, setOpen] = React.useState(initial);
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  return (
    <nav className="nav">
      {NAV.map((item) => {
        const hasChildren = !!item.children;
        const isOpen = !!open[item.key];
        const childActiveKey = hasChildren && item.children.find((c) => c.viewKey === activeView);
        const isActive = !hasChildren && item.viewKey === activeView;
        return (
          <div key={item.key}>
            <div
              className={`nav-item${isActive ? ' active' : ''}${hasChildren ? ' has-children' : ''}`}
              onClick={() => {
                if (hasChildren) toggle(item.key);
                else if (item.viewKey) onNav(item.viewKey);
              }}>
              <span>{item.label}</span>
              {item.badge && <span className="badge">{item.badge}</span>}
              {hasChildren && (
                <Icon name="chevr" size={14} strokeWidth={2.2}
                  style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0, marginLeft: 'auto' }} />
              )}
            </div>
            {hasChildren && isOpen &&
              <div className="nav-sub">
                {item.children.map((c) =>
                  <div key={c.key}
                    className={`nav-subitem${c.viewKey === activeView ? ' active' : ''}`}
                    onClick={() => c.viewKey && onNav(c.viewKey)}>
                    <span>{c.label}</span>
                  </div>
                )}
              </div>
            }
          </div>);
      })}
    </nav>);
};

const Sidebar = ({ activeView, onNav }) =>
<aside className="sidebar">
    <div className="sidebar-brand">
      <div className="brand-text">
        <div className="name">Pupuk Indonesia</div>
        <div className="role">Digital Office</div>
      </div>
    </div>

    <NavList activeView={activeView} onNav={onNav} />

    <div className="sidebar-foot">
      <div className="deco"></div>
      <h4>Kebijakan Baru</h4>
      <p>Update SOP penggajian dan tunjangan berlaku 1 Juni 2026.</p>
      <button>Baca selengkapnya</button>
    </div>
  </aside>;


const Topbar = () =>
<header className="topbar">
    <div className="topbar-logo">
      <img src="assets/akhlak-logo.png" alt="AKHLAK" />
    </div>
    <div style={{ flex: 1 }} />
    <button className="lang-btn" title="Bahasa">ID</button>
    <button className="icon-btn" title="Notifikasi">
      <Icon name="bell" size={20} />
      <span className="dot-notif"></span>
    </button>
    <button className="icon-btn" title="Pengaturan">
      <Icon name="cog" size={20} />
    </button>
    <button className="avatar-btn">
      <div className="avatar">SD</div>
      <div>
        <div className="name">Sri Dewanti</div>
        <div className="role">VP Human Capital</div>
      </div>
    </button>
  </header>;


// KPI card
const KpiCard = ({ icon, iconColor, label, value, trend, trendDir, foot, sparkData, sparkColor }) =>
<div className="card kpi">
    <div className="kpi-head">
      <div className={`kpi-icon ${iconColor}`}><Icon name={icon} size={28} strokeWidth={1.6} /></div>
      <div className={`kpi-trend ${trendDir}`}>
        <Icon name={trendDir === 'up' ? 'arrUR' : trendDir === 'down' ? 'arrDR' : 'sparkles'} size={12} strokeWidth={2} />
        {trend}
      </div>
    </div>
    <div className="kpi-label">{label}</div>
    <div className="kpi-value tnum">{value}</div>
    {foot && <div className="kpi-foot">{foot}</div>}
    <div className="kpi-spark">
      <Sparkline data={sparkData} w={140} h={48} color={sparkColor || 'var(--primary)'} />
    </div>
  </div>;


// Welcome banner
const WelcomeBanner = () =>
<div className="welcome">
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-dark)', letterSpacing: '0.08em', marginBottom: 6, opacity: 0.7 }}>SELAMAT PAGI · MINGGU, 10 MEI 2026</div>
      <h2>Halo, Sri 👋</h2>
      <p>Hari ini ada <b>12 pengajuan menunggu approval</b> dan <b>34 lowongan aktif</b> sedang berjalan. Tim HR berperforma di atas target Q2.</p>
      <div className="actions">
        <button className="btn btn-primary"><Icon name="plus" size={16} /> Tambah Karyawan</button>
        <button className="btn btn-secondary"><Icon name="download" size={16} /> Export Laporan</button>
      </div>
    </div>
    <div className="deco-illustration" aria-hidden="true">
      {/* abstract people-cluster */}
      <svg viewBox="0 0 220 180" width="220" height="180">
        <defs>
          <linearGradient id="welc-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--primary-dark)" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        {/* big circle */}
        <circle cx="110" cy="100" r="64" fill="white" opacity="0.4" />
        <circle cx="110" cy="100" r="48" fill="white" opacity="0.7" />
        {/* avatars */}
        <g>
          <circle cx="110" cy="78" r="14" fill="url(#welc-a)" />
          <rect x="92" y="96" width="36" height="20" rx="10" fill="url(#welc-a)" />
          <circle cx="74" cy="118" r="10" fill="var(--primary-light)" />
          <rect x="62" y="132" width="24" height="14" rx="7" fill="var(--primary-light)" />
          <circle cx="146" cy="118" r="10" fill="var(--primary-light)" />
          <rect x="134" y="132" width="24" height="14" rx="7" fill="var(--primary-light)" />
        </g>
        {/* tag dots */}
        <circle cx="40" cy="50" r="4" fill="var(--primary)" opacity="0.4" />
        <circle cx="180" cy="42" r="6" fill="var(--primary)" opacity="0.3" />
        <circle cx="190" cy="140" r="4" fill="var(--primary)" opacity="0.5" />
      </svg>
    </div>
  </div>;


// Pending Approvals row
const ApprovalRow = ({ a }) =>
<div className="row">
    <div className={`avatar av-${a.av}`}>{a.init}</div>
    <div className="meta">
      <div className="ttl">{a.name}</div>
      <div className="sub">{a.unit} · {a.tipe}</div>
    </div>
    <div className="right">
      <div style={{ fontSize: 12, fontWeight: 600 }}>{a.durasi}</div>
      {a.hari != null && <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{a.hari} hari</div>}
    </div>
    <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
      <button className="icon-btn" style={{ width: 30, height: 30, background: 'var(--success-bg)', color: '#118D57', borderRadius: 8 }} title="Approve">
        <Icon name="check" size={16} strokeWidth={2.4} />
      </button>
      <button className="icon-btn" style={{ width: 30, height: 30, background: 'var(--error-bg)', color: '#B71D18', borderRadius: 8 }} title="Reject">
        <Icon name="x" size={16} strokeWidth={2.4} />
      </button>
    </div>
  </div>;


const upcomingMeta = {
  birthday: { icon: 'party', color: '#FFAB00', bg: 'var(--warning-bg)', label: 'Ulang tahun' },
  anniv: { icon: 'award', color: '#5119B7', bg: '#EBE3FF', label: 'Anniversary' },
  event: { icon: 'flag', color: '#006C9C', bg: 'var(--info-bg)', label: 'Acara' },
  training: { icon: 'book', color: '#118D57', bg: 'var(--primary-50)', label: 'Pelatihan' }
};

const UpcomingRow = ({ u }) => {
  const m = upcomingMeta[u.type];
  return (
    <div className="row">
      {u.av ?
      <div className={`avatar av-${u.av}`}>{u.init}</div> :

      <div className="avatar" style={{ background: m.bg, color: m.color }}>
          <Icon name={m.icon} size={18} />
        </div>
      }
      <div className="meta">
        <div className="ttl">{u.who}</div>
        <div className="sub">{u.meta}</div>
      </div>
      <span className="chip" style={{ color: m.color, background: m.bg }}>{m.label}</span>
    </div>);

};

// Employee table
const EmployeeTable = () => {
  const [tab, setTab] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const filters = ['all', 'active', 'on-leave', 'probation', 'inactive'];
  const filterLbl = { all: 'Semua', active: 'Aktif', 'on-leave': 'Cuti', probation: 'Probasi', inactive: 'Non-aktif' };

  const filtered = tab === 'all' ? EMPLOYEES : EMPLOYEES.filter((e) => e.status === tab);
  const counts = filters.reduce((acc, f) => {
    acc[f] = f === 'all' ? EMPLOYEES.length : EMPLOYEES.filter((e) => e.status === f).length;
    return acc;
  }, {});

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-head">
        <div>
          <h3 className="card-title">Daftar Karyawan</h3>
          <p className="card-subtitle">Total {HC_DISPLAY.toLocaleString('id-ID')} karyawan tersebar di 6 entitas</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary"><Icon name="upload" size={14} /> Import</button>
          <button className="btn btn-primary"><Icon name="plus" size={14} /> Tambah</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 24px', borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ display: 'flex', gap: 32 }}>
          {filters.map((f) =>
          <button
            key={f}
            onClick={() => setTab(f)}
            style={{
              padding: '14px 0',
              borderBottom: tab === f ? '2px solid var(--text)' : '2px solid transparent',
              color: tab === f ? 'var(--text)' : 'var(--text-secondary)',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'color 0.15s'
            }}>
            
              {filterLbl[f]}
              <span className={`chip ${tab === f ? 'solid' : 'gray'}`} style={{ fontSize: 11 }}>{counts[f]}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="filterbar">
        <div className="filter-input">
          <Icon name="search" size={16} />
          <input placeholder="Cari nama, NIK, atau email…" />
        </div>
        <button className="filter-select"><span className="lab">Unit:</span> Semua <Icon name="chevd" size={14} /></button>
        <button className="filter-select"><span className="lab">Lokasi:</span> Semua <Icon name="chevd" size={14} /></button>
        <button className="filter-select"><span className="lab">Jabatan:</span> Semua <Icon name="chevd" size={14} /></button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-ghost"><Icon name="filter" size={16} /> Filter Lanjut</button>
        <button className="btn btn-ghost"><Icon name="download" size={16} /></button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 36 }}><input type="checkbox" /></th>
              <th>Karyawan</th>
              <th>Unit / Anak Perusahaan</th>
              <th>Jabatan</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>Bergabung</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => {
              const s = STATUS_CHIP[e.status];
              return (
                <tr key={e.id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="empl-cell">
                      <div className={`avatar av-${e.av}`}>{e.init}</div>
                      <div className="meta">
                        <div className="nm">{e.name}</div>
                        <div className="em">{e.id} · {e.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{e.unit}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.dept}</div>
                  </td>
                  <td>{e.jabatan}</td>
                  <td>
                    <div className="flex"><Icon name="pin" size={14} color="var(--text-disabled)" /> {e.lokasi}</div>
                  </td>
                  <td><span className={`chip ${s.cls}`}>{s.lbl}</span></td>
                  <td className="muted tnum">{e.joined}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="icon-btn" style={{ width: 32, height: 32 }}><Icon name="eye" size={16} /></button>
                      <button className="icon-btn" style={{ width: 32, height: 32 }}><Icon name="dotsV" size={16} /></button>
                    </div>
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagi">
        <span>Menampilkan <b className="tnum" style={{ color: 'var(--text)' }}>1–{filtered.length}</b> dari {HC_DISPLAY.toLocaleString('id-ID')} karyawan</span>
        <div className="pagi-pages">
          <button><Icon name="chevl" size={14} /></button>
          <button className="on">1</button>
          <button>2</button>
          <button>3</button>
          <button>…</button>
          <button>1,071</button>
          <button><Icon name="chevr" size={14} /></button>
        </div>
      </div>
    </div>);

};

// Surat (letter) table — clicked from "Manajemen Surat" in sidebar
const DateRangeField = ({ from, to, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const fmt = (d) => {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    const monthShort = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][parseInt(m,10)-1];
    return `${parseInt(day,10)} ${monthShort} ${y}`;
  };
  const label = from && to ? `${fmt(from)} – ${fmt(to)}` : from ? `${fmt(from)} – …` : to ? `… – ${fmt(to)}` : 'Rentang Tanggal';
  const active = !!(from || to);

  const preset = (days) => {
    const end = new Date();
    const start = new Date(); start.setDate(end.getDate() - days + 1);
    const iso = (d) => d.toISOString().slice(0, 10);
    onChange({ from: iso(start), to: iso(end) });
  };
  const presetThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const iso = (d) => d.toISOString().slice(0, 10);
    onChange({ from: iso(start), to: iso(now) });
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="filter-select" onClick={() => setOpen((o) => !o)}
        style={{
          gap: 8,
          borderColor: active ? 'var(--primary)' : undefined,
          color: active ? 'var(--primary-dark)' : undefined,
          background: active ? 'var(--primary-50)' : undefined,
        }}>
        <Icon name="cal" size={14} />
        <span style={{ fontWeight: active ? 600 : 500 }}>{label}</span>
        {active && (
          <span onClick={(e) => { e.stopPropagation(); onChange({ from: '', to: '' }); }}
            style={{ display: 'inline-flex', marginLeft: 2, opacity: 0.7, cursor: 'pointer' }}
            title="Hapus rentang">
            <Icon name="x" size={12} strokeWidth={2.4} />
          </span>
        )}
        {!active && <Icon name="chevd" size={14} />}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 50,
          background: 'white', border: '1px solid var(--border)', borderRadius: 12,
          boxShadow: '0 12px 32px rgba(28,37,46,0.16), 0 2px 8px rgba(28,37,46,0.08)',
          padding: 16, width: 340, maxWidth: 'calc(100vw - 48px)',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {[
              { lbl: '7 hari', d: 7 },
              { lbl: '30 hari', d: 30 },
              { lbl: '90 hari', d: 90 },
            ].map((p) => (
              <button key={p.lbl} onClick={() => preset(p.d)}
                style={{ padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                  border: '1px solid var(--border)', background: 'white', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                {p.lbl}
              </button>
            ))}
            <button onClick={presetThisMonth}
              style={{ padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                border: '1px solid var(--border)', background: 'white', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Bulan ini
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 4 }}>DARI</div>
              <input type="date" value={from} max={to || undefined}
                onChange={(e) => onChange({ from: e.target.value, to })}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 4 }}>SAMPAI</div>
              <input type="date" value={to} min={from || undefined}
                onChange={(e) => onChange({ from, to: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--border)' }}>
            <button onClick={() => onChange({ from: '', to: '' })}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', background: 'transparent', cursor: 'pointer' }}>
              Reset
            </button>
            <button onClick={() => setOpen(false)} className="btn btn-primary" style={{ padding: '7px 14px', fontSize: 12 }}>
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SuratTable = ({ onNav, suratList, onWithdraw, onOpenLetter }) => {
  const data = suratList || SURAT;
  const [tab, setTab] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [sifatFilter, setSifatFilter] = React.useState('all');
  const [kecepatanFilter, setKecepatanFilter] = React.useState('all');
  const [dateRange, setDateRange] = React.useState({ from: '', to: '' });
  const [detailOpen, setDetailOpen] = React.useState(null);

  const filters = ['all', 'draft', 'menunggu-review', 'menunggu-approval'];
  const filterLbl = { all: 'Semua', 'draft': 'Draft', 'menunggu-review': 'Menunggu Review', 'menunggu-approval': 'Menunggu Approval' };

  // Sinkronkan detail modal dengan data terbaru (mis. setelah Tarik Kembali → status berubah)
  React.useEffect(() => {
    if (!detailOpen) return;
    const fresh = data.find((s) => s.id === detailOpen.id);
    if (fresh && fresh !== detailOpen) setDetailOpen(fresh);
  }, [data, detailOpen]);

  let filtered = data;
  if (tab !== 'all') filtered = filtered.filter(s => s.status === tab);
  if (sifatFilter !== 'all') filtered = filtered.filter(s => s.sifat === sifatFilter);
  if (kecepatanFilter !== 'all') filtered = filtered.filter(s => s.kecepatan === kecepatanFilter);
  if (dateRange.from || dateRange.to) {
    const ID_MONTH = { jan:0, feb:1, mar:2, apr:3, mei:4, jun:5, jul:6, agu:7, agt:7, sep:8, okt:9, nov:10, des:11 };
    const parseIdDate = (s) => {
      const parts = s.trim().split(/\s+/);
      if (parts.length !== 3) return null;
      const d = parseInt(parts[0], 10);
      const m = ID_MONTH[parts[1].toLowerCase().slice(0,3)];
      const y = parseInt(parts[2], 10);
      if (isNaN(d) || m == null || isNaN(y)) return null;
      return new Date(y, m, d);
    };
    const fromD = dateRange.from ? new Date(dateRange.from) : null;
    const toD = dateRange.to ? new Date(dateRange.to) : null;
    filtered = filtered.filter(s => {
      const sd = parseIdDate(s.tanggal);
      if (!sd) return true;
      if (fromD && sd < fromD) return false;
      if (toD && sd > toD) return false;
      return true;
    });
  }
  if (search) filtered = filtered.filter(s =>
    s.judul.toLowerCase().includes(search.toLowerCase()) ||
    s.no.toLowerCase().includes(search.toLowerCase()) ||
    s.pembuat.toLowerCase().includes(search.toLowerCase())
  );

  const counts = filters.reduce((acc, f) => {
    acc[f] = f === 'all' ? data.length : data.filter((e) => e.status === f).length;
    return acc;
  }, {});

  return (
    <>
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-head">
        <div>
          <h3 className="card-title">Daftar Surat</h3>
          <p className="card-subtitle">Total {data.length} surat tercatat di sistem</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary"><Icon name="download" size={14} /> Export</button>
          <button className="btn btn-primary" onClick={() => onNav && onNav('buat-surat-baru')}><Icon name="plus" size={14} /> Buat Surat Baru</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 24px', borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ display: 'flex', gap: 32 }}>
          {filters.map((f) =>
            <button key={f} onClick={() => setTab(f)}
              style={{
                padding: '14px 0',
                borderBottom: tab === f ? '2px solid var(--text)' : '2px solid transparent',
                color: tab === f ? 'var(--text)' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8,
                whiteSpace: 'nowrap',
                transition: 'color 0.15s' }}>
              {filterLbl[f]}
              <span className={`chip ${tab === f ? 'solid' : 'gray'}`} style={{ fontSize: 11 }}>{counts[f]}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="filterbar">
        <div className="filter-input">
          <Icon name="search" size={16} />
          <input placeholder="Cari judul, nomor surat, atau pembuat…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={sifatFilter} onChange={e => setSifatFilter(e.target.value)}
          style={{ appearance: 'none', paddingRight: 28, backgroundImage: 'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="%23637381" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>\')', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}>
          <option value="all">Sifat: Semua</option>
          <option value="biasa">Biasa</option>
          <option value="terbatas">Terbatas</option>
          <option value="rahasia">Rahasia</option>
          <option value="sangat-rahasia">Sangat Rahasia</option>
        </select>
        <select className="filter-select" value={kecepatanFilter} onChange={e => setKecepatanFilter(e.target.value)}
          style={{ appearance: 'none', paddingRight: 28, backgroundImage: 'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="%23637381" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>\')', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}>
          <option value="all">Kecepatan: Semua</option>
          <option value="biasa">Biasa</option>
          <option value="segera">Segera</option>
          <option value="sangat-segera">Sangat Segera</option>
        </select>
        <div style={{ flex: 1 }} />
        <DateRangeField from={dateRange.from} to={dateRange.to} onChange={setDateRange} />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 36 }}><input type="checkbox" /></th>
              <th>Judul Surat</th>
              <th>Sifat</th>
              <th>Kecepatan Tanggapan</th>
              <th>Status</th>
              <th>Tanggal Dibuat</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-secondary)' }}>
                Tidak ada surat yang sesuai filter
              </td></tr>
            ) : filtered.map((s) => {
              const sif = SIFAT_CHIP[s.sifat];
              const kec = KECEPATAN_CHIP[s.kecepatan];
              const stat = STATUS_SURAT_CHIP[s.status];
              return (
                <tr key={s.id} onClick={() => setDetailOpen(s)}>
                  <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                  <td style={{ maxWidth: 380 }}>
                    <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{s.judul}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{s.no} · oleh {s.pembuat}</div>
                  </td>
                  <td><span className={`chip ${sif.cls}`}>{sif.lbl}</span></td>
                  <td><span className={`chip ${kec.cls}`}>{kec.lbl}</span></td>
                  <td><span className={`chip ${stat.cls}`}>{stat.lbl}</span></td>
                  <td className="muted tnum">{s.tanggal}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setDetailOpen(s)}>
                        <Icon name="eye" size={14} /> Lihat Detail
                      </button>
                    </div>
                  </td>
                </tr>);
            })}
          </tbody>
        </table>
      </div>

      <div className="pagi">
        <span>Menampilkan <b className="tnum" style={{ color: 'var(--text)' }}>{filtered.length}</b> dari {data.length} surat</span>
        <div className="pagi-pages">
          <button><Icon name="chevl" size={14} /></button>
          <button className="on">1</button>
          <button><Icon name="chevr" size={14} /></button>
        </div>
      </div>
    </div>

    {detailOpen && (
      <SuratDetailModal
        surat={detailOpen}
        onClose={() => setDetailOpen(null)}
        onWithdraw={onWithdraw ? (id) => { onWithdraw(id); } : null}
        onOpenLetter={onOpenLetter || null}
      />
    )}
    </>
  );
};

const SuratAdvFilterModal = ({ value, onChange, onClose }) => {
  const [v, setV] = React.useState(value);
  const set = (patch) => setV((x) => ({ ...x, ...patch }));
  const reset = () => setV({ dateFrom: '', dateTo: '', pembuat: '' });
  const apply = () => { onChange(v); onClose(); };

  const Lbl = ({ children }) =>
    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 8 }}>{children}</div>;

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid var(--border)',
    borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: 'white', outline: 'none',
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(28,37,46,0.45)', backdropFilter: 'blur(4px)',
      display: 'grid', placeItems: 'center', zIndex: 100, padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 720, maxWidth: '100%', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="card-head" style={{ borderBottom: '1px dashed var(--border)' }}>
          <div>
            <h3 className="card-title">Filter Lanjut</h3>
            <p className="card-subtitle">Persempit pencarian surat dengan kriteria tambahan</p>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={18}/></button>
        </div>

        <div style={{ padding: '20px 24px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Tanggal */}
          <div>
            <Lbl>RENTANG TANGGAL DIBUAT</Lbl>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Dari</div>
                <input type="date" style={inputStyle} value={v.dateFrom} onChange={e => set({ dateFrom: e.target.value })} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Sampai</div>
                <input type="date" style={inputStyle} value={v.dateTo} onChange={e => set({ dateTo: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Pembuat */}
          <div>
            <Lbl>PEMBUAT</Lbl>
            <input type="text" style={inputStyle} placeholder="Nama atau NIK pembuat surat…"
              value={v.pembuat} onChange={e => set({ pembuat: e.target.value })} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px dashed var(--border)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-ghost" onClick={reset} style={{ color: 'var(--text-secondary)' }}>
            <Icon name="x" size={14}/> Reset Semua
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button className="btn btn-primary" onClick={apply}><Icon name="check" size={14}/> Terapkan Filter</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuratDetailModal = ({ surat, onClose, onWithdraw, onOpenLetter }) => {
  const sif = SIFAT_CHIP[surat.sifat];
  const kec = KECEPATAN_CHIP[surat.kecepatan];
  const stat = STATUS_SURAT_CHIP[surat.status];
  const [confirmWithdraw, setConfirmWithdraw] = React.useState(false);

  const reviewers = surat.reviewers || [];
  const approvers = surat.approvers || [];

  const isMenungguReview = surat.status === 'menunggu-review';
  const reviewerNames = reviewers.length
    ? reviewers.map((r) => r.name).join(', ')
    : null;

  const handleWithdraw = () => {
    if (!onWithdraw) return;
    onWithdraw(surat.id);
    setConfirmWithdraw(false);
    onClose();
  };

  const handleOpenLetter = () => {
    if (onOpenLetter) {
      onOpenLetter(surat);
      onClose();
    }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(28,37,46,0.45)', backdropFilter: 'blur(4px)',
      display: 'grid', placeItems: 'center', zIndex: 100, padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 680, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="card-head" style={{ borderBottom: '1px dashed var(--border)' }}>
          <div>
            <h3 className="card-title">Detail Surat</h3>
            <p className="card-subtitle">{surat.no}</p>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={18}/></button>
        </div>

        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {isMenungguReview && (
            <div className="review-banner">
              <span className="ic"><Icon name="info" size={18} strokeWidth={2.2}/></span>
              <div className="body">
                <div className="ttl">Surat Anda sedang direview</div>
                <div className="msg">
                  Surat ini sedang ditinjau oleh{' '}
                  <b>{reviewerNames || 'tim reviewer'}</b>. Anda akan menerima notifikasi ketika
                  proses review selesai. Selama menunggu, Anda dapat menarik kembali surat untuk
                  melakukan revisi—statusnya akan berubah menjadi <b>Draft</b>.
                </div>
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 6 }}>JUDUL SURAT</div>
            <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{surat.judul}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 6 }}>SIFAT</div>
              <span className={`chip ${sif.cls}`}>{sif.lbl}</span>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 6 }}>KECEPATAN</div>
              <span className={`chip ${kec.cls}`}>{kec.lbl}</span>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 6 }}>STATUS</div>
              <span className={`chip ${stat.cls}`}>{stat.lbl}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 6 }}>PEMBUAT</div>
              <div className="flex">
                <div className={`avatar av-${surat.av}`} style={{ width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>{surat.init}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{surat.pembuat}</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 6 }}>TANGGAL DIBUAT</div>
              <div style={{ fontSize: 14, fontWeight: 600 }} className="tnum">{surat.tanggal}</div>
            </div>
          </div>

          {(reviewers.length > 0 || approvers.length > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {reviewers.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 8 }}>REVIEWER</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {reviewers.map((p) => (
                      <div key={p.id} className="person-row">
                        <div className="av">{(p.name || '?').split(' ').map((s) => s[0]).slice(0,2).join('').toUpperCase()}</div>
                        <div className="meta">
                          <div className="nm">{p.name}</div>
                          <div className="sub">
                            <span className="nik">{p.id}</span>
                            {p.role && <><span> · </span><span>{p.role}</span></>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {approvers.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 8 }}>APPROVER</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {approvers.map((p) => (
                      <div key={p.id} className="person-row">
                        <div className="av">{(p.name || '?').split(' ').map((s) => s[0]).slice(0,2).join('').toUpperCase()}</div>
                        <div className="meta">
                          <div className="nm">{p.name}</div>
                          <div className="sub">
                            <span className="nik">{p.id}</span>
                            {p.role && <><span> · </span><span>{p.role}</span></>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {isMenungguReview && onWithdraw ? (
              !confirmWithdraw ? (
                <>
                  <button className="btn btn-secondary" onClick={onClose}>Tutup</button>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-danger" onClick={() => setConfirmWithdraw(true)}>
                      <Icon name="x" size={14} strokeWidth={2.4}/> Tarik Kembali Surat
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleOpenLetter} disabled={!onOpenLetter}>
                      <Icon name="ext" size={14}/> Buka Surat
                    </button>
                  </div>
                </>
              ) : (
                <div className="confirm-bar" style={{ width: '100%' }}>
                  <div className="confirm-msg">
                    <Icon name="info" size={16} strokeWidth={2.2}/>
                    <span>Yakin ingin menarik kembali surat ini? Status akan berubah menjadi <b>Draft</b>.</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary" onClick={() => setConfirmWithdraw(false)}>Batal</button>
                    <button className="btn btn-danger" onClick={handleWithdraw}>
                      <Icon name="check" size={14} strokeWidth={2.4}/> Ya, Tarik Kembali
                    </button>
                  </div>
                </div>
              )
            ) : (
              <>
                <button className="btn btn-secondary" onClick={onClose}>Tutup</button>
                <button type="button" className="btn btn-primary" onClick={handleOpenLetter} disabled={!onOpenLetter}>
                  <Icon name="ext" size={14}/> Buka Surat
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// — Tag input (multi-select chip) —
const TagInput = ({ tags, onRemove, placeholder, onAdd, readOnly }) => {
  const [val, setVal] = React.useState('');
  const handleKey = (e) => {
    if (readOnly) return;
    if (e.key === 'Enter' && val.trim()) {
      e.preventDefault();
      onAdd && onAdd(val.trim());
      setVal('');
    }
  };
  return (
    <div className={`tag-input${readOnly ? ' read-only' : ''}`}>
      {tags.map((tag) => (
        <span className="tag" key={tag.id}>
          <span className="id">{tag.id}</span>
          <span>· {tag.name}</span>
          {tag.role && <span style={{ opacity: 0.85 }}>· {tag.role}</span>}
          {!readOnly && (
            <button type="button" onClick={() => onRemove(tag.id)} title="Hapus">
              <Icon name="x" size={11} strokeWidth={2.6} />
            </button>
          )}
        </span>
      ))}
      {!readOnly && (
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={handleKey}
          placeholder={tags.length === 0 ? placeholder : ''}
        />
      )}
      {readOnly && tags.length === 0 && <span className="tag-readonly-empty">—</span>}
    </div>
  );
};

// — Rich text editor —
const RichTextEditor = ({ readOnly, initialHtml = '', htmlKey = '' }) => {
  const editorRef = React.useRef(null);
  const [tab, setTab] = React.useState('Home');
  const [active, setActive] = React.useState({});
  const [font, setFont] = React.useState('Calibri');
  const [size, setSize] = React.useState('11');
  const [color, setColor] = React.useState('#FF0000');
  const [stats, setStats] = React.useState({ words: 0, chars: 0 });

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current && editorRef.current.focus();
    syncActive();
    syncStats();
  };

  const syncActive = () => {
    const next = {};
    ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
     'insertUnorderedList', 'insertOrderedList',
     'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'].forEach((c) => {
      try { next[c] = document.queryCommandState(c); } catch (e) {}
    });
    setActive(next);
  };

  const syncStats = () => {
    if (!editorRef.current) return;
    const txt = editorRef.current.innerText || '';
    const trimmed = txt.trim();
    setStats({
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      chars: txt.length,
    });
  };

  const onSelect = () => syncActive();
  const onInput = () => { syncActive(); syncStats(); };

  const tabs = ['File', 'Home', 'Insert', 'Page Layout', 'References', 'View'];

  React.useEffect(() => {
    if (!readOnly || !editorRef.current) return;
    const html = initialHtml && initialHtml.trim() ? initialHtml : '<p style="color:var(--text-secondary);font-style:italic">Tidak ada isi dokumen.</p>';
    editorRef.current.innerHTML = html;
    syncStats();
  }, [readOnly, initialHtml, htmlKey]);

  if (readOnly) {
    return (
      <div className="editor editor-readonly">
        <div className="readonly-editor-banner">Tampilan baca — editor dinonaktifkan</div>
        <div className="editor-ruler">
          <div className="editor-ruler-marks">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="editor-ruler-mark" key={i}>{i + 1}</div>
            ))}
          </div>
        </div>
        <div className="editor-page">
          <div
            ref={editorRef}
            className="editor-paper readonly"
            contentEditable={false}
            suppressContentEditableWarning
            style={{ fontFamily: font }}
          />
        </div>
        <div className="editor-status">
          <span>Halaman 1 dari 1</span>
          <span>{stats.words} kata · {stats.chars} karakter</span>
        </div>
      </div>
    );
  }

  const Tb = ({ name, cmd, val, label, title }) => (
    <button type="button" className={`tb${active[cmd] ? ' on' : ''}`} title={title || cmd}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => exec(cmd, val)}>
      {name ? <Icon name={name} size={15} strokeWidth={1.8}/> : <span style={{ fontSize: 12, fontWeight: 700 }}>{label}</span>}
    </button>
  );

  return (
    <div className="editor">
      <div className="editor-tabs">
        {tabs.map(t => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="editor-toolbar">
        <Tb name="undo" cmd="undo" title="Undo (Ctrl+Z)"/>
        <Tb name="redo" cmd="redo" title="Redo (Ctrl+Y)"/>
        <span className="sep"/>
        <Tb name="cut" cmd="cut" title="Cut"/>
        <Tb name="copy" cmd="copy" title="Copy"/>
        <Tb name="paste" cmd="paste" title="Paste"/>
        <span className="sep"/>

        <select className="tb-sel" value={font} onChange={(e) => { setFont(e.target.value); exec('fontName', e.target.value); }}>
          <option>Calibri</option>
          <option>Arial</option>
          <option>Times New Roman</option>
          <option>Verdana</option>
          <option>Georgia</option>
          <option>Public Sans</option>
        </select>
        <select className="tb-sel" value={size} onChange={(e) => { setSize(e.target.value); exec('fontSize', e.target.value); }} style={{ width: 56 }}>
          {['1','2','3','4','5','6','7'].map(s => <option key={s} value={s}>{[8,10,11,13,18,24,36][parseInt(s)-1]}</option>)}
        </select>
        <button type="button" className="tb" title="Perbesar font" onMouseDown={(e) => e.preventDefault()}
          onClick={() => { const n = Math.min(7, parseInt(size) + 1); setSize(String(n)); exec('fontSize', String(n)); }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>A<sup style={{ fontSize: 8 }}>+</sup></span>
        </button>
        <button type="button" className="tb" title="Perkecil font" onMouseDown={(e) => e.preventDefault()}
          onClick={() => { const n = Math.max(1, parseInt(size) - 1); setSize(String(n)); exec('fontSize', String(n)); }}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>A<sup style={{ fontSize: 8 }}>−</sup></span>
        </button>
        <span className="sep"/>

        <input type="color" className="tb-color" title="Warna teks"
          value={color} onChange={(e) => { setColor(e.target.value); exec('foreColor', e.target.value); }}/>
        <button type="button" className="tb" title="Hapus pemformatan" onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('removeFormat')}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>A<sub style={{ fontSize: 8 }}>×</sub></span>
        </button>
        <span className="sep"/>

        <Tb cmd="bold" label="B" title="Bold (Ctrl+B)"/>
        <Tb cmd="italic" label="I" title="Italic (Ctrl+I)"/>
        <Tb cmd="underline" label="U" title="Underline (Ctrl+U)"/>
        <Tb cmd="subscript" label="X₂" title="Subscript"/>
        <Tb cmd="superscript" label="X²" title="Superscript"/>
        <button type="button" className="tb" title="Highlight teks" onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('hiliteColor', '#FFF59D')}>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Aa</span>
        </button>
        <button type="button" className="tb" title="Strikethrough" onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('strikeThrough')}>
          <span style={{ fontSize: 12, fontWeight: 700, textDecoration: 'line-through' }}>ab</span>
        </button>
        <span className="sep"/>

        <Tb name="bullet" cmd="insertUnorderedList" title="Bullet list"/>
        <Tb name="numlist" cmd="insertOrderedList" title="Numbered list"/>
        <Tb name="indentR" cmd="indent" title="Indent"/>
        <Tb name="indentL" cmd="outdent" title="Outdent"/>
        <span className="sep"/>

        <Tb name="alignL" cmd="justifyLeft" title="Rata kiri"/>
        <Tb name="alignC" cmd="justifyCenter" title="Rata tengah"/>
        <Tb name="alignR" cmd="justifyRight" title="Rata kanan"/>
        <Tb name="alignJ" cmd="justifyFull" title="Justify"/>
      </div>

      <div className="editor-ruler">
        <div className="editor-ruler-marks">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="editor-ruler-mark" key={i}>{i + 1}</div>
          ))}
        </div>
      </div>

      <div className="editor-page">
        <div ref={editorRef} className="editor-paper" contentEditable suppressContentEditableWarning
          data-placeholder="Mulai mengetik isi surat di sini…"
          onInput={onInput} onMouseUp={onSelect} onKeyUp={onSelect}
          style={{ fontFamily: font }}>
        </div>
      </div>

      <div className="editor-status">
        <span>Halaman 1 dari 1</span>
        <span>{stats.words} kata · {stats.chars} karakter</span>
      </div>
    </div>
  );
};

// — Searchable dropdown for picking a person —
const initialsOf = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const PersonCombo = ({ value, onChange, placeholder, options = [], excludeIds = [], readOnly }) => {
  if (readOnly) {
    return (
      <div className="combo combo-readonly">
        <div className="combo-control" style={{ cursor: 'default', pointerEvents: 'none' }}>
          {value ? (
            <span className="selected" style={{ cursor: 'default', maxWidth: '100%', flexWrap: 'wrap', height: 'auto', minHeight: 34 }}>
              <span className="id">{value.id}</span>
              <span>· {value.name}</span>
              {value.role && <span style={{ opacity: 0.88 }}> · {value.role}</span>}
            </span>
          ) : (
            <span className="placeholder" style={{ color: 'var(--text-secondary)' }}>—</span>
          )}
        </div>
      </div>
    );
  }
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [highlight, setHighlight] = React.useState(0);
  const [popPos, setPopPos] = React.useState({ top: 0, left: 0, width: 0 });
  const wrapRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const popRef = React.useRef(null);

  React.useEffect(() => {
    const onDoc = (e) => {
      if (
        wrapRef.current && !wrapRef.current.contains(e.target) &&
        popRef.current && !popRef.current.contains(e.target)
      ) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const updatePopPos = React.useCallback(() => {
    if (wrapRef.current) {
      const r = wrapRef.current.getBoundingClientRect();
      setPopPos({ top: r.bottom + 6, left: r.left, width: r.width });
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      updatePopPos();
      if (searchRef.current) setTimeout(() => searchRef.current && searchRef.current.focus(), 10);
      window.addEventListener('scroll', updatePopPos, true);
      window.addEventListener('resize', updatePopPos);
      return () => {
        window.removeEventListener('scroll', updatePopPos, true);
        window.removeEventListener('resize', updatePopPos);
      };
    }
  }, [open, updatePopPos]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return options
      .filter((p) => !excludeIds.includes(p.id) || (value && p.id === value.id))
      .filter((p) => {
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.role && p.role.toLowerCase().includes(q)) ||
          (p.unit && p.unit.toLowerCase().includes(q))
        );
      });
  }, [options, query, excludeIds, value]);

  const select = (p) => {
    onChange(p);
    setOpen(false);
    setQuery('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(filtered.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlight]) select(filtered[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div className={`combo${open ? ' open' : ''}`} ref={wrapRef}>
      <div className="combo-control" onClick={() => setOpen((o) => !o)}>
        {value ? (
          <span className="selected" onClick={(e) => e.stopPropagation()}>
            <span className="id">{value.id}</span>
            <span>· {value.name}</span>
            <button type="button" title="Hapus pilihan"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}>
              <Icon name="x" size={11} strokeWidth={2.6}/>
            </button>
          </span>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className="chev"><Icon name="chevd" size={16}/></span>
      </div>
      {open && (
        <div ref={popRef} className="combo-pop"
          style={{ position: 'fixed', top: popPos.top, left: popPos.left, width: popPos.width }}
          onClick={(e) => e.stopPropagation()}>
          <div className="combo-search">
            <Icon name="search" size={14}/>
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setHighlight(0); }}
              onKeyDown={onKeyDown}
              placeholder="Cari nama, NIK, jabatan…"
            />
          </div>
          <div className="combo-list">
            {filtered.length === 0 ? (
              <div className="combo-empty">
                <Icon name="search" size={20} className="ic"/>
                Tidak ada pegawai yang cocok
              </div>
            ) : filtered.map((p, i) => (
              <div key={p.id}
                className={`combo-item${i === highlight ? ' active' : ''}${value && value.id === p.id ? ' selected' : ''}`}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => select(p)}>
                <div className="av">{initialsOf(p.name)}</div>
                <div className="meta">
                  <div className="nm">{p.name}</div>
                  <div className="sub">
                    <span className="nik">{p.id}</span>
                    <span>·</span>
                    <span>{p.role}</span>
                    {p.unit && <><span>·</span><span>{p.unit}</span></>}
                  </div>
                </div>
                {value && value.id === p.id && <span className="check"><Icon name="check" size={16} strokeWidth={2.4}/></span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// — Normalize surat (dummy / API) ke nilai field form —
const escapeSuratHtml = (s) => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const SIFAT_TO_FORM_LABEL = { biasa: 'Biasa', terbatas: 'Terbatas', rahasia: 'Rahasia', 'sangat-rahasia': 'Sangat Rahasia' };
const KEC_TO_FORM_LABEL = { biasa: 'Biasa', segera: 'Segera', 'sangat-segera': 'Sangat Segera' };

const KLASIFIKASI_SEG_MAP = {
  HC01: 'HC.01 - Sumber Daya Manusia',
  HC02: 'HC.02 - Pengembangan SDM',
  OP01: 'OP.01 - Operasional',
  FN01: 'FN.01 - Keuangan',
  DIR: 'OP.01 - Operasional',
  AUD: 'FN.01 - Keuangan',
  PROC: 'FN.01 - Keuangan',
  HR: 'HC.01 - Sumber Daya Manusia',
  IT: 'OP.01 - Operasional',
  MKT: 'OP.01 - Operasional',
  FIN: 'FN.01 - Keuangan',
  RND: 'HC.02 - Pengembangan SDM',
  QC: 'OP.01 - Operasional',
};

const klasifikasiGuessFromNomor = (no) => {
  const m = String(no || '').match(/\/PI\/([^/]+)\//);
  const seg = m && m[1];
  return (seg && KLASIFIKASI_SEG_MAP[seg]) || '';
};

const normalizeSuratToFormSnapshot = (surat) => {
  const jenis = surat.jenis || 'Memorandum';
  const template = surat.template || '';
  const klasifikasi = surat.klasifikasi || klasifikasiGuessFromNomor(surat.no);
  const sifat = SIFAT_TO_FORM_LABEL[surat.sifat] || '';
  const kecepatan = KEC_TO_FORM_LABEL[surat.kecepatan] || '';
  const judul = surat.judul || '';
  const keterangan = surat.keterangan || '';
  const ringkas = surat.ringkas || '';
  const rev = Array.isArray(surat.reviewers) ? surat.reviewers.filter(Boolean) : [];
  const app = Array.isArray(surat.approvers) ? surat.approvers.filter(Boolean) : [];
  const reviewers = rev.length
    ? rev.map((p, i) => ({ rid: `rv-${surat.id}-${i}`, person: { id: p.id, name: p.name, role: p.role || '', unit: p.unit || '' } }))
    : [{ rid: `rv-${surat.id}-0`, person: null }];
  const approvers = app.length
    ? app.map((p, i) => ({ rid: `ap-${surat.id}-${i}`, person: { id: p.id, name: p.name, role: p.role || '', unit: p.unit || '' } }))
    : [{ rid: `ap-${surat.id}-0`, person: null }];
  const tujuan = Array.isArray(surat.tujuan) ? [...surat.tujuan] : [];
  const cc = Array.isArray(surat.cc) ? [...surat.cc] : [];
  const attachments = Array.isArray(surat.attachments) ? [...surat.attachments] : [];
  const isiHtml = surat.isiHtml || `<p><strong>${escapeSuratHtml(judul)}</strong></p><p style="opacity:0.82">Isi dokumen pada surat ini hanya dapat disunting saat status masih Draft.</p>`;
  return { jenis, template, klasifikasi, sifat, kecepatan, judul, keterangan, ringkas, reviewers, approvers, tujuan, cc, attachments, isiHtml };
};

const SuratPanelHistory = ({ surat }) => {
  const chip = STATUS_SURAT_CHIP[surat.status];
  return (
    <div className="card surat-extra-card">
      <div className="surat-extra-head">
        <h3>Riwayat alur surat</h3>
        <p className="sub">Lintasan status dan aktivitas utama · {surat.no}</p>
      </div>
      <table className="tbl surat-mini-tbl">
        <thead>
          <tr>
            <th>Waktu</th>
            <th>Aktor</th>
            <th>Peristiwa</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="tnum muted">11 Mei 2026 09:12</td><td>Sistem</td><td>Pencatatan</td><td>Surat dibuat · status <span className={`chip ${chip?.cls || 'gray'}`}>{chip?.lbl || surat.status}</span></td></tr>
          <tr><td className="tnum muted">11 Mei 2026 09:20</td><td>{surat.pembuat}</td><td>Unggahan</td><td>Disimpan / dikirim ke alur reviewer (simulasi)</td></tr>
          <tr><td className="tnum muted">11 Mei 2026 09:55</td><td>Reviewer</td><td>In review</td><td>Dokumen terbuka di antrian review</td></tr>
        </tbody>
      </table>
    </div>
  );
};

const SuratPanelDocHistory = ({ surat }) => (
  <div className="card surat-extra-card">
    <div className="surat-extra-head">
      <h3>Doc History</h3>
      <p className="sub">Revisi isi dokumen dan metadata · versi penyimpanan</p>
    </div>
    <table className="tbl surat-mini-tbl">
      <thead>
        <tr>
          <th>Versi</th>
          <th>Tanggal</th>
          <th>Oleh</th>
          <th>Catatan ringkas</th>
        </tr>
      </thead>
      <tbody>
        <tr><td className="tnum"><b>v3</b></td><td className="tnum muted">11 Mei 2026 11:05</td><td>Sistem</td><td>Sinkron nominal terbaru dari editor</td></tr>
        <tr><td className="tnum"><b>v2</b></td><td className="tnum muted">10 Mei 2026 16:42</td><td>{surat.pembuat}</td><td>Ubah struktur lampiran</td></tr>
        <tr><td className="tnum"><b>v1</b></td><td className="tnum muted">{surat.tanggal}</td><td>{surat.pembuat}</td><td>Versi awal penyimpanan</td></tr>
      </tbody>
    </table>
  </div>
);

const SuratPanelHierarchy = ({ surat }) => {
  const reviewers = Array.isArray(surat.reviewers) ? surat.reviewers : [];
  const approvers = Array.isArray(surat.approvers) ? surat.approvers : [];
  return (
    <div className="card surat-extra-card">
      <div className="surat-extra-head">
        <h3>Hierarchy</h3>
        <p className="sub">Susunan jabatan &amp; rantai pengesahan dokumentasi</p>
      </div>
      <div className="surat-hier">
        <div className="hier-node">
          <span className="lbl">Pembuat</span>
          <strong>{surat.pembuat}</strong>
          <span className="muted tnum">{surat.no}</span>
        </div>
        {reviewers.length > 0 && reviewers.map((p, idx) => (
          <React.Fragment key={p.id}>
            <div className="hier-line"><span/><Icon name="chevd" size={14}/></div>
            <div className="hier-node">
              <span className="lbl">Reviewer {idx + 1}</span>
              <strong>{p.name}</strong>
              <span className="muted">{p.id}{p.role ? ` · ${p.role}` : ''}</span>
            </div>
          </React.Fragment>
        ))}
        {approvers.length > 0 && approvers.map((p, idx) => (
          <React.Fragment key={p.id}>
            <div className="hier-line"><span/><Icon name="chevd" size={14}/></div>
            <div className="hier-node">
              <span className="lbl">Approver {idx + 1}</span>
              <strong>{p.name}</strong>
              <span className="muted">{p.id}{p.role ? ` · ${p.role}` : ''}</span>
            </div>
          </React.Fragment>
        ))}
        {reviewers.length === 0 && approvers.length === 0 && (
          <>
            <div className="hier-line"><span/><Icon name="chevd" size={14}/></div>
            <div className="hier-node muted" style={{ fontStyle: 'italic' }}>Rantai review/approve belum tercantum untuk surat dari arsip sistem.</div>
          </>
        )}
      </div>
    </div>
  );
};

const BuatSuratBaru = ({ onBack, onSubmit, readOnly, surat, onWithdraw }) => {
  const [jenis, setJenis] = React.useState('');
  const [template, setTemplate] = React.useState('');
  const [klasifikasi, setKlasifikasi] = React.useState('');
  const [sifat, setSifat] = React.useState('');
  const [kecepatan, setKecepatan] = React.useState('');
  const [judul, setJudul] = React.useState('');
  const [keterangan, setKeterangan] = React.useState('');
  const [ringkas, setRingkas] = React.useState('');
  const [reviewers, setReviewers] = React.useState([
    { rid: 'r-1', person: null },
  ]);
  const [approvers, setApprovers] = React.useState([
    { rid: 'a-1', person: null },
  ]);
  const [tujuan, setTujuan] = React.useState([]);
  const [cc, setCc] = React.useState([]);
  const [attachments, setAttachments] = React.useState([]);
  const [detailTab, setDetailTab] = React.useState('surat');
  const [readonlyEditorHtml, setReadonlyEditorHtml] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const dropzoneRef = React.useRef(null);
  const [confirmWithdrawDetail, setConfirmWithdrawDetail] = React.useState(false);

  React.useEffect(() => {
    if (!readOnly || !surat) return;
    const f = normalizeSuratToFormSnapshot(surat);
    setConfirmWithdrawDetail(false);
    setDetailTab('surat');
    setJenis(f.jenis);
    setTemplate(f.template);
    setKlasifikasi(f.klasifikasi);
    setSifat(f.sifat);
    setKecepatan(f.kecepatan);
    setJudul(f.judul);
    setKeterangan(f.keterangan);
    setRingkas(f.ringkas);
    setReviewers(f.reviewers);
    setApprovers(f.approvers);
    setTujuan(f.tujuan);
    setCc(f.cc);
    setAttachments(f.attachments);
    setReadonlyEditorHtml(f.isiHtml);
    setErrors({});
  }, [readOnly, surat]);

  // — Validasi & helper untuk submit/draft —
  const SIFAT_KEY = { 'Biasa': 'biasa', 'Terbatas': 'terbatas', 'Rahasia': 'rahasia', 'Sangat Rahasia': 'sangat-rahasia' };
  const KEC_KEY = { 'Biasa': 'biasa', 'Segera': 'segera', 'Sangat Segera': 'sangat-segera' };

  const formatTglID = (d) => {
    const bln = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return `${String(d.getDate()).padStart(2,'0')} ${bln[d.getMonth()]} ${d.getFullYear()}`;
  };

  const validate = () => {
    const e = {};
    if (!jenis)       e.jenis = 'Jenis surat wajib dipilih';
    if (!klasifikasi) e.klasifikasi = 'Klasifikasi wajib dipilih';
    if (!sifat)       e.sifat = 'Sifat wajib dipilih';
    if (!kecepatan)   e.kecepatan = 'Kecepatan tanggapan wajib dipilih';
    if (!judul.trim()) e.judul = 'Judul surat wajib diisi';
    if (!reviewers.some((r) => r.person)) e.reviewers = 'Minimal 1 reviewer wajib dipilih';
    if (!approvers.some((a) => a.person)) e.approvers = 'Minimal 1 approver wajib dipilih';
    if (tujuan.length === 0) e.tujuan = 'Minimal 1 tujuan surat wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildSurat = (status) => {
    const now = new Date();
    const tahun = now.getFullYear();
    const bulanRomawi = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][now.getMonth()];
    const seq = String(Math.floor(Math.random() * 900) + 100);
    const klasKode = (klasifikasi.split(' ')[0] || 'NEW').replace('.', '');
    return {
      id: `SR-${tahun}-${String(now.getTime()).slice(-4)}`,
      no: `${seq}/PI/${klasKode}/${bulanRomawi}/${tahun}`,
      judul: judul.trim(),
      sifat: SIFAT_KEY[sifat] || 'biasa',
      kecepatan: KEC_KEY[kecepatan] || 'biasa',
      status,
      tanggal: formatTglID(now),
      pembuat: 'Sri Dewanti',
      av: 1,
      init: 'SD',
      jenis, template, klasifikasi, keterangan, ringkas,
      reviewers: reviewers.map((r) => r.person).filter(Boolean),
      approvers: approvers.map((a) => a.person).filter(Boolean),
      tujuan, cc,
      attachments: attachments.map(({ id, name, size, type }) => ({ id, name, size, type })),
    };
  };

  const handleSubmit = () => {
    if (!validate()) {
      const firstErr = document.querySelector('.fld-err');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);
    const newSurat = buildSurat('menunggu-review');
    onSubmit && onSubmit(newSurat);
  };

  const handleSaveDraft = () => {
    if (!judul.trim()) {
      setErrors((p) => ({ ...p, judul: 'Judul surat wajib diisi minimal untuk menyimpan draft' }));
      return;
    }
    const newSurat = buildSurat('draft');
    onSubmit && onSubmit(newSurat);
  };

  const addReviewer = () => setReviewers((p) => [...p, { rid: `r-${Date.now()}`, person: null }]);
  const removeReviewer = (rid) => setReviewers((p) => p.filter((r) => r.rid !== rid));
  const updateReviewer = (rid, person) => setReviewers((p) => p.map((r) => (r.rid === rid ? { ...r, person } : r)));

  const addApprover = () => setApprovers((p) => [...p, { rid: `a-${Date.now()}`, person: null }]);
  const removeApprover = (rid) => setApprovers((p) => p.filter((r) => r.rid !== rid));
  const updateApprover = (rid, person) => setApprovers((p) => p.map((r) => (r.rid === rid ? { ...r, person } : r)));

  const addAttachments = (filesList) => {
    const arr = Array.from(filesList || []);
    if (!arr.length) return;
    const next = arr.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      type: f.type || 'application/octet-stream',
    }));
    setAttachments((prev) => [...prev, ...next]);
  };

  const removeAttachment = (id) => setAttachments((prev) => prev.filter((a) => a.id !== id));

  const formatBytes = (b) => {
    if (b < 1024) return `${b} B`;
    if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1048576).toFixed(2)} MB`;
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (dropzoneRef.current) dropzoneRef.current.classList.remove('drag-over');
    addAttachments(e.dataTransfer.files);
  };
  const onDragOver = (e) => { e.preventDefault(); };

  const handleWithdrawFromDetail = () => {
    if (!onWithdraw || !surat) return;
    onWithdraw(surat.id);
    setConfirmWithdrawDetail(false);
    onBack();
  };

  const awaitingReviewWithdraw = readOnly && surat && surat.status === 'menunggu-review' && onWithdraw;

  return (
    <div className={`surat-form${readOnly ? ' surat-form-readonly' : ''}`} style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div className="surat-form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="back" onClick={onBack} title="Kembali"><Icon name="chevl" size={20}/></button>
          <div>
            <h1>{readOnly ? 'Detail Surat' : 'Buat Surat Baru'}</h1>
            <div className="crumbs">
              <span>Pupuk Indonesia</span>
              <span className="sep"></span>
              <span>Manajemen Surat</span>
              <span className="sep"></span>
              <span className="now">{readOnly ? `Detail · ${surat && surat.no ? surat.no : ''}` : 'Buat Surat Baru'}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {readOnly && awaitingReviewWithdraw ? (
            !confirmWithdrawDetail ? (
              <button type="button" className="btn btn-danger" onClick={() => setConfirmWithdrawDetail(true)}>
                <Icon name="x" size={14} strokeWidth={2.4}/> Tarik Kembali Surat
              </button>
            ) : (
              <>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginRight: 4 }}>
                  Tarik surat ini? Status menjadi <b>Draft</b>.
                </span>
                <button type="button" className="btn btn-secondary" onClick={() => setConfirmWithdrawDetail(false)}>
                  Batal
                </button>
                <button type="button" className="btn btn-danger" onClick={handleWithdrawFromDetail}>
                  <Icon name="check" size={14} strokeWidth={2.4}/> Ya, Tarik Kembali
                </button>
              </>
            )
          ) : readOnly ? (
            <button type="button" className="btn btn-secondary" onClick={onBack}><Icon name="chevl" size={14}/> Kembali</button>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={onBack} disabled={submitting}>Batal</button>
              <button className="btn btn-secondary" onClick={handleSaveDraft} disabled={submitting}>
                <Icon name="download" size={14}/> Simpan Draft
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                <Icon name="check" size={14}/> {submitting ? 'Menyubmit…' : 'Submit Surat'}
              </button>
            </>
          )}
        </div>
      </div>

      {readOnly && surat && (
        <div className="surat-form-tabs">
          {[
            { key: 'surat', label: 'Detail Surat' },
            { key: 'history', label: 'History' },
            { key: 'doc-history', label: 'Doc History' },
            { key: 'hierarchy', label: 'Hierarchy' },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              className={`surat-tab${detailTab === t.key ? ' on' : ''}`}
              onClick={() => setDetailTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {!readOnly && (
      <div className="surat-alert">
        <span className="icon"><Icon name="info" size={16} strokeWidth={2}/></span>
        <div>
          <b>Kode Unit belum diisi oleh administrator.</b> Silahkan hubungi administrator. Mohon untuk tidak melakukan copy paste langsung dari MS Word agar format tetap rapi.
        </div>
      </div>
      )}

      {readOnly && surat && detailTab === 'history' && <SuratPanelHistory surat={surat}/>}
      {readOnly && surat && detailTab === 'doc-history' && <SuratPanelDocHistory surat={surat}/>}
      {readOnly && surat && detailTab === 'hierarchy' && <SuratPanelHierarchy surat={surat}/>}

      {(!readOnly || detailTab === 'surat') && (
      <>
      {/* Detail Surat */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="surat-section-head">
          <span className="num">1</span>
          <h3>Detail Surat</h3>
          <span className="sub">Informasi dasar dan klasifikasi surat</span>
        </div>
        <div className="surat-grid">
          <div className="fld">
            <label className="fld-lbl">Jenis <span className="req">*</span></label>
            <select className={`sel${errors.jenis ? ' err' : ''}`} disabled={readOnly} value={jenis} onChange={(e) => setJenis(e.target.value)}>
              <option value="" disabled>Pilih jenis surat…</option>
              <option>Memorandum</option>
              <option>Surat Keputusan</option>
              <option>Surat Edaran</option>
              <option>Surat Tugas</option>
              <option>Nota Dinas</option>
            </select>
            {errors.jenis && <div className="fld-err">{errors.jenis}</div>}
          </div>
          <div className="fld">
            <label className="fld-lbl">Template</label>
            <select className="sel" disabled={readOnly} value={template} onChange={(e) => setTemplate(e.target.value)}>
              <option value="" disabled>Pilih template (opsional)…</option>
              <option>Template Default</option>
              <option>Template SK Direksi</option>
              <option>Template Memo Internal</option>
            </select>
          </div>

          <div className="fld full">
            <label className="fld-lbl">Klasifikasi <span className="req">*</span></label>
            <select className={`sel${errors.klasifikasi ? ' err' : ''}`} disabled={readOnly} value={klasifikasi} onChange={(e) => setKlasifikasi(e.target.value)}
              style={{ maxWidth: 'calc(50% - 12px)' }}>
              <option value="" disabled>Pilih klasifikasi…</option>
              <option>HC.01 - Sumber Daya Manusia</option>
              <option>HC.02 - Pengembangan SDM</option>
              <option>OP.01 - Operasional</option>
              <option>FN.01 - Keuangan</option>
            </select>
            {errors.klasifikasi && <div className="fld-err">{errors.klasifikasi}</div>}
          </div>

          <div className="fld">
            <label className="fld-lbl">Sifat <span className="req">*</span></label>
            <select className={`sel${errors.sifat ? ' err' : ''}`} disabled={readOnly} value={sifat} onChange={(e) => setSifat(e.target.value)}>
              <option value="" disabled>Pilih sifat…</option>
              <option>Biasa</option>
              <option>Terbatas</option>
              <option>Rahasia</option>
              <option>Sangat Rahasia</option>
            </select>
            {errors.sifat && <div className="fld-err">{errors.sifat}</div>}
          </div>
          <div className="fld">
            <label className="fld-lbl">Kecepatan Tanggapan <span className="req">*</span></label>
            <select className={`sel${errors.kecepatan ? ' err' : ''}`} disabled={readOnly} value={kecepatan} onChange={(e) => setKecepatan(e.target.value)}>
              <option value="" disabled>Pilih kecepatan…</option>
              <option>Biasa</option>
              <option>Segera</option>
              <option>Sangat Segera</option>
            </select>
            {errors.kecepatan && <div className="fld-err">{errors.kecepatan}</div>}
          </div>

          <div className="fld full">
            <label className="fld-lbl">Judul <span className="req">*</span></label>
            <input className={`inp${errors.judul ? ' err' : ''}`} disabled={readOnly} type="text" value={judul} onChange={(e) => setJudul(e.target.value)}
              placeholder="Tuliskan judul surat yang jelas dan ringkas…"/>
            {errors.judul && <div className="fld-err">{errors.judul}</div>}
          </div>
        </div>
      </div>

      {/* Penerima */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="surat-section-head">
          <span className="num">2</span>
          <h3>Penerima &amp; Approval</h3>
          <span className="sub">Reviewer, approver, dan tujuan surat</span>
        </div>
        <div className="surat-grid">
          <div className="fld full">
            <div className="repeater">
              {reviewers.map((r, i) => {
                const otherIds = reviewers.filter((x) => x.rid !== r.rid && x.person).map((x) => x.person.id);
                return (
                  <div className="repeater-row" key={r.rid}>
                    <div className="fld">
                      <label className="fld-lbl">Reviewer {i + 1} <span className="req">*</span></label>
                      <PersonCombo
                        readOnly={readOnly}
                        value={r.person}
                        onChange={(person) => updateReviewer(r.rid, person)}
                        options={PERSONNEL}
                        excludeIds={otherIds}
                        placeholder="Pilih reviewer…"
                      />
                    </div>
                    {!readOnly && reviewers.length > 1 && (
                      <button type="button" className="remove-btn" title="Hapus reviewer ini"
                        onClick={() => removeReviewer(r.rid)}>
                        <Icon name="trash" size={16}/>
                      </button>
                    )}
                  </div>
                );
              })}
              {!readOnly && (
              <button type="button" className="repeater-add" onClick={addReviewer}>
                <Icon name="plus" size={14} strokeWidth={2.4}/> Tambah Reviewer
              </button>
              )}
              {errors.reviewers && <div className="fld-err" style={{ marginTop: 4 }}>{errors.reviewers}</div>}
            </div>
          </div>

          <div className="fld full">
            <div className="repeater">
              {approvers.map((a, i) => {
                const otherIds = approvers.filter((x) => x.rid !== a.rid && x.person).map((x) => x.person.id);
                return (
                  <div className="repeater-row" key={a.rid}>
                    <div className="fld">
                      <label className="fld-lbl">Approver {i + 1} <span className="req">*</span></label>
                      <PersonCombo
                        readOnly={readOnly}
                        value={a.person}
                        onChange={(person) => updateApprover(a.rid, person)}
                        options={PERSONNEL}
                        excludeIds={otherIds}
                        placeholder="Pilih approver…"
                      />
                    </div>
                    {!readOnly && approvers.length > 1 && (
                      <button type="button" className="remove-btn" title="Hapus approver ini"
                        onClick={() => removeApprover(a.rid)}>
                        <Icon name="trash" size={16}/>
                      </button>
                    )}
                  </div>
                );
              })}
              {!readOnly && (
              <button type="button" className="repeater-add" onClick={addApprover}>
                <Icon name="plus" size={14} strokeWidth={2.4}/> Tambah Approver
              </button>
              )}
              {errors.approvers && <div className="fld-err" style={{ marginTop: 4 }}>{errors.approvers}</div>}
            </div>
          </div>
          <div className="fld full">
            <label className="fld-lbl">Tujuan <span className="req">*</span></label>
            <div className={`tag-with-icon${errors.tujuan ? ' err' : ''}`}>
              <span className="users-ic"><Icon name="users" size={18}/></span>
              <TagInput
                readOnly={readOnly}
                tags={tujuan}
                onRemove={(id) => setTujuan((p) => p.filter((x) => x.id !== id))}
                onAdd={(name) => setTujuan((p) => [...p, { id: `t-${Date.now()}`, name }])}
                placeholder="Tambah tujuan (ketik nama lalu Enter)…"
              />
            </div>
            {errors.tujuan && <div className="fld-err">{errors.tujuan}</div>}
          </div>
          <div className="fld full">
            <label className="fld-lbl">CC (Internal)</label>
            <div className="tag-with-icon">
              <span className="users-ic"><Icon name="users" size={18}/></span>
              <TagInput
                readOnly={readOnly}
                tags={cc}
                onRemove={(id) => setCc((p) => p.filter((x) => x.id !== id))}
                onAdd={(name) => setCc((p) => [...p, { id: `c-${Date.now()}`, name }])}
                placeholder="Tambah penerima CC…"
              />
            </div>
          </div>

          <div className="fld full">
            <label className="fld-lbl">Keterangan</label>
            <input className="inp" disabled={readOnly} type="text" value={keterangan} onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Keterangan tambahan (opsional)…"/>
          </div>
          <div className="fld full">
            <label className="fld-lbl">Isi Ringkas Arsip</label>
            <textarea className="ta" disabled={readOnly} value={ringkas} onChange={(e) => setRingkas(e.target.value)}
              placeholder="Ringkasan singkat untuk keperluan arsip dan pencarian…"></textarea>
          </div>
        </div>
      </div>

      {/* Attachment */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="surat-section-head">
          <span className="num">3</span>
          <h3>Lampiran</h3>
          <span className="sub">{attachments.length} file dilampirkan</span>
        </div>

        <div ref={dropzoneRef} className={`dropzone${readOnly ? ' dropzone-static' : ''}`}
          onClick={readOnly ? undefined : () => fileInputRef.current && fileInputRef.current.click()}
          onDrop={readOnly ? undefined : onDrop}
          onDragOver={readOnly ? undefined : onDragOver}>
          {!readOnly && (
          <>
          <span className="ic"><Icon name="upload" size={26} strokeWidth={1.6}/></span>
          <div className="text">
            <div className="t1">Tarik &amp; lepas file ke sini, atau <b>klik untuk memilih</b></div>
            <div className="t2">PDF, DOCX, XLSX, JPG, PNG · maks 10 MB per file</div>
          </div>
          <span className="browse-btn">Browse…</span>
          <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }}
            onChange={(e) => addAttachments(e.target.files)}/>
          </>
          )}
          {readOnly && (
            <div className="text dropzone-ro-msg">
              <span className="ic"><Icon name="paperclip" size={26} strokeWidth={1.6}/></span>
              <div>
                <div className="t1">Lampiran (baca-saja)</div>
                <div className="t2">{attachments.length === 0 ? 'Tidak ada lampiran' : `${attachments.length} file terdaftar`}</div>
              </div>
            </div>
          )}
        </div>

        <div className="attach-table">
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                {!readOnly && <th style={{ width: 100 }}>Aksi</th>}
                <th>Nama</th>
                <th style={{ width: 120 }}>Ukuran</th>
                <th style={{ width: 120 }}>Tipe</th>
              </tr>
            </thead>
            <tbody>
              {attachments.length === 0 ? (
                <tr><td colSpan={readOnly ? 4 : 5}>
                  <div className="attach-empty">
                    <Icon name="paperclip" size={28} color="var(--text-disabled)"/>
                    No data to display
                  </div>
                </td></tr>
              ) : attachments.map((a, i) => (
                <tr key={a.id}>
                  <td className="muted tnum">{i + 1}</td>
                  {!readOnly && (
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button type="button" className="icon-btn" style={{ width: 28, height: 28, color: 'var(--text-secondary)' }} title="Lihat">
                        <Icon name="eye" size={14}/>
                      </button>
                      <button type="button" className="icon-btn" style={{ width: 28, height: 28, color: '#B71D18' }}
                        title="Hapus" onClick={() => removeAttachment(a.id)}>
                        <Icon name="trash" size={14}/>
                      </button>
                    </div>
                  </td>
                  )}
                  <td>
                    <div className="file-cell">
                      <span className="file-ic"><Icon name="file" size={16}/></span>
                      <div className="file-meta">
                        <div className="nm">{a.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="muted tnum">{formatBytes(a.size)}</td>
                  <td className="muted" style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>{a.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="surat-section-head">
          <span className="num">4</span>
          <h3>Isi Surat</h3>
          <span className="sub">Tulis konten surat menggunakan editor di bawah</span>
        </div>
        <RichTextEditor
          readOnly={readOnly}
          initialHtml={readonlyEditorHtml}
          htmlKey={(surat && surat.id) ? surat.id : 'buat-baru'}
        />
      </div>
      </>
      )}
    </div>
  );
};

Object.assign(window, { Sidebar, Topbar, KpiCard, WelcomeBanner, ApprovalRow, UpcomingRow, EmployeeTable, SuratTable, SuratDetailModal, SuratAdvFilterModal, BuatSuratBaru });