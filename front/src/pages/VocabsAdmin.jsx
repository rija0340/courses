import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import useSupabaseAdminSession from '../hooks/useSupabaseAdminSession';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Plus, ArrowLeft, AlertCircle, Check, Eye, LogOut, Layers, Settings2, Database, HelpCircle, MoreHorizontal
} from 'lucide-react';
import { AppContext } from '../App';
import useVocabDomain from '../hooks/useVocabDomain';
import vocabStorage from '../services/vocabStorage';
import { supabase } from '../services/supabaseClient';
import { ACTIVE_PROVIDER, STORAGE_PROVIDERS } from '../services/storageConfig';
import { flattenTree } from '../utils/categoryTree';
import { parseAdminSearchParams, buildAdminUrl } from '../utils/vocabUrlState';
import { CompactMenu, MenuLink, MenuButton, MenuTrigger } from '../components/CompactMenu';
import CategoriesHub from '../components/vocabs/admin/CategoriesHub';
import SettingsPanel from '../components/vocabs/admin/SettingsPanel';
import AdminAuth from '../components/vocabs/admin/AdminAuth';

const ADMIN_TABS = [
  { id: 'categories', label: 'Catégories', icon: Layers },
  { id: 'settings', label: 'Paramètres', icon: Settings2 }
];

export default function VocabsAdmin() {
  const { domainId } = useParams();
  const { lang } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const adminUrl = useMemo(() => parseAdminSearchParams(searchParams), [searchParams]);
  const {
    domain, items, loading, error, refresh,
    addItem, updateItem, deleteItem, deleteItems,
    updateCategories, updateMeta, updateOrganization
  } = useVocabDomain(domainId);

  const [activeTab, setActiveTab] = useState(() => adminUrl.tab);
  const [toast, setToast] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const onAuthRefresh = useCallback(() => refresh({ soft: true }), [refresh]);
  const { session, checkingAuth } = useSupabaseAdminSession(onAuthRefresh);

  useEffect(() => {
    setActiveTab(adminUrl.tab);
  }, [adminUrl.tab]);

  const setAdminTab = useCallback((tab) => {
    navigate(buildAdminUrl(domainId, { ...adminUrl, tab }), { replace: true });
  }, [navigate, domainId, adminUrl]);

  const onAdminNavChange = useCallback((patch) => {
    navigate(buildAdminUrl(domainId, { ...adminUrl, ...patch }), { replace: true });
  }, [navigate, domainId, adminUrl]);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      showToast('Déconnecté');
    }
  };

  const handleSeedDomain = async () => {
    setSeeding(true);
    try {
      await vocabStorage.initDomain(domainId);
      await refresh();
      showToast('Domaine initialisé avec les données de démonstration');
    } catch (err) {
      showToast(err.message || 'Échec initialisation', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const getLabel = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.fr || '';
  };

  if (checkingAuth || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (ACTIVE_PROVIDER === STORAGE_PROVIDERS.SUPABASE && !session) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <Link
            to={`/vocabs/${domainId}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5f6368] hover:text-[#202124] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Aperçu public
          </Link>
        </div>
        <AdminAuth />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-16 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-[#202124] font-medium mb-1">Impossible de charger le domaine</p>
        <p className="text-[14px] text-[#5f6368] mb-6">{error}</p>
        <button type="button" onClick={() => refresh()} className="text-[#1a73e8] text-[14px] font-medium hover:underline mr-4">
          Réessayer
        </button>
        <Link to="/" className="text-[#1a73e8] text-[14px] font-medium hover:underline">Retour à l’accueil</Link>
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-16 text-center">
        <Database className="w-10 h-10 text-[#1a73e8] mx-auto mb-3" />
        <p className="text-[#202124] font-medium mb-1">Domaine pas encore créé dans Supabase</p>
        <p className="text-[14px] text-[#5f6368] mb-6">
          Le domaine <code className="bg-[#f1f3f4] px-1.5 py-0.5 rounded text-[13px]">{domainId}</code> n’existe pas encore.
        </p>
        <button
          type="button"
          onClick={handleSeedDomain}
          disabled={seeding}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#1a73e8] text-white font-semibold text-[14px] hover:bg-[#1b66c9] disabled:opacity-50"
        >
          {seeding ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Initialiser le domaine
        </button>
        <div className="mt-4">
          <Link to={`/vocabs/${domainId}`} className="text-[13px] text-[#5f6368] hover:underline">Retour à l’aperçu</Link>
        </div>
      </div>
    );
  }

  const org = domain?.organization;
  const categories = org?.categories || [];
  const tabs = org?.tabs || [];
  const title = getLabel(domain?.meta?.title) || domainId;
  const catCount = flattenTree(categories, 'fr').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-24">
      {toast && (
        <div
          role="status"
          className={`fixed top-4 right-4 z-[60] max-w-sm px-4 py-3 rounded-xl text-[13px] font-medium flex items-start gap-2 shadow-lg border ${
            toast.type === 'error'
              ? 'bg-white text-red-700 border-red-200'
              : 'bg-white text-[#137333] border-[#34A853]/40'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <Check className="w-4 h-4 mt-0.5 shrink-0" />}
          <span>{toast.text}</span>
        </div>
      )}

      <header className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-5 bg-[#f8f9fa]/90 backdrop-blur-md border-b border-[#dadce0]/60">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="min-w-0 flex items-center gap-3">
            <Link
              to={`/vocabs/${domainId}`}
              className="w-9 h-9 rounded-xl bg-white border border-[#dadce0] flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] transition-colors shrink-0"
              title="Retour à l’aperçu"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[18px] sm:text-[20px] font-medium text-[#202124] truncate">{title}</h1>
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${
                  ACTIVE_PROVIDER === STORAGE_PROVIDERS.SUPABASE
                    ? 'bg-[#E6F4EA] text-[#137333]'
                    : 'bg-[#FEF7E0] text-[#E37400]'
                }`}>
                  {ACTIVE_PROVIDER === STORAGE_PROVIDERS.SUPABASE ? 'Supabase' : 'Local'}
                </span>
              </div>
              <p className="text-[12px] text-[#9aa0a6] truncate">
                {items.length} mots · {catCount} catégories
                {session?.user?.email ? ` · ${session.user.email}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile: actions menu */}
            <CompactMenu
              className="sm:hidden"
              trigger={(open) => <MenuTrigger icon={MoreHorizontal} label="Actions admin" open={open} />}
            >
              <MenuLink to={`/vocabs/${domainId}/admin/guide`}>
                <HelpCircle size={15} className="text-[#1a73e8]" />
                Guide admin
              </MenuLink>
              <MenuLink to={`/vocabs/${domainId}`}>
                <Eye size={15} className="text-[#5f6368]" />
                Aperçu public
              </MenuLink>
              {session && (
                <MenuButton onClick={handleLogout}>
                  <LogOut size={15} className="text-[#5f6368]" />
                  Se déconnecter
                </MenuButton>
              )}
            </CompactMenu>

            {/* Desktop: separate buttons */}
            <Link
              to={`/vocabs/${domainId}/admin/guide`}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-medium text-[#3c4043] bg-white border border-[#dadce0] hover:bg-[#f1f3f4] transition-colors"
              title="Guide administrateur"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#1a73e8]" />
              Guide
            </Link>
            <Link
              to={`/vocabs/${domainId}`}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-medium text-[#3c4043] bg-white border border-[#dadce0] hover:bg-[#f1f3f4] transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Aperçu
            </Link>
            {session && (
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-medium text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sortir</span>
              </button>
            )}
          </div>
        </div>

        <nav className="mt-3 flex gap-1 overflow-x-auto scrollbar-none -mb-px">
          {ADMIN_TABS.map(tab => {
            const Icon = tab.icon;
            const count = tab.id === 'categories' ? catCount : null;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`inline-flex items-center gap-2 h-10 px-3.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-white text-[#202124] shadow-sm border border-[#dadce0]'
                    : 'text-[#5f6368] hover:text-[#202124] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#1a73e8]' : ''}`} />
                {tab.label}
                {count != null && (
                  <span className={`text-[11px] tabular-nums px-1.5 py-0.5 rounded-md ${
                    active ? 'bg-[#E8F0FE] text-[#1967D2]' : 'bg-[#f1f3f4] text-[#5f6368]'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {activeTab === 'categories' && (
        <CategoriesHub
          categories={categories}
          items={items}
          tabs={tabs}
          getLabel={getLabel}
          updateCategories={updateCategories}
          showToast={showToast}
          domainId={domainId}
          domain={domain}
          addItem={addItem}
          updateItem={updateItem}
          deleteItem={deleteItem}
          deleteItems={deleteItems}
          refresh={refresh}
          urlCategoryId={adminUrl.cat}
          urlOrgTab={adminUrl.orgTab}
          urlSearch={adminUrl.q}
          onNavChange={onAdminNavChange}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsPanel
          domain={domain}
          updateMeta={updateMeta}
          updateOrganization={updateOrganization}
          showToast={showToast}
        />
      )}
    </div>
  );
}
