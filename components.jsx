// components.jsx — building blocks (Sidebar, Topbar, KPI card, Tables)

/** Flatten role-based nav tree for icon-only rail (detail / minimized). */
const flattenNavLeaves = (navTree) => {
  const rows = [];
  (navTree || []).forEach((block) => {
    (block.items || []).forEach((item) => {
      if (item.children) {
        item.children.forEach((c) => {
          if (c.viewKey) rows.push({ key: c.key, label: c.label, viewKey: c.viewKey });
        });
      } else if (item.viewKey) {
        rows.push({ key: item.key, label: item.label, viewKey: item.viewKey });
      }
    });
  });
  return rows;
};

const NAV_RAIL_ICON = {
  dashboard: 'grid',
  'profil-saya': 'user',
  'profil-jabatan': 'briefc',
  'manajemen-surat': 'file',
  'buat-sp': 'file',
  'master-jenis': 'list',
  'master-template': 'file',
  'master-klasif': 'book',
  'master-unit': 'users',
  'arsip-a-list': 'book',
  'arsip-a-pinjam': 'cal',
  'arsip-i-list': 'book',
  'arsip-i-musnah': 'trash',
  permission: 'shield',
  inbox: 'mail',
  notif: 'bell',
  rekap: 'chart',
  pencarian: 'search',
  'rekap-arsip': 'pie',
  'admin-user-mgmt': 'users',
  'admin-meterai': 'cash',
  'admin-emeterai': 'upload',
  'admin-migrasi': 'ext',
  'admin-reg-masuk': 'mail',
};

const navBadgeVal = (item, badgeCounts) => {
  if (item.badgeKey != null && badgeCounts[item.badgeKey] !== undefined && badgeCounts[item.badgeKey] !== null) {
    return badgeCounts[item.badgeKey];
  }
  if (item.viewKey && badgeCounts[item.viewKey] !== undefined && badgeCounts[item.viewKey] !== null) {
    return badgeCounts[item.viewKey];
  }
  return null;
};

const findBadgeForViewKey = (navTree, viewKey, badgeCounts) => {
  for (const block of navTree || []) {
    for (const item of block.items || []) {
      if (item.viewKey === viewKey) return navBadgeVal(item, badgeCounts);
      for (const c of item.children || []) {
        if (c.viewKey === viewKey) return navBadgeVal(c, badgeCounts);
      }
    }
  }
  return null;
};

const computeNavOpenKeys = (navTree, activeView) => {
  const o = {};
  (navTree || []).forEach((block) => {
    (block.items || []).forEach((item) => {
      if (item.children?.some((c) => c.viewKey === activeView)) o[item.key] = true;
    });
  });
  return o;
};

const NavList = ({ navTree, activeView, onNav, badgeCounts = {}, collapsed }) => {
  const [open, setOpen] = React.useState(() => computeNavOpenKeys(navTree, activeView));
  const toggle = (k) => setOpen((prev) => ({ ...prev, [k]: !prev[k] }));

  React.useEffect(() => {
    setOpen(computeNavOpenKeys(navTree, activeView));
  }, [navTree]);

  React.useEffect(() => {
    setOpen((prev) => ({ ...prev, ...computeNavOpenKeys(navTree, activeView) }));
  }, [activeView, navTree]);

  if (collapsed) {
    const leaves = flattenNavLeaves(navTree);
    return (
      <nav className="nav nav--rail" aria-label="Navigasi utama">
        {leaves.map((row) => {
          const showBadge = findBadgeForViewKey(navTree, row.viewKey, badgeCounts);
          const railTip = `${row.label}${showBadge ? ` · ${showBadge}` : ''}`;
          return (
            <button
              key={row.key}
              type="button"
              className={`nav-rail-btn${activeView === row.viewKey ? ' active' : ''}`}
              title={railTip}
              aria-label={railTip}
              onClick={() => onNav(row.viewKey)}>
              <Icon name={NAV_RAIL_ICON[row.viewKey] || 'list'} size={20} strokeWidth={1.8}/>
              {showBadge ? <span className="nav-rail-badge">{showBadge}</span> : null}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="nav" aria-label="Navigasi utama">
      {(navTree || []).map((block, bi) => (
        <React.Fragment key={bi}>
          {block.section ? (
            <div className="nav-section-label">{block.section}</div>
          ) : null}
          {(block.items || []).map((item) => {
            const hasChildren = !!item.children;
            const isOpen = !!open[item.key];
            const isActive = !hasChildren && item.viewKey === activeView;
            const badgeVal = navBadgeVal(item, badgeCounts);
            return (
              <div key={item.key}>
                <div
                  className={`nav-item${isActive ? ' active' : ''}${hasChildren ? ' has-children' : ''}`}
                  onClick={() => {
                    if (hasChildren) toggle(item.key);
                    else if (item.viewKey) onNav(item.viewKey);
                  }}>
                  <span>{item.label}</span>
                  {badgeVal ? <span className="badge badge--warn">{badgeVal}</span> : null}
                  {hasChildren && (
                    <Icon name="chevr" size={14} strokeWidth={2.2}
                      style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0, marginLeft: 'auto' }} />
                  )}
                </div>
                {hasChildren && isOpen &&
                  <div className="nav-sub">
                    {item.children.map((c) => {
                      const cb = navBadgeVal(c, badgeCounts);
                      return (
                        <div key={c.key}
                          className={`nav-subitem${c.viewKey === activeView ? ' active' : ''}`}
                          onClick={() => c.viewKey && onNav(c.viewKey)}>
                          <span>{c.label}</span>
                          {cb ? <span className="badge badge--sm badge--warn">{cb}</span> : null}
                        </div>
                      );
                    })}
                  </div>
                }
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </nav>);
};

const Sidebar = ({
  navTree,
  activeView,
  onNav,
  badgeCounts,
  collapsed,
  railToggleLabel,
  onRailToggle,
  railContextActive,
  onUserMinimize,
  userMinimized,
  detailRailMode,
}) =>
<aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
    <div className="sidebar-brand-row">
      <div className={`sidebar-brand${collapsed ? ' sidebar-brand--center' : ''}`}>
        {!collapsed ? (
          <>
            <div className="brand-mark">PI</div>
            <div className="brand-text">
              <div className="name">Pupuk Indonesia</div>
              <div className="role">Digital Office</div>
            </div>
          </>
        ) : (
          <div className="brand-mark brand-mark--solo" title="Pupuk Indonesia · Digital Office">PI</div>
        )}
      </div>
      {!collapsed && typeof onUserMinimize === 'function' && !detailRailMode && (
        <button
          type="button"
          className="sidebar-collapse-trigger"
          title="Ciutkan sidebar"
          aria-label="Ciutkan sidebar"
          onClick={() => onUserMinimize(true)}>
          <Icon name="chevl" size={18} strokeWidth={2}/>
        </button>
      )}
    </div>

    <NavList navTree={navTree} activeView={activeView} onNav={onNav} badgeCounts={badgeCounts} collapsed={collapsed}/>

    {collapsed && typeof onRailToggle === 'function' && detailRailMode && (
      <div className="sidebar-rail-toggle-wrap">
        <button type="button" className="sidebar-rail-toggle" title={railToggleLabel || 'Perluas sidebar'} onClick={onRailToggle}>
          <Icon name="chevr" size={16} strokeWidth={2.2} style={{ transform: 'rotate(180deg)' }}/>
        </button>
      </div>
    )}

    {collapsed && userMinimized && !detailRailMode && typeof onUserMinimize === 'function' && (
      <div className="sidebar-rail-toggle-wrap">
        <button
          type="button"
          className="sidebar-rail-toggle"
          title="Luaskan sidebar"
          aria-label="Luaskan sidebar"
          onClick={() => onUserMinimize(false)}>
          <Icon name="chevr" size={16} strokeWidth={2.2} style={{ transform: 'rotate(180deg)' }}/>
        </button>
      </div>
    )}

    {!collapsed && (
      <div className="sidebar-foot">
        <div className="deco"></div>
        <h4>Kebijakan Baru</h4>
        <p>Update SOP penggajian dan tunjangan berlaku 1 Juni 2026.</p>
        <button type="button">Baca selengkapnya</button>
      </div>
    )}

    {!collapsed && railContextActive && typeof onRailToggle === 'function' && (
      <div className="sidebar-rail-toggle-wrap sidebar-rail-toggle-wrap--bottom">
        <button type="button" className="sidebar-rail-toggle-text" onClick={onRailToggle}>
          Tampilkan ikon saja
        </button>
      </div>
    )}
  </aside>;


const Topbar = ({
  notifUnread = 0,
  onOpenNotifikasi,
  userName = 'Pengguna',
  userRole = '',
  userInit = 'PI',
  onOpenProfil,
}) =>
<header className="topbar">
    <div className="topbar-logo">
      <img src="assets/akhlak-logo.png" alt="AKHLAK" />
    </div>
    <div style={{ flex: 1 }} />
    <button type="button" className="lang-btn" title="Bahasa">ID</button>
    <button
      type="button"
      className={`icon-btn${notifUnread ? ' icon-btn--has-badge' : ''}`}
      title={notifUnread ? `Notifikasi · ${notifUnread} belum dibaca` : 'Notifikasi'}
      aria-label={notifUnread ? `Notifikasi, ${notifUnread} belum dibaca` : 'Notifikasi'}
      onClick={onOpenNotifikasi}>
      <Icon name="bell" size={20} />
      {notifUnread > 0 ? (
        <span className="topbar-badge">{notifUnread > 99 ? '99+' : notifUnread}</span>
      ) : null}
    </button>
    <button type="button" className="icon-btn" title="Pengaturan">
      <Icon name="cog" size={20} />
    </button>
    <button type="button" className="avatar-btn" onClick={onOpenProfil} title="Profil · Edit profil & keluar">
      <div className="avatar">{userInit}</div>
      <div>
        <div className="name">{userName}</div>
        <div className="role">{userRole}</div>
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

// ——————————————————————————————
// DRAFTER DASHBOARD (surat milik pembuat saja)
// ——————————————————————————————
const isDraftDikembalikan = (s) =>
  s.status === 'draft' && (s.reviewers || []).some((r) => r.reviewStatus === 'returned');

const DrafterDashboard = ({ suratList, onOpenBuatSurat, onPantauSurat, povUserId, onBukaManajemen }) => {
  const currentPerson = POV_OPTIONS.find(p => p.id === povUserId) || { name: 'Drafter', role: '' };
  const data = React.useMemo(
    () => (suratList || []).filter((s) => s.pembuatId === povUserId),
    [suratList, povUserId]
  );

  // Greeting based on time
  const hour = new Date().getHours();
  let greeting = 'Selamat malam';
  if (hour >= 6 && hour < 12) greeting = 'Selamat pagi';
  else if (hour >= 12 && hour < 15) greeting = 'Selamat siang';
  else if (hour >= 15 && hour < 19) greeting = 'Selamat sore';

  // Filters
  const drafts = data.filter((s) => s.status === 'draft' && !isDraftDikembalikan(s));
  const returned = data.filter((s) => isDraftDikembalikan(s) || s.status === 'direvisi');

  const inProgress = data.filter((s) => s.status === 'menunggu-review' || s.status === 'menunggu-approval');
  
  // Selesai bulan ini
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const doneThisMonth = data.filter(s => {
    if (s.status !== 'disetujui') return false;
    // Format tanggal: '10 Mei 2026'
    const match = s.tanggal.match(/\d+\s([A-Za-z]+)\s(\d{4})/);
    if (!match) return false;
    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const m = months.indexOf(match[1]);
    const y = parseInt(match[2], 10);
    return m === currentMonth && y === currentYear;
  });

  const cancelled = data.filter(s => s.status === 'dibatalkan');

  const actionableCount = drafts.length + returned.length;

  // Worklist 1 items (Returned then Drafts)
  const worklist1 = [...returned.map(s => ({ ...s, wlType: 'returned' })), ...drafts.map(s => ({ ...s, wlType: 'draft' }))].slice(0, 5);
  
  // Worklist 2 items (Oldest first, simplified as it's static data for now, just reversing the array as a proxy)
  const worklist2 = [...inProgress].reverse().slice(0, 5);

  const bukaManajemen = () => onBukaManajemen && onBukaManajemen();

  const getActorLabel = (s) => {
    if (s.status === 'menunggu-review') {
      const pending = s.reviewers?.find(r => r.reviewStatus === 'pending');
      return pending ? `${pending.name} · ${pending.role}` : 'Reviewer';
    }
    if (s.status === 'menunggu-approval') {
      return s.approvers?.[0] ? `${s.approvers[0].name} · ${s.approvers[0].role}` : 'Approver';
    }
    return '—';
  };

  const getReturnedNote = (s) => {
    if (s.catatanRevisi) return s.catatanRevisi;
    const revs = (s.reviewers || []).filter(r => r.reviewStatus === 'returned');
    if (revs.length > 0) return `Dikembalikan oleh ${revs[revs.length-1].name}: "Mohon lengkapi dasar hukum surat..."`;
    return 'Dokumen perlu direvisi.';
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
      {/* Welcome Bar */}
      <div className="welcome-bar">
        <div className="welcome-bar-content">
          <h2>{greeting}, {currentPerson.name.split(' ')[0]}</h2>
          <p>
            {currentPerson.role ? <span style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>{currentPerson.role}</span> : null}
            {actionableCount > 0 
              ? <span>Ada <b>{actionableCount} surat</b> yang membutuhkan perhatian Anda.</span>
              : <span>Semua surat sudah tertangani. Tidak ada tindakan yang diperlukan.</span>
            }
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenBuatSurat && onOpenBuatSurat(null)}>
          <Icon name="plus" size={16}/> Buat Surat Baru
        </button>
      </div>

      {/* Alert Bar */}
      {returned.length > 0 && (
        <div className="alert-bar warning">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="info" size={18}/>
            {returned.length} surat dikembalikan oleh Reviewer dan perlu direvisi.
          </div>
          <div className="alert-bar-link" onClick={bukaManajemen} onKeyDown={(e) => e.key === 'Enter' && bukaManajemen()} role="button" tabIndex={0}>Lihat sekarang <Icon name="chevr" size={14}/></div>
        </div>
      )}
      {returned.length === 0 && cancelled.length > 0 && (
        <div className="alert-bar danger">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="x" size={18}/>
            {cancelled.length} surat dibatalkan dan tidak dapat dilanjutkan.
          </div>
          <div className="alert-bar-link" onClick={bukaManajemen} onKeyDown={(e) => e.key === 'Enter' && bukaManajemen()} role="button" tabIndex={0}>Lihat detail <Icon name="chevr" size={14}/></div>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid-kpi" style={{ marginBottom: 24 }}>
        <KpiCard
          icon="chevl" iconColor="amber"
          label="Dikembalikan, perlu revisi"
          value={returned.length}
          trend="Revisi sekarang" trendDir="none"
          sparkColor="#FFAB00"
        />
        <KpiCard
          icon="file" iconColor="gray"
          label="Draft belum dikirim"
          value={drafts.length}
          trend="Lanjutkan" trendDir="none"
          sparkColor="var(--text-secondary)"
        />
        <KpiCard
          icon="refresh" iconColor="primary"
          label="Sedang diproses"
          value={inProgress.length}
          trend="Pantau status" trendDir="none"
          sparkColor="var(--primary)"
        />
        <KpiCard
          icon="check" iconColor="green"
          label="Selesai bulan ini"
          value={doneThisMonth.length}
          trend="Lihat riwayat" trendDir="none"
          sparkColor="#118D57"
        />
      </div>

      {/* Worklists */}
      <div className="grid-2-1" style={{ gridTemplateColumns: '1fr 1fr' }}>
        
        {/* Worklist 1 */}
        <div className="worklist-section">
          <div className="worklist-head">
            <h3>Perlu Tindakan</h3>
            {actionableCount > 5 && <button type="button" className="worklist-head-link" onClick={bukaManajemen}>Lihat semua</button>}
          </div>
          {worklist1.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
              Tidak ada surat yang perlu direvisi atau dilanjutkan. Semua sudah tertangani.
            </div>
          ) : (
            worklist1.map(s => (
              <div className="worklist-row" key={s.id}>
                <div className={`wl-dot ${s.wlType === 'returned' ? 'warning' : 'neutral'}`}/>
                <div className="wl-content">
                  <div className="wl-title">{s.judul}</div>
                  <div className="wl-meta">
                    <span className={`chip ${s.wlType === 'returned' ? 'amber' : 'gray'}`} style={{ fontSize: 10 }}>
                      {s.wlType === 'returned' ? 'Dikembalikan' : 'Draft'}
                    </span>
                    <span>{s.wlType === 'returned' ? `oleh Reviewer · ${s.tanggal}` : `Diedit ${s.tanggal}`}</span>
                  </div>
                  {s.wlType === 'returned' && (
                    <div className="wl-inline-note">{getReturnedNote(s)}</div>
                  )}
                </div>
                <div className="wl-action">
                  {s.wlType === 'returned' ? (
                    <button className="btn btn-secondary" style={{ color: '#B76E00', borderColor: 'rgba(183,110,0,0.3)', background: '#FFF5CC' }} onClick={() => onPantauSurat && onPantauSurat(s)}>
                      Revisi
                    </button>
                  ) : (
                    <button className="btn btn-secondary" onClick={() => onOpenBuatSurat && onOpenBuatSurat(s)}>
                      Lanjutkan
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Worklist 2 */}
        <div className="worklist-section">
          <div className="worklist-head">
            <h3>Sedang Diproses</h3>
            {inProgress.length > 5 && <button type="button" className="worklist-head-link" onClick={bukaManajemen}>Lihat semua</button>}
          </div>
          {worklist2.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
              Tidak ada surat yang sedang diproses saat ini.
            </div>
          ) : (
            worklist2.map(s => (
              <div className="worklist-row" key={s.id}>
                <div className="wl-dot primary"/>
                <div className="wl-content">
                  <div className="wl-title">{s.judul}</div>
                  <div className="wl-meta">
                    <span className="chip blue" style={{ fontSize: 10 }}>{s.status === 'menunggu-review' ? 'Menunggu Review' : 'Menunggu Approval'}</span>
                    <span>Di: {getActorLabel(s)}</span>
                  </div>
                </div>
                <div className="wl-action">
                  <button className="btn btn-secondary" onClick={() => onPantauSurat && onPantauSurat(s)}>
                    <Icon name="eye" size={14}/> Pantau
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

// ——————————————————————————————
// DASHBOARD DIGITAL OFFICE — per POV (reviewer, approver, tujuan, admin, …)
// ——————————————————————————————
const DOF_DASH_TERMINAL = ['disetujui', 'terkirim', 'dibatalkan', 'ditolak'];

const dashGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'Selamat pagi';
  if (hour >= 12 && hour < 15) return 'Selamat siang';
  if (hour >= 15 && hour < 19) return 'Selamat sore';
  return 'Selamat malam';
};

const OperasiDashboard = ({
  povType,
  povUserId,
  povName,
  povRoleLine,
  suratList,
  inboxList,
  inboxUnread,
  onOpenBuatSurat,
  onOpenManajemen,
  onOpenInbox,
  onNav,
  onPantauSurat,
}) => {
  const list = suratList || [];
  const greeting = dashGreeting();
  const first = (povName || 'Anda').split(' ')[0];

  if (povType === 'drafter') {
    return (
      <DrafterDashboard
        suratList={list}
        povUserId={povUserId}
        onOpenBuatSurat={onOpenBuatSurat}
        onPantauSurat={onPantauSurat}
        onBukaManajemen={onOpenManajemen}
      />
    );
  }

  const pendingReviewMe = list.filter(
    (s) =>
      s.status === 'menunggu-review' &&
      (s.reviewers || []).some((r) => r.id === povUserId && r.reviewStatus === 'pending')
  );
  const pendingApproveMe = list.filter(
    (s) =>
      s.status === 'menunggu-approval' &&
      (s.approvers || []).some((a) => a.id === povUserId && (!a.approveStatus || a.approveStatus === 'pending'))
  );
  const mineActive = list.filter(
    (s) => s.pembuatId === povUserId && !DOF_DASH_TERMINAL.includes(s.status)
  );
  const stempelAntrian = list.filter((s) =>
    ['menunggu-stempel', 'diproses-peruri-stempel', 'gagal-peruri'].includes(s.status)
  );

  if (povType === 'reviewer') {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
        <div className="welcome-bar">
          <div className="welcome-bar-content">
            <h2>{greeting}, {first}</h2>
            <p>
              {povRoleLine ? <span style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>{povRoleLine}</span> : null}
              {pendingReviewMe.length > 0 ? (
                <span><b>{pendingReviewMe.length} surat</b> menunggu review Anda. </span>
              ) : (
                <span>Tidak ada surat di antrian review Anda. </span>
              )}
              {mineActive.length > 0 ? (
                <span>Anda juga memiliki <b>{mineActive.length}</b> surat buatan sendiri yang masih berjalan.</span>
              ) : null}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => onOpenManajemen()}>Manajemen Surat</button>
          </div>
        </div>
        <div className="grid-kpi" style={{ marginBottom: 24 }}>
          <KpiCard icon="eye" iconColor="amber" label="Menunggu review Anda" value={String(pendingReviewMe.length)} trend="Buka detail" trendDir="none" sparkColor="#FFAB00" />
          <KpiCard icon="file" iconColor="green" label="Surat Anda (aktif)" value={String(mineActive.length)} trend="Di Manajemen" trendDir="none" sparkColor="var(--primary)" />
          <KpiCard icon="mail" iconColor="blue" label="Inbox" value={String(inboxUnread || 0)} trend="Surat masuk" trendDir="none" sparkColor="#006C9C" />
        </div>
        <div className="worklist-section">
          <div className="worklist-head">
            <h3>Perlu review</h3>
            <button type="button" className="worklist-head-link" onClick={() => onOpenManajemen()}>Ke Manajemen Surat</button>
          </div>
          {pendingReviewMe.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>Tidak ada surat di antrian review.</div>
          ) : (
            pendingReviewMe.slice(0, 6).map((s) => (
              <div className="worklist-row" key={s.id}>
                <div className="wl-dot warning" />
                <div className="wl-content">
                  <div className="wl-title">{s.judul}</div>
                  <div className="wl-meta"><span className="chip amber" style={{ fontSize: 10 }}>Menunggu Review</span><span>{s.no} · {s.pembuat}</span></div>
                </div>
                <div className="wl-action">
                  <button type="button" className="btn btn-secondary" onClick={() => onPantauSurat && onPantauSurat(s)}><Icon name="eye" size={14} /> Review</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (povType === 'approver') {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
        <div className="welcome-bar">
          <div className="welcome-bar-content">
            <h2>{greeting}, {first}</h2>
            <p>
              {povRoleLine ? <span style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>{povRoleLine}</span> : null}
              {pendingApproveMe.length > 0 ? (
                <span><b>{pendingApproveMe.length} surat</b> membutuhkan keputusan approval Anda. </span>
              ) : (
                <span>Tidak ada surat menunggu approval Anda. </span>
              )}
              {mineActive.length > 0 ? <span>Surat buatan Anda yang masih berjalan: <b>{mineActive.length}</b>.</span> : null}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => onOpenManajemen()}>Manajemen Surat</button>
          </div>
        </div>
        <div className="grid-kpi" style={{ marginBottom: 24 }}>
          <KpiCard icon="award" iconColor="amber" label="Menunggu approval Anda" value={String(pendingApproveMe.length)} trend="Prioritas" trendDir="none" sparkColor="#B76E00" />
          <KpiCard icon="file" iconColor="green" label="Surat Anda (aktif)" value={String(mineActive.length)} trend="Di Manajemen" trendDir="none" sparkColor="var(--primary)" />
          <KpiCard icon="mail" iconColor="blue" label="Inbox" value={String(inboxUnread || 0)} trend="Surat masuk" trendDir="none" sparkColor="#006C9C" />
        </div>
        <div className="worklist-section">
          <div className="worklist-head">
            <h3>Perlu keputusan</h3>
            <button type="button" className="worklist-head-link" onClick={() => onOpenManajemen()}>Ke Manajemen Surat</button>
          </div>
          {pendingApproveMe.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>Antrian approval Anda kosong.</div>
          ) : (
            pendingApproveMe.slice(0, 6).map((s) => (
              <div className="worklist-row" key={s.id}>
                <div className="wl-dot primary" />
                <div className="wl-content">
                  <div className="wl-title">{s.judul}</div>
                  <div className="wl-meta"><span className="chip blue" style={{ fontSize: 10 }}>Menunggu Approval</span><span>{s.no} · {s.pembuat}</span></div>
                </div>
                <div className="wl-action">
                  <button type="button" className="btn btn-secondary" onClick={() => onPantauSurat && onPantauSurat(s)}><Icon name="eye" size={14} /> Periksa</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (povType === 'tujuan') {
    const msgs = inboxList || INBOX || [];
    const unread = msgs.filter((m) => m.unread).slice(0, 5);
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
        <div className="welcome-bar">
          <div className="welcome-bar-content">
            <h2>{greeting}, {first}</h2>
            <p>
              {povRoleLine ? <span style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>{povRoleLine}</span> : null}
              {inboxUnread > 0 ? <span>Ada <b>{inboxUnread}</b> item inbox yang belum dibaca.</span> : <span>Inbox Anda sudah terbaca.</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-primary" onClick={() => onOpenInbox()}>Buka Inbox</button>
            <button type="button" className="btn btn-secondary" onClick={() => onOpenManajemen()}>Manajemen Surat</button>
          </div>
        </div>
        <div className="grid-kpi" style={{ marginBottom: 24 }}>
          <KpiCard icon="mail" iconColor="blue" label="Belum dibaca" value={String(inboxUnread || 0)} trend="Inbox" trendDir="none" sparkColor="#006C9C" />
          <KpiCard icon="file" iconColor="green" label="Surat Anda (aktif)" value={String(mineActive.length)} trend="Manajemen" trendDir="none" sparkColor="var(--primary)" />
        </div>
        <div className="worklist-section">
          <div className="worklist-head">
            <h3>Terbaru (belum dibaca)</h3>
            <button type="button" className="worklist-head-link" onClick={() => onOpenInbox()}>Semua inbox</button>
          </div>
          {unread.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>Tidak ada pesan belum dibaca.</div>
          ) : (
            unread.map((m) => (
              <div className="worklist-row" key={m.id}>
                <div className="wl-dot primary" />
                <div className="wl-content">
                  <div className="wl-title">{m.subject}</div>
                  <div className="wl-meta"><span>{m.from}</span><span>{m.date} · {m.time}</span></div>
                </div>
                <div className="wl-action">
                  <button type="button" className="btn btn-secondary" onClick={() => onOpenInbox()}>Buka</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (povType === 'admin-stempel') {
    const gagal = stempelAntrian.filter((s) => s.status === 'gagal-peruri');
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
        <div className="welcome-bar">
          <div className="welcome-bar-content">
            <h2>{greeting}, {first}</h2>
            <p>
              {povRoleLine ? <span style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>{povRoleLine}</span> : null}
              Antrian stempel digital: <b>{stempelAntrian.length}</b> surat.
              {gagal.length > 0 ? <span> Termasuk <b style={{ color: '#B71D18' }}>{gagal.length} gagal</b> Peruri.</span> : null}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => onOpenManajemen()}>Buka Manajemen Stempel</button>
        </div>
        <div className="grid-kpi" style={{ marginBottom: 24 }}>
          <KpiCard icon="shield" iconColor="green" label="Menunggu / proses stempel" value={String(stempelAntrian.length)} trend="BPO" trendDir="none" sparkColor="var(--primary)" />
          <KpiCard icon="mail" iconColor="blue" label="Inbox" value={String(inboxUnread || 0)} trend="" trendDir="none" sparkColor="#006C9C" />
        </div>
        <div className="worklist-section">
          <div className="worklist-head">
            <h3>Antrian stempel</h3>
            <button type="button" className="worklist-head-link" onClick={() => onOpenManajemen()}>Lihat semua</button>
          </div>
          {stempelAntrian.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>Tidak ada surat di antrian stempel.</div>
          ) : (
            stempelAntrian.slice(0, 6).map((s) => {
              const stat = STATUS_SURAT_CHIP[s.status] || { lbl: s.status, cls: 'gray' };
              return (
                <div className="worklist-row" key={s.id}>
                  <div className="wl-dot neutral" />
                  <div className="wl-content">
                    <div className="wl-title">{s.judul}</div>
                    <div className="wl-meta"><span className={`chip ${stat.cls}`} style={{ fontSize: 10 }}>{stat.lbl}</span><span>{s.no}</span></div>
                  </div>
                  <div className="wl-action">
                    <button type="button" className="btn btn-secondary" onClick={() => onPantauSurat && onPantauSurat(s)}><Icon name="eye" size={14} /> Detail</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  if (povType === 'admin') {
    const shortcuts = [
      { k: 'admin-user-mgmt', label: 'User Management', sub: 'Pengguna & peran', ic: 'users' },
      { k: 'master-jenis', label: 'Master Data', sub: 'Jenis, template, klasifikasi', ic: 'list' },
      { k: 'admin-meterai', label: 'Setting Meterai', sub: 'Kuota & konfigurasi', ic: 'cash' },
      { k: 'manajemen-surat', label: 'Manajemen Surat', sub: 'Operasional surat', ic: 'file' },
      { k: 'rekap', label: 'Rekap', sub: 'Laporan ringkas', ic: 'chart' },
    ];
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>
        <div className="welcome-bar">
          <div className="welcome-bar-content">
            <h2>{greeting}, {first}</h2>
            <p>
              <span style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>{povRoleLine || 'Administrasi sistem'}</span>
              Akses cepat ke konfigurasi Digital Office dan operasi surat.
            </p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {shortcuts.map((sc) => (
            <button
              key={sc.k}
              type="button"
              className="card"
              onClick={() => onNav && onNav(sc.k)}
              style={{
                textAlign: 'left',
                padding: 18,
                cursor: 'pointer',
                border: '1px solid var(--border)',
                borderRadius: 12,
                background: 'var(--card)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                transition: 'box-shadow 0.15s, border-color 0.15s',
              }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--primary-50)',
                color: 'var(--primary-dark)',
                display: 'grid',
                placeItems: 'center',
              }}><Icon name={sc.ic} size={22}/></div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{sc.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>{sc.sub}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
      Dashboard untuk peran ini belum dikonfigurasi ({String(povType)}).
    </div>
  );
};

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

// Surat (letter) worklist — Manajemen Surat (PRD v1)
const isSuratDikembalikan = (s) =>
  s.status === 'draft' && (s.reviewers || []).some((r) => r.reviewStatus === 'returned');

const isSuratDraftTab = (s) => s.status === 'draft' && !isSuratDikembalikan(s);

const getSuratDiprosesOleh = (s) => {
  if (['disetujui', 'dibatalkan', 'ditolak', 'terkirim'].includes(s.status)) return '';
  if (s.status === 'menunggu-review') {
    const p = (s.reviewers || []).find((r) => (r.reviewStatus || 'pending') === 'pending');
    return p ? p.name : '';
  }
  if (s.status === 'menunggu-approval' || s.status === 'menunggu-ttd-digital') {
    const p = (s.approvers || []).find((a) => (a.approveStatus || 'pending') === 'pending');
    return p ? p.name : '';
  }
  if (s.status === 'diproses-peruri-ttd' || s.status === 'diproses-peruri-stempel') return 'Peruri (eksternal)';
  if (s.status === 'menunggu-stempel') return 'Admin Stempel · BPO';
  if (s.status === 'gagal-peruri') return '—';
  return '';
};

const getSuratLastUpdatedTs = (s) => {
  if (typeof s.lastUpdatedTs === 'number') return s.lastUpdatedTs;
  const ID_MONTH = { jan:0, feb:1, mar:2, apr:3, mei:4, jun:5, jul:6, agu:7, agt:7, sep:8, okt:9, nov:10, des:11 };
  const parts = String(s.tanggal || '').trim().split(/\s+/);
  if (parts.length !== 3) return 0;
  const d = parseInt(parts[0], 10);
  const m = ID_MONTH[parts[1].toLowerCase().slice(0, 3)];
  const y = parseInt(parts[2], 10);
  if (isNaN(d) || m == null || isNaN(y)) return 0;
  return new Date(y, m, d).getTime();
};

const getSuratRowAction = (s, povType) => {
  if (povType === 'admin-stempel' && s.status === 'menunggu-stempel')
    return { key: 'pantau', label: 'Verifikasi Stempel', btn: 'primary' };
  if (isSuratDraftTab(s)) return { key: 'lanjut', label: 'Lanjutkan', btn: 'secondary' };
  if (isSuratDikembalikan(s)) return { key: 'revisi', label: 'Revisi', btn: 'warning' };
  if (s.status === 'menunggu-review' || s.status === 'menunggu-approval' ||
      s.status === 'menunggu-ttd-digital' || s.status === 'diproses-peruri-ttd' ||
      s.status === 'menunggu-stempel' || s.status === 'diproses-peruri-stempel' || s.status === 'gagal-peruri')
    return { key: 'pantau', label: 'Pantau', btn: 'secondary' };
  return { key: 'lihat', label: 'Lihat Detail', btn: 'ghost' };
};

const passesSuratStatusTab = (s, tab) => {
  if (tab === 'semua') return true;
  if (tab === 'draft') return isSuratDraftTab(s);
  if (tab === 'menunggu') {
    return ['menunggu-review', 'menunggu-approval', 'menunggu-ttd-digital', 'diproses-peruri-ttd',
      'menunggu-stempel', 'diproses-peruri-stempel', 'gagal-peruri'].includes(s.status);
  }
  if (tab === 'dikembalikan') return isSuratDikembalikan(s);
  if (tab === 'disetujui') return s.status === 'disetujui' || s.status === 'terkirim';
  if (tab === 'dibatalkan') return s.status === 'dibatalkan' || s.status === 'ditolak';
  return true;
};

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

const SuratTable = ({ onOpenBuatSurat, suratList, onOpenLetter, povType }) => {
  const data = suratList || SURAT;
  const defaultStatusTab = povType === 'reviewer' || povType === 'approver' ? 'menunggu' : 'semua';
  const [statusTab, setStatusTab] = React.useState(defaultStatusTab);
  const [search, setSearch] = React.useState('');
  const [sifatFilter, setSifatFilter] = React.useState('all');
  const [kecepatanFilter, setKecepatanFilter] = React.useState('all');
  const [dateRange, setDateRange] = React.useState({ from: '', to: '' });
  const [sort, setSort] = React.useState({ key: 'lastUpdated', dir: 'desc' });

  React.useEffect(() => {
    setStatusTab(povType === 'reviewer' || povType === 'approver' ? 'menunggu' : 'semua');
  }, [povType]);

  const STATUS_TABS = [
    { key: 'semua', lbl: 'Semua', showBadge: true },
    { key: 'draft', lbl: 'Draft', showBadge: true },
    { key: 'menunggu', lbl: 'Menunggu Persetujuan', showBadge: true },
    { key: 'dikembalikan', lbl: 'Dikembalikan', showBadge: true, warnBadge: true },
    { key: 'disetujui', lbl: 'Disetujui', showBadge: false },
    { key: 'dibatalkan', lbl: 'Dibatalkan', showBadge: false },
  ];

  const tabCount = (key) => data.filter((s) => passesSuratStatusTab(s, key)).length;

  let filtered = data.filter((s) => passesSuratStatusTab(s, statusTab));
  if (sifatFilter !== 'all') filtered = filtered.filter((s) => s.sifat === sifatFilter);
  if (kecepatanFilter !== 'all') filtered = filtered.filter((s) => s.kecepatan === kecepatanFilter);
  if (dateRange.from || dateRange.to) {
    const fromT = dateRange.from ? new Date(dateRange.from).setHours(0, 0, 0, 0) : null;
    const toT = dateRange.to ? new Date(dateRange.to).setHours(23, 59, 59, 999) : null;
    filtered = filtered.filter((s) => {
      const ts = getSuratLastUpdatedTs(s);
      if (!ts) return true;
      if (fromT != null && ts < fromT) return false;
      if (toT != null && ts > toT) return false;
      return true;
    });
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((s) =>
      (s.judul || '').toLowerCase().includes(q) ||
      (s.no || '').toLowerCase().includes(q) ||
      (s.pembuat || '').toLowerCase().includes(q)
    );
  }

  const kecRank = { 'sangat-segera': 3, segera: 2, biasa: 1 };
  const sorted = [...filtered].sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1;
    if (sort.key === 'lastUpdated') {
      return (getSuratLastUpdatedTs(a) - getSuratLastUpdatedTs(b)) * -dir;
    }
    if (sort.key === 'judul') {
      return (a.judul || '').localeCompare(b.judul || '', 'id') * dir;
    }
    if (sort.key === 'kecepatan') {
      return ((kecRank[a.kecepatan] || 0) - (kecRank[b.kecepatan] || 0)) * -dir;
    }
    return 0;
  });

  const toggleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' } : { key, dir: key === 'judul' ? 'asc' : 'desc' }
    );
  };

  const sortMark = (key) => {
    if (sort.key !== key) return '';
    return sort.dir === 'desc' ? ' ↓' : ' ↑';
  };

  const hasExtraFilters =
    !!search.trim() || sifatFilter !== 'all' || kecepatanFilter !== 'all' || !!dateRange.from || !!dateRange.to;

  const emptyCopy = () => {
    if (hasExtraFilters) {
      return {
        title: 'Tidak ada surat yang sesuai filter',
        sub: 'Sesuaikan pencarian, sifat, kecepatan, rentang tanggal, atau tab status.',
        cta: null,
      };
    }
    const map = {
      semua: { title: 'Tidak ada surat', sub: 'Belum ada surat dalam daftar ini.', cta: 'buat' },
      draft: {
        title: 'Tidak ada draft yang tersimpan',
        sub: 'Mulai buat surat baru.',
        cta: 'buat',
      },
      menunggu: {
        title: 'Tidak ada surat yang sedang dalam proses review atau approval',
        sub: 'Semua surat pada kategori ini sudah selesai diproses atau belum ada yang dikirim.',
        cta: null,
      },
      dikembalikan: {
        title: 'Tidak ada surat yang dikembalikan',
        sub: 'Semua surat sudah diproses dengan baik.',
        cta: null,
      },
      disetujui: {
        title: 'Belum ada surat yang selesai / terkirim',
        sub: 'Surat yang disetujui atau telah terkirim (alur digital) muncul di tab ini.',
        cta: null,
      },
      dibatalkan: {
        title: 'Tidak ada surat yang dibatalkan',
        sub: 'Riwayat pembatalan akan tercatat di sini.',
        cta: null,
      },
    };
    return map[statusTab] || map.semua;
  };

  const runRowAction = (s, act) => {
    if (act.key === 'lanjut') {
      onOpenBuatSurat && onOpenBuatSurat(s);
      return;
    }
    if (act.key === 'revisi' || act.key === 'pantau' || act.key === 'lihat') {
      onOpenLetter && onOpenLetter(s);
    }
  };

  const actionBtnClass = (btn) => {
    if (btn === 'ghost') return 'btn btn-ghost';
    if (btn === 'warning') return 'btn btn-secondary surat-row-btn--warning';
    if (btn === 'primary') return 'btn btn-primary';
    return 'btn btn-secondary';
  };

  const ec = emptyCopy();
  const emptyColSpan = 7;

  return (
    <>
      <div className="card surat-work-card" style={{ overflow: 'hidden' }}>
        <div className="filterbar surat-work-filterbar">
          <div className="filter-input" style={{ minWidth: 220, flex: '1 1 260px' }}>
            <Icon name="search" size={16} />
            <input
              placeholder="Cari judul, nomor surat, atau pembuat…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={sifatFilter}
            onChange={(e) => setSifatFilter(e.target.value)}
            style={{
              appearance: 'none',
              paddingRight: 28,
              backgroundImage:
                'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="%23637381" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>\')',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
            }}
          >
            <option value="all">Sifat: Semua</option>
            <option value="biasa">Biasa</option>
            <option value="terbatas">Terbatas</option>
            <option value="rahasia">Rahasia</option>
            <option value="sangat-rahasia">Sangat Rahasia</option>
          </select>
          <select
            className="filter-select"
            value={kecepatanFilter}
            onChange={(e) => setKecepatanFilter(e.target.value)}
            style={{
              appearance: 'none',
              paddingRight: 28,
              backgroundImage:
                'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="%23637381" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>\')',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
            }}
          >
            <option value="all">Kecepatan: Semua</option>
            <option value="biasa">Biasa</option>
            <option value="segera">Segera</option>
            <option value="sangat-segera">Sangat Segera</option>
          </select>
          <DateRangeField from={dateRange.from} to={dateRange.to} onChange={setDateRange} />
        </div>

        <div className="surat-work-tabs">
          {STATUS_TABS.map((t) => {
            const cnt = tabCount(t.key);
            const warn = t.warnBadge && cnt > 0;
            return (
              <button
                key={t.key}
                type="button"
                className={`surat-work-tab${statusTab === t.key ? ' on' : ''}${warn ? ' surat-work-tab--warn' : ''}`}
                onClick={() => setStatusTab(t.key)}
              >
                {t.lbl}
                {t.showBadge && <span className="surat-work-tab-count">{cnt}</span>}
              </button>
            );
          })}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tbl surat-work-tbl">
            <thead>
              <tr>
                <th className="tbl-th-sort" onClick={() => toggleSort('judul')}>
                  Judul Surat{sortMark('judul')}
                </th>
                <th>Sifat</th>
                <th className="tbl-th-sort" onClick={() => toggleSort('kecepatan')}>
                  Kecepatan Tanggapan{sortMark('kecepatan')}
                </th>
                <th>Status</th>
                <th>Diproses Oleh</th>
                <th className="tbl-th-sort" onClick={() => toggleSort('lastUpdated')}>
                  Last Updated{sortMark('lastUpdated')}
                </th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={emptyColSpan} className="surat-work-empty">
                    <div className="surat-work-empty-title">{ec.title}</div>
                    <div className="surat-work-empty-sub">{ec.sub}</div>
                    {ec.cta === 'buat' && (
                      <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => onOpenBuatSurat && onOpenBuatSurat(null)}>
                        <Icon name="plus" size={14} /> Buat Surat Baru
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                sorted.map((s) => {
                  const sif = SIFAT_CHIP[s.sifat] || { lbl: s.sifat, cls: 'gray' };
                  const kec = KECEPATAN_CHIP[s.kecepatan] || { lbl: s.kecepatan, cls: 'gray' };
                  const stat = STATUS_SURAT_CHIP[s.status] || { lbl: s.status, cls: 'gray' };
                  const owner = getSuratDiprosesOleh(s);
                  const act = getSuratRowAction(s, povType);
                  const judulTip = `${s.judul}\n${s.no} · ${s.pembuat}`;
                  const showRevNote = isSuratDikembalikan(s) && s.catatanRevisi;
                  return (
                    <tr key={s.id}>
                      <td className="surat-judul-cell" style={{ maxWidth: 320 }}>
                        <div className="surat-judul-truncate" title={judulTip}>
                          {s.judul}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                          {s.no} · {s.pembuat}
                        </div>
                        {showRevNote && (() => {
                          const prev = s.catatanRevisi.length > 120 ? `${s.catatanRevisi.slice(0, 120)}…` : s.catatanRevisi;
                          return (
                            <div className="surat-row-revisi-note" title={s.catatanRevisi}>
                              {`↳ Catatan: "${prev}"`}
                            </div>
                          );
                        })()}
                      </td>
                      <td>
                        <span className={`chip ${sif.cls}`}>{sif.lbl}</span>
                      </td>
                      <td>
                        <span className={`chip ${kec.cls}`}>{kec.lbl}</span>
                      </td>
                      <td>
                        <span className={`chip ${stat.cls}`}>{stat.lbl}</span>
                      </td>
                      <td style={{ fontSize: 13, color: owner ? 'var(--text)' : 'var(--text-disabled)' }}>{owner || '—'}</td>
                      <td className="muted tnum" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                        {s.lastUpdated || s.tanggal}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className={actionBtnClass(act.btn)}
                          style={{ padding: '6px 12px', fontSize: 12 }}
                          onClick={() => runRowAction(s, act)}
                        >
                          {act.key === 'pantau' || act.key === 'lihat' ? <Icon name="eye" size={14} /> : null}
                          {act.key === 'lanjut' ? <Icon name="chevr" size={14} /> : null}
                          {act.key === 'revisi' ? <Icon name="eye" size={14} /> : null}{' '}
                          {act.label}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="pagi">
          <span>
            Menampilkan <b className="tnum" style={{ color: 'var(--text)' }}>{sorted.length}</b> dari {data.length} surat
          </span>
          <div className="pagi-pages">
            <button type="button">
              <Icon name="chevl" size={14} />
            </button>
            <button type="button" className="on">
              1
            </button>
            <button type="button">
              <Icon name="chevr" size={14} />
            </button>
          </div>
        </div>
      </div>
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

const SuratDetailModal = ({ surat, onClose, onWithdraw, onOpenLetter, reviewerMode }) => {
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

          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 16, display: 'flex', justifyContent: reviewerMode ? 'flex-end' : 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {reviewerMode ? (
              <button type="button" className="btn btn-primary" onClick={handleOpenLetter}>
                <Icon name="ext" size={14}/> Buka Surat
              </button>
            ) : isMenungguReview && onWithdraw ? (
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
  const template = surat.flowDigitalSign ? (surat.template || 'TM-DIGITAL-EXT') : (surat.template || '');
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

const BuatSuratBaru = ({ onBack, onSubmit, readOnly, surat, onWithdraw, reviewerActions, pembuatName }) => {
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
  const [confirmReviewerAction, setConfirmReviewerAction] = React.useState(null); // 'approve'|'return-drafter'|'cancel'|null

  React.useEffect(() => {
    if (!surat) return;
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

  const buildUpdatedSurat = () => ({
    ...surat,
    judul: judul.trim(),
    sifat: SIFAT_KEY[sifat] || surat.sifat,
    kecepatan: KEC_KEY[kecepatan] || surat.kecepatan,
    jenis, template, klasifikasi, keterangan, ringkas,
    flowDigitalSign:
      template === 'TM-DIGITAL-EXT' ||
      (template && String(template).toLowerCase().includes('digital sign')) ||
      !!surat.flowDigitalSign,
    reviewers: reviewers.map(r => r.person).filter(Boolean),
    approvers: approvers.map(a => a.person).filter(Boolean),
    tujuan, cc,
    attachments: attachments.map(({ id, name, size, type }) => ({ id, name, size, type })),
  });

  const buildSurat = (status) => {
    const now = new Date();
    const blnShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const stampLastUpdated = (base) => {
      const ts = now.getTime();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      return {
        ...base,
        lastUpdatedTs: ts,
        lastUpdated: `${now.getDate()} ${blnShort[now.getMonth()]} ${now.getFullYear()} · ${hh}.${mm}`,
      };
    };

    const peopleR = reviewers.map((r) => r.person).filter(Boolean);
    const peopleA = approvers.map((a) => a.person).filter(Boolean);
    const flowDigitalSign =
      template === 'TM-DIGITAL-EXT' ||
      (template && String(template).toLowerCase().includes('digital sign')) ||
      !!(surat && surat.flowDigitalSign);

    if (surat && surat.id) {
      const nextReviewers = peopleR.map((p) => {
        const prev = (surat.reviewers || []).find((rv) => rv.id === p.id);
        const reviewStatus = status === 'menunggu-review' ? 'pending' : (prev && prev.reviewStatus) || 'pending';
        return { id: p.id, name: p.name, role: p.role || '', reviewStatus };
      });
      const nextApprovers = peopleA.map((p) => {
        const prev = (surat.approvers || []).find((av) => av.id === p.id);
        const approveStatus = (prev && prev.approveStatus) || 'pending';
        return { id: p.id, name: p.name, role: p.role || '', approveStatus };
      });
      return stampLastUpdated({
        ...surat,
        judul: judul.trim(),
        sifat: SIFAT_KEY[sifat] || surat.sifat,
        kecepatan: KEC_KEY[kecepatan] || surat.kecepatan,
        status,
        jenis, template, klasifikasi, keterangan, ringkas,
        flowDigitalSign,
        reviewers: nextReviewers,
        approvers: nextApprovers,
        tujuan, cc,
        attachments: attachments.map(({ id, name, size, type }) => ({ id, name, size, type })),
        catatanRevisi:
          status === 'menunggu-review' || status === 'menunggu-approval' ? null : surat.catatanRevisi || null,
      });
    }

    const tahun = now.getFullYear();
    const bulanRomawi = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][now.getMonth()];
    const seq = String(Math.floor(Math.random() * 900) + 100);
    const klasKode = (klasifikasi.split(' ')[0] || 'NEW').replace('.', '');
    const namaPembuat = pembuatName || 'Sri Dewanti';
    const initPembuat = namaPembuat.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
    return stampLastUpdated({
      id: `SR-${tahun}-${String(now.getTime()).slice(-4)}`,
      no: `${seq}/PI/${klasKode}/${bulanRomawi}/${tahun}`,
      judul: judul.trim(),
      sifat: SIFAT_KEY[sifat] || 'biasa',
      kecepatan: KEC_KEY[kecepatan] || 'biasa',
      status,
      tanggal: formatTglID(now),
      pembuat: namaPembuat,
      av: null,
      init: initPembuat,
      jenis, template, klasifikasi, keterangan, ringkas,
      flowDigitalSign,
      reviewers: peopleR.map((p) => ({ id: p.id, name: p.name, role: p.role || '', reviewStatus: 'pending' })),
      approvers: peopleA.map((p) => ({ id: p.id, name: p.name, role: p.role || '', approveStatus: 'pending' })),
      tujuan, cc,
      attachments: attachments.map(({ id, name, size, type }) => ({ id, name, size, type })),
      catatanRevisi: null,
    });
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
    <div className={`surat-form${(readOnly && !reviewerActions) ? ' surat-form-readonly' : ''}`} style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div className={`surat-form-header${(readOnly || reviewerActions) && surat ? ' has-tabs' : ''}`}>
        <div className="surat-form-header-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="back" onClick={onBack} title="Kembali"><Icon name="chevl" size={20}/></button>
            <div>
              <h1>{(readOnly || reviewerActions) ? 'Detail Surat' : 'Buat Surat Baru'}</h1>
              <div className="crumbs">
                <span>Pupuk Indonesia</span>
                <span className="sep"></span>
                <span>Manajemen Surat</span>
                <span className="sep"></span>
                <span className="now">{(readOnly || reviewerActions) ? `Detail · ${surat && surat.no ? surat.no : ''}` : 'Buat Surat Baru'}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {reviewerActions ? (
              confirmReviewerAction ? (
                (() => {
                  const meta = {
                    approve:          { msg: 'Setujui surat ini dan teruskan ke tahap berikutnya?', btnCls: 'btn-primary', btnStyle: { background: '#118D57', borderColor: '#118D57' }, label: 'Ya, Setujui', fn: reviewerActions.onApprove },
                    'return-drafter': { msg: 'Kembalikan surat ke drafter untuk diperbaiki?',       btnCls: 'btn-secondary', btnStyle: {},                                                  label: 'Ya, Kembalikan', fn: reviewerActions.onReturn },
                    cancel:           { msg: 'Batalkan surat ini? Tindakan tidak dapat diurungkan.', btnCls: 'btn-danger',   btnStyle: {},                                                  label: 'Ya, Batalkan', fn: reviewerActions.onCancel },
                  }[confirmReviewerAction];
                  return (
                    <>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginRight: 4 }}>{meta.msg}</span>
                      <button type="button" className="btn btn-secondary" onClick={() => setConfirmReviewerAction(null)}>Batal</button>
                      <button type="button" className={`btn ${meta.btnCls}`} style={meta.btnStyle} onClick={() => { setConfirmReviewerAction(null); meta.fn(); }}>
                        <Icon name="check" size={14} strokeWidth={2.4}/> {meta.label}
                      </button>
                    </>
                  );
                })()
              ) : (
                <>
                  <button type="button" className="btn btn-danger"    onClick={() => setConfirmReviewerAction('cancel')}>
                    <Icon name="x" size={14} strokeWidth={2.4}/> Batalkan
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setConfirmReviewerAction('return-drafter')}>
                    <Icon name="chevl" size={14}/> Kembalikan
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => reviewerActions.onSave(buildUpdatedSurat())}>
                    <Icon name="download" size={14}/> Simpan
                  </button>
                  <button type="button" className="btn btn-primary"   style={{ background: '#118D57', borderColor: '#118D57' }} onClick={() => setConfirmReviewerAction('approve')}>
                    <Icon name="check" size={14} strokeWidth={2.4}/> Setujui
                  </button>
                </>
              )
            ) : readOnly && awaitingReviewWithdraw ? (
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
              { key: 'surat',       label: 'Detail Surat' },
              { key: 'history',     label: 'History'      },
              { key: 'doc-history', label: 'Doc History'  },
              { key: 'hierarchy',   label: 'Hierarchy'    },
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
      </div>

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
              <option value="Template Default">Template Default</option>
              <option value="Template SK Direksi">Template SK Direksi</option>
              <option value="Template Memo Internal">Template Memo Internal</option>
              <option value="TM-DIGITAL-EXT">Template Eksternal — Digital Sign &amp; Stempel (Peruri)</option>
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
        </div>
      </div>

      {/* Isi Surat */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="surat-section-head">
          <span className="num">3</span>
          <h3>Isi Surat</h3>
          <span className="sub">Isi ringkas arsip di atas, lalu tulis konten surat di editor</span>
        </div>
        <div className="surat-grid">
          <div className="fld full">
            <label className="fld-lbl">Isi Ringkas Arsip</label>
            <textarea className="ta" disabled={readOnly} value={ringkas} onChange={(e) => setRingkas(e.target.value)}
              placeholder="Ringkasan singkat untuk keperluan arsip dan pencarian…"></textarea>
          </div>
        </div>
        <RichTextEditor
          readOnly={readOnly}
          initialHtml={readonlyEditorHtml}
          htmlKey={(surat && surat.id) ? surat.id : 'buat-baru'}
        />
      </div>

      {/* Lampiran — paling bawah */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="surat-section-head">
          <span className="num">4</span>
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
      </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// DETAIL SURAT — Split Layout (PRD §6)
// ─────────────────────────────────────────────



const STATUS_SURAT_LABEL = {
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

// Contextual confirmation modal
const CtxModal = ({ config, onConfirm, onCancel }) => {
  const [note, setNote] = React.useState('');
  if (!config) return null;
  const canConfirm = !config.requireNote || note.trim().length > 0;
  return (
    <div className="ctx-modal-overlay" onClick={onCancel}>
      <div className="ctx-modal" onClick={e => e.stopPropagation()}>
        <div className="ctx-modal-head">
          <h2>{config.title}</h2>
          {config.destination && (
            <div className="destination">
              <Icon name="chevr" size={14}/> {config.destination}
            </div>
          )}
        </div>
        <div className="ctx-modal-body">
          <p>{config.body}</p>
          {config.requireNote && (
            <>
              <span className="note-label">Catatan (wajib diisi) *</span>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Tuliskan catatan untuk penerima…"/>
            </>
          )}
        </div>
        <div className="ctx-modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Batal</button>
          <button
            className="btn btn-primary"
            style={config.danger ? { background: '#B71D18', borderColor: '#B71D18' } : config.green ? { background: '#118D57', borderColor: '#118D57' } : {}}
            disabled={!canConfirm}
            onClick={() => onConfirm(note)}
          >{config.cta}</button>
        </div>
      </div>
    </div>
  );
};

// Approval stepper (shared by right panel and Alur Persetujuan tab)
const ApprovalStepper = ({ surat, compact }) => {
  const reviewers = Array.isArray(surat.reviewers) ? surat.reviewers : [];
  const approvers = Array.isArray(surat.approvers) ? surat.approvers : [];
  const nodes = [
    { role: 'Drafter', name: surat.pembuat, status: 'done', ts: surat.tanggal },
    ...reviewers.map((r, i) => ({
      role: `Reviewer ${i + 1}`,
      name: r.name,
      status: r.reviewStatus === 'approved' ? 'done' : r.reviewStatus === 'pending' ? 'curr' : 'pend',
      ts: r.reviewStatus === 'approved' ? 'Disetujui' : r.reviewStatus === 'returned' ? 'Dikembalikan' : 'Menunggu',
    })),
    ...approvers.map((a, i) => ({
      role: `Approver ${i + 1}`,
      name: a.name,
      status: a.approveStatus === 'approved' ? 'done' : surat.status === 'menunggu-approval' ? 'curr' : 'pend',
      ts: a.approveStatus === 'approved' ? 'Disetujui' : surat.status === 'menunggu-approval' ? 'Menunggu' : 'Pending',
    })),
  ];
  return (
    <div className="approval-stepper">
      {nodes.map((n, i) => (
        <div className="stepper-node" key={i}>
          <div className="stepper-left">
            <div className={`stepper-dot ${n.status}`}>
              {n.status === 'done' ? <Icon name="check" size={13} strokeWidth={2.8}/> : i + 1}
            </div>
            {i < nodes.length - 1 && <div className="stepper-line"/>}
          </div>
          <div className="stepper-content">
            <div className="stepper-role">{n.role}</div>
            <div className="stepper-name">{n.name || '—'}</div>
            <div className="stepper-ts">{n.ts}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DetailSurat = ({ surat, role, onBack, onAction, onSuratPatch }) => {
  // role: 'reviewer' | 'approver' | 'drafter' | 'tujuan' | 'admin-stempel'
  const [activeTab, setActiveTab] = React.useState('isi-surat');
  const [modal, setModal] = React.useState(null); // { type, config }
  const [tlHistory, setTlHistory] = React.useState([]);
  const [otpOpen, setOtpOpen] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [otpErr, setOtpErr] = React.useState('');
  const [otpCooldown, setOtpCooldown] = React.useState(0);
  const [peruriPhase, setPeruriPhase] = React.useState(null); // 'ttd' | 'stempel'

  const flowDigital = !!surat.flowDigitalSign;
  const docLockedPeruri = flowDigital && ['diproses-peruri-ttd', 'menunggu-stempel', 'diproses-peruri-stempel', 'disetujui', 'terkirim', 'gagal-peruri'].includes(surat.status);

  React.useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setInterval(() => setOtpCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [otpCooldown]);

  const chip = STATUS_SURAT_LABEL[surat.status] || { lbl: surat.status, cls: 'gray' };
  const reviewers = Array.isArray(surat.reviewers) ? surat.reviewers : [];
  const approvers = Array.isArray(surat.approvers) ? surat.approvers : [];

  // Determine "next" person label
  const nextLabel = (() => {
    if (surat.status === 'menunggu-review') {
      const pending = reviewers.find(r => r.reviewStatus === 'pending');
      return pending ? `${pending.name} · ${pending.role}` : null;
    }
    if (surat.status === 'menunggu-approval') {
      return approvers.length ? `${approvers[0].name} · ${approvers[0].role}` : null;
    }
    return null;
  })();

  const kirimUlangOtp = () => {
    setOtpErr('');
    setOtpCooldown(60);
  };

  const mulaiOtpSetujui = () => {
    setOtp('');
    setOtpErr('');
    setOtpOpen(true);
    setOtpCooldown(60);
  };

  const verifikasiOtpDanKirimPeruri = () => {
    const code = otp.replace(/\D/g, '');
    if (code.length !== 6) {
      setOtpErr('Masukkan 6 digit kode OTP.');
      return;
    }
    if (code === '000000') {
      setOtpErr('Kode OTP sudah kadaluarsa.');
      return;
    }
    if (code !== '123456') {
      setOtpErr('Kode OTP tidak valid. Silakan coba lagi.');
      return;
    }
    setOtpOpen(false);
    setOtp('');
    setOtpErr('');
    if (!onSuratPatch) {
      onAction && onAction('approve_approver', '');
      return;
    }
    onSuratPatch(surat.id, { status: 'diproses-peruri-ttd' });
    setPeruriPhase('ttd');
    window.setTimeout(() => {
      setPeruriPhase(null);
      onSuratPatch(surat.id, { status: 'menunggu-stempel' });
    }, 2200);
  };

  const adminVerifikasiStempel = () => {
    if (!onSuratPatch) return;
    onSuratPatch(surat.id, { status: 'diproses-peruri-stempel' });
    setPeruriPhase('stempel');
    window.setTimeout(() => {
      setPeruriPhase(null);
      onSuratPatch(surat.id, {
        status: 'terkirim',
        versiDokumen: 'Final (TTD digital + stempel digital · Peruri)',
      });
    }, 2200);
  };

  const retryPeruriStempel = () => {
    onSuratPatch && onSuratPatch(surat.id, { status: 'menunggu-stempel' });
  };

  const openModal = (type) => {
    const configs = {
      approve_reviewer: {
        title: 'Setujui & Teruskan Surat?',
        body: 'Surat akan diteruskan ke reviewer berikutnya atau ke Approver jika semua reviewer telah menyetujui.',
        destination: nextLabel ? `Berikutnya: ${nextLabel}` : 'Berikutnya: Approver',
        cta: 'Setujui & Teruskan', requireNote: false, green: true,
      },
      approve_approver: {
        title: 'Setujui & Kirim Surat?',
        body: 'Surat akan resmi disetujui. Nomor dan tanggal surat di-generate otomatis oleh sistem, lalu dikirim ke Tujuan.',
        destination: 'Berikutnya: Dikirim ke Tujuan',
        cta: 'Setujui & Kirim', requireNote: false, green: true,
      },
      return: {
        title: 'Kembalikan untuk Revisi?',
        body: 'Surat akan dikembalikan ke Drafter untuk diperbaiki. Alur review mengulang dari awal setelah revisi disubmit.',
        destination: `Kembali ke: ${surat.pembuat} (Drafter)`,
        cta: 'Kembalikan untuk Revisi', requireNote: true,
      },
      cancel: {
        title: 'Batalkan Surat?',
        body: 'Surat akan dibatalkan secara permanen. Tindakan ini tidak dapat diurungkan.',
        cta: 'Batalkan Surat', requireNote: true, danger: true,
      },
      acc: {
        title: 'ACC Surat?',
        body: 'Anda mengakui dan menerima surat ini. Status surat akan diperbarui menjadi Sudah Dibaca.',
        cta: 'ACC Surat', requireNote: false, green: true,
      },
      tolak: {
        title: 'Tolak Surat?',
        body: 'Anda menolak surat ini. Surat akan ditutup di sisi Anda.',
        cta: 'Tolak Surat', requireNote: true, danger: true,
      },
      teruskan: {
        title: 'Teruskan Surat?',
        body: 'Surat akan diteruskan ke penerima lain. Status surat Anda akan berubah menjadi Selesai.',
        cta: 'Teruskan', requireNote: true, green: false,
      },
      submit_tl: {
        title: 'Submit Tindak Lanjut?',
        body: 'Catatan tindak lanjut Anda akan disimpan dan surat akan ditutup.',
        cta: 'Submit Tindak Lanjut', requireNote: true, green: true,
      },
    };
    setModal({ type, config: configs[type] });
  };

  const handleConfirm = (note) => {
    const type = modal?.type;
    setModal(null);
    if (type === 'submit_tl' || type === 'acc' || type === 'teruskan') {
      setTlHistory(prev => [...prev, { action: modal.config.title, note, ts: 'Baru saja' }]);
    }
    onAction && onAction(type, note);
  };

  const TABS = [
    { key: 'isi-surat', lbl: 'Isi Surat' },
    { key: 'catatan', lbl: 'Catatan' },
    { key: 'riwayat', lbl: 'Riwayat' },
    { key: 'versi', lbl: 'Versi Dokumen' },
    { key: 'alur', lbl: 'Alur Persetujuan' },
  ];

  // ── Right panel render ──
  const renderRightPanel = () => {
    if (role === 'admin-stempel') {
      const jalur =
        surat.tujuanKirim === 'email-eksternal' ? 'Email eksternal (otomatis setelah stempel)' :
        surat.tujuanKirim === 'intercompany' ? 'Intercompany — inbox DOF penerima (Admin Pendok)' :
        'Manual — unduh & kirim sendiri';
      return (
        <div className="right-panel-card">
          <div className="right-panel-block">
            <div className="right-panel-block-title">Konteks Surat</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 4 }}>STATUS</div>
                <span className={`chip ${chip.cls}`} style={{ fontSize: 12 }}>{chip.lbl}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <b>Alur Digital Sign &amp; Stempel</b> — dokumen read-only. Tanpa OTP pada tahap stempel (PRD §5.4).
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                <b>Jalur tujuan:</b> {jalur}
              </div>
            </div>
          </div>
          <div className="right-panel-block">
            <div className="right-panel-block-title">Alur Persetujuan</div>
            <ApprovalStepper surat={surat} compact/>
          </div>
          <div className="right-panel-block">
            <div className="right-panel-block-title">Tindakan Saya</div>
            {surat.status === 'menunggu-stempel' && (
              <button type="button" className="action-btn-primary" onClick={adminVerifikasiStempel}>
                <Icon name="check" size={15} strokeWidth={2.4}/> Verifikasi Stempel Digital
              </button>
            )}
            {surat.status === 'diproses-peruri-stempel' && (
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', padding: '12px 0' }}>
                <Icon name="refresh" size={24} className="peruri-spin" style={{ display: 'block', margin: '0 auto 10px' }}/>
                Sedang memproses stempel digital…
              </div>
            )}
            {(surat.status === 'terkirim' || surat.status === 'disetujui') && (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
                Proses Peruri selesai. Surat mengikuti jalur pengiriman ke tujuan.
              </p>
            )}
            {surat.status === 'gagal-peruri' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#B71D18', lineHeight: 1.45 }}>Proses stempel gagal. Silakan coba lagi.</p>
                <button type="button" className="btn btn-secondary" onClick={retryPeruriStempel}>Coba Lagi</button>
              </div>
            )}
            {!['menunggu-stempel', 'diproses-peruri-stempel', 'terkirim', 'disetujui', 'gagal-peruri'].includes(surat.status) && (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
                Tidak ada tindakan pada status ini.
              </p>
            )}
          </div>
        </div>
      );
    }

    if (role === 'tujuan') {
      return (
        <div className="right-panel-card">
          <div className="right-panel-block">
            <div className="right-panel-block-title">Informasi Surat</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div><span style={{ color: 'var(--text-secondary)' }}>Dari: </span><b>{surat.pembuat}</b></div>
              {approvers[0] && <div><span style={{ color: 'var(--text-secondary)' }}>Disetujui oleh: </span><b>{approvers[0].name}</b></div>}
              <div><span style={{ color: 'var(--text-secondary)' }}>Diterima: </span><b className="tnum">{surat.tanggal}</b></div>
              <div style={{ marginTop: 4 }}><span className={`chip ${chip.cls}`}>{chip.lbl}</span></div>
            </div>
          </div>
          <div className="right-panel-block">
            <div className="right-panel-block-title">Tindakan Saya</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="action-btn-primary" onClick={() => openModal('acc')}>
                <Icon name="check" size={15} strokeWidth={2.4}/> ACC Surat
              </button>
              <button className="action-btn-secondary-full" onClick={() => openModal('teruskan')}>
                <Icon name="chevr" size={14}/> Teruskan
              </button>
              <button className="action-btn-secondary-full" onClick={() => openModal('submit_tl')}>
                <Icon name="download" size={14}/> Submit Tindak Lanjut
              </button>
              <div className="action-divider"/>
              <button className="action-btn-destructive" onClick={() => openModal('tolak')}>
                <Icon name="x" size={13} strokeWidth={2.4}/> Tolak Surat
              </button>
            </div>
          </div>
          {tlHistory.length > 0 && (
            <div className="right-panel-block">
              <div className="right-panel-block-title">Status Tindak Lanjut</div>
              <div className="tindaklanjut-history">
                {tlHistory.map((h, i) => (
                  <div className="tl-hist-item" key={i}>
                    <div className="dot"/>
                    <div><b>{h.action}</b> · {h.ts}{h.note ? <><br/><span style={{ color: 'var(--text-secondary)' }}>{h.note}</span></> : null}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Variant A: Reviewer / Approver / Drafter
    const isDrafter = role === 'drafter';
    const isReviewer = role === 'reviewer';
    const isApprover = role === 'approver';
    const currentPerson = isReviewer ? reviewers.find(r => r.reviewStatus === 'pending') : approvers[0];
    const hideApproverPipelineActions = isApprover && flowDigital &&
      ['diproses-peruri-ttd', 'menunggu-stempel', 'diproses-peruri-stempel', 'terkirim', 'gagal-peruri'].includes(surat.status);
    return (
      <div className="right-panel-card">
        <div className="right-panel-block">
          <div className="right-panel-block-title">Konteks Surat</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 4 }}>STATUS</div>
              <span className={`chip ${chip.cls}`} style={{ fontSize: 12 }}>{chip.lbl}</span>
            </div>
            {flowDigital && (
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary-dark)', background: 'var(--primary-50)', padding: '8px 10px', borderRadius: 8, lineHeight: 1.45 }}>
                Alur <b>Digital Sign &amp; Stempel</b> (Peruri) — setelah persetujuan Approver: OTP → TTD digital → Admin Stempel → stempel → tujuan.
              </div>
            )}
            {currentPerson && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 4 }}>DIPROSES OLEH</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{currentPerson.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{currentPerson.role}</div>
              </div>
            )}
            {!isDrafter && nextLabel && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 4 }}>BERIKUTNYA</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{nextLabel}</div>
              </div>
            )}
          </div>
        </div>
        <div className="right-panel-block">
          <div className="right-panel-block-title">Alur Persetujuan</div>
          <ApprovalStepper surat={surat} compact/>
        </div>
        <div className="right-panel-block">
          <div className="right-panel-block-title">Tindakan Saya</div>
          {isDrafter ? (
            <div style={{ padding: '8px 0', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, textAlign: 'center' }}>
              <Icon name="info" size={20} style={{ opacity: 0.4, marginBottom: 6, display: 'block', margin: '0 auto 8px' }}/>
              Surat sedang diproses.<br/>Tidak ada tindakan saat ini.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {isApprover && flowDigital && surat.status === 'diproses-peruri-ttd' && (
                <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', padding: '8px 0' }}>
                  <Icon name="refresh" size={24} className="peruri-spin" style={{ display: 'block', margin: '0 auto 10px' }}/>
                  Sedang memproses tanda tangan digital…
                </div>
              )}
              {isApprover && flowDigital && surat.status === 'menunggu-stempel' && (
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5 }}>
                  TTD digital selesai. Surat menunggu <b>Admin Stempel</b> untuk verifikasi stempel digital.
                </div>
              )}
              {isReviewer && (
                <button className="action-btn-primary" onClick={() => openModal('approve_reviewer')}>
                  <Icon name="check" size={15} strokeWidth={2.4}/> Setujui & Teruskan
                </button>
              )}
              {isApprover && surat.status === 'menunggu-approval' && (
                <button className="action-btn-primary" onClick={() => (flowDigital ? mulaiOtpSetujui() : openModal('approve_approver'))}>
                  <Icon name="check" size={15} strokeWidth={2.4}/> Setujui & Kirim
                </button>
              )}
              {!hideApproverPipelineActions && (
                <>
                  <button className="action-btn-warning" onClick={() => openModal('return')}>
                    <Icon name="chevl" size={14}/> Kembalikan untuk Revisi
                  </button>
                  <div className="action-divider"/>
                  <button className="action-btn-destructive" onClick={() => openModal('cancel')}>
                    <Icon name="x" size={13} strokeWidth={2.4}/> Batalkan Surat
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Tab content render ──
  const renderTabContent = () => {
    if (activeTab === 'isi-surat') {
      const isiHtml = surat.isiHtml || `<p><strong>${surat.judul}</strong></p><p style="opacity:0.75">Dokumen surat tersedia di sistem.</p>`;
      const isEditable = role === 'reviewer' && !docLockedPeruri;
      return (
        <div className="card" style={{ overflow: 'hidden' }}>
          {isEditable && (
            <div style={{ padding: '10px 20px', background: 'linear-gradient(to right, var(--primary-50), transparent)', borderBottom: '1px dashed var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--primary-dark)' }}>
              ✏️ Anda sedang mengedit sebagai Reviewer
            </div>
          )}
          <RichTextEditor readOnly={!isEditable} initialHtml={isiHtml} htmlKey={surat.id}/>
        </div>
      );
    }
    if (activeTab === 'catatan') {
      const notes = [
        reviewers.filter(r => r.reviewStatus === 'approved').map((r, i) => ({
          name: r.name, role: `Reviewer ${i + 1}`, action: 'Disetujui',
          body: 'Dokumen telah direview dan disetujui. Tidak ada perubahan signifikan yang diperlukan.',
          ts: '10 Mei 2026, 11:20',
        })),
        approvers.filter(a => a.approveStatus === 'approved').map(a => ({
          name: a.name, role: 'Approver', action: 'Disetujui',
          body: 'Surat disetujui sesuai prosedur yang berlaku.',
          ts: '11 Mei 2026, 09:00',
        })),
      ].flat();
      if (notes.length === 0) return (
        <div className="tab-empty-state">
          <div className="icon"><Icon name="info" size={36}/></div>
          <div className="title">Belum ada catatan</div>
          Catatan dari Reviewer dan Approver akan muncul di sini setelah mereka memberikan keputusan.
        </div>
      );
      return (
        <div className="tab-catatan">
          {notes.map((n, i) => (
            <div className="note-card" key={i}>
              <div className="note-card-head">
                <div className="note-av">{initialsOf(n.name)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{n.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{n.role}</div>
                </div>
                <span className="chip green" style={{ marginLeft: 'auto' }}>{n.action}</span>
              </div>
              <div className="note-card-body">{n.body}</div>
              <div className="note-card-ts">{n.ts}</div>
            </div>
          ))}
        </div>
      );
    }
    if (activeTab === 'riwayat') {
      const events = [
        { icon: 'plus', bg: '#D3FCD2', color: '#118D57', label: `Surat dibuat oleh ${surat.pembuat}`, actor: surat.pembuat, ts: `${surat.tanggal} · 09:12` },
        { icon: 'chevr', bg: '#D0F2FF', color: '#006C9C', label: 'Surat dikirim ke Reviewer', actor: surat.pembuat, ts: `${surat.tanggal} · 09:20` },
        ...reviewers.filter(r => r.reviewStatus === 'approved').map(r => ({
          icon: 'check', bg: '#D3FCD2', color: '#118D57', label: `Disetujui oleh ${r.name}`, actor: `${r.name} · ${r.role}`, ts: '11 Mei 2026 · 10:45',
        })),
        surat.status === 'menunggu-approval' ? { icon: 'chevr', bg: '#FFF5CC', color: '#B76E00', label: 'Diteruskan ke Approver', actor: 'Sistem', ts: '11 Mei 2026 · 10:46' } : null,
        surat.status === 'disetujui' ? { icon: 'check', bg: '#D3FCD2', color: '#118D57', label: `Disetujui oleh ${approvers[0]?.name}`, actor: `${approvers[0]?.name} · Approver`, ts: '11 Mei 2026 · 14:00' } : null,
      ].filter(Boolean);
      return (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="timeline">
            {events.map((e, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-left">
                  <div className="timeline-icon" style={{ background: e.bg, color: e.color }}>
                    <Icon name={e.icon} size={16} strokeWidth={2.4}/>
                  </div>
                  <div className="timeline-connector"/>
                </div>
                <div className="timeline-content">
                  <div className="timeline-label">{e.label}</div>
                  <div className="timeline-actor">{e.actor}</div>
                  <div className="timeline-ts">{e.ts}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (activeTab === 'versi') {
      const versions = [
        { label: 'Versi Final', by: surat.pembuat, ts: '11 Mei 2026', latest: true },
        { label: 'Versi Reviewer 1', by: reviewers[0]?.name || surat.pembuat, ts: '10 Mei 2026', latest: false },
        { label: 'Versi Awal', by: surat.pembuat, ts: surat.tanggal, latest: false },
      ];
      return (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="version-list">
            {versions.map((v, i) => (
              <div className="version-card" key={i}>
                <div><span className={`version-badge ${v.latest ? 'latest' : 'old'}`}>{v.latest ? 'Terbaru' : `v${versions.length - i}`}</span></div>
                <div className="version-meta">
                  <div className="nm">{v.label}</div>
                  <div className="sub">Oleh {v.by} · {v.ts}</div>
                </div>
                <div className="version-actions">
                  <button className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 10px' }}><Icon name="eye" size={13}/> Lihat</button>
                  <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}><Icon name="download" size={13}/> Unduh</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (activeTab === 'alur') {
      return (
        <div className="card" style={{ padding: 24, overflow: 'hidden' }}>
          <ApprovalStepper surat={surat}/>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="detail-surat-shell">
      {/* Header */}
      <div className="detail-surat-header">
        <div className="detail-surat-header-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button type="button" className="back" onClick={onBack} title="Kembali ke daftar"><Icon name="chevl" size={20}/></button>
            <div>
              <h1>Detail Surat</h1>
              <div className="crumbs">
                <span>Manajemen Surat</span>
                <span className="sep"/>
                <span className="now">Detail · {surat.no || surat.id}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" style={{ fontSize: 12 }}>
              <Icon name="eye" size={14}/> Print Preview
            </button>
            <button type="button" className="btn btn-secondary" style={{ fontSize: 12 }}>
              <Icon name="download" size={14}/> Unduh
            </button>
          </div>
        </div>
        <div className="detail-tabs">
          {TABS.map(t => (
            <button key={t.key} className={`detail-tab${activeTab === t.key ? ' on' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Body: split layout */}
      <div className="detail-surat-body">
        <div className="detail-surat-left">
          {/* Document Summary Card */}
          <div className="doc-summary-card">
            <div className="doc-summary-head">
              <div className="judul">{surat.judul}</div>
              <div className="nomor">{surat.no || surat.id}</div>
              {flowDigital && (
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary-dark)', marginTop: 6 }}>
                  Alur: Digital Sign &amp; Stempel (Peruri)
                </div>
              )}
            </div>
            <div className="doc-summary-grid">
              <div className="doc-summary-cell">
                <div className="lbl">Jenis</div>
                <div className="val">{surat.jenis || 'Memorandum'}</div>
              </div>
              <div className="doc-summary-cell">
                <div className="lbl">Sifat</div>
                <div className="val">{surat.sifat ? surat.sifat.charAt(0).toUpperCase() + surat.sifat.slice(1).replace('-', ' ') : '—'}</div>
              </div>
              <div className="doc-summary-cell">
                <div className="lbl">Kecepatan Tanggapan</div>
                <div className="val">{surat.kecepatan ? surat.kecepatan.replace('-', ' ') : '—'}</div>
              </div>
              <div className="doc-summary-cell">
                <div className="lbl">Klasifikasi</div>
                <div className="val">{surat.klasifikasi || '—'}</div>
              </div>
              <div className="doc-summary-cell">
                <div className="lbl">Drafter</div>
                <div className="val">{surat.pembuat}</div>
              </div>
              <div className="doc-summary-cell">
                <div className="lbl">Tujuan</div>
                <div className="val">{surat.tujuanNama || surat.tujuan || '—'}</div>
              </div>
              <div className="doc-summary-cell">
                <div className="lbl">Jumlah lampiran</div>
                <div className="val">{surat.lampiranCount != null ? String(surat.lampiranCount) : '—'}</div>
              </div>
              <div className="doc-summary-cell">
                <div className="lbl">Versi dokumen</div>
                <div className="val">{surat.versiDokumen || '—'}</div>
              </div>
              <div className="doc-summary-cell doc-summary-cell--span2">
                <div className="lbl">Tanggal dibuat</div>
                <div className="val tnum">{surat.tanggal}</div>
              </div>
            </div>
          </div>

          {/* Tab content */}
          {renderTabContent()}
        </div>

        {/* Right panel */}
        <div className="detail-surat-right">
          {renderRightPanel()}
        </div>
      </div>

      {/* OTP Digital Sign (PRD §10) */}
      {otpOpen && (
        <div className="ctx-modal-overlay" onClick={() => setOtpOpen(false)}>
          <div className="ctx-modal digital-otp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ctx-modal-head">
              <h2>Verifikasi Tanda Tangan Digital</h2>
            </div>
            <div className="ctx-modal-body">
              <p style={{ marginTop: 0 }}>Kode OTP telah dikirim ke email dan nomor HP Anda. Masukkan kode untuk melanjutkan.</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Demo: gunakan kode <b className="tnum">123456</b>. OTP kadaluarsa disimulasikan dengan kode <b className="tnum">000000</b>.</p>
              <label className="fld-lbl" style={{ marginTop: 12 }}>Kode OTP (6 digit)</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className={`inp${otpErr ? ' err' : ''}`}
                placeholder="••••••"
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpErr(''); }}
                autoFocus
              />
              {otpErr && <div className="fld-err" style={{ marginTop: 8 }}>{otpErr}</div>}
            </div>
            <div className="ctx-modal-footer" style={{ flexWrap: 'wrap', gap: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setOtpOpen(false)}>Batal</button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={otpCooldown > 0}
                onClick={kirimUlangOtp}>
                Kirim Ulang OTP{otpCooldown > 0 ? ` (${otpCooldown}s)` : ''}
              </button>
              <button type="button" className="btn btn-primary" onClick={verifikasiOtpDanKirimPeruri}>Verifikasi</button>
            </div>
          </div>
        </div>
      )}

      {peruriPhase && (
        <div className="detail-peruri-blocking">
          <div className="detail-peruri-blocking-inner">
            <Icon name="refresh" size={36} className="peruri-spin"/>
            <p>{peruriPhase === 'ttd' ? 'Sedang memproses tanda tangan digital…' : 'Sedang memproses stempel digital…'}</p>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Menunggu respons Peruri…</span>
          </div>
        </div>
      )}

      {/* Contextual modal */}
      <CtxModal config={modal?.config} onConfirm={handleConfirm} onCancel={() => setModal(null)}/>
    </div>
  );
};

// ─────────────────────────────────────────────
// REVIEWER & APPROVER PAGES
// ─────────────────────────────────────────────

const SuratWorkflowTable = ({ title, subtitle, emptyMsg, suratList, mode, onAction, onOpenLetter, currentUserId }) => {
  const ME = currentUserId || CURRENT_USER_ID;
  const [search, setSearch]   = React.useState('');
  const [sifatF, setSifatF]   = React.useState('all');
  const [kecF, setKecF]       = React.useState('all');
  const [confirm, setConfirm] = React.useState(null); // { id, action: 'approve'|'reject'|'return' }
  const [flash, setFlash]     = React.useState(null);

  React.useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 5000);
    return () => clearTimeout(t);
  }, [flash]);

  let filtered = suratList;
  if (sifatF !== 'all')  filtered = filtered.filter(s => s.sifat === sifatF);
  if (kecF   !== 'all')  filtered = filtered.filter(s => s.kecepatan === kecF);
  if (search) filtered = filtered.filter(s =>
    s.judul.toLowerCase().includes(search.toLowerCase()) ||
    s.no.toLowerCase().includes(search.toLowerCase()) ||
    s.pembuat.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    if (!confirm) return;
    const { id, action } = confirm;
    const surat = suratList.find(s => s.id === id);
    const judulShort = surat ? `"${surat.judul.slice(0, 50)}${surat.judul.length > 50 ? '…' : ''}"` : '';

    // For approve, check if all reviewers will be done after this action
    let approveMsg = `Surat ${judulShort} diteruskan ke tahap Approval.`;
    if (action === 'approve' && surat?.reviewers) {
      const updatedReviewers = surat.reviewers.map(r =>
        r.id === ME ? { ...r, reviewStatus: 'approved' } : r
      );
      const allApproved = updatedReviewers.every(r => r.reviewStatus === 'approved');
      approveMsg = allApproved
        ? `Semua reviewer menyetujui. Surat ${judulShort} diteruskan ke Approver.`
        : `Review Anda dicatat. Surat ${judulShort} masih menunggu reviewer lain.`;
    }

    const messages = {
      approve:          { tone: 'success', title: 'Review disetujui',        msg: approveMsg },
      'return-drafter': { tone: 'info',    title: 'Dikembalikan ke Drafter', msg: `Surat ${judulShort} dikembalikan ke pembuat untuk diperbaiki.` },
      cancel:           { tone: 'error',   title: 'Surat dibatalkan',        msg: `Surat ${judulShort} telah dibatalkan dan tidak dapat diproses lebih lanjut.` },
      'return':         { tone: 'error',   title: 'Approval ditolak',        msg: `Surat ${judulShort} dikembalikan ke Menunggu Review.` },
      finalize:         { tone: 'success', title: 'Surat disetujui',         msg: `Surat ${judulShort} telah disetujui dan selesai.` },
    };
    onAction(id, action);
    setFlash(messages[action] || { tone: 'info', title: 'Aksi berhasil', msg: '' });
    setConfirm(null);
  };

  const ActionButtons = ({ s }) => {
    const openDetail = (e) => {
      e.stopPropagation();
      onOpenLetter && onOpenLetter(s);
    };
    if (mode === 'reviewer') return (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }}
          onClick={openDetail}>
          <Icon name="eye" size={13}/> Detail
        </button>
      </div>
    );
    if (mode === 'approver') return (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }}
          onClick={openDetail}>
          <Icon name="eye" size={13}/> Detail
        </button>
      </div>
    );
    return null;
  };

  const confirmMeta = confirm && {
    approve:          { label: 'Setujui',             msg: 'Surat akan diteruskan ke reviewer berikutnya atau ke Approver jika semua reviewer sudah menyetujui.', btnCls: 'btn-primary', btnStyle: { background: '#118D57', borderColor: '#118D57' } },
    'return-drafter': { label: 'Kembalikan ke Drafter', msg: 'Surat akan dikembalikan ke pembuat (drafter) untuk diperbaiki. Status berubah kembali ke Draft.',    btnCls: 'btn-secondary', btnStyle: {} },
    cancel:           { label: 'Batalkan Surat',      msg: 'Surat akan dibatalkan dan tidak dapat diproses lebih lanjut. Tindakan ini tidak dapat diurungkan.',    btnCls: 'btn-danger', btnStyle: {} },
    'return':         { label: 'Tolak Approval',      msg: 'Surat akan dikembalikan ke Reviewer untuk direvisi.',                                                  btnCls: 'btn-danger', btnStyle: {} },
    finalize:         { label: 'Setujui Surat',       msg: 'Surat akan resmi disetujui dan proses selesai.',                                                       btnCls: 'btn-primary', btnStyle: {} },
  }[confirm?.action];

  return (
    <div>
      {flash && (
        <div className={`flash flash-${flash.tone}`} style={{ marginBottom: 0 }}>
          <span className="flash-ic"><Icon name={flash.tone === 'success' ? 'check' : 'info'} size={16} strokeWidth={2.4}/></span>
          <div className="flash-body">
            <div className="flash-title">{flash.title}</div>
            <div className="flash-msg">{flash.msg}</div>
          </div>
          <button className="flash-x" onClick={() => setFlash(null)}><Icon name="x" size={14}/></button>
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-head">
          <div>
            <h3 className="card-title">{title}</h3>
            <p className="card-subtitle">{subtitle}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filterbar">
          <div className="filter-input">
            <Icon name="search" size={16}/>
            <input placeholder="Cari judul, nomor surat, atau pembuat…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <select className="filter-select" value={sifatF} onChange={e => setSifatF(e.target.value)}
            style={{ appearance: 'none', paddingRight: 28, backgroundImage: 'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="%23637381" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>\')', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}>
            <option value="all">Sifat: Semua</option>
            <option value="biasa">Biasa</option>
            <option value="terbatas">Terbatas</option>
            <option value="rahasia">Rahasia</option>
            <option value="sangat-rahasia">Sangat Rahasia</option>
          </select>
          <select className="filter-select" value={kecF} onChange={e => setKecF(e.target.value)}
            style={{ appearance: 'none', paddingRight: 28, backgroundImage: 'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="%23637381" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>\')', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}>
            <option value="all">Kecepatan: Semua</option>
            <option value="biasa">Biasa</option>
            <option value="segera">Segera</option>
            <option value="sangat-segera">Sangat Segera</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 36 }}><input type="checkbox"/></th>
                <th>Judul Surat</th>
                <th>Sifat</th>
                <th>Kecepatan</th>
                <th>Pembuat</th>
                {mode === 'reviewer' && <th>Progress Review</th>}
                <th>Tanggal</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={mode === 'reviewer' ? 8 : 7} style={{ textAlign: 'center', padding: '60px 24px' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                  <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{emptyMsg}</div>
                </td></tr>
              ) : filtered.map(s => {
                const sif  = SIFAT_CHIP[s.sifat]      || { lbl: s.sifat,      cls: 'gray' };
                const kec  = KECEPATAN_CHIP[s.kecepatan] || { lbl: s.kecepatan, cls: 'gray' };
                const reviewers = s.reviewers || [];
                const approvedCount = reviewers.filter(r => r.reviewStatus === 'approved').length;
                const totalReviewers = reviewers.length;
                const allApproved = approvedCount === totalReviewers && totalReviewers > 0;
                return (
                  <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => onOpenLetter && onOpenLetter(s)}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox"/></td>
                    <td style={{ maxWidth: 340 }}>
                      <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{s.judul}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{s.no}</div>
                    </td>
                    <td><span className={`chip ${sif.cls}`}>{sif.lbl}</span></td>
                    <td><span className={`chip ${kec.cls}`}>{kec.lbl}</span></td>
                    <td>
                      <div className="flex" style={{ gap: 8 }}>
                        <div className={`avatar av-${s.av}`} style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>{s.init}</div>
                        <span style={{ fontSize: 13 }}>{s.pembuat}</span>
                      </div>
                    </td>
                    {mode === 'reviewer' && (
                      <td>
                        {totalReviewers > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span className={`chip ${allApproved ? 'green' : approvedCount > 0 ? 'amber' : 'gray'}`} style={{ fontSize: 11, fontWeight: 700 }}>
                                {approvedCount}/{totalReviewers} disetujui
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {reviewers.map((r, idx) => (
                                <div key={idx} title={`${r.name} — ${r.reviewStatus === 'approved' ? 'Disetujui' : r.reviewStatus === 'rejected' ? 'Ditolak' : 'Menunggu'}`}
                                  style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid',
                                    borderColor: r.reviewStatus === 'approved' ? '#118D57' : (r.reviewStatus === 'rejected' || r.reviewStatus === 'cancelled') ? '#B71D18' : r.reviewStatus === 'returned' ? '#0E7AC0' : 'var(--border)',
                                    background: r.reviewStatus === 'approved' ? '#D3F5E3' : (r.reviewStatus === 'rejected' || r.reviewStatus === 'cancelled') ? '#FFDAD5' : r.reviewStatus === 'returned' ? '#E8F2FA' : 'var(--hover)',
                                    display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700,
                                    color: r.reviewStatus === 'approved' ? '#118D57' : (r.reviewStatus === 'rejected' || r.reviewStatus === 'cancelled') ? '#B71D18' : r.reviewStatus === 'returned' ? '#0E7AC0' : 'var(--text-secondary)',
                                    flexShrink: 0,
                                  }}>
                                  {r.id === ME ? '★' : (idx + 1)}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : <span className="muted">—</span>}
                      </td>
                    )}
                    <td className="muted tnum">{s.tanggal}</td>
                    <td onClick={e => e.stopPropagation()}><ActionButtons s={s}/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pagi">
          <span>Menampilkan <b className="tnum">{filtered.length}</b> dari {suratList.length} surat</span>
        </div>
      </div>

      {/* Confirm modal */}
      {confirm && confirmMeta && (() => {
        const confirmSurat = suratList.find(s => s.id === confirm.id);
        const reviewers = confirmSurat?.reviewers || [];
        const approvers = confirmSurat?.approvers || [];
        // Simulate post-action reviewer statuses for display
        const previewReviewers = confirm.action === 'approve'
          ? reviewers.map(r => r.id === ME ? { ...r, reviewStatus: 'approved' } : r)
          : confirm.action === 'return-drafter'
          ? reviewers.map(r => r.id === ME ? { ...r, reviewStatus: 'returned' } : r)
          : reviewers;
        const allWouldApprove = previewReviewers.every(r => r.reviewStatus === 'approved');
        return (
          <div onClick={() => setConfirm(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(28,37,46,0.5)', backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', zIndex: 200, padding: 24 }}>
            <div onClick={e => e.stopPropagation()} className="card" style={{ width: 500, maxWidth: '100%' }}>
              <div className="card-head" style={{ borderBottom: '1px dashed var(--border)' }}>
                <h3 className="card-title">{confirmMeta.label}</h3>
                <button className="icon-btn" onClick={() => setConfirm(null)}><Icon name="x" size={18}/></button>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: (confirm.action === 'approve' || confirm.action === 'finalize') ? 'var(--success-bg)' : confirm.action === 'return-drafter' ? 'var(--info-bg)' : 'var(--error-bg)', display: 'grid', placeItems: 'center', flexShrink: 0, color: (confirm.action === 'approve' || confirm.action === 'finalize') ? '#118D57' : confirm.action === 'return-drafter' ? '#006C9C' : '#B71D18' }}>
                    <Icon name={confirm.action === 'approve' || confirm.action === 'finalize' ? 'check' : confirm.action === 'return-drafter' ? 'chevd' : 'info'} size={20} strokeWidth={2}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Konfirmasi Tindakan</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {confirm.action === 'approve' && !allWouldApprove
                        ? `Persetujuan Anda akan dicatat. Surat masih menunggu reviewer lain sebelum diteruskan ke Approver.`
                        : confirmMeta.msg}
                    </div>
                    <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--hover)', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                      {confirmSurat?.judul}
                    </div>
                  </div>
                </div>

                {/* Approval chain — shown for reviewer mode */}
                {mode === 'reviewer' && reviewers.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rantai Persetujuan</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
                      {previewReviewers.map((r, idx) => {
                        const isMe = r.id === ME;
                        const st = r.reviewStatus;
                        const dotColor = st === 'approved' ? '#118D57' : (st === 'rejected' || st === 'cancelled') ? '#B71D18' : st === 'returned' ? '#0E7AC0' : '#B76E00';
                        const dotBg   = st === 'approved' ? '#D3F5E3' : (st === 'rejected' || st === 'cancelled') ? '#FFDAD5' : st === 'returned' ? '#E8F2FA' : '#FFF0CC';
                        return (
                          <React.Fragment key={r.id}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 80 }}>
                              <div style={{ width: 34, height: 34, borderRadius: '50%', border: `2px solid ${dotColor}`, background: dotBg, display: 'grid', placeItems: 'center', fontSize: 13, color: dotColor }}>
                                {st === 'approved' ? <Icon name="check" size={14} strokeWidth={2.5}/> : (st === 'rejected' || st === 'cancelled') ? <Icon name="x" size={14} strokeWidth={2.5}/> : st === 'returned' ? <Icon name="chevd" size={14} strokeWidth={2.5}/> : <Icon name="eye" size={14} strokeWidth={2}/>}
                              </div>
                              <div style={{ fontSize: 11, fontWeight: isMe ? 700 : 500, textAlign: 'center', color: isMe ? 'var(--text)' : 'var(--text-secondary)', lineHeight: 1.3 }}>
                                {isMe ? `${r.name} (Anda)` : r.name}
                              </div>
                              <div style={{ fontSize: 10, color: dotColor, fontWeight: 600 }}>
                                {st === 'approved' ? 'Disetujui' : st === 'rejected' ? 'Ditolak' : 'Menunggu'}
                              </div>
                            </div>
                            {idx < previewReviewers.length - 1 && (
                              <div style={{ flex: 1, height: 2, background: 'var(--border)', minWidth: 24, marginBottom: 28 }}/>
                            )}
                          </React.Fragment>
                        );
                      })}
                      {/* Arrow to Approver stage */}
                      <div style={{ flex: 1, height: 2, background: allWouldApprove ? '#118D57' : 'var(--border)', minWidth: 24, marginBottom: 28 }}/>
                      {approvers.map((a, idx) => (
                        <div key={a.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 80 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', border: `2px solid ${allWouldApprove ? '#0E7AC0' : 'var(--border)'}`, background: allWouldApprove ? '#E8F2FA' : 'var(--hover)', display: 'grid', placeItems: 'center', color: allWouldApprove ? '#0E7AC0' : 'var(--text-disabled)' }}>
                            <Icon name="check" size={14} strokeWidth={2}/>
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 500, textAlign: 'center', color: allWouldApprove ? 'var(--text)' : 'var(--text-secondary)', lineHeight: 1.3 }}>{a.name}</div>
                          <div style={{ fontSize: 10, color: allWouldApprove ? '#0E7AC0' : 'var(--text-disabled)', fontWeight: 600 }}>
                            {allWouldApprove ? 'Siap di-approve' : 'Menunggu reviewer'}
                          </div>
                        </div>
                      ))}
                    </div>
                    {!allWouldApprove && confirm.action === 'approve' && (
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--warning-bg)', borderRadius: 8, fontSize: 12, color: '#7A4F00', lineHeight: 1.5 }}>
                        Surat akan tetap di status <b>Menunggu Review</b> hingga semua reviewer menyetujui.
                      </div>
                    )}
                    {allWouldApprove && confirm.action === 'approve' && (
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--success-bg)', borderRadius: 8, fontSize: 12, color: '#065E49', lineHeight: 1.5 }}>
                        Semua reviewer akan menyetujui — surat langsung diteruskan ke <b>Approver</b>.
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary" onClick={() => setConfirm(null)}>Batal</button>
                  <button className={`btn ${confirmMeta.btnCls}`} style={confirmMeta.btnStyle} onClick={handleConfirm}>
                    <Icon name="check" size={14} strokeWidth={2.4}/> {confirmMeta.label}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};

const ReviewerPage = ({ suratList, onAction, currentUserId, onOpenLetter, variant = 'pending' }) => {
  const ME = currentUserId || CURRENT_USER_ID;
  const toReview = suratList.filter(s =>
    s.status === 'menunggu-review' &&
    (s.reviewers || []).some(r => r.id === ME && r.reviewStatus === 'pending')
  );
  const reviewedByMe = suratList.filter((s) =>
    (s.reviewers || []).some((r) => r.id === ME && r.reviewStatus && r.reviewStatus !== 'pending')
  );
  const isHistory = variant === 'history';
  const list = isHistory ? reviewedByMe : toReview;
  const counts = { total: toReview.length };

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>{isHistory ? 'Telah Saya Review' : 'Menunggu Review Saya'}</h1>
          <div className="crumbs">
            <span>Pupuk Indonesia</span><span className="sep"></span>
            <span>Review Surat</span><span className="sep"></span>
            <span className="now">{isHistory ? 'Riwayat review' : 'Antrian'}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px', background: 'var(--warning-bg)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: '#7A4F00' }}>
        <Icon name="info" size={16} strokeWidth={2} color="#B76E00" style={{ flexShrink: 0, marginTop: 1 }}/>
        <span>
          {isHistory
            ? <>Daftar surat yang pernah Anda proses sebagai reviewer (setujui, kembalikan, atau batalkan).</>
            : <>Sebagai <b>Reviewer</b>, periksa kelengkapan surat sebelum ke Approver. Surat berpindah ke Approval setelah <b>semua reviewer menyetujui</b>.</>}
        </span>
      </div>

      <SuratWorkflowTable
        title={isHistory ? 'Surat yang sudah Anda review' : 'Surat menunggu review Anda'}
        subtitle={isHistory ? `${list.length} entri` : `${counts.total} surat perlu ditinjau oleh Anda`}
        emptyMsg={isHistory ? 'Belum ada riwayat review dari Anda' : 'Tidak ada surat yang menunggu review Anda saat ini'}
        suratList={list}
        mode="reviewer"
        onAction={onAction}
        currentUserId={ME}
        onOpenLetter={onOpenLetter}
      />
    </div>
  );
};

const ApproverPage = ({ suratList, onAction, currentUserId, onOpenLetter, variant = 'pending' }) => {
  const ME = currentUserId || CURRENT_USER_ID;
  const toApprove = suratList.filter(s =>
    s.status === 'menunggu-approval' &&
    (s.approvers || []).some(a => a.id === ME && (!a.approveStatus || a.approveStatus === 'pending'))
  );
  const decidedByMe = suratList.filter((s) =>
    (s.approvers || []).some((a) => a.id === ME && a.approveStatus && a.approveStatus !== 'pending')
  );
  const isHistory = variant === 'history';
  const list = isHistory ? decidedByMe : toApprove;

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>{isHistory ? 'Telah Saya Periksa' : 'Menunggu Approval Saya'}</h1>
          <div className="crumbs">
            <span>Pupuk Indonesia</span><span className="sep"></span>
            <span>Approval Surat</span><span className="sep"></span>
            <span className="now">{isHistory ? 'Riwayat keputusan' : 'Antrian'}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px', background: 'var(--info-bg)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: '#004B6B' }}>
        <Icon name="info" size={16} strokeWidth={2} color="#006C9C" style={{ flexShrink: 0, marginTop: 1 }}/>
        <span>
          {isHistory
            ? <>Surat yang sudah Anda putuskan (setujui, kembalikan ke review, atau batalkan).</>
            : <>Sebagai <b>Approver</b>, berikan keputusan akhir atas surat yang telah direview.</>}
        </span>
      </div>

      <SuratWorkflowTable
        title={isHistory ? 'Riwayat persetujuan Anda' : 'Surat menunggu approval Anda'}
        subtitle={isHistory ? `${list.length} entri` : `${toApprove.length} surat perlu disetujui oleh Anda`}
        emptyMsg={isHistory ? 'Belum ada riwayat approval dari Anda' : 'Tidak ada surat yang menunggu approval saat ini'}
        suratList={list}
        mode="approver"
        onAction={onAction}
        currentUserId={ME}
        onOpenLetter={onOpenLetter}
      />
    </div>
  );
};

const AdminRoutePage = ({ title, subtitle, crumbMid = 'Administrasi' }) => (
  <>
    <div className="page-title">
      <div>
        <h1>{title}</h1>
        <div className="crumbs">
          <span>Pupuk Indonesia</span><span className="sep"></span>
          <span>{crumbMid}</span><span className="sep"></span>
          <span className="now">{title}</span>
        </div>
      </div>
    </div>
    <div className="card" style={{ padding: 24 }}>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{subtitle}</p>
    </div>
  </>
);

// ─────────────────────────────────────────────
// POV SWITCHER (demo floating button)
// ─────────────────────────────────────────────
// Urutan menu Ganti POV: drafter → reviewer → approver → admin stempel → penerima → admin sistem
const POV_OPTIONS = [
  { id: 'PI-15912',  name: 'Cahyo Nugroho',     init: 'CN', role: 'Drafter · Senior Auditor',              color: '#7635DC', bg: '#F3EDFF', type: 'drafter' },
  { id: '1120084',   name: 'Yetty Endarwati',   init: 'YE', role: 'Reviewer 1 · SVP Digitalisasi',         color: '#00753E', bg: '#EBF6F0', type: 'reviewer' },
  { id: '2611582',   name: 'Linda Kurniawati',  init: 'LK', role: 'Reviewer 2 · VP Legal & Compliance',    color: '#0E7AC0', bg: '#E8F2FA', type: 'reviewer' },
  { id: '2511437',   name: 'Dr. Indra Permana', init: 'IP', role: 'Approver · Dir. Operasi & Produksi',    color: '#B76E00', bg: '#FFF7E6', type: 'approver' },
  { id: 'AST-BPO-01', name: 'Wahyu Firmansyah', init: 'WF', role: 'Admin Stempel · BPO Holding',          color: '#1C252E', bg: '#F4F6F8', type: 'admin-stempel' },
  { id: 'TL-REC-01', name: 'Rudi Hartono',      init: 'RH', role: 'Penerima Surat · VP Operasional',        color: '#006C9C', bg: '#E8F2FA', type: 'tujuan' },
  { id: 'ADM-SIS-01', name: 'Eko Widodo',       init: 'EW', role: 'Admin Sistem · IT Holding',             color: '#5119B7', bg: '#F3EDFF', type: 'admin' },
];

const PovSwitcher = ({ povUserId, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const current = POV_OPTIONS.find(p => p.id === povUserId) || POV_OPTIONS[0];

  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 600, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
      {/* Option cards (shown when open) */}
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2, marginRight: 4 }}>
            Ganti POV
          </div>
          {POV_OPTIONS.map(p => {
            const active = p.id === povUserId;
            return (
              <button key={p.id} onClick={() => { onChange(p.id); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 14,
                  background: active ? p.bg : 'white',
                  border: `2px solid ${active ? p.color : 'var(--border)'}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  minWidth: 240,
                }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: p.color, display: 'grid', placeItems: 'center',
                  color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>{p.init}</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: 'var(--text)' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>{p.role}</div>
                </div>
                {active && (
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: p.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icon name="check" size={11} strokeWidth={3} color="white"/>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <button onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 18px 10px 10px', borderRadius: 999,
          background: current.color, border: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          cursor: 'pointer', color: 'white', transition: 'all 0.15s',
        }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          display: 'grid', placeItems: 'center',
          fontSize: 12, fontWeight: 700,
        }}>{current.init}</div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 10, opacity: 0.8, lineHeight: 1 }}>POV Aktif</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{current.name}</div>
        </div>
        <div style={{ marginLeft: 4, opacity: 0.8, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <Icon name="chevd" size={16} color="white"/>
        </div>
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────
// INBOX PAGE
// ─────────────────────────────────────────────
const INBOX_TYPE_META = {
  review:      { lbl: 'Review',     cls: 'blue'  },
  reply:       { lbl: 'Balasan',    cls: 'gray'  },
  announcement:{ lbl: 'Pengumuman', cls: 'amber' },
  request:     { lbl: 'Permintaan', cls: 'amber' },
  system:      { lbl: 'Sistem',     cls: 'gray'  },
  invitation:  { lbl: 'Undangan',   cls: 'blue'  },
  approved:    { lbl: 'Disetujui',  cls: 'green' },
};

const InboxPage = ({ inboxList, setInboxList }) => {
  const [tab, setTab] = React.useState('unread');
  const [search, setSearch] = React.useState('');
  const [selectedId, setSelectedId] = React.useState(null);
  const messages = inboxList || INBOX;
  const setMessages = setInboxList || (() => {});

  const selected = selectedId ? messages.find(m => m.id === selectedId) : null;

  React.useEffect(() => {
    if (selectedId && !messages.some(m => m.id === selectedId)) setSelectedId(null);
  }, [messages, selectedId]);

  const unreadCount = messages.filter(m => m.unread).length;

  const TABS = [
    { key: 'unread',    lbl: 'Belum Dibaca',       count: messages.filter(m => m.unread).length },
    { key: 'read',      lbl: 'Sudah Dibaca',        count: messages.filter(m => !m.unread && !m.inProgress && !m.closed && !m.cancelled).length },
    { key: 'progress',  lbl: 'Dalam Tindak Lanjut', count: messages.filter(m => m.inProgress).length },
    { key: 'closed',    lbl: 'Selesai',             count: messages.filter(m => m.closed).length },
    { key: 'cancelled', lbl: 'Dibatalkan',          count: messages.filter(m => m.cancelled).length },
  ];

  const filtered = messages.filter(m => {
    if (tab === 'unread'    && !m.unread)      return false;
    if (tab === 'read'      && (m.unread || m.inProgress || m.closed || m.cancelled)) return false;
    if (tab === 'progress'  && !m.inProgress)  return false;
    if (tab === 'closed'    && !m.closed)       return false;
    if (tab === 'cancelled' && !m.cancelled)    return false;
    if (search && !m.subject.toLowerCase().includes(search.toLowerCase()) && !m.from.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const backToList = () => setSelectedId(null);

  const openMsg = (msg) => {
    setSelectedId(msg.id);
    if (msg.unread) setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));
  };

  const tm = selected ? (INBOX_TYPE_META[selected.type] || { lbl: selected.type, cls: 'gray' }) : null;
  const isReviewType = selected?.type === 'review';

  return (
    <div className="inbox-shell">
      <div className={`page-title${selected ? ' inbox-detail-title' : ''}`}>
        {selected ? (
          <div className="inbox-detail-page-head">
            <button type="button" className="back" onClick={backToList} title="Kembali ke Inbox">
              <Icon name="chevl" size={20}/>
            </button>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1>{selected.subject}</h1>
              <div className="crumbs">
                <span>Pupuk Indonesia</span>
                <span className="sep"/>
                <button type="button" className="inbox-crumb-back" onClick={backToList}>Inbox</button>
                <span className="sep"/>
                <span className="now">Pesan</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1>Inbox</h1>
            <div className="crumbs">
              <span>Pupuk Indonesia</span><span className="sep"/><span className="now">Inbox</span>
            </div>
          </div>
        )}
        {!selected && unreadCount > 0 && (
          <button className="btn btn-secondary" onClick={() => setMessages(prev => prev.map(m => ({ ...m, unread: false })))}>
            <Icon name="check" size={14}/> Tandai Semua Dibaca
          </button>
        )}
      </div>

      {!selected ? (
        <div className="inbox-layout">
          <div className="inbox-list-col">
            <div className="inbox-tabs-bar">
              {TABS.map(t => (
                <button key={t.key} className={`inbox-tab${tab === t.key ? ' on' : ''}`} onClick={() => { setTab(t.key); setSelectedId(null); }}>
                  {t.lbl}
                  {t.count > 0 && <span className="tab-count">{t.count}</span>}
                </button>
              ))}
            </div>
            <div className="filterbar">
              <div className="filter-input">
                <Icon name="search" size={16}/>
                <input placeholder="Cari pesan…" value={search} onChange={e => setSearch(e.target.value)}/>
              </div>
            </div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-secondary)', fontSize: 13 }}>Tidak ada pesan di tab ini</div>
            ) : filtered.map(msg => {
              const mt = INBOX_TYPE_META[msg.type] || { lbl: msg.type, cls: 'gray' };
              return (
                <div key={msg.id} className={`inbox-msg-row${msg.unread ? ' unread' : ''}`} onClick={() => openMsg(msg)} role="button" tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMsg(msg); } }}>
                  <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-dark)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>
                    {msg.init}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: msg.unread ? 700 : 600 }}>{msg.from}</span>
                      <span className={`chip ${mt.cls}`} style={{ fontSize: 10, marginLeft: 'auto', flexShrink: 0 }}>{mt.lbl}</span>
                      {msg.unread && <div className="inbox-unread-dot"/>}
                    </div>
                    <div className="subject">{msg.subject}</div>
                    <div className="preview-txt">{msg.preview}</div>
                  </div>
                  <div style={{ flexShrink: 0, fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap', paddingTop: 2 }}>{msg.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="inbox-layout inbox-layout--detail">
          <div className="inbox-detail-col">
            <div className="inbox-detail-head">
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>PESAN MASUK · {selected.date} {selected.time || ''}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-dark)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{selected.init}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{selected.from}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{selected.fromRole} · {selected.fromUnit}</div>
                </div>
                {tm && <span className={`chip ${tm.cls}`} style={{ marginLeft: 'auto', fontSize: 11 }}>{tm.lbl}</span>}
              </div>
            </div>
            <div className="inbox-detail-body">
              <p>{selected.preview} Kami harap informasi ini dapat segera ditindaklanjuti sesuai prosedur yang berlaku.</p>
              <p>Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.</p>
              <p style={{ marginTop: 16 }}>Hormat kami,<br/><strong>{selected.from}</strong><br/>{selected.fromRole}</p>
            </div>
            {selected.ref && (
              <div className="inbox-detail-ref">
                <Icon name="info" size={14}/> Merujuk pada surat <b>{selected.ref}</b>
              </div>
            )}
            {isReviewType && (
              <div className="inbox-detail-actions">
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 4 }}>TINDAKAN SAYA</div>
                <button className="action-btn-primary"><Icon name="check" size={14} strokeWidth={2.4}/> ACC Surat</button>
                <button className="action-btn-secondary-full"><Icon name="chevr" size={14}/> Teruskan</button>
                <button className="action-btn-secondary-full"><Icon name="download" size={14}/> Submit Tindak Lanjut</button>
                <div className="action-divider"/>
                <button className="action-btn-destructive"><Icon name="x" size={13}/> Tolak Surat</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );


};

// ─────────────────────────────────────────────
// NOTIFIKASI PAGE
// ─────────────────────────────────────────────
const NOTIF_META = {
  success: { color: '#118D57', bg: 'var(--success-bg)' },
  warning: { color: '#B76E00', bg: 'var(--warning-bg)' },
  info:    { color: '#006C9C', bg: 'var(--info-bg)'    },
};

const NotifikasiPage = () => {
  const [notifs, setNotifs] = React.useState(NOTIFIKASI);
  const unread = notifs.filter(n => n.unread).length;

  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
  const markOne = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>Notifikasi</h1>
          <div className="crumbs">
            <span>Pupuk Indonesia</span><span className="sep"></span>
            <span className="now">Notifikasi</span>
          </div>
        </div>
        {unread > 0 && (
          <button className="btn btn-secondary" onClick={markAll}>
            <Icon name="check" size={14}/> Tandai Semua Dibaca
          </button>
        )}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-head">
          <div>
            <h3 className="card-title">Semua Notifikasi</h3>
            <p className="card-subtitle">{unread} belum dibaca</p>
          </div>
        </div>
        {notifs.map((n, i) => {
          const m = NOTIF_META[n.type] || NOTIF_META.info;
          return (
            <div key={n.id} onClick={() => markOne(n.id)} style={{
              display: 'flex', gap: 14, padding: '16px 24px',
              borderBottom: i < notifs.length - 1 ? '1px solid var(--border-soft)' : 'none',
              background: n.unread ? 'var(--hover)' : 'white', cursor: 'pointer', transition: 'background 0.15s',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: m.bg, display: 'grid', placeItems: 'center', flexShrink: 0, color: m.color }}>
                <Icon name={n.icon} size={18} strokeWidth={2}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontWeight: n.unread ? 700 : 600, fontSize: 14 }}>{n.title}</span>
                  {n.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)' }}/>}
                  <span className="muted" style={{ marginLeft: 'auto', fontSize: 12 }}>{n.time}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.msg}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PROFIL SAYA PAGE
// ─────────────────────────────────────────────
const ProfilSayaPage = () => {
  const emp = EMPLOYEES[2]; // Ahmad Fauzi as logged-in user substitute (IT · HQ)
  const user = { name: 'Sri Dewanti', id: 'PI-00001', email: 'sri.dewanti@pupuk-indonesia.com', unit: 'Holding HQ', dept: 'Human Capital', jabatan: 'VP Human Capital', lokasi: 'Jakarta', joined: '03 Agu 2009', status: 'active', init: 'SD', phone: '+62 812 3456 7890', gender: 'Perempuan', dob: '14 Februari 1978', pendidikan: 'S2 Manajemen SDM — Universitas Indonesia' };
  const riwayat = [
    { tahun: '2020 – Sekarang', jabatan: 'VP Human Capital', unit: 'Holding HQ', tipe: 'Promosi' },
    { tahun: '2016 – 2020',     jabatan: 'Senior Manager HR Operations', unit: 'Holding HQ', tipe: 'Promosi' },
    { tahun: '2013 – 2016',     jabatan: 'HR Business Partner', unit: 'Petrokimia Gresik', tipe: 'Rotasi' },
    { tahun: '2009 – 2013',     jabatan: 'HR Officer', unit: 'Holding HQ', tipe: 'Rekrutmen' },
  ];

  const Field = ({ label, value }) => (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
    </div>
  );

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>Profil Saya</h1>
          <div className="crumbs">
            <span>Pupuk Indonesia</span><span className="sep"></span>
            <span>Profil</span><span className="sep"></span>
            <span className="now">Profil Saya</span>
          </div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Edit Profil</button>
      </div>

      {/* Header card */}
      <div className="card" style={{ padding: '32px 32px 24px' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--primary)', display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 700, color: 'white', flexShrink: 0 }}>SD</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{user.name}</h2>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 10 }}>{user.jabatan} · {user.unit}</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span className="chip green">Aktif</span>
              <span className="chip gray" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="pin" size={12}/> {user.lokasi}</span>
              <span className="chip gray" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="cal" size={12}/> Bergabung {user.joined}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary"><Icon name="download" size={14}/> Unduh CV</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 0 }}>
        {/* Info Pribadi */}
        <div className="card">
          <div className="card-head"><h3 className="card-title">Informasi Pribadi</h3></div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Field label="NIK KARYAWAN" value={user.id}/>
            <Field label="STATUS" value="Aktif"/>
            <Field label="JENIS KELAMIN" value={user.gender}/>
            <Field label="TANGGAL LAHIR" value={user.dob}/>
            <Field label="PENDIDIKAN TERAKHIR" value={user.pendidikan}/>
            <Field label="NOMOR HP" value={user.phone}/>
            <Field label="EMAIL" value={user.email}/>
            <Field label="LOKASI KERJA" value={user.lokasi}/>
          </div>
        </div>

        {/* Info Jabatan */}
        <div className="card">
          <div className="card-head"><h3 className="card-title">Informasi Jabatan</h3></div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Field label="JABATAN" value={user.jabatan}/>
            <Field label="DEPARTEMEN" value={user.dept}/>
            <Field label="UNIT / ENTITAS" value={user.unit}/>
            <Field label="ATASAN LANGSUNG" value="Direktur SDM & Umum"/>
            <Field label="TANGGAL BERGABUNG" value={user.joined}/>
            <Field label="MASA KERJA" value="16 Tahun 9 Bulan"/>
            <Field label="GOLONGAN" value="IV-B"/>
            <Field label="GRADE" value="G-16"/>
          </div>
        </div>
      </div>

      {/* Riwayat Jabatan */}
      <div className="card" style={{ marginTop: 0, overflow: 'hidden' }}>
        <div className="card-head">
          <div>
            <h3 className="card-title">Riwayat Jabatan</h3>
            <p className="card-subtitle">Perjalanan karir di Pupuk Indonesia Group</p>
          </div>
        </div>
        <div style={{ padding: '8px 24px 24px' }}>
          {riwayat.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: i < riwayat.length - 1 ? 20 : 0, position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: i === 0 ? 'var(--primary)' : 'var(--border)', border: '2px solid', borderColor: i === 0 ? 'var(--primary)' : 'var(--border)', marginTop: 3 }}/>
                {i < riwayat.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--border-soft)', marginTop: 4 }}/>}
              </div>
              <div style={{ flex: 1, paddingBottom: 4 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.jabatan}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{r.unit} · {r.tahun}</div>
                <span className={`chip ${r.tipe === 'Promosi' ? 'green' : r.tipe === 'Rotasi' ? 'blue' : 'gray'}`} style={{ marginTop: 6, fontSize: 11 }}>{r.tipe}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// REKAP PAGE
// ─────────────────────────────────────────────
const RekapPage = () => {
  const statCards = [
    { label: 'Total Rekap Dibuat', value: '248', sub: 'Bulan Mei 2026', icon: 'download', color: 'green' },
    { label: 'Rekap Diunduh',      value: '189', sub: '76.2% dari total',   icon: 'users',    color: 'blue'  },
    { label: 'Rekap Terjadwal',    value: '12',  sub: '3 akan segera dikirm', icon: 'cal',   color: 'amber' },
    { label: 'Rekap Gagal',        value: '2',   sub: 'Perlu tindakan',    icon: 'info',     color: 'red'   },
  ];

  const rekapList = [
    { id: 'RKP-001', nama: 'Rekap Kehadiran Mei 2026',       tipe: 'Kehadiran',  unit: 'Semua Unit',          tgl: '10 Mei 2026', status: 'selesai',  format: 'XLSX' },
    { id: 'RKP-002', nama: 'Rekap Cuti & Izin April 2026',   tipe: 'Cuti',       unit: 'Semua Unit',          tgl: '01 Mei 2026', status: 'selesai',  format: 'PDF'  },
    { id: 'RKP-003', nama: 'Rekap Lembur Q1 2026',           tipe: 'Lembur',     unit: 'Petrokimia Gresik',   tgl: '05 Apr 2026', status: 'selesai',  format: 'XLSX' },
    { id: 'RKP-004', nama: 'Rekap Headcount Bulanan Apr',    tipe: 'Headcount',  unit: 'Semua Unit',          tgl: '01 Apr 2026', status: 'selesai',  format: 'PDF'  },
    { id: 'RKP-005', nama: 'Rekap Rekrutmen Batch 12',       tipe: 'Rekrutmen',  unit: 'Holding HQ',          tgl: '28 Mar 2026', status: 'proses',   format: 'XLSX' },
    { id: 'RKP-006', nama: 'Rekap Pelatihan K3 Bontang',     tipe: 'Pelatihan',  unit: 'Pupuk Kaltim',        tgl: '15 Mar 2026', status: 'gagal',    format: 'PDF'  },
    { id: 'RKP-007', nama: 'Rekap Turnover YTD 2026',        tipe: 'Turnover',   unit: 'Semua Unit',          tgl: '01 Mar 2026', status: 'selesai',  format: 'PDF'  },
  ];

  const statusMap = { selesai: { lbl: 'Selesai', cls: 'green' }, proses: { lbl: 'Diproses', cls: 'amber' }, gagal: { lbl: 'Gagal', cls: 'red' } };

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>Rekap</h1>
          <div className="crumbs">
            <span>Pupuk Indonesia</span><span className="sep"></span>
            <span className="now">Rekap</span>
          </div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Buat Rekap Baru</button>
      </div>

      <div className="grid-kpi">
        {statCards.map((s, i) => (
          <div className="card kpi" key={i}>
            <div className="kpi-head">
              <div className={`kpi-icon ${s.color}`}><Icon name={s.icon} size={26} strokeWidth={1.6}/></div>
            </div>
            <div className="kpi-label">{s.label}</div>
            <div className="kpi-value tnum">{s.value}</div>
            <div className="kpi-foot">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-head">
          <div>
            <h3 className="card-title">Daftar Rekap</h3>
            <p className="card-subtitle">Rekap yang pernah dibuat di sistem</p>
          </div>
          <button className="btn btn-secondary"><Icon name="download" size={14}/> Export Semua</button>
        </div>
        <div className="filterbar">
          <div className="filter-input">
            <Icon name="search" size={16}/>
            <input placeholder="Cari rekap…"/>
          </div>
          <button className="filter-select">Tipe: Semua <Icon name="chevd" size={14}/></button>
          <button className="filter-select">Unit: Semua <Icon name="chevd" size={14}/></button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Nama Rekap</th>
                <th>Tipe</th>
                <th>Unit</th>
                <th>Format</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rekapList.map(r => {
                const s = statusMap[r.status];
                return (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.nama}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.id}</div>
                    </td>
                    <td><span className="chip gray">{r.tipe}</span></td>
                    <td>{r.unit}</td>
                    <td><span className="chip blue">{r.format}</span></td>
                    <td className="muted tnum">{r.tgl}</td>
                    <td><span className={`chip ${s.cls}`}>{s.lbl}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="icon-btn" style={{ width: 32, height: 32 }} title="Unduh"><Icon name="download" size={15}/></button>
                        <button className="icon-btn" style={{ width: 32, height: 32 }} title="Lihat"><Icon name="eye" size={15}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PENCARIAN PAGE
// ─────────────────────────────────────────────
const PencarianPage = () => {
  const [query, setQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('all');

  const allResults = [
    ...EMPLOYEES.map(e => ({ type: 'karyawan', id: e.id, title: e.name, sub: `${e.jabatan} · ${e.unit}`, meta: e.lokasi, chip: 'Karyawan', chipCls: 'green' })),
    ...SURAT.map(s => ({ type: 'surat', id: s.id, title: s.judul, sub: `${s.no} · ${s.pembuat}`, meta: s.tanggal, chip: 'Surat', chipCls: 'blue' })),
    ...ARSIP_AKTIF.map(a => ({ type: 'arsip', id: a.id, title: a.judul, sub: `${a.kode} · ${a.unit}`, meta: a.tgl_masuk, chip: 'Arsip Aktif', chipCls: 'amber' })),
  ];

  const q = query.trim().toLowerCase();
  const filtered = q
    ? allResults.filter(r =>
        (activeFilter === 'all' || r.type === activeFilter) &&
        (r.title.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
      )
    : [];

  const filters = [
    { key: 'all',      lbl: 'Semua' },
    { key: 'karyawan', lbl: 'Karyawan' },
    { key: 'surat',    lbl: 'Surat'    },
    { key: 'arsip',    lbl: 'Arsip'    },
  ];

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>Pencarian</h1>
          <div className="crumbs">
            <span>Pupuk Indonesia</span><span className="sep"></span>
            <span className="now">Pencarian</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div className="filter-input" style={{ flex: 1, fontSize: 15 }}>
            <Icon name="search" size={18} color="var(--primary)"/>
            <input autoFocus placeholder="Cari karyawan, surat, arsip, atau dokumen…" value={query} onChange={e => setQuery(e.target.value)} style={{ fontSize: 15 }}/>
          </div>
          {query && <button className="btn btn-secondary" onClick={() => setQuery('')}><Icon name="x" size={14}/></button>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {filters.map(f => (
            <button key={f.key} onClick={() => setActiveFilter(f.key)}
              className={activeFilter === f.key ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ fontSize: 12, padding: '6px 14px' }}>
              {f.lbl}
            </button>
          ))}
        </div>
      </div>

      {query.length > 0 && (
        <div className="card" style={{ overflow: 'hidden', marginTop: 0 }}>
          <div className="card-head">
            <div>
              <h3 className="card-title">Hasil Pencarian</h3>
              <p className="card-subtitle">{filtered.length} hasil untuk "{query}"</p>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              Tidak ada hasil untuk "{query}"
            </div>
          ) : filtered.map((r, i) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.chipCls === 'green' ? 'var(--primary)' : r.chipCls === 'blue' ? '#0095D9' : '#FFAB00', flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{r.sub}</div>
              </div>
              <span className="muted tnum" style={{ fontSize: 12 }}>{r.meta}</span>
              <span className={`chip ${r.chipCls}`} style={{ fontSize: 11 }}>{r.chip}</span>
            </div>
          ))}
        </div>
      )}

      {!query && (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Cari di seluruh sistem</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Ketik nama karyawan, nomor surat, kode arsip, atau kata kunci lainnya</div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// MASTER DATA PAGES
// ─────────────────────────────────────────────
const MasterDataPage = ({ title, subtitle, crumb, columns, data: rows, onAdd }) => {
  const [search, setSearch] = React.useState('');
  const filtered = search
    ? rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())))
    : rows;

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>{title}</h1>
          <div className="crumbs">
            <span>Pupuk Indonesia</span><span className="sep"></span>
            <span>Master Data</span><span className="sep"></span>
            <span className="now">{crumb}</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={onAdd}><Icon name="plus" size={14}/> Tambah {crumb}</button>
      </div>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-head">
          <div>
            <h3 className="card-title">{title}</h3>
            <p className="card-subtitle">{subtitle}</p>
          </div>
          <button className="btn btn-secondary"><Icon name="download" size={14}/> Export</button>
        </div>
        <div className="filterbar">
          <div className="filter-input">
            <Icon name="search" size={16}/>
            <input placeholder={`Cari ${crumb.toLowerCase()}…`} value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                {columns.map(col => <th key={col.key} style={col.style}>{col.label}</th>)}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id || i}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  <td>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button className="icon-btn" style={{ width: 32, height: 32 }}><Icon name="eye" size={15}/></button>
                      <button className="icon-btn" style={{ width: 32, height: 32 }}><Icon name="dotsV" size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagi">
          <span>Menampilkan <b>{filtered.length}</b> dari {rows.length} data</span>
        </div>
      </div>
    </div>
  );
};

const MasterJenisSuratPage = () => (
  <MasterDataPage
    title="Jenis Surat" subtitle={`${MASTER_JENIS_SURAT.length} jenis surat terdaftar`} crumb="Jenis Surat"
    data={MASTER_JENIS_SURAT}
    columns={[
      { key: 'kode',  label: 'Kode',     style: { width: 80 } },
      { key: 'nama',  label: 'Nama Jenis Surat' },
      { key: 'deskripsi', label: 'Deskripsi' },
      { key: 'kategori',  label: 'Kategori', render: v => <span className="chip gray">{v}</span> },
      { key: 'aktif', label: 'Status', render: v => <span className={`chip ${v ? 'green' : 'gray'}`}>{v ? 'Aktif' : 'Nonaktif'}</span> },
    ]}
  />
);

const MasterTemplateSuratPage = () => (
  <MasterDataPage
    title="Template Surat" subtitle={`${MASTER_SURAT_TEMPLATE.length} template · flag mengatur alur Digital Sign & Stempel (Peruri)`} crumb="Template Surat"
    data={MASTER_SURAT_TEMPLATE}
    columns={[
      { key: 'nama', label: 'Nama Template', style: { minWidth: 220 } },
      { key: 'unit', label: 'Berlaku untuk unit' },
      { key: 'ttdDigital', label: 'Ttd Digital', render: (v) => <span className={`chip ${v ? 'blue' : 'gray'}`}>{v ? 'Aktif' : 'Tidak'}</span> },
      { key: 'stampDigital', label: 'Stamp Digital', render: (v) => <span className={`chip ${v ? 'blue' : 'gray'}`}>{v ? 'Aktif' : 'Tidak'}</span> },
      { key: 'tujuanInternal', label: 'Tujuan Internal', render: (v) => <span className={`chip ${v ? 'gray' : 'amber'}`}>{v ? 'Ya' : 'Eksternal'}</span> },
      { key: 'qrAllPage', label: 'QR All Page', render: (v) => <span className="chip gray">{v ? 'Ya' : 'Tidak'}</span> },
      { key: 'aktif', label: 'Status', render: (v) => <span className={`chip ${v ? 'green' : 'gray'}`}>{v ? 'Aktif' : 'Nonaktif'}</span> },
    ]}
  />
);

const MasterKlasifikasiPage = () => (
  <MasterDataPage
    title="Klasifikasi Surat" subtitle={`${MASTER_KLASIFIKASI.length} klasifikasi terdaftar`} crumb="Klasifikasi"
    data={MASTER_KLASIFIKASI}
    columns={[
      { key: 'kode',  label: 'Kode',  style: { width: 80 } },
      { key: 'nama',  label: 'Nama Klasifikasi' },
      { key: 'aktif', label: 'Status', render: v => <span className={`chip ${v ? 'green' : 'gray'}`}>{v ? 'Aktif' : 'Nonaktif'}</span> },
    ]}
  />
);

const MasterUnitPage = () => (
  <MasterDataPage
    title="Unit Kerja" subtitle={`${MASTER_UNIT.length} unit terdaftar`} crumb="Unit Kerja"
    data={MASTER_UNIT}
    columns={[
      { key: 'kode',   label: 'Kode',  style: { width: 90 } },
      { key: 'nama',   label: 'Nama Unit' },
      { key: 'tipe',   label: 'Tipe',  render: v => <span className={`chip ${v === 'Holding' ? 'blue' : 'gray'}`}>{v}</span> },
      { key: 'lokasi', label: 'Lokasi' },
      { key: 'aktif',  label: 'Status', render: v => <span className={`chip ${v ? 'green' : 'gray'}`}>{v ? 'Aktif' : 'Nonaktif'}</span> },
    ]}
  />
);

// ─────────────────────────────────────────────
// ARSIP PAGES
// ─────────────────────────────────────────────
const STATUS_ARSIP_AKTIF = {
  'tersedia':  { lbl: 'Tersedia',  cls: 'green' },
  'dipinjam':  { lbl: 'Dipinjam',  cls: 'amber' },
};
const STATUS_ARSIP_INAKTIF = {
  'aktif':          { lbl: 'Aktif',           cls: 'gray'  },
  'jadwal-musnah':  { lbl: 'Jadwal Musnah',   cls: 'red'   },
};

const ArsipTable = ({ rows, statusMap, extraCols }) => {
  const [search, setSearch] = React.useState('');
  const filtered = search ? rows.filter(r => r.judul.toLowerCase().includes(search.toLowerCase()) || r.kode.toLowerCase().includes(search.toLowerCase())) : rows;
  return (
    <>
      <div className="filterbar">
        <div className="filter-input">
          <Icon name="search" size={16}/>
          <input placeholder="Cari arsip…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <button className="filter-select">Unit: Semua <Icon name="chevd" size={14}/></button>
        <button className="filter-select">Jenis: Semua <Icon name="chevd" size={14}/></button>
        <div style={{ flex: 1 }}/>
        <button className="btn btn-ghost"><Icon name="download" size={16}/></button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 36 }}><input type="checkbox"/></th>
              <th>Judul Dokumen</th>
              <th>Unit</th>
              <th>Jenis</th>
              {extraCols.map(c => <th key={c.key}>{c.label}</th>)}
              <th>Retensi</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const s = statusMap[r.status] || { lbl: r.status, cls: 'gray' };
              return (
                <tr key={r.id}>
                  <td><input type="checkbox"/></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.judul}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.kode}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{r.unit}</td>
                  <td><span className="chip gray">{r.jenis}</span></td>
                  {extraCols.map(c => <td key={c.key} className="muted tnum">{r[c.key]}</td>)}
                  <td><span className={`chip ${r.retensi === 'Permanen' ? 'blue' : 'gray'}`}>{r.retensi}</span></td>
                  <td className="muted">{r.lokasi}</td>
                  <td><span className={`chip ${s.cls}`}>{s.lbl}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="icon-btn" style={{ width: 32, height: 32 }}><Icon name="eye" size={15}/></button>
                      <button className="icon-btn" style={{ width: 32, height: 32 }}><Icon name="dotsV" size={15}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagi">
        <span>Menampilkan <b>{filtered.length}</b> dari {rows.length} arsip</span>
      </div>
    </>
  );
};

const ArsipAktifPage = ({ subView }) => {
  const [tab, setTab] = React.useState(subView === 'arsip-a-pinjam' ? 'pinjam' : 'daftar');
  const dipinjam = ARSIP_AKTIF.filter(a => a.status === 'dipinjam');

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>Manajemen Arsip Aktif</h1>
          <div className="crumbs">
            <span>Pupuk Indonesia</span><span className="sep"></span>
            <span className="now">{tab === 'pinjam' ? 'Peminjaman' : 'Daftar Arsip'}</span>
          </div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Tambah Arsip</button>
      </div>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '0 24px', borderBottom: '1px solid var(--border-soft)', display: 'flex', gap: 32 }}>
          {[{key:'daftar',lbl:'Daftar Arsip',cnt:ARSIP_AKTIF.length},{key:'pinjam',lbl:'Peminjaman',cnt:dipinjam.length}].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '14px 0', borderBottom: tab === t.key ? '2px solid var(--text)' : '2px solid transparent',
              color: tab === t.key ? 'var(--text)' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {t.lbl} <span className={`chip ${tab===t.key?'solid':'gray'}`} style={{fontSize:11}}>{t.cnt}</span>
            </button>
          ))}
        </div>
        <ArsipTable
          rows={tab === 'pinjam' ? dipinjam : ARSIP_AKTIF}
          statusMap={STATUS_ARSIP_AKTIF}
          extraCols={[{ key: 'tgl_masuk', label: 'Tgl Masuk' }]}
        />
      </div>
    </div>
  );
};

const ArsipInaktifPage = ({ subView }) => {
  const [tab, setTab] = React.useState(subView === 'arsip-i-musnah' ? 'musnah' : 'daftar');
  const jadwalMusnah = ARSIP_INAKTIF.filter(a => a.status === 'jadwal-musnah');

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>Manajemen Arsip Inaktif</h1>
          <div className="crumbs">
            <span>Pupuk Indonesia</span><span className="sep"></span>
            <span className="now">{tab === 'musnah' ? 'Pemusnahan' : 'Daftar Arsip'}</span>
          </div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Tambah Arsip</button>
      </div>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '0 24px', borderBottom: '1px solid var(--border-soft)', display: 'flex', gap: 32 }}>
          {[{key:'daftar',lbl:'Daftar Arsip',cnt:ARSIP_INAKTIF.length},{key:'musnah',lbl:'Jadwal Pemusnahan',cnt:jadwalMusnah.length}].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '14px 0', borderBottom: tab === t.key ? '2px solid var(--text)' : '2px solid transparent',
              color: tab === t.key ? 'var(--text)' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {t.lbl} <span className={`chip ${tab===t.key?'solid':'gray'}`} style={{fontSize:11}}>{t.cnt}</span>
            </button>
          ))}
        </div>
        {tab === 'musnah' && (
          <div style={{ margin: '16px 24px 0', padding: '12px 16px', background: 'var(--error-bg)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: '#B71D18' }}>
            <Icon name="info" size={16} strokeWidth={2.2}/>
            <span><b>{jadwalMusnah.length} arsip</b> telah melewati masa retensi dan dijadwalkan untuk dimusnahkan. Konfirmasi diperlukan sebelum proses pemusnahan.</span>
          </div>
        )}
        <ArsipTable
          rows={tab === 'musnah' ? jadwalMusnah : ARSIP_INAKTIF}
          statusMap={STATUS_ARSIP_INAKTIF}
          extraCols={[{ key: 'tgl_pindah', label: 'Tgl Dipindahkan' }]}
        />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PERMISSION DOCUMENT PAGE
// ─────────────────────────────────────────────
const PermissionDocumentPage = () => {
  const perms = [
    { id: 'PRM-001', dokumen: 'Laporan Keuangan Konsolidasi 2025',     level: 'Rahasia',        akses: ['Direksi', 'VP Keuangan', 'Audit Internal'],   tgl: '01 Jan 2026', pemberi: 'CFO' },
    { id: 'PRM-002', dokumen: 'Data Karyawan — Gaji & Tunjangan',      level: 'Sangat Rahasia', akses: ['VP HC', 'HR Payroll', 'Direksi'],             tgl: '15 Jan 2026', pemberi: 'CHRO' },
    { id: 'PRM-003', dokumen: 'Strategi Ekspansi Bisnis 2026–2030',    level: 'Rahasia',        akses: ['Direksi', 'VP Strategi'],                     tgl: '10 Feb 2026', pemberi: 'CEO' },
    { id: 'PRM-004', dokumen: 'Laporan Audit Internal Q4 2025',        level: 'Terbatas',       akses: ['Direksi', 'Komite Audit', 'Internal Audit'],  tgl: '20 Feb 2026', pemberi: 'Direktur Audit' },
    { id: 'PRM-005', dokumen: 'Kontrak Supplier Bahan Baku Prioritas', level: 'Terbatas',       akses: ['VP Pengadaan', 'Direksi Operasional'],        tgl: '05 Mar 2026', pemberi: 'COO' },
  ];
  const levelCls = { 'Rahasia': 'amber', 'Sangat Rahasia': 'red', 'Terbatas': 'blue', 'Biasa': 'gray' };

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>Permission Document</h1>
          <div className="crumbs">
            <span>Pupuk Indonesia</span><span className="sep"></span>
            <span className="now">Permission Document</span>
          </div>
        </div>
        <button className="btn btn-primary"><Icon name="plus" size={14}/> Atur Permission Baru</button>
      </div>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-head">
          <div>
            <h3 className="card-title">Daftar Hak Akses Dokumen</h3>
            <p className="card-subtitle">{perms.length} dokumen dengan permission terdaftar</p>
          </div>
        </div>
        <div className="filterbar">
          <div className="filter-input"><Icon name="search" size={16}/><input placeholder="Cari dokumen…"/></div>
          <button className="filter-select">Level: Semua <Icon name="chevd" size={14}/></button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Nama Dokumen</th>
                <th>Level Kerahasiaan</th>
                <th>Pihak yang Diizinkan</th>
                <th>Tgl Ditetapkan</th>
                <th>Pemberi Izin</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {perms.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.dokumen}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.id}</div>
                  </td>
                  <td><span className={`chip ${levelCls[p.level] || 'gray'}`}>{p.level}</span></td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {p.akses.map(a => <span key={a} className="chip gray" style={{ fontSize: 11 }}>{a}</span>)}
                    </div>
                  </td>
                  <td className="muted tnum">{p.tgl}</td>
                  <td style={{ fontSize: 13 }}>{p.pemberi}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="icon-btn" style={{ width: 32, height: 32 }}><Icon name="eye" size={15}/></button>
                      <button className="icon-btn" style={{ width: 32, height: 32 }}><Icon name="dotsV" size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// REKAP ARSIP PAGE
// ─────────────────────────────────────────────
const RekapArsipPage = () => {
  const stats = [
    { label: 'Total Arsip Aktif',   value: ARSIP_AKTIF.length,   icon: 'book',   color: 'green' },
    { label: 'Total Arsip Inaktif', value: ARSIP_INAKTIF.length, icon: 'download', color: 'blue' },
    { label: 'Sedang Dipinjam',     value: ARSIP_AKTIF.filter(a=>a.status==='dipinjam').length, icon: 'users', color: 'amber' },
    { label: 'Jadwal Musnah',       value: ARSIP_INAKTIF.filter(a=>a.status==='jadwal-musnah').length, icon: 'info', color: 'red' },
  ];
  return (
    <div>
      <div className="page-title">
        <div>
          <h1>Rekap Arsip</h1>
          <div className="crumbs">
            <span>Pupuk Indonesia</span><span className="sep"></span>
            <span className="now">Rekap Arsip</span>
          </div>
        </div>
        <button className="btn btn-secondary"><Icon name="download" size={14}/> Export Rekap</button>
      </div>
      <div className="grid-kpi">
        {stats.map((s, i) => (
          <div className="card kpi" key={i}>
            <div className="kpi-head">
              <div className={`kpi-icon ${s.color}`}><Icon name={s.icon} size={26} strokeWidth={1.6}/></div>
            </div>
            <div className="kpi-label">{s.label}</div>
            <div className="kpi-value tnum">{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-head"><h3 className="card-title">Arsip Aktif per Unit</h3></div>
          <div className="card-body">
            {['Holding HQ', 'Petrokimia Gresik', 'Pupuk Kaltim', 'Pupuk Sriwidjaja', 'Pupuk Kujang', 'Pupuk Iskandar Muda'].map((u, i) => {
              const cnt = [2,1,1,1,0,1][i];
              const pct = Math.round(cnt / ARSIP_AKTIF.length * 100);
              return (
                <div className="demo-row" key={u}>
                  <div className="demo-head"><span className="l">{u}</span><span className="r">{cnt} arsip · {pct}%</span></div>
                  <div className="demo-bar"><div className="fill" style={{ width: `${pct * 2}%` }}></div></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-head"><h3 className="card-title">Arsip per Jenis Dokumen</h3></div>
          <div className="card-body">
            {[
              { jenis: 'Kontrak',         cnt: 2 },
              { jenis: 'Laporan',         cnt: 3 },
              { jenis: 'Notulensi',       cnt: 2 },
              { jenis: 'Pengadaan',       cnt: 2 },
              { jenis: 'Berkas Rekrutmen',cnt: 1 },
              { jenis: 'Laporan Audit',   cnt: 1 },
            ].map((j, i) => {
              const total = 11;
              const pct = Math.round(j.cnt / total * 100);
              return (
                <div className="demo-row" key={j.jenis}>
                  <div className="demo-head"><span className="l">{j.jenis}</span><span className="r">{j.cnt} dok · {pct}%</span></div>
                  <div className="demo-bar"><div className="fill" style={{ width: `${pct * 2.5}%` }}></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { POV_OPTIONS, Sidebar, Topbar, KpiCard, WelcomeBanner, ApprovalRow, UpcomingRow, EmployeeTable, SuratTable, SuratDetailModal, SuratAdvFilterModal, BuatSuratBaru, PovSwitcher, ReviewerPage, ApproverPage, AdminRoutePage, DrafterDashboard, OperasiDashboard });