import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, ArrowLeft, AlertCircle, Check, Eye, Settings2, Trash2,
  BookOpen, HeartPulse, Cpu, Languages, Scale, Briefcase, GraduationCap, Globe, FlaskConical, LogOut
} from 'lucide-react';
import { AppContext } from '../App';
import Breadcrumb from '../components/Breadcrumb';
import AdminAuth from '../components/vocabs/admin/AdminAuth';
import useVocabDomainsList from '../hooks/useVocabDomainsList';
import vocabStorage from '../services/vocabStorage';
import { supabase } from '../services/supabaseClient';
import { ACTIVE_PROVIDER, STORAGE_PROVIDERS } from '../services/storageConfig';
import {
  validateDomainId,
  buildDefaultOrganization,
  buildDefaultDomainMeta,
  I18N_LANGS
} from '../data/vocabs/vocabDomainSchema';

const ICON_OPTIONS = [
  { id: 'BookOpen', Icon: BookOpen },
  { id: 'HeartPulse', Icon: HeartPulse },
  { id: 'Cpu', Icon: Cpu },
  { id: 'Languages', Icon: Languages },
  { id: 'Scale', Icon: Scale },
  { id: 'Briefcase', Icon: Briefcase },
  { id: 'GraduationCap', Icon: GraduationCap },
  { id: 'Globe', Icon: Globe },
  { id: 'FlaskConical', Icon: FlaskConical }
];

const ICON_MAP = Object.fromEntries(ICON_OPTIONS.map(o => [o.id, o.Icon]));

export default function VocabsGlobalAdmin() {
  const { lang } = useContext(AppContext);
  const navigate = useNavigate();
  const { domains, loading, error, refresh } = useVocabDomainsList(lang);

  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [toast, setToast] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState({
    id: '',
    title: { fr: '', en: '', mg: '' },
    description: { fr: '', en: '', mg: '' },
    icon: 'BookOpen',
    color: '#1a73e8',
    tabPreset: 'vocabOnly'
  });

  useEffect(() => {
    if (ACTIVE_PROVIDER !== STORAGE_PROVIDERS.SUPABASE || !supabase) {
      setCheckingAuth(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setCheckingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) refresh();
    });
    return () => subscription?.unsubscribe();
  }, [refresh]);

  const showToastMsg = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  };

  const getLabel = (obj, fallback = '') => {
    if (!obj) return fallback;
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.fr || fallback;
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      showToastMsg('Déconnecté');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const idErr = validateDomainId(form.id.trim());
    if (idErr) {
      showToastMsg(idErr, 'error');
      return;
    }
    if (!form.title.fr.trim()) {
      showToastMsg('Titre FR requis', 'error');
      return;
    }

    setCreating(true);
    try {
      const domainId = form.id.trim();
      const meta = buildDefaultDomainMeta({
        title: form.title,
        description: form.description,
        icon: form.icon,
        color: form.color
      });
      const organization = buildDefaultOrganization(form.tabPreset);
      await vocabStorage.createDomain(domainId, { meta, organization });
      await refresh();
      showToastMsg(`Domaine « ${domainId} » créé`);
      setShowCreate(false);
      navigate(`/vocabs/${domainId}/admin`);
    } catch (err) {
      showToastMsg(err.message || 'Échec création', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (domainId) => {
    const domain = domains.find(d => d.id === domainId);
    const label = getLabel(domain?.title, domainId);
    if (!window.confirm(`Supprimer définitivement « ${label} » (${domainId}) ? Cette action est irréversible.`)) {
      return;
    }
    setDeletingId(domainId);
    try {
      await vocabStorage.deleteDomain(domainId);
      await refresh();
      showToastMsg('Domaine supprimé');
    } catch (err) {
      showToastMsg(err.message || 'Échec suppression', 'error');
    } finally {
      setDeletingId(null);
    }
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
        <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-[#5f6368] hover:text-[#202124] mb-8">
          <ArrowLeft className="w-4 h-4" />
          Accueil
        </Link>
        <h1 className="text-2xl font-medium text-[#202124] mb-2">Admin global — Vocabs</h1>
        <p className="text-[14px] text-[#5f6368] mb-6">Connectez-vous pour gérer tous les domaines vocabulaires.</p>
        <AdminAuth onLoginSuccess={(s) => { setSession(s); refresh(); }} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-24">
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

      <Breadcrumb items={[{ label: 'Admin global vocabs' }]} />

      <header className="flex flex-wrap items-start justify-between gap-4 mb-8 mt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#202124]">Admin global — Vocabs</h1>
          <p className="text-[14px] text-[#5f6368] mt-1">
            Créez et gérez tous les domaines vocabulaires.
            {session?.user?.email ? ` · ${session.user.email}` : ''}
          </p>
          {error && <p className="text-[13px] text-amber-700 mt-2">{error}</p>}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowCreate(v => !v)}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold hover:bg-[#1b66c9]"
          >
            <Plus className="w-4 h-4" />
            Nouveau domaine
          </button>
          {session && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl border border-[#dadce0] bg-white text-[13px] text-[#5f6368] hover:bg-[#f1f3f4]"
            >
              <LogOut className="w-4 h-4" />
              Sortir
            </button>
          )}
        </div>
      </header>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-8 bg-white border border-[#dadce0] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <h2 className="text-[18px] font-medium text-[#202124]">Créer un domaine</h2>

          <div>
            <label className="block text-[13px] font-medium text-[#3c4043] mb-1">Identifiant (slug URL)</label>
            <input
              value={form.id}
              onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
              placeholder="juridique-vocabs"
              className="w-full h-10 px-3 rounded-xl border border-[#dadce0] text-[14px] focus:border-[#1a73e8] outline-none"
            />
            <p className="text-[12px] text-[#9aa0a6] mt-1">Recommandé : suffixe -vocabs. URL publique : /vocabs/{form.id || '…'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {I18N_LANGS.map(l => (
              <div key={l}>
                <label className="block text-[12px] font-bold uppercase text-[#9aa0a6] mb-1">Titre {l}</label>
                <input
                  value={form.title[l]}
                  onChange={e => setForm(f => ({ ...f, title: { ...f.title, [l]: e.target.value } }))}
                  className="w-full h-10 px-3 rounded-xl border border-[#dadce0] text-[14px] focus:border-[#1a73e8] outline-none"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {I18N_LANGS.map(l => (
              <div key={l}>
                <label className="block text-[12px] font-bold uppercase text-[#9aa0a6] mb-1">Description {l}</label>
                <input
                  value={form.description[l]}
                  onChange={e => setForm(f => ({ ...f, description: { ...f.description, [l]: e.target.value } }))}
                  className="w-full h-10 px-3 rounded-xl border border-[#dadce0] text-[14px] focus:border-[#1a73e8] outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-[13px] font-medium text-[#3c4043] mb-2">Icône</label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map(({ id, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, icon: id }))}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                      form.icon === id ? 'border-[#1a73e8] bg-[#E8F0FE] text-[#1a73e8]' : 'border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#3c4043] mb-1">Couleur</label>
              <input
                type="color"
                value={form.color}
                onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                className="w-12 h-10 rounded-lg border border-[#dadce0] cursor-pointer"
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[13px] font-medium text-[#3c4043] mb-1">Onglets par défaut</label>
              <select
                value={form.tabPreset}
                onChange={e => setForm(f => ({ ...f, tabPreset: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-[#dadce0] text-[14px] bg-white"
              >
                <option value="vocabOnly">Vocabulaire seul</option>
                <option value="full">Vocab + Maladies + Expressions</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={creating}
              className="h-10 px-5 rounded-xl bg-[#1a73e8] text-white text-[13px] font-semibold hover:bg-[#1b66c9] disabled:opacity-50"
            >
              {creating ? 'Création…' : 'Créer le domaine'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="h-10 px-4 rounded-xl border border-[#dadce0] text-[13px] text-[#5f6368] hover:bg-[#f8f9fa]"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {domains.length === 0 && (
          <p className="text-center text-[#5f6368] py-12">Aucun domaine vocabulaire. Créez-en un pour commencer.</p>
        )}
        {domains.map(d => {
          const IconComp = ICON_MAP[d.icon] || BookOpen;
          return (
            <div
              key={d.id}
              className="bg-white border border-[#dadce0] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center gap-4 hover:shadow-sm transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: d.color || '#1a73e8' }}
              >
                <IconComp className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <h2 className="text-[17px] font-medium text-[#202124]">{getLabel(d.title, d.id)}</h2>
                <p className="text-[13px] text-[#9aa0a6] font-mono">{d.id}</p>
                <p className="text-[13px] text-[#5f6368] mt-0.5">
                  {d.itemCount ?? 0} mot{(d.itemCount ?? 0) !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/vocabs/${d.id}`}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#dadce0] text-[13px] font-medium text-[#3c4043] hover:bg-[#f1f3f4]"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Aperçu
                </Link>
                <Link
                  to={`/vocabs/${d.id}/admin`}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#dadce0] text-[13px] font-medium text-[#3c4043] hover:bg-[#f1f3f4]"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  Admin
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(d.id)}
                  disabled={deletingId === d.id}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-red-200 text-[13px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {deletingId === d.id ? '…' : 'Supprimer'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Link to="/" className="text-[13px] text-[#5f6368] hover:text-[#1a73e8] inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
