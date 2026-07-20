import React, { useContext } from 'react';
import { BookOpen, Settings, Globe, Languages } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import { CompactMenu, MenuButton, MenuLink, MenuTrigger } from './CompactMenu';

const LANGS = [
  { id: 'mg', label: 'Malagasy' },
  { id: 'fr', label: 'Français' },
  { id: 'en', label: 'English' }
];

const Navigation = () => {
  const { lang, setLang } = useContext(AppContext);
  const location = useLocation();

  const vocabMatch = location.pathname.match(/^\/vocabs\/([^/]+)/);
  const domainId = vocabMatch ? vocabMatch[1] : null;
  const isAdminRoute = location.pathname.includes('/admin');
  const isHome = location.pathname === '/';
  const showAdminMenu = (isHome || domainId) && !isAdminRoute;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#dadce0] shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 bg-[#1a73e8] rounded-lg flex items-center justify-center text-white shrink-0">
            <BookOpen size={18} />
          </div>
          <span className="font-medium text-lg sm:text-xl text-[#3c4043] truncate">LearnHub</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile: admin dropdown */}
          {showAdminMenu && (
            <CompactMenu
              className="sm:hidden"
              trigger={(open) => <MenuTrigger icon={Settings} label="Administration" open={open} />}
            >
              <MenuLink to="/admin/vocabs">
                <Globe size={15} className="text-[#5f6368]" />
                Admin global
              </MenuLink>
              {domainId && (
                <MenuLink to={`/vocabs/${domainId}/admin`}>
                  <Settings size={15} className="text-[#5f6368]" />
                  Admin domaine
                </MenuLink>
              )}
            </CompactMenu>
          )}

          {/* Desktop: admin links */}
          {showAdminMenu && (
            <Link
              to="/admin/vocabs"
              className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-full border border-[#dadce0] bg-white hover:bg-[#f1f3f4] text-[#5f6368] text-sm font-medium transition-all shadow-sm shrink-0"
              title="Admin global vocabulaires"
            >
              <Globe size={14} />
              <span>Admin global</span>
            </Link>
          )}

          {domainId && !isAdminRoute && (
            <Link
              to={`/vocabs/${domainId}/admin`}
              className="hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-full border border-[#dadce0] bg-white hover:bg-[#f1f3f4] text-[#5f6368] text-sm font-medium transition-all shadow-sm shrink-0"
            >
              <Settings size={14} />
              <span>Admin</span>
            </Link>
          )}

          {/* Mobile: lang dropdown */}
          <CompactMenu
            className="sm:hidden"
            trigger={(open) => (
              <MenuTrigger icon={Languages} label="Langue de l'interface" open={open} badge={lang} />
            )}
          >
            {LANGS.map(l => (
              <MenuButton key={l.id} active={lang === l.id} onClick={() => setLang(l.id)}>
                <span className="w-7 text-[11px] font-bold uppercase text-[#9aa0a6]">{l.id}</span>
                {l.label}
              </MenuButton>
            ))}
          </CompactMenu>

          {/* Desktop: lang pills */}
          <div className="hidden sm:flex bg-[#f1f3f4] p-[2px] rounded-full">
            {LANGS.map(l => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  lang === l.id
                    ? 'bg-white text-[#1a73e8] shadow-sm'
                    : 'text-[#5f6368] hover:bg-black/5'
                }`}
              >
                {l.id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
