import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Plus, Trash2, Pencil, ArrowLeft, Save, AlertCircle, X, Check,
  ChevronDown, Search, Image as ImageIcon, Folder, FolderOpen,
  Lock, Mail, Key, LogOut, FileCode, Upload, Download, Eye,
  LayoutGrid, List, BookOpen, Layers, Settings2, ImageOff, Copy, ChevronsUpDown,
  RefreshCw, Database
} from 'lucide-react';
import { AppContext } from '../App';
import VocabForm from '../components/vocabs/VocabForm';
import ImageUploader from '../components/vocabs/ImageUploader';
import useVocabDomain from '../hooks/useVocabDomain';
import vocabStorage from '../services/vocabStorage';
import { supabase } from '../services/supabaseClient';
import { ACTIVE_PROVIDER, STORAGE_PROVIDERS } from '../services/storageConfig';
import {
  buildExportPayload,
  buildImportTemplate,
  getSchemaFieldDocs,
  templateToPrettyJson,
  validateAndNormalizeImport,
  VOCAB_DOMAIN_VERSION,
} from '../data/vocabs/vocabDomainSchema';
import { checkSupabaseHealth } from '../services/supabaseHealth';
import {
  flattenTree, removeNode, addChildToNode, updateNode,
  findNodeById, getPath
} from '../utils/categoryTree';

const ADMIN_TABS = [
  { id: 'items', label: 'Vocabulaire', icon: BookOpen },
  { id: 'categories', label: 'Catégories', icon: Layers },
  { id: 'settings', label: 'Paramètres', icon: Settings2 }
];

const TYPE_COLORS = {
  Organe: 'bg-[#E8F0FE] text-[#1967D2]',
  Maladie: 'bg-[#FCE8E6] text-[#C5221F]',
  Symptôme: 'bg-[#FEF7E0] text-[#E37400]',
  Expression: 'bg-[#E6F4EA] text-[#137333]',
  Traitement: 'bg-[#F3E8FD] text-[#7627BB]',
  Diagnostic: 'bg-[#E8F0FE] text-[#1967D2]',
};

export default function VocabsAdmin() {
  const { domainId } = useParams();
  const { lang } = useContext(AppContext);
  const {
    domain, items, loading, error, refresh,
    addItem, updateItem, deleteItem,
    updateCategories, updateMeta, updateOrganization
  } = useVocabDomain(domainId);

  const [activeTab, setActiveTab] = useState('items');
  const [toast, setToast] = useState(null);
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (ACTIVE_PROVIDER !== STORAGE_PROVIDERS.SUPABASE || !supabase) {
      setCheckingAuth(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // After login, re-run domain load so initDomain can seed with auth
      if (session) refresh();
    });
    return () => subscription?.unsubscribe();
  }, [refresh]);

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

  // Auth gate BEFORE domain error — seeding requires a logged-in user
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
        <AdminAuth onLoginSuccess={(sess) => { setSession(sess); refresh(); }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-16 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-[#202124] font-medium mb-1">Impossible de charger le domaine</p>
        <p className="text-[14px] text-[#5f6368] mb-6">{error}</p>
        <button
          type="button"
          onClick={() => refresh()}
          className="text-[#1a73e8] text-[14px] font-medium hover:underline mr-4"
        >
          Réessayer
        </button>
        <Link to="/" className="text-[#1a73e8] text-[14px] font-medium hover:underline">Retour à l’accueil</Link>
      </div>
    );
  }

  // Domain not in DB yet — offer one-click seed (authenticated)
  if (!domain) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-16 text-center">
        <Database className="w-10 h-10 text-[#1a73e8] mx-auto mb-3" />
        <p className="text-[#202124] font-medium mb-1">Domaine pas encore créé dans Supabase</p>
        <p className="text-[14px] text-[#5f6368] mb-6">
          Le domaine <code className="bg-[#f1f3f4] px-1.5 py-0.5 rounded text-[13px]">{domainId}</code> n’existe pas encore.
          Initialise-le avec les données de démonstration (nécessite d’être connecté).
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
  const withImages = items.filter(i => i.image).length;
  const catCount = flattenTree(categories, 'fr').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-24">
      {toast && (
        <div
          role="status"
          className={`fixed top-4 right-4 z-[60] max-w-sm px-4 py-3 rounded-xl text-[13px] font-medium flex items-start gap-2 shadow-lg border animate-[fadeIn_0.2s_ease] ${
            toast.type === 'error'
              ? 'bg-white text-red-700 border-red-200'
              : 'bg-white text-[#137333] border-[#34A853]/40'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <Check className="w-4 h-4 mt-0.5 shrink-0" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Compact sticky header */}
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
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-medium text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sortir</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <nav className="mt-3 flex gap-1 overflow-x-auto scrollbar-none -mb-px">
          {ADMIN_TABS.map(tab => {
            const Icon = tab.icon;
            const count = tab.id === 'items' ? items.length : tab.id === 'categories' ? catCount : null;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

      {activeTab === 'items' && (
        <ItemsTab
          items={items}
          categories={categories}
          tabs={tabs}
          domainId={domainId}
          addItem={addItem}
          updateItem={updateItem}
          deleteItem={deleteItem}
          showToast={showToast}
          withImagesHint={withImages}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesTab
          categories={categories}
          items={items}
          getLabel={getLabel}
          updateCategories={updateCategories}
          showToast={showToast}
          domainId={domainId}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsTab
          domain={domain}
          updateMeta={updateMeta}
          updateOrganization={updateOrganization}
          showToast={showToast}
          refresh={refresh}
        />
      )}
    </div>
  );
}

/* =========================================================
   ITEMS TAB
   ========================================================= */
function ItemsTab({ items, categories, tabs, domainId, addItem, updateItem, deleteItem, showToast, withImagesHint }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterImage, setFilterImage] = useState('all'); // all | missing | has
  const [view, setView] = useState('list');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [itemImages, setItemImages] = useState({});
  const [imageItemId, setImageItemId] = useState(null);

  const flatCats = useMemo(() => flattenTree(categories, 'fr'), [categories]);

  useEffect(() => {
    async function load() {
      const map = {};
      for (const item of items) {
        const img = item.image || await vocabStorage.getImage(domainId, item.id);
        if (img) map[item.id] = img;
      }
      setItemImages(map);
    }
    load();
  }, [items, domainId]);

  const filtered = useMemo(() => {
    let result = [...items];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.en?.toLowerCase().includes(q) ||
        i.fr?.toLowerCase().includes(q) ||
        i.mg?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q)
      );
    }
    if (filterCat) result = result.filter(i => i.categoryId === filterCat);
    if (filterImage === 'missing') result = result.filter(i => !itemImages[i.id] && !i.image);
    if (filterImage === 'has') result = result.filter(i => itemImages[i.id] || i.image);
    return result;
  }, [items, search, filterCat, filterImage, itemImages]);

  const missingCount = useMemo(
    () => items.filter(i => !itemImages[i.id] && !i.image).length,
    [items, itemImages]
  );

  const handleSave = async (data) => {
    try {
      if (editItem) {
        await updateItem(editItem.id, data);
        showToast('Mot mis à jour');
      } else {
        await addItem(data);
        showToast('Mot ajouté');
      }
      setShowForm(false);
      setEditItem(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      showToast('Mot supprimé');
      setConfirmDelete(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleImageSave = async (itemId, dataUrl) => {
    try {
      const url = await vocabStorage.saveImage(domainId, itemId, dataUrl);
      setItemImages(prev => ({ ...prev, [itemId]: url || dataUrl }));
      showToast('Image sauvegardée');
      setImageItemId(null);
    } catch (err) {
      showToast(err.message || 'Échec sauvegarde image', 'error');
    }
  };

  const handleImageDelete = async (itemId) => {
    try {
      await vocabStorage.deleteImage(domainId, itemId);
      setItemImages(prev => {
        const c = { ...prev };
        delete c[itemId];
        return c;
      });
      showToast('Image supprimée');
      setImageItemId(null);
    } catch (err) {
      showToast(err.message || 'Échec suppression image', 'error');
    }
  };

  const catMap = {};
  flatCats.forEach(c => { catMap[c.id] = c; });

  return (
    <section>
      {/* Toolbar */}
      <div className="bg-white border border-[#dadce0] rounded-2xl p-3 sm:p-4 mb-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher (FR, EN, MG, type)…"
              className="w-full h-10 pl-9 pr-9 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] outline-none text-[14px] transition-all placeholder:text-[#9aa0a6]"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#e8eaed]">
                <X className="w-3.5 h-3.5 text-[#5f6368]" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
              className="h-10 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[13px] outline-none min-w-[160px]"
            >
              <option value="">Toutes catégories</option>
              {flatCats.map(c => (
                <option key={c.id} value={c.id}>{c.path}</option>
              ))}
            </select>

            <div className="inline-flex p-0.5 rounded-xl bg-[#f1f3f4]">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'missing', label: `Sans image${missingCount ? ` (${missingCount})` : ''}` },
                { id: 'has', label: 'Avec image' },
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterImage(f.id)}
                  className={`h-9 px-2.5 rounded-lg text-[12px] font-medium transition-all ${
                    filterImage === f.id ? 'bg-white text-[#202124] shadow-sm' : 'text-[#5f6368] hover:text-[#202124]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="inline-flex p-0.5 rounded-xl bg-[#f1f3f4]">
              <button
                type="button"
                onClick={() => setView('list')}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${view === 'list' ? 'bg-white shadow-sm text-[#1a73e8]' : 'text-[#5f6368]'}`}
                title="Liste"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setView('grid')}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${view === 'grid' ? 'bg-white shadow-sm text-[#1a73e8]' : 'text-[#5f6368]'}`}
                title="Grille"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => { setEditItem(null); setShowForm(true); }}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-[#1a73e8] text-white font-semibold text-[13px] hover:bg-[#1b66c9] transition-all shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 text-[12px] text-[#9aa0a6]">
          <span>
            <strong className="text-[#5f6368] font-medium">{filtered.length}</strong> affiché{filtered.length !== 1 ? 's' : ''}
            {filtered.length !== items.length && ` sur ${items.length}`}
            {withImagesHint != null && ` · ${withImagesHint} avec image`}
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={search || filterCat || filterImage !== 'all' ? Search : BookOpen}
          title={items.length === 0 ? 'Aucun mot pour l’instant' : 'Aucun résultat'}
          text={items.length === 0 ? 'Ajoutez votre premier mot pour commencer.' : 'Modifiez la recherche ou les filtres.'}
          action={items.length === 0 ? (
            <button
              type="button"
              onClick={() => { setEditItem(null); setShowForm(true); }}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold hover:bg-[#1b66c9]"
            >
              <Plus className="w-4 h-4" /> Ajouter un mot
            </button>
          ) : null}
        />
      ) : view === 'list' ? (
        <div className="bg-white border border-[#dadce0] rounded-2xl overflow-hidden shadow-sm">
          <div className="hidden md:grid grid-cols-[56px_1fr_1fr_120px_100px_108px] gap-2 px-4 py-2.5 bg-[#f8f9fa] border-b border-[#dadce0] text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6]">
            <span>Img</span>
            <span>Français / EN</span>
            <span>Malagasy</span>
            <span>Type</span>
            <span>Catégorie</span>
            <span className="text-right">Actions</span>
          </div>
          <ul className="divide-y divide-[#f1f3f4]">
            {filtered.map(item => {
              const img = itemImages[item.id];
              const typeClass = TYPE_COLORS[item.category] || 'bg-[#f1f3f4] text-[#5f6368]';
              return (
                <li key={item.id} className="group hover:bg-[#f8f9fa]/80 transition-colors">
                  <div className="grid grid-cols-[56px_1fr_auto] md:grid-cols-[56px_1fr_1fr_120px_100px_108px] gap-2 items-center px-3 sm:px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => setImageItemId(item.id)}
                      className="w-12 h-12 rounded-xl overflow-hidden bg-[#f1f3f4] border border-[#dadce0]/80 flex items-center justify-center shrink-0 hover:ring-2 hover:ring-[#1a73e8]/30 transition-all"
                      title={img ? 'Changer l’image' : 'Ajouter une image'}
                    >
                      {img ? (
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageOff className="w-4 h-4 text-[#9aa0a6]" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-[#202124] truncate">{item.fr || '—'}</p>
                      <p className="text-[12px] text-[#5f6368] truncate">{item.en || '—'}</p>
                      <div className="md:hidden flex flex-wrap gap-1.5 mt-1.5">
                        {item.category && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${typeClass}`}>{item.category}</span>
                        )}
                        {catMap[item.categoryId] && (
                          <span className="text-[10px] text-[#9aa0a6] truncate max-w-[140px]">{catMap[item.categoryId].path}</span>
                        )}
                      </div>
                    </div>

                    <p className="hidden md:block text-[13px] text-[#3c4043] truncate">{item.mg || '—'}</p>

                    <div className="hidden md:block">
                      {item.category ? (
                        <span className={`inline-block text-[11px] font-semibold px-2 py-1 rounded-md ${typeClass}`}>
                          {item.category}
                        </span>
                      ) : (
                        <span className="text-[12px] text-[#9aa0a6]">—</span>
                      )}
                    </div>

                    <p className="hidden md:block text-[12px] text-[#5f6368] truncate" title={catMap[item.categoryId]?.path}>
                      {catMap[item.categoryId]?.label || '—'}
                    </p>

                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setImageItemId(item.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5f6368] hover:bg-[#e8eaed] transition-colors"
                        title="Image"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditItem(item); setShowForm(true); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5f6368] hover:bg-[#e8eaed] transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(item)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(item => {
            const img = itemImages[item.id];
            const typeClass = TYPE_COLORS[item.category] || 'bg-[#f1f3f4] text-[#5f6368]';
            return (
              <article key={item.id} className="bg-white border border-[#dadce0] rounded-2xl overflow-hidden shadow-sm hover:border-[#c4c7c5] transition-all flex flex-col">
                <button
                  type="button"
                  onClick={() => setImageItemId(item.id)}
                  className="relative aspect-[16/10] bg-[#f1f3f4] flex items-center justify-center group"
                >
                  {img ? (
                    <img src={img} alt={item.fr} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-[#9aa0a6]">
                      <ImageOff className="w-6 h-6" />
                      <span className="text-[11px]">Ajouter une image</span>
                    </div>
                  )}
                  <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </button>
                <div className="p-3.5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-medium text-[#202124] truncate">{item.fr}</h3>
                      <p className="text-[12px] text-[#5f6368] truncate">{item.en} · {item.mg}</p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      <button type="button" onClick={() => { setEditItem(item); setShowForm(true); }} className="w-8 h-8 rounded-lg hover:bg-[#f1f3f4] flex items-center justify-center text-[#5f6368]">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => setConfirmDelete(item)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {item.category && <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${typeClass}`}>{item.category}</span>}
                    {catMap[item.categoryId] && (
                      <span className="text-[10px] text-[#5f6368] bg-[#f8f9fa] px-2 py-0.5 rounded-md truncate max-w-full">
                        {catMap[item.categoryId].path}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {showForm && (
        <VocabForm
          item={editItem}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
          categories={categories}
          tabs={tabs}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Supprimer ce mot ?"
          text={`« ${confirmDelete.fr} » (${confirmDelete.en}) sera définitivement supprimé.`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete.id)}
          confirmText="Supprimer"
          danger
        />
      )}

      {imageItemId && (
        <ImageModal
          title={`Image — ${items.find(i => i.id === imageItemId)?.fr || imageItemId}`}
          currentImage={itemImages[imageItemId] || null}
          onSave={(b64) => handleImageSave(imageItemId, b64)}
          onDelete={() => handleImageDelete(imageItemId)}
          onClose={() => setImageItemId(null)}
        />
      )}
    </section>
  );
}

/* =========================================================
   CATEGORIES TAB
   ========================================================= */
function CategoriesTab({ categories, items, getLabel, updateCategories, showToast, domainId }) {
  const [selectedId, setSelectedId] = useState(null);
  const [expanded, setExpanded] = useState([]);
  const [catImages, setCatImages] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState({ fr: '', en: '', mg: '' });
  const [addingChild, setAddingChild] = useState(false);
  const [newLabel, setNewLabel] = useState({ fr: '', en: '', mg: '' });
  const [imageModalId, setImageModalId] = useState(null);
  const [rootDraft, setRootDraft] = useState('');

  useEffect(() => {
    async function load() {
      const map = {};
      const walk = async (nodes) => {
        for (const n of nodes) {
          const img = await vocabStorage.getCategoryImage(domainId, n.id);
          if (img) map[n.id] = img;
          if (n.children?.length) await walk(n.children);
        }
      };
      await walk(categories);
      setCatImages(map);
    }
    if (categories.length) load();
  }, [categories, domainId]);

  const toggleExpand = (id) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectNode = (id) => {
    setSelectedId(id);
    setIsEditing(false);
    setAddingChild(false);
  };

  const selectedNode = selectedId ? findNodeById(categories, selectedId) : null;
  const selectedPath = selectedId ? getPath(categories, selectedId) : [];

  const countDirect = (id) => items.filter(i => i.categoryId === id).length;
  const countTotal = (node) => {
    if (!node) return 0;
    let c = countDirect(node.id);
    (node.children || []).forEach(ch => { c += countTotal(ch); });
    return c;
  };

  const handleSaveLabel = async () => {
    if (!editLabel.fr.trim()) return;
    const updated = updateNode(categories, selectedId, (n) => ({
      ...n, label: { ...n.label, ...editLabel }
    }));
    await updateCategories(updated);
    showToast('Nom mis à jour');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!selectedNode) return;
    if (countTotal(selectedNode) > 0) {
      showToast('Déplacez d’abord les mots de cette catégorie.', 'error');
      return;
    }
    const updated = removeNode(categories, selectedId);
    await updateCategories(updated);
    await vocabStorage.deleteCategoryImage(domainId, selectedId);
    showToast('Catégorie supprimée');
    setSelectedId(null);
    setIsEditing(false);
  };

  const makeCat = (label) => ({
    id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    label: {
      fr: label.fr,
      en: label.en || label.fr,
      mg: label.mg || label.fr
    },
    children: []
  });

  const handleAddChild = async () => {
    if (!newLabel.fr.trim() || !selectedId) return;
    const updated = addChildToNode(categories, selectedId, makeCat(newLabel));
    await updateCategories(updated);
    showToast('Sous-catégorie ajoutée');
    setAddingChild(false);
    setNewLabel({ fr: '', en: '', mg: '' });
    setExpanded(prev => [...prev, selectedId]);
  };

  const handleAddRoot = async () => {
    const fr = rootDraft.trim();
    if (!fr) return;
    const updated = addChildToNode(categories, null, makeCat({ fr, en: fr, mg: fr }));
    await updateCategories(updated);
    showToast('Catégorie ajoutée');
    setRootDraft('');
  };

  const handleSaveImage = async (id, dataUrl) => {
    try {
      const url = await vocabStorage.saveCategoryImage(domainId, id, dataUrl);
      setCatImages(prev => ({ ...prev, [id]: url || dataUrl }));
      showToast('Image sauvegardée');
      setImageModalId(null);
    } catch (err) {
      showToast(err.message || 'Échec sauvegarde image', 'error');
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await vocabStorage.deleteCategoryImage(domainId, id);
      setCatImages(prev => { const c = { ...prev }; delete c[id]; return c; });
      showToast('Image supprimée');
      setImageModalId(null);
    } catch (err) {
      showToast(err.message || 'Échec suppression image', 'error');
    }
  };

  const renderTree = (nodes, depth = 0) => nodes.map(node => {
    const isSel = selectedId === node.id;
    const isExp = expanded.includes(node.id);
    const hasCh = node.children?.length > 0;
    return (
      <div key={node.id}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => selectNode(node.id)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') selectNode(node.id); }}
          className={`w-full flex items-center gap-2 rounded-xl text-left cursor-pointer transition-all ${
            depth === 0 ? 'py-2 text-[13px]' : 'py-1.5 text-[13px]'
          } ${isSel ? 'bg-[#E8F0FE] text-[#1967D2]' : 'hover:bg-[#f1f3f4] text-[#3c4043]'}`}
          style={{ paddingLeft: `${8 + depth * 12}px`, paddingRight: 8 }}
        >
          {hasCh ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-transform ${isExp ? '' : '-rotate-90'} ${isSel ? 'text-[#1967D2]' : 'text-[#9aa0a6]'}`}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="w-5 shrink-0" />
          )}
          {catImages[node.id] ? (
            <img src={catImages[node.id]} alt="" className="w-6 h-6 rounded-md object-cover shrink-0 border border-[#dadce0]" />
          ) : (
            <Folder className={`w-4 h-4 shrink-0 ${isSel ? 'text-[#1967D2]' : 'text-[#9aa0a6]'}`} />
          )}
          <span className="truncate flex-1 font-medium">{getLabel(node.label)}</span>
          <span className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded-md shrink-0 ${isSel ? 'bg-white/80 text-[#1967D2]' : 'bg-[#f1f3f4] text-[#5f6368]'}`}>
            {countTotal(node)}
          </span>
        </div>
        {hasCh && isExp && <div>{renderTree(node.children, depth + 1)}</div>}
      </div>
    );
  });

  return (
    <section className="flex flex-col lg:flex-row gap-4">
      <div className="lg:w-[300px] shrink-0">
        <div className="bg-white border border-[#dadce0] rounded-2xl p-3 sm:p-4 sticky top-[7.5rem] shadow-sm">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6]">Arbre</p>
            {selectedId && (
              <button type="button" onClick={() => { setSelectedId(null); setIsEditing(false); setAddingChild(false); }} className="text-[11px] text-[#1a73e8] font-medium hover:underline">
                Effacer
              </button>
            )}
          </div>
          <div className="space-y-0.5 max-h-[50vh] overflow-y-auto pr-0.5">
            {renderTree(categories)}
            {categories.length === 0 && (
              <p className="text-[13px] text-[#9aa0a6] text-center py-8">Aucune catégorie</p>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-[#f1f3f4]">
            <div className="flex gap-1.5">
              <input
                value={rootDraft}
                onChange={e => setRootDraft(e.target.value)}
                placeholder="Nouvelle catégorie…"
                className="flex-1 h-9 rounded-xl bg-[#f8f9fa] border border-transparent focus:border-[#1a73e8] focus:bg-white px-3 text-[13px] outline-none"
                onKeyDown={e => { if (e.key === 'Enter') handleAddRoot(); }}
              />
              <button
                type="button"
                onClick={handleAddRoot}
                disabled={!rootDraft.trim()}
                className="h-9 w-9 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center hover:bg-[#1b66c9] disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {selectedNode ? (
          <div className="bg-white border border-[#dadce0] rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-1 text-[12px] text-[#9aa0a6] mb-4 flex-wrap">
              {selectedPath.map((n, i) => (
                <React.Fragment key={n.id}>
                  {i > 0 && <span className="text-[#dadce0]">/</span>}
                  <span className={i === selectedPath.length - 1 ? 'text-[#202124] font-medium' : ''}>
                    {getLabel(n.label)}
                  </span>
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <button
                type="button"
                onClick={() => setImageModalId(selectedId)}
                className="relative w-full sm:w-44 aspect-video sm:aspect-square rounded-xl overflow-hidden bg-[#f8f9fa] border border-[#dadce0] flex items-center justify-center group shrink-0"
              >
                {catImages[selectedId] ? (
                  <img src={catImages[selectedId]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[#9aa0a6]">
                    <ImageIcon className="w-7 h-7" />
                    <span className="text-[11px]">Image</span>
                  </div>
                )}
                <span className="absolute inset-x-0 bottom-0 py-1.5 text-[11px] font-medium text-center bg-black/45 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {catImages[selectedId] ? 'Changer' : 'Ajouter'}
                </span>
              </button>

              <div className="flex-1 min-w-0">
                <div className="mb-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      {['fr', 'en', 'mg'].map(code => (
                        <div key={code} className="flex items-center gap-2">
                          <span className="text-[10px] font-bold w-7 text-[#9aa0a6] uppercase">{code}</span>
                          <input
                            value={editLabel[code]}
                            onChange={e => setEditLabel(p => ({ ...p, [code]: e.target.value }))}
                            className="flex-1 h-9 rounded-xl bg-[#f8f9fa] border border-[#dadce0] px-3 text-[14px] outline-none focus:border-[#1a73e8]"
                          />
                        </div>
                      ))}
                      <div className="flex gap-2 pt-1">
                        <button type="button" onClick={handleSaveLabel} className="h-9 px-4 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold hover:bg-[#1b66c9]">Enregistrer</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="h-9 px-4 rounded-xl bg-[#f1f3f4] text-[#5f6368] text-[13px] font-semibold">Annuler</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-[20px] font-medium text-[#202124]">{getLabel(selectedNode.label)}</h2>
                        <p className="text-[11px] text-[#9aa0a6] font-mono mt-0.5">{selectedNode.id}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(true);
                          setEditLabel({
                            fr: selectedNode.label?.fr || '',
                            en: selectedNode.label?.en || '',
                            mg: selectedNode.label?.mg || ''
                          });
                        }}
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#f1f3f4] text-[#5f6368] text-[12px] font-semibold hover:bg-[#e8eaed]"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Renommer
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { n: countDirect(selectedId), l: 'Ici' },
                    { n: countTotal(selectedNode), l: 'Total' },
                    { n: selectedNode.children?.length || 0, l: 'Enfants' },
                  ].map(s => (
                    <div key={s.l} className="rounded-xl bg-[#f8f9fa] px-2 py-2.5 text-center">
                      <p className="text-[18px] font-semibold text-[#202124] tabular-nums">{s.n}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9aa0a6]">{s.l}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {!addingChild && (
                    <button
                      type="button"
                      onClick={() => { setAddingChild(true); setNewLabel({ fr: '', en: '', mg: '' }); }}
                      className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold hover:bg-[#1b66c9]"
                    >
                      <Plus className="w-4 h-4" /> Sous-catégorie
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-red-50 text-red-600 text-[13px] font-semibold hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </button>
                </div>

                {addingChild && (
                  <div className="mt-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0]/60 p-3.5">
                    <p className="text-[13px] font-medium text-[#202124] mb-2">Nouvelle sous-catégorie</p>
                    <div className="space-y-2 mb-3">
                      {['fr', 'en', 'mg'].map(code => (
                        <div key={code} className="flex items-center gap-2">
                          <span className="text-[10px] font-bold w-7 text-[#9aa0a6] uppercase">{code}</span>
                          <input
                            value={newLabel[code]}
                            onChange={e => setNewLabel(p => ({ ...p, [code]: e.target.value }))}
                            placeholder={{ fr: 'Français', en: 'English', mg: 'Malagasy' }[code]}
                            className="flex-1 h-9 rounded-lg bg-white border border-[#dadce0] px-3 text-[13px] outline-none focus:border-[#1a73e8]"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={handleAddChild} disabled={!newLabel.fr.trim()} className="flex-1 h-9 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold disabled:opacity-40">Ajouter</button>
                      <button type="button" onClick={() => setAddingChild(false)} className="h-9 px-4 rounded-xl bg-white border border-[#dadce0] text-[13px] font-semibold text-[#5f6368]">Annuler</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={FolderOpen}
            title="Sélectionnez une catégorie"
            text="Choisissez un nœud dans l’arbre pour renommer, illustrer ou ajouter des enfants."
          />
        )}
      </div>

      {imageModalId && (
        <ImageModal
          title="Image de catégorie"
          currentImage={catImages[imageModalId] || null}
          onSave={(b64) => handleSaveImage(imageModalId, b64)}
          onDelete={() => handleDeleteImage(imageModalId)}
          onClose={() => setImageModalId(null)}
        />
      )}
    </section>
  );
}

/* =========================================================
   SETTINGS TAB
   ========================================================= */
function SettingsTab({ domain, updateMeta, updateOrganization, showToast, refresh }) {
  const [meta, setMeta] = useState(domain?.meta || { title: { fr: '', en: '', mg: '' }, description: { fr: '', en: '', mg: '' } });
  const [org, setOrg] = useState(domain?.organization || { tabs: [], categories: [] });
  const [dirty, setDirty] = useState(false);
  const [importPreview, setImportPreview] = useState(null);
  const [importMode, setImportMode] = useState('merge');
  const [showFields, setShowFields] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [copied, setCopied] = useState(false);

  const schemaDocs = useMemo(() => getSchemaFieldDocs(), []);
  const templateJson = useMemo(() => templateToPrettyJson(domain), [domain]);

  useEffect(() => {
    if (domain) {
      setMeta(domain.meta || { title: { fr: '', en: '', mg: '' }, description: { fr: '', en: '', mg: '' } });
      setOrg(domain.organization || { tabs: [], categories: [] });
      setDirty(false);
    }
  }, [domain]);

  const handleMetaChange = (field, l, value) => {
    setMeta(prev => ({ ...prev, [field]: { ...(prev[field] || {}), [l]: value } }));
    setDirty(true);
  };

  const handleTabChange = (index, field, value) => {
    const updated = [...org.tabs];
    if (!updated[index]) return;
    if (field === 'id') updated[index] = { ...updated[index], id: value };
    else updated[index] = { ...updated[index], label: { ...updated[index].label, [field]: value } };
    setOrg(prev => ({ ...prev, tabs: updated }));
    setDirty(true);
  };

  const addTab = () => {
    setOrg(prev => ({ ...prev, tabs: [...(prev.tabs || []), { id: `tab_${Date.now()}`, label: { fr: '', en: '', mg: '' } }] }));
    setDirty(true);
  };

  const removeTab = (index) => {
    setOrg(prev => ({ ...prev, tabs: prev.tabs.filter((_, i) => i !== index) }));
    setDirty(true);
  };

  const handleSave = async () => {
    await updateMeta(meta);
    await updateOrganization(org);
    setDirty(false);
    showToast('Paramètres sauvegardés');
  };

  const downloadJson = (payload, filename) => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(payload, null, 2))}`;
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleExport = async () => {
    try {
      const data = await vocabStorage.exportAll(domain.id);
      downloadJson(buildExportPayload(data), `${domain.id}-vocabs.json`);
      showToast('Export réussi');
    } catch (err) {
      showToast(`Erreur d'export: ${err.message}`, 'error');
    }
  };

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(templateJson);
      setCopied(true);
      showToast('Modèle copié dans le presse-papiers');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Impossible de copier — téléchargez le modèle', 'error');
    }
  };

  const handleDownloadTemplate = () => {
    const tpl = buildImportTemplate(domain);
    const { _comment, ...clean } = tpl;
    downloadJson(clean, `${domain.id || 'domain'}-import-template.json`);
    showToast('Modèle téléchargé');
  };

  const handleImportSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const result = validateAndNormalizeImport(parsed);
        setImportPreview({ raw: parsed, result, fileName: file.name });
        setImportMode('merge');
        if (!result.ok) {
          showToast(result.errors[0] || 'JSON invalide', 'error');
        }
      } catch (err) {
        showToast(`JSON invalide: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const executeImport = async () => {
    if (!importPreview?.result?.ok || !importPreview.result.data) return;
    const normalized = importPreview.result.data;
    try {
      if (importMode === 'overwrite') {
        await vocabStorage.saveDomain(domain.id, normalized);
        showToast(`Import OK — ${normalized.items.length} mots (écrasement)`);
      } else {
        const currentItems = domain.items || [];
        const mergedItems = [...currentItems];
        normalized.items.forEach(item => {
          const idx = mergedItems.findIndex(i => i.id === item.id);
          if (idx !== -1) mergedItems[idx] = { ...mergedItems[idx], ...item };
          else mergedItems.push(item);
        });

        const tabMap = new Map((domain.organization?.tabs || []).map(t => [t.id, t]));
        (normalized.organization.tabs || []).forEach(t => {
          tabMap.set(t.id, { ...(tabMap.get(t.id) || {}), ...t, label: { ...(tabMap.get(t.id)?.label || {}), ...t.label } });
        });

        const updatedDomain = {
          version: VOCAB_DOMAIN_VERSION,
          meta: {
            title: { ...(domain.meta?.title || {}), ...normalized.meta.title },
            description: { ...(domain.meta?.description || {}), ...normalized.meta.description },
          },
          organization: {
            tabs: Array.from(tabMap.values()),
            categories: (normalized.organization.categories?.length
              ? normalized.organization.categories
              : (domain.organization?.categories || [])),
          },
          items: mergedItems,
        };
        await vocabStorage.saveDomain(domain.id, updatedDomain);
        showToast(`Fusion OK — ${normalized.items.length} mots traités`);
      }
      setImportPreview(null);
      if (refresh) await refresh();
    } catch (err) {
      showToast(`Erreur d'import: ${err.message}`, 'error');
    }
  };

  return (
    <section className="max-w-2xl space-y-4 pb-20">
      <SupabaseConnectionPanel />

      <Panel title="Informations du domaine">
        <div className="space-y-4">
          {['title', 'description'].map(field => (
            <div key={field}>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-2 block">
                {field === 'title' ? 'Titre' : 'Description'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {['fr', 'en', 'mg'].map(code => (
                  <input
                    key={code}
                    value={meta[field]?.[code] || ''}
                    onChange={e => handleMetaChange(field, code, e.target.value)}
                    placeholder={code.toUpperCase()}
                    className="h-10 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] px-3 text-[13px] outline-none"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="Onglets"
        action={
          <button type="button" onClick={addTab} className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg bg-[#f1f3f4] text-[#5f6368] text-[12px] font-semibold hover:bg-[#e8eaed]">
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        }
      >
        <div className="space-y-2">
          {(org.tabs || []).map((tab, idx) => (
            <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#f8f9fa] rounded-xl p-2">
              <input
                value={tab.id}
                onChange={e => handleTabChange(idx, 'id', e.target.value)}
                placeholder="id"
                className="w-full sm:w-24 h-9 rounded-lg bg-white border border-[#dadce0] px-2.5 text-[12px] outline-none font-mono"
              />
              {['fr', 'en', 'mg'].map(code => (
                <input
                  key={code}
                  value={tab.label?.[code] || ''}
                  onChange={e => handleTabChange(idx, code, e.target.value)}
                  placeholder={code.toUpperCase()}
                  className="flex-1 min-w-[70px] h-9 rounded-lg bg-white border border-[#dadce0] px-2.5 text-[12px] outline-none"
                />
              ))}
              <button type="button" onClick={() => removeTab(idx)} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 shrink-0">
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          ))}
          {(!org.tabs || org.tabs.length === 0) && (
            <p className="text-[13px] text-[#9aa0a6] text-center py-4">Aucun onglet</p>
          )}
        </div>
      </Panel>

      <Panel
        title="Import / Export JSON"
        icon={FileCode}
        action={
          <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#E8F0FE] text-[#1967D2]">
            schéma v{VOCAB_DOMAIN_VERSION}
          </span>
        }
      >
        <p className="text-[13px] text-[#5f6368] mb-4">
          Le modèle est généré depuis <code className="text-[12px] bg-[#f1f3f4] px-1.5 py-0.5 rounded">vocabDomainSchema.js</code> —
          il se met à jour automatiquement si la structure change.
        </p>

        <div className="rounded-xl border border-[#dadce0] bg-[#f8f9fa] p-3.5 mb-3">
          <div className="mb-3">
            <p className="text-[13px] font-semibold text-[#202124]">Modèle à copier</p>
            <p className="text-[12px] text-[#5f6368] mt-0.5">
              Prérempli avec vos onglets / catégories actuelles + exemples de mots.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-[#dadce0] text-[12px] font-semibold text-[#3c4043] hover:bg-[#f1f3f4]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copié' : 'Copier le modèle'}
            </button>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-[#dadce0] text-[12px] font-semibold text-[#3c4043] hover:bg-[#f1f3f4]"
            >
              <Download className="w-3.5 h-3.5" />
              Télécharger le modèle
            </button>
            <button
              type="button"
              onClick={() => setShowTemplate(v => !v)}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#1a73e8] hover:bg-[#E8F0FE]"
            >
              <ChevronsUpDown className="w-3.5 h-3.5" />
              {showTemplate ? 'Masquer' : 'Aperçu'}
            </button>
          </div>

          {showTemplate && (
            <pre className="mt-3 max-h-56 overflow-auto rounded-xl bg-[#202124] text-[#E8EAED] text-[11px] leading-relaxed p-3 font-mono">
              {templateJson}
            </pre>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowFields(v => !v)}
          className="w-full flex items-center justify-between h-10 px-3 rounded-xl border border-[#dadce0] text-[12px] font-semibold text-[#5f6368] hover:bg-[#f8f9fa] mb-3"
        >
          <span>Champs du schéma (items)</span>
          <ChevronsUpDown className="w-3.5 h-3.5" />
        </button>
        {showFields && (
          <div className="mb-3 rounded-xl border border-[#dadce0] overflow-hidden">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#f8f9fa] text-[#9aa0a6]">
                <tr>
                  <th className="px-3 py-2 font-semibold">Champ</th>
                  <th className="px-3 py-2 font-semibold">Req.</th>
                  <th className="px-3 py-2 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f4]">
                {schemaDocs.items.map(f => (
                  <tr key={f.key}>
                    <td className="px-3 py-2 font-mono text-[#1967D2]">{f.key}</td>
                    <td className="px-3 py-2">{f.required ? 'oui' : '—'}</td>
                    <td className="px-3 py-2 text-[#5f6368]">{f.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-[#dadce0] text-[13px] font-semibold text-[#3c4043] hover:bg-[#f8f9fa]"
          >
            <Download className="w-4 h-4" /> Exporter les données
          </button>
          <label className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#1a73e8] text-[13px] font-semibold text-white hover:bg-[#1b66c9] cursor-pointer">
            <Upload className="w-4 h-4" /> Importer un JSON
            <input type="file" accept=".json,application/json" onChange={handleImportSelect} className="hidden" />
          </label>
        </div>
      </Panel>

      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-200 ${dirty ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-[#1a73e8] text-white font-semibold text-[14px] shadow-lg shadow-[#1a73e8]/30 hover:bg-[#1b66c9]"
        >
          <Save className="w-4 h-4" />
          Enregistrer les modifications
        </button>
      </div>

      {importPreview && (
        <ImportPreviewModal
          preview={importPreview}
          importMode={importMode}
          setImportMode={setImportMode}
          onCancel={() => setImportPreview(null)}
          onConfirm={executeImport}
        />
      )}
    </section>
  );
}

function SupabaseConnectionPanel() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const runCheck = async () => {
    setLoading(true);
    try {
      const h = await checkSupabaseHealth();
      setHealth(h);
    } catch (err) {
      setHealth({
        configured: false,
        ready: false,
        canUploadImages: false,
        errors: [err.message],
        tables: {},
        storage: { ok: false },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { runCheck(); }, []);

  const StatusDot = ({ ok }) => (
    <span className={`inline-block w-2 h-2 rounded-full ${ok ? 'bg-[#34A853]' : ok === false ? 'bg-[#EA4335]' : 'bg-[#9aa0a6]'}`} />
  );

  return (
    <Panel
      title="Connexion Supabase"
      icon={Database}
      action={
        <button
          type="button"
          onClick={runCheck}
          disabled={loading}
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-[#f1f3f4] text-[#5f6368] text-[12px] font-semibold hover:bg-[#e8eaed] disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Vérifier
        </button>
      }
    >
      {loading && !health ? (
        <p className="text-[13px] text-[#9aa0a6]">Diagnostic en cours…</p>
      ) : (
        <div className="space-y-3">
          <div className={`rounded-xl px-3 py-2.5 text-[13px] font-medium border ${
            health?.ready
              ? 'bg-[#E6F4EA] border-[#34A853]/30 text-[#137333]'
              : 'bg-[#FCE8E6] border-red-200 text-[#C5221F]'
          }`}>
            {health?.ready
              ? (health.canUploadImages
                ? 'Prêt — DB + Storage OK, session active (upload images possible).'
                : 'DB OK — connectez-vous pour pouvoir uploader des images.')
              : 'Pas prêt — suivez les étapes ci-dessous.'}
          </div>

          <ul className="space-y-1.5 text-[12px] text-[#3c4043]">
            <li className="flex items-center gap-2">
              <StatusDot ok={health?.configured} />
              Provider: <code className="bg-[#f1f3f4] px-1 rounded">{health?.provider || '—'}</code>
              {health?.url && <span className="text-[#9aa0a6] truncate">({health.url.replace(/^https?:\/\//, '')})</span>}
            </li>
            <li className="flex items-center gap-2">
              <StatusDot ok={!!health?.session} />
              Session: {health?.session?.email || 'non connecté'}
            </li>
            {Object.entries(health?.tables || {}).map(([name, ok]) => (
              <li key={name} className="flex items-center gap-2">
                <StatusDot ok={ok} />
                Table <code className="bg-[#f1f3f4] px-1 rounded">{name}</code>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <StatusDot ok={health?.storage?.ok} />
              Bucket <code className="bg-[#f1f3f4] px-1 rounded">vocab-images</code>
              {health?.storage?.public === true && <span className="text-[#137333]">(public)</span>}
              {health?.storage?.public === false && <span className="text-[#C5221F]">(privé !)</span>}
            </li>
          </ul>

          {(health?.errors || []).length > 0 && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-[12px] text-red-700 space-y-1">
              {health.errors.map((e, i) => <p key={i}>• {e}</p>)}
            </div>
          )}

          <div className="rounded-xl bg-[#f8f9fa] border border-[#dadce0] p-3 text-[12px] text-[#5f6368] space-y-1.5">
            <p className="font-semibold text-[#202124]">Checklist rapide</p>
            <p>1. `.env` avec URL + anon key → <strong>redémarrer</strong> <code>npm start</code></p>
            <p>2. SQL Editor → coller / exécuter tout <code>supabase_schema.sql</code></p>
            <p>3. Auth → Email activé (désactiver “Confirm email” en dev)</p>
            <p>4. Se connecter dans Admin → uploader une image JPG/PNG/WebP/GIF/SVG</p>
          </div>
        </div>
      )}
    </Panel>
  );
}

function ImportPreviewModal({ preview, importMode, setImportMode, onCancel, onConfirm }) {
  const { result, fileName } = preview;
  const ok = result?.ok;
  const data = result?.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
        <h3 className="font-semibold text-[16px] text-[#202124] mb-1">Importer JSON</h3>
        <p className="text-[12px] text-[#9aa0a6] mb-3 truncate">{fileName}</p>

        {!ok ? (
          <div className="mb-4">
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-[13px] mb-3">
              <p className="font-semibold mb-1">Validation échouée</p>
              <ul className="list-disc pl-4 space-y-0.5">
                {(result.errors || []).map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
            <button type="button" onClick={onCancel} className="w-full h-11 rounded-xl bg-[#f1f3f4] text-[#5f6368] font-semibold text-[13px]">
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-xl bg-[#f8f9fa] p-2.5 text-center">
                <p className="text-[18px] font-semibold text-[#202124] tabular-nums">{data.items.length}</p>
                <p className="text-[10px] font-semibold uppercase text-[#9aa0a6]">Mots</p>
              </div>
              <div className="rounded-xl bg-[#f8f9fa] p-2.5 text-center">
                <p className="text-[18px] font-semibold text-[#202124] tabular-nums">{data.organization.tabs.length}</p>
                <p className="text-[10px] font-semibold uppercase text-[#9aa0a6]">Onglets</p>
              </div>
              <div className="rounded-xl bg-[#f8f9fa] p-2.5 text-center">
                <p className="text-[18px] font-semibold text-[#202124] tabular-nums">{data.organization.categories.length}</p>
                <p className="text-[10px] font-semibold uppercase text-[#9aa0a6]">Cat. racine</p>
              </div>
            </div>

            {(result.warnings || []).length > 0 && (
              <div className="mb-4 p-3 rounded-xl bg-[#FEF7E0] border border-[#F9AB00]/40 text-[#E37400] text-[12px]">
                <p className="font-semibold mb-1">{result.warnings.length} avertissement(s)</p>
                <ul className="list-disc pl-4 max-h-28 overflow-y-auto space-y-0.5">
                  {result.warnings.slice(0, 12).map((w, i) => <li key={i}>{w}</li>)}
                  {result.warnings.length > 12 && <li>… et {result.warnings.length - 12} de plus</li>}
                </ul>
              </div>
            )}

            <div className="space-y-2 mb-5">
              {[
                { id: 'merge', title: 'Fusionner', desc: 'Met à jour les mots existants (même id) et ajoute les nouveaux. Conserve les images déjà uploadées.', danger: false },
                { id: 'overwrite', title: 'Écraser tout', desc: 'Remplace meta, onglets, catégories et mots par le fichier.', danger: true },
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    importMode === opt.id
                      ? opt.danger ? 'border-red-400 bg-red-50/60' : 'border-[#1a73e8] bg-[#E8F0FE]'
                      : 'border-[#dadce0] hover:bg-[#f8f9fa]'
                  }`}
                >
                  <input type="radio" name="importMode" checked={importMode === opt.id} onChange={() => setImportMode(opt.id)} className="mt-1" />
                  <div>
                    <p className={`text-[14px] font-semibold ${opt.danger ? 'text-red-600' : 'text-[#202124]'}`}>{opt.title}</p>
                    <p className="text-[12px] text-[#5f6368] mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={onCancel} className="flex-1 h-11 rounded-xl bg-[#f1f3f4] text-[#5f6368] font-semibold text-[13px]">Annuler</button>
              <button
                type="button"
                onClick={onConfirm}
                className={`flex-1 h-11 rounded-xl text-white font-semibold text-[13px] ${importMode === 'overwrite' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1a73e8] hover:bg-[#1b66c9]'}`}
              >
                Confirmer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SHARED UI
   ========================================================= */
function Panel({ title, action, icon: Icon, children }) {
  return (
    <div className="bg-white border border-[#dadce0] rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-[#202124] flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-[#1a73e8]" />}
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="bg-white border border-dashed border-[#dadce0] rounded-2xl px-6 py-14 text-center">
      <Icon className="w-10 h-10 text-[#dadce0] mx-auto mb-3" />
      <p className="text-[15px] font-medium text-[#3c4043]">{title}</p>
      {text && <p className="text-[13px] text-[#9aa0a6] mt-1 max-w-sm mx-auto">{text}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

function ConfirmModal({ title, text, onCancel, onConfirm, confirmText, danger }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5">
        <h3 className="font-semibold text-[16px] text-[#202124] mb-2">{title}</h3>
        <p className="text-[13px] text-[#5f6368] mb-5">{text}</p>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="flex-1 h-11 rounded-xl bg-[#f1f3f4] text-[#5f6368] font-semibold text-[13px] hover:bg-[#e8eaed]">Annuler</button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 h-11 rounded-xl text-white font-semibold text-[13px] ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1a73e8] hover:bg-[#1b66c9]'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageModal({ title, currentImage, onSave, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[15px] text-[#202124] truncate pr-2">{title}</h3>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-[#f1f3f4] flex items-center justify-center hover:bg-[#e8eaed] shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <ImageUploader
          currentImage={currentImage}
          onSave={onSave}
          onDelete={currentImage ? onDelete : null}
        />
      </div>
    </div>
  );
}

function AdminAuth({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Inscription réussie. Vérifiez votre e-mail pour confirmer le compte.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLoginSuccess?.(data.session);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#dadce0] rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#E8F0FE] rounded-2xl flex items-center justify-center mx-auto text-[#1a73e8] mb-3">
          <Lock className="w-5 h-5" />
        </div>
        <h2 className="text-[22px] font-medium text-[#202124]">
          {isSignUp ? 'Créer un compte' : 'Connexion admin'}
        </h2>
        <p className="text-[13px] text-[#5f6368] mt-1">
          Accès réservé pour gérer le vocabulaire sur Supabase.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-[13px] flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 text-[13px] flex gap-2">
          <Check className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full h-11 pl-9 pr-4 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] outline-none text-[14px]"
            />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#9aa0a6] mb-1.5 block">Mot de passe</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-11 pl-9 pr-4 rounded-xl bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#1a73e8] outline-none text-[14px]"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-[#1a73e8] text-white font-semibold text-[14px] hover:bg-[#1b66c9] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (isSignUp ? 'Créer le compte' : 'Se connecter')}
        </button>
      </form>

      <button
        type="button"
        onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
        className="w-full mt-5 pt-4 border-t border-[#f1f3f4] text-[13px] text-[#1a73e8] font-medium hover:underline"
      >
        {isSignUp ? 'Déjà un compte ? Se connecter' : 'Créer un compte administrateur'}
      </button>
    </div>
  );
}
