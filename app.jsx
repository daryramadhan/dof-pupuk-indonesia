// app.jsx — Pupuk Indonesia HR Dashboard main shell

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "green",
  "density": "comfortable"
}/*EDITMODE-END*/;

const PALETTES = {
  green:   { primary: '#00753E', dark: '#00502B', light: '#5BB587', p50: '#EBF6F0', p100: '#D4ECDF', p200: '#A8D9BF' },
  blue:    { primary: '#0E7AC0', dark: '#0A5A8E', light: '#5BAAD9', p50: '#E8F2FA', p100: '#CFE5F5', p200: '#A5CCEC' },
  neutral: { primary: '#1C252E', dark: '#000000', light: '#637381', p50: '#F4F6F8', p100: '#E4E7EB', p200: '#C4CDD5' },
  amber:   { primary: '#B76E00', dark: '#7A4F00', light: '#FFAB00', p50: '#FFF7E6', p100: '#FFEACC', p200: '#FFD49A' },
};

function applyPalette(name) {
  const p = PALETTES[name] || PALETTES.green;
  const r = document.documentElement.style;
  r.setProperty('--primary', p.primary);
  r.setProperty('--primary-dark', p.dark);
  r.setProperty('--primary-light', p.light);
  r.setProperty('--primary-50', p.p50);
  r.setProperty('--primary-100', p.p100);
  r.setProperty('--primary-200', p.p200);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeView, setActiveView] = React.useState('dashboard');
  const [suratList, setSuratList] = React.useState(SURAT);
  const [openedSurat, setOpenedSurat] = React.useState(null);
  const [flash, setFlash] = React.useState(null);
  const [povUserId, setPovUserId] = React.useState(POV_OPTIONS[0]?.id || CURRENT_USER_ID);
  const [detailContext, setDetailContext] = React.useState(null); // null | 'reviewer'
  const [notifList, setNotifList] = React.useState(NOTIFIKASI);
  const [inboxList, setInboxList] = React.useState(INBOX);
  const [suratFormSeed, setSuratFormSeed] = React.useState(null);
  const prevActiveViewRef = React.useRef(activeView);
  const [detailSidebarExpanded, setDetailSidebarExpanded] = React.useState(false);
  const [navUserMinimized, setNavUserMinimized] = React.useState(() => {
    try {
      return sessionStorage.getItem('dof-nav-minimized') === '1';
    } catch (_) {
      return false;
    }
  });

  const persistNavMinimized = React.useCallback((v) => {
    setNavUserMinimized(v);
    try {
      sessionStorage.setItem('dof-nav-minimized', v ? '1' : '0');
    } catch (_) { /* ignore */ }
  }, []);

  React.useEffect(() => {
    if (activeView === 'detail-surat' && prevActiveViewRef.current !== 'detail-surat') {
      setDetailSidebarExpanded(false);
    }
    prevActiveViewRef.current = activeView;
  }, [activeView]);

  React.useEffect(() => { applyPalette(t.palette); }, [t.palette]);

  const capBadge = (n) => {
    if (n == null || n <= 0) return null;
    return n > 99 ? '99+' : n;
  };

  const povMeta = POV_OPTIONS.find((p) => p.id === povUserId) || POV_OPTIONS[0];
  const navRole = mapPovTypeToNavRole(povMeta.type);
  const navTree = getNavTreeForRole(navRole);

  const unreadNotifCount = notifList.filter((n) => n.unread).length;
  const unreadInboxCount = inboxList.filter((m) => m.unread).length;
  const stempelQueueCount = suratList.filter((s) =>
    ['menunggu-stempel', 'diproses-peruri-stempel', 'gagal-peruri'].includes(s.status)
  ).length;

  const terminalSurat = ['disetujui', 'terkirim', 'dibatalkan', 'ditolak'];
  const actionableManajemenIds = new Set();
  if (povMeta.type === 'drafter' || povMeta.type === 'reviewer' || povMeta.type === 'approver') {
    suratList.forEach((s) => {
      if (s.pembuatId === povUserId && !terminalSurat.includes(s.status)) actionableManajemenIds.add(s.id);
    });
  }
  if (povMeta.type === 'reviewer') {
    suratList.forEach((s) => {
      if (
        s.status === 'menunggu-review' &&
        (s.reviewers || []).some((r) => r.id === povUserId && r.reviewStatus === 'pending')
      ) {
        actionableManajemenIds.add(s.id);
      }
    });
  }
  if (povMeta.type === 'approver') {
    suratList.forEach((s) => {
      if (
        s.status === 'menunggu-approval' &&
        (s.approvers || []).some((a) => a.id === povUserId && (!a.approveStatus || a.approveStatus === 'pending'))
      ) {
        actionableManajemenIds.add(s.id);
      }
    });
  }

  const liveBadgeCounts = {
    inbox: capBadge(unreadInboxCount),
    'manajemen-action':
      (povMeta.type === 'drafter' || povMeta.type === 'reviewer' || povMeta.type === 'approver') &&
      actionableManajemenIds.size > 0
        ? capBadge(actionableManajemenIds.size)
        : null,
    'stempel-queue':
      povMeta.type === 'admin-stempel' && stempelQueueCount > 0 ? capBadge(stempelQueueCount) : null,
  };

  const NAV_VIEW_KEYS_ALWAYS = React.useMemo(
    () =>
      new Set([
        'dashboard',
        'detail-surat',
        'buat-surat-baru',
        'notif',
        'profil-saya',
        'profil-jabatan',
      ]),
    []
  );

  React.useEffect(() => {
    const meta = POV_OPTIONS.find((p) => p.id === povUserId) || POV_OPTIONS[0];
    const role = mapPovTypeToNavRole(meta.type);
    const allowed = getNavViewKeysForRole(role);
    if (NAV_VIEW_KEYS_ALWAYS.has(activeView)) return;
    if (!allowed.has(activeView)) setActiveView('dashboard');
  }, [povUserId, activeView, NAV_VIEW_KEYS_ALWAYS]);

  const shellNavigate = React.useCallback((viewKey) => {
    if (viewKey !== 'detail-surat') {
      setOpenedSurat(null);
      setDetailContext(null);
    }
    setActiveView(viewKey);
  }, []);

  React.useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 6000);
    return () => clearTimeout(t);
  }, [flash]);

  const handleSubmitSurat = (newSurat) => {
    const pov = POV_OPTIONS.find(p => p.id === povUserId);
    const tagged = {
      ...newSurat,
      pembuatId: newSurat.pembuatId || povUserId,
      pembuat: pov?.name || newSurat.pembuat,
    };
    const existedBefore = suratList.some((s) => s.id === newSurat.id);
    setSuratList((prev) => {
      const exists = prev.some((s) => s.id === newSurat.id);
      if (exists) return prev.map((s) => (s.id === newSurat.id ? { ...s, ...tagged } : s));
      return [tagged, ...prev];
    });
    setSuratFormSeed(null);
    setActiveView('manajemen-surat');

    if (existedBefore) {
      setFlash({
        tone: newSurat.status === 'menunggu-review' ? 'success' : 'info',
        title: newSurat.status === 'menunggu-review' ? 'Surat dikirim ke reviewer' : 'Surat diperbarui',
        msg:
          newSurat.status === 'menunggu-review'
            ? `Surat "${newSurat.judul}" telah dikirim ulang ke alur review.`
            : `Perubahan pada "${newSurat.judul}" telah disimpan.`,
      });
      return;
    }

    if (newSurat.status === 'menunggu-review') {
      const newNotif = {
        id: `N-${Date.now()}`,
        type: 'info',
        icon: 'check',
        title: 'Surat Dikirim ke Reviewer',
        msg: `Surat "${newSurat.judul}" telah dikirim ke reviewer dan sedang menunggu review.`,
        time: 'Baru saja',
        unread: true,
      };
      setNotifList((prev) => [newNotif, ...prev]);

      const reviewerPersons = (newSurat.reviewers || []).filter(Boolean);
      if (reviewerPersons.length > 0) {
        const newInboxItems = reviewerPersons.map((r, i) => ({
          id: `MSG-NEW-${Date.now()}-${i}`,
          from: tagged.pembuat,
          fromRole: pov?.role || 'Drafter',
          fromUnit: 'Holding HQ',
          init: tagged.init || '??',
          av: null,
          subject: `Review: ${newSurat.judul}`,
          preview: `Mohon dilakukan review atas surat berikut yang ditugaskan kepada Anda.`,
          date: newSurat.tanggal,
          time: 'Baru saja',
          unread: true,
          type: 'review',
          ref: newSurat.id,
        }));
        setInboxList((prev) => [...newInboxItems, ...prev]);
      }

      setFlash({
        tone: 'success',
        title: 'Surat berhasil disubmit',
        msg: `Surat "${newSurat.judul}" telah dikirim ke reviewer dengan status Menunggu Review.`,
      });
      return;
    }

    setFlash({
      tone: 'info',
      title: 'Draft disimpan',
      msg: `Draft "${newSurat.judul}" tersimpan. Anda dapat melanjutkan pengisian kapan saja.`,
    });
  };

  const handleReviewerAction = (id, action) => {
    setSuratList((prev) => prev.map((s) => {
      if (s.id !== id) return s;
      if (action === 'approve') {
        const updatedReviewers = (s.reviewers || []).map(r =>
          r.id === povUserId ? { ...r, reviewStatus: 'approved' } : r
        );
        const allApproved = updatedReviewers.every(r => r.reviewStatus === 'approved');
        return { ...s, reviewers: updatedReviewers, status: allApproved ? 'menunggu-approval' : 'menunggu-review' };
      }
      if (action === 'return-drafter') {
        const updatedReviewers = (s.reviewers || []).map(r =>
          r.id === povUserId ? { ...r, reviewStatus: 'returned' } : r
        );
        return { ...s, reviewers: updatedReviewers, status: 'draft' };
      }
      if (action === 'cancel') {
        const updatedReviewers = (s.reviewers || []).map(r =>
          r.id === povUserId ? { ...r, reviewStatus: 'cancelled' } : r
        );
        return { ...s, reviewers: updatedReviewers, status: 'dibatalkan' };
      }
      return s;
    }));
  };

  const handleApproverAction = (id, action) => {
    setSuratList((prev) => prev.map((s) => {
      if (s.id !== id) return s;
      if (action === 'finalize') {
        const approvers = (s.approvers || []).map((a) =>
          a.id === povUserId ? { ...a, approveStatus: 'approved' } : a
        );
        return { ...s, status: 'disetujui', approvers };
      }
      if (action === 'return') {
        const approvers = (s.approvers || []).map((a) =>
          a.id === povUserId ? { ...a, approveStatus: 'returned' } : a
        );
        return { ...s, status: 'menunggu-review', approvers };
      }
      if (action === 'cancel') {
        const approvers = (s.approvers || []).map((a) =>
          a.id === povUserId ? { ...a, approveStatus: 'cancelled' } : a
        );
        return { ...s, status: 'dibatalkan', approvers };
      }
      return s;
    }));
  };

  React.useEffect(() => {
    if (activeView === 'detail-surat' && !openedSurat) setActiveView('manajemen-surat');
  }, [activeView, openedSurat]);

  const trendData = HEADCOUNT_TREND.map(d => d.v);

  const renderContent = () => {
    if (activeView === 'detail-surat' && openedSurat) {
      const isReviewerCtx = detailContext === 'reviewer';
      const isApproverCtx = detailContext === 'approver';
      const role =
        detailContext === 'reviewer' ? 'reviewer' :
        detailContext === 'approver' ? 'approver' :
        detailContext === 'admin-stempel' ? 'admin-stempel' :
        'drafter';
      const handleBackFromDetail = () => {
        setOpenedSurat(null);
        setDetailContext(null);
        setActiveView('manajemen-surat');
      };
      // Map generic actions from DetailSurat to app.jsx state handlers
      const handleDetailAction = (type, note) => {
        if (isReviewerCtx) {
          if (type === 'approve_reviewer') handleReviewerAction(openedSurat.id, 'approve');
          else if (type === 'return') handleReviewerAction(openedSurat.id, 'return-drafter');
          else if (type === 'cancel') handleReviewerAction(openedSurat.id, 'cancel');
        } else if (isApproverCtx) {
          if (type === 'approve_approver') handleApproverAction(openedSurat.id, 'finalize');
          else if (type === 'return') handleApproverAction(openedSurat.id, 'return');
          else if (type === 'cancel') handleApproverAction(openedSurat.id, 'cancel');
        } else if (role === 'tujuan') {
           // handled internally by InboxPage TL history for now
        }
        handleBackFromDetail();
      };

      const handleSuratPatch = (id, patch) => {
        setSuratList((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
        setOpenedSurat((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
        if (patch.status === 'terkirim') {
          setFlash({
            tone: 'success',
            title: 'Surat terkirim',
            msg: 'Proses stempel digital selesai. Surat mengikuti jalur pengiriman ke tujuan.',
          });
        }
      };

      return (
        <DetailSurat
          surat={openedSurat}
          role={role}
          onBack={handleBackFromDetail}
          onAction={handleDetailAction}
          onSuratPatch={handleSuratPatch}
        />
      );
    }
    if (activeView === 'buat-surat-baru') {
      const pov = POV_OPTIONS.find(p => p.id === povUserId);
      return (
        <BuatSuratBaru
          key={suratFormSeed?.id || 'surat-baru'}
          surat={suratFormSeed}
          onBack={() => { setSuratFormSeed(null); setActiveView('manajemen-surat'); }}
          onSubmit={handleSubmitSurat}
          pembuatName={pov?.name}
        />
      );
    }
    if (activeView === 'buat-sp') {
      return (
        <AdminRoutePage
          crumbMid="Penciptaan Surat"
          title="Buat SP/ASP"
          subtitle="Form dan alur Surat Perintah / ASP mengikuti kebijakan unit Anda. Ini placeholder demo agar item sidebar PRD v2 tetap dapat dibuka."
        />
      );
    }
    if (activeView === 'manajemen-surat') {
      const povMeta = POV_OPTIONS.find(p => p.id === povUserId);
      const isDrafter = povMeta?.type === 'drafter';
      const isReviewer = povMeta?.type === 'reviewer';
      const isApprover = povMeta?.type === 'approver';
      const isAdminStempel = povMeta?.type === 'admin-stempel';
      const visibleSurat = isAdminStempel
        ? suratList.filter((s) => ['menunggu-stempel', 'diproses-peruri-stempel', 'gagal-peruri'].includes(s.status))
        : isDrafter
          ? suratList.filter((s) => s.pembuatId === povUserId)
          : isReviewer
            ? suratList.filter((s) => {
                const perluReview =
                  s.status === 'menunggu-review' &&
                  (s.reviewers || []).some((r) => r.id === povUserId && r.reviewStatus === 'pending');
                const buatanSaya = s.pembuatId === povUserId;
                return perluReview || buatanSaya;
              })
            : isApprover
              ? suratList.filter((s) => {
                  const perluApproval =
                    s.status === 'menunggu-approval' &&
                    (s.approvers || []).some(
                      (a) => a.id === povUserId && (!a.approveStatus || a.approveStatus === 'pending')
                    );
                  const buatanSaya = s.pembuatId === povUserId;
                  return perluApproval || buatanSaya;
                })
              : suratList;
      return (
        <>
          <div className="page-title">
            <div style={{ minWidth: 0 }}>
              <h1>Manajemen Surat</h1>
              {isDrafter && (
                <p className="page-title-sub">
                  Kelola surat yang Anda buat, revisi, atau sedang dalam proses. Draft, menunggu review/approval, dan status lain dipilah lewat tab di bawah (PRD navigasi v2).
                </p>
              )}
              {(isReviewer || isApprover) && (
                <p className="page-title-sub">
                  {isReviewer
                    ? 'Antrian review Anda dan surat yang Anda buat sebagai drafter digabung di sini. Gunakan tab status — khususnya «Menunggu Persetujuan» — untuk memilah surat yang perlu review.'
                    : 'Antrian approval Anda dan surat yang Anda buat sebagai drafter digabung di sini. Gunakan tab status — khususnya «Menunggu Persetujuan» — untuk memilah surat yang perlu keputusan.'}
                </p>
              )}
              <div className="crumbs">
                <span>Pupuk Indonesia</span>
                <span className="sep"></span>
                <span>Penciptaan Surat</span>
                <span className="sep"></span>
                <span className="now">Manajemen Surat</span>
              </div>
            </div>
            {isDrafter && (
              <div className="page-title-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => window.alert('Export daftar surat (demo prototipe).')}
                >
                  <Icon name="download" size={16} /> Export
                </button>
                <button type="button" className="btn btn-primary" onClick={() => { setSuratFormSeed(null); setActiveView('buat-surat-baru'); }}>
                  <Icon name="plus" size={16} /> Buat Surat Baru
                </button>
              </div>
            )}
          </div>
          {isDrafter && (
            <div style={{ padding: '12px 16px', background: '#F3EDFF', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: '#3F1E8F' }}>
              <Icon name="info" size={16} strokeWidth={2} color="#7635DC" style={{ flexShrink: 0, marginTop: 1 }}/>
              <span>Sebagai <b>Drafter</b>, Anda hanya melihat surat yang Anda buat sendiri. Klik <b>Buat Surat Baru</b> untuk membuat surat baru, atau buka surat dari daftar untuk melihat detail dan melanjutkan draft. Pilih template <b>Digital Sign &amp; Stempel</b> untuk alur Peruri (OTP Approver + Admin Stempel).</span>
            </div>
          )}
          {isReviewer && (
            <div style={{ padding: '12px 16px', background: 'var(--warning-bg)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: '#7A4F00' }}>
              <Icon name="info" size={16} strokeWidth={2} color="#B76E00" style={{ flexShrink: 0, marginTop: 1 }}/>
              <span>Sebagai <b>Reviewer</b>, tugas review tidak lagi di menu sidebar terpisah: buka surat berstatus menunggu review dari daftar ini (tab <b>Menunggu Persetujuan</b> menampilkan proses review &amp; approval).</span>
            </div>
          )}
          {isApprover && (
            <div style={{ padding: '12px 16px', background: 'var(--info-bg)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: '#004B6B' }}>
              <Icon name="info" size={16} strokeWidth={2} color="#006C9C" style={{ flexShrink: 0, marginTop: 1 }}/>
              <span>Sebagai <b>Approver</b>, antrian approval ada di halaman ini bersama surat yang Anda buat. Tab <b>Menunggu Persetujuan</b> membantu menemukan surat yang menunggu keputusan Anda.</span>
            </div>
          )}
          {isAdminStempel && (
            <div style={{ padding: '12px 16px', background: '#F4F6F8', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-secondary)', border: '1px dashed var(--border)' }}>
              <Icon name="shield" size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1, color: 'var(--text)' }}/>
              <span>Sebagai <b>Admin Stempel</b> (BPO), Anda memproses stempel digital setelah TTD Peruri selesai. Tanpa OTP — gunakan <b>Verifikasi Stempel Digital</b> pada detail surat (PRD Digital Sign &amp; Stempel).</span>
            </div>
          )}
          {flash && (
            <div className={`flash flash-${flash.tone}`}>
              <span className="flash-ic"><Icon name={flash.tone === 'success' ? 'check' : 'info'} size={16} strokeWidth={2.4}/></span>
              <div className="flash-body">
                <div className="flash-title">{flash.title}</div>
                <div className="flash-msg">{flash.msg}</div>
              </div>
              <button className="flash-x" onClick={() => setFlash(null)} title="Tutup"><Icon name="x" size={14}/></button>
            </div>
          )}
          <SuratTable
            povType={povMeta?.type}
            onOpenBuatSurat={(seed) => { setSuratFormSeed(seed); setActiveView('buat-surat-baru'); }}
            suratList={visibleSurat}
            onOpenLetter={(s) => {
              setOpenedSurat(s);
              if (isAdminStempel) {
                setDetailContext('admin-stempel');
              } else {
                const isPendingReviewer = s.status === 'menunggu-review' &&
                  (s.reviewers || []).some(r => r.id === povUserId && r.reviewStatus === 'pending');
                const isPendingApprover = s.status === 'menunggu-approval' &&
                  (s.approvers || []).some(a => a.id === povUserId);
                setDetailContext(isPendingReviewer ? 'reviewer' : isPendingApprover ? 'approver' : null);
              }
              setActiveView('detail-surat');
            }}
          />
        </>
      );
    }
    if (activeView === 'admin-user-mgmt') {
      return (
        <AdminRoutePage
          title="User Management"
          subtitle="Pengelolaan pengguna, peran, dan izin akses. Halaman ini adalah placeholder demo untuk PRD navigasi v2 — integrasi backend mengikuti kebijakan keamanan Anda."
        />
      );
    }
    if (activeView === 'admin-meterai') {
      return (
        <AdminRoutePage
          title="Setting Meterai"
          subtitle="Konfigurasi kuota, akun, dan parameter meterai digital. Placeholder demo (PRD §11)."
        />
      );
    }
    if (activeView === 'admin-emeterai') {
      return (
        <AdminRoutePage
          title="E-Meterai"
          subtitle="Operasi pembubuhan e-meterai pada dokumen. Placeholder demo (PRD §11)."
        />
      );
    }
    if (activeView === 'admin-migrasi') {
      return (
        <AdminRoutePage
          title="Migrasi"
          subtitle="Alur migrasi data surat/dokumen antar sistem. Placeholder demo."
        />
      );
    }
    if (activeView === 'admin-reg-masuk') {
      return (
        <AdminRoutePage
          title="Reg Surat Masuk"
          subtitle="Registrasi dan routing surat masuk. Placeholder demo."
        />
      );
    }
    if (activeView === 'inbox')           return <InboxPage inboxList={inboxList} setInboxList={setInboxList}/>;
    if (activeView === 'notif')           return <NotifikasiPage/>;
    if (activeView === 'profil-saya')     return <ProfilSayaPage/>;
    if (activeView === 'profil-jabatan')  return <ProfilSayaPage/>;
    if (activeView === 'rekap')           return <RekapPage/>;
    if (activeView === 'pencarian')       return <PencarianPage/>;
    if (activeView === 'master-jenis')    return <MasterJenisSuratPage/>;
    if (activeView === 'master-template') return <MasterTemplateSuratPage/>;
    if (activeView === 'master-klasif')   return <MasterKlasifikasiPage/>;
    if (activeView === 'master-unit')     return <MasterUnitPage/>;
    if (activeView === 'arsip-a-list' || activeView === 'arsip-a-pinjam')   return <ArsipAktifPage subView={activeView}/>;
    if (activeView === 'arsip-i-list' || activeView === 'arsip-i-musnah')   return <ArsipInaktifPage subView={activeView}/>;
    if (activeView === 'permission')      return <PermissionDocumentPage/>;
    if (activeView === 'rekap-arsip')     return <RekapArsipPage/>;
    // default: dashboard view
    const pov = POV_OPTIONS.find(p => p.id === povUserId) || POV_OPTIONS[0];
    const openSuratFromDashboard = (s) => {
      const meta = POV_OPTIONS.find((p) => p.id === povUserId);
      if (meta?.type === 'admin-stempel') {
        setOpenedSurat(s);
        setDetailContext('admin-stempel');
        setActiveView('detail-surat');
        return;
      }
      const isPendingReviewer =
        s.status === 'menunggu-review' &&
        (s.reviewers || []).some((r) => r.id === povUserId && r.reviewStatus === 'pending');
      const isPendingApprover =
        s.status === 'menunggu-approval' &&
        (s.approvers || []).some((a) => a.id === povUserId && (!a.approveStatus || a.approveStatus === 'pending'));
      setOpenedSurat(s);
      setDetailContext(isPendingReviewer ? 'reviewer' : isPendingApprover ? 'approver' : null);
      setActiveView('detail-surat');
    };

    if (['drafter', 'reviewer', 'approver', 'tujuan', 'admin', 'admin-stempel'].includes(pov.type)) {
      return (
        <OperasiDashboard
          povType={pov.type}
          povUserId={povUserId}
          povName={pov.name}
          povRoleLine={pov.role}
          suratList={suratList}
          inboxList={inboxList}
          inboxUnread={unreadInboxCount}
          onOpenBuatSurat={(seed) => { setSuratFormSeed(seed); setActiveView('buat-surat-baru'); }}
          onOpenManajemen={() => setActiveView('manajemen-surat')}
          onOpenInbox={() => setActiveView('inbox')}
          onNav={shellNavigate}
          onPantauSurat={openSuratFromDashboard}
        />
      );
    }
    return (
      <>
        <div className="page-title">
          <div>
            <h1>Dashboard HR & SDM</h1>
            <div className="crumbs">
              <span>Pupuk Indonesia</span>
              <span className="sep"></span>
              <span>HR & SDM</span>
              <span className="sep"></span>
              <span className="now">Dashboard</span>
            </div>
          </div>
        </div>

        <WelcomeBanner/>

          {/* KPI Row */}
          <div className="grid-kpi">
            <KpiCard
              icon="users" iconColor="green"
              label="Total Karyawan"
              value={HC_DISPLAY.toLocaleString('id-ID')}
              trend="+5.2%" trendDir="up"
              foot="vs 12,204 bulan lalu"
              sparkData={trendData}
              sparkColor="var(--primary)"
            />
            <KpiCard
              icon="check" iconColor="blue"
              label="Hadir Hari Ini"
              value="11,203"
              trend="87.2%" trendDir="up"
              foot="1,644 cuti / izin / WFH"
              sparkData={[82,85,88,84,87,89,87,88,87,89,86,87]}
              sparkColor="#0095D9"
            />
            <KpiCard
              icon="cal" iconColor="amber"
              label="Cuti Aktif"
              value="248"
              trend="−12.4%" trendDir="down"
              foot="12 menunggu approval"
              sparkData={[280,295,310,302,275,260,248,255,260,250,252,248]}
              sparkColor="#FFAB00"
            />
            <KpiCard
              icon="briefc" iconColor="red"
              label="Lowongan Aktif"
              value="34"
              trend="+8 baru" trendDir="up"
              foot="142 kandidat dalam proses"
              sparkData={[18,22,24,28,26,30,32,29,31,33,35,34]}
              sparkColor="#FF5630"
            />
          </div>

          {/* Headcount trend + Donut */}
          <div className="grid-2-1">
            <div className="card">
              <div className="card-head">
                <div>
                  <h3 className="card-title">Tren Headcount</h3>
                  <p className="card-subtitle">Total karyawan aktif · 12 bulan terakhir</p>
                </div>
                <div className="pills">
                  <button>30 hari</button>
                  <button>6 bulan</button>
                  <button className="on">12 bulan</button>
                  <button>YTD</button>
                </div>
              </div>
              <div className="card-body" style={{ paddingBottom: 8 }}>
                <AreaChart data={HEADCOUNT_TREND} height={260}/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px dashed var(--border)' }}>
                <div style={{ padding: '20px 24px', borderRight: '1px dashed var(--border)' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tambah Bersih</div>
                  <div style={{ fontFamily: 'Barlow', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }} className="tnum">+667</div>
                  <div style={{ fontSize: 11, color: '#118D57', fontWeight: 700 }}>+5.5% YoY</div>
                </div>
                <div style={{ padding: '20px 24px', borderRight: '1px dashed var(--border)' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Rekrut Baru</div>
                  <div style={{ fontFamily: 'Barlow', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }} className="tnum">582</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>~48 / bulan</div>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Turnover Rate</div>
                  <div style={{ fontFamily: 'Barlow', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }} className="tnum">3.8%</div>
                  <div style={{ fontSize: 11, color: '#118D57', fontWeight: 700 }}>−0.4 pts</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <div>
                  <h3 className="card-title">Distribusi per Anak Perusahaan</h3>
                  <p className="card-subtitle">Sebaran headcount</p>
                </div>
                <button className="icon-btn"><Icon name="dotsV" size={18}/></button>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                  <Donut data={ANAK_PERUSAHAAN}/>
                </div>
                <div className="legend">
                  {ANAK_PERUSAHAAN.map(a => {
                    const pct = (a.headcount / TOTAL_HEADCOUNT * 100).toFixed(1);
                    return (
                      <div className="legend-row" key={a.id}>
                        <span className="swatch" style={{ background: a.color }}></span>
                        <span className="lbl">{a.name}</span>
                        <span className="pct">{pct}%</span>
                        <span className="cnt">{a.headcount.toLocaleString('id-ID')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 3-col row: Hire/Exit · Demografi · Pending Approvals */}
          <div className="grid-3">
            <div className="card">
              <div className="card-head">
                <div>
                  <h3 className="card-title">Rekrut vs Resign</h3>
                  <p className="card-subtitle">6 bulan terakhir</p>
                </div>
              </div>
              <div className="card-body" style={{ paddingBottom: 12 }}>
                <HireExitChart data={HIRE_EXIT}/>
              </div>
              <div style={{ display: 'flex', gap: 16, padding: '12px 24px 20px', fontSize: 12 }}>
                <div className="flex"><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--primary)' }}></span> <span>Rekrut <b className="tnum">582</b></span></div>
                <div className="flex"><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--text-disabled)', opacity: 0.55 }}></span> <span>Resign <b className="tnum">224</b></span></div>
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <div>
                  <h3 className="card-title">Demografi Usia</h3>
                  <p className="card-subtitle">Distribusi karyawan aktif</p>
                </div>
              </div>
              <div className="card-body">
                <div className="demo">
                  {DEMOGRAFI_USIA.map((d, i) => (
                    <div className="demo-row" key={i}>
                      <div className="demo-head">
                        <span className="l">{d.lbl}</span>
                        <span className="r">{d.count.toLocaleString('id-ID')} · {d.pct}%</span>
                      </div>
                      <div className="demo-bar"><div className="fill" style={{ width: `${d.pct * 2.5}%` }}></div></div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--primary-50)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, color: 'var(--primary-dark)' }}><Icon name="info" size={16}/></div>
                  <div style={{ fontSize: 12, color: 'var(--primary-dark)', lineHeight: 1.5 }}>
                    Rata-rata usia <b className="tnum">37.4 tahun</b>. 46% karyawan dalam kelompok usia produktif (25-44).
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-head">
                <div>
                  <h3 className="card-title">Approval Tertunda</h3>
                  <p className="card-subtitle">{PENDING_APPROVALS.length} pengajuan menunggu</p>
                </div>
                <button className="btn btn-ghost" style={{ fontSize: 12 }}>Lihat Semua <Icon name="chevr" size={14}/></button>
              </div>
              <div>
                {PENDING_APPROVALS.map(a => <ApprovalRow key={a.id} a={a}/>)}
              </div>
            </div>
          </div>

          {/* Upcoming events full width */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-head">
              <div>
                <h3 className="card-title">Agenda Mendatang</h3>
                <p className="card-subtitle">Ulang tahun, anniversary, acara, dan pelatihan minggu ini</p>
              </div>
              <div className="pills">
                <button className="on">Semua</button>
                <button>Ultah</button>
                <button>Acara</button>
                <button>Pelatihan</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {UPCOMING.map((u, i) => (
                <div key={u.id} style={{ borderRight: i % 2 === 0 ? '1px dashed var(--border)' : 'none' }}>
                  <UpcomingRow u={u}/>
                </div>
              ))}
              <div style={{ borderTop: '1px dashed var(--border)', padding: '14px 24px', gridColumn: 'span 2', display: 'flex', justifyContent: 'center' }}>
                <button className="btn btn-ghost" style={{ fontSize: 13 }}>Lihat kalender lengkap <Icon name="ext" size={14}/></button>
              </div>
            </div>
          </div>

          {/* Employee table */}
          <EmployeeTable/>
      </>
    );
  };

  const isFocusMode = activeView === 'buat-surat-baru';
  const detailRailMode = activeView === 'detail-surat' && !detailSidebarExpanded;
  const sidebarCollapsed =
    (activeView === 'detail-surat' && !detailSidebarExpanded) ||
    (activeView !== 'detail-surat' && navUserMinimized);

  return (
    <div className={`app ${isFocusMode ? 'focus-mode' : ''}${!isFocusMode && sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      {!isFocusMode && (
        <Sidebar
          navTree={navTree}
          activeView={activeView}
          onNav={shellNavigate}
          badgeCounts={liveBadgeCounts}
          collapsed={sidebarCollapsed}
          userMinimized={navUserMinimized}
          detailRailMode={detailRailMode}
          onUserMinimize={persistNavMinimized}
          railContextActive={activeView === 'detail-surat' && !sidebarCollapsed}
          onRailToggle={activeView === 'detail-surat' ? () => setDetailSidebarExpanded((v) => !v) : undefined}
        />
      )}
      <main className="main">
        <Topbar
          notifUnread={unreadNotifCount}
          onOpenNotifikasi={() => setActiveView('notif')}
          userName={povMeta.name}
          userRole={povMeta.role}
          userInit={povMeta.init}
          onOpenProfil={() => setActiveView('profil-saya')}
        />
        <div className="content">
          {renderContent()}
        </div>
      </main>

      {!isFocusMode && (
        <PovSwitcher povUserId={povUserId} onChange={setPovUserId}/>
      )}

      {!isFocusMode && (
        <TweaksPanel>
          <TweakSection label="Identitas Visual"/>
          <TweakRadio
            label="Palette"
            value={t.palette}
            options={['green', 'blue', 'neutral', 'amber']}
            onChange={(v) => setTweak('palette', v)}
          />
          <div style={{ padding: '0 12px 12px', fontSize: 11, color: '#666', lineHeight: 1.4 }}>
            Hijau = identitas Pupuk Indonesia. Coba alternatif untuk presentasi.
          </div>
        </TweaksPanel>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
