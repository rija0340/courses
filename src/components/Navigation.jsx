import React, { useContext, useState, useEffect } from 'react';
import { Settings, Globe, Languages, Moon, Sun, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import { CompactMenu, MenuButton, MenuLink, MenuTrigger } from './CompactMenu';
import { getSessionTheme, toggleSessionTheme } from '../utils/sessionTheme';

const LANGS = [
  { id: 'mg', label: 'Malagasy' },
  { id: 'fr', label: 'Français' },
  { id: 'en', label: 'English' }
];

const Navigation = () => {
  const { lang, setLang } = useContext(AppContext);
  const location = useLocation();
  const [theme, setTheme] = useState(() => getSessionTheme());

  useEffect(() => {
    setTheme(getSessionTheme());
  }, []);

  const vocabMatch = location.pathname.match(/^\/vocabs\/([^/]+)/);
  const domainId = vocabMatch ? vocabMatch[1] : null;
  const isAdminRoute = location.pathname.includes('/admin');
  const isHome = location.pathname === '/';
  const isCourseRoute = location.pathname.startsWith('/course/');
  const showAdminMenu = (isHome || domainId || isCourseRoute) && !isAdminRoute;

  const handleToggleTheme = () => {
    setTheme(toggleSessionTheme());
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#202124] border-b border-[#dadce0] dark:border-[#3c4043] shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img
            src={`${process.env.PUBLIC_URL || ''}/logo.svg`}
            alt="LearnHub"
            className="w-8 h-8 rounded-lg shrink-0"
            width={32}
            height={32}
          />
          <span className="font-medium text-lg sm:text-xl text-[#3c4043] dark:text-[#e8eaed] truncate">LearnHub</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={handleToggleTheme}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#303134] text-[#5f6368] dark:text-[#e8eaed] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] transition-all"
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            aria-label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {showAdminMenu && (
            <CompactMenu
              className="sm:hidden"
              trigger={(open) => <MenuTrigger icon={Settings} label="Administration" open={open} />}
            >
              <MenuLink to="/admin/vocabs">
                <Globe size={15} className="text-[#5f6368]" />
                Admin vocabs
              </MenuLink>
              <MenuLink to="/admin/courses">
                <Settings size={15} className="text-[#5f6368]" />
                Admin cours
              </MenuLink>
              {domainId && (
                <MenuLink to={`/vocabs/${domainId}/admin`}>
                  <Settings size={15} className="text-[#5f6368]" />
                  Admin domaine
                </MenuLink>
              )}
            </CompactMenu>
          )}

          {showAdminMenu && (
            <Link
              to="/admin/courses"
              className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-full border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#303134] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] text-[#5f6368] dark:text-[#e8eaed] text-sm font-medium transition-all shadow-sm shrink-0"
              title="Admin cours JSON"
            >
              <BookOpen size={14} />
              <span>Admin cours</span>
            </Link>
          )}

          {showAdminMenu && (
            <Link
              to="/admin/vocabs"
              className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-full border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#303134] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] text-[#5f6368] dark:text-[#e8eaed] text-sm font-medium transition-all shadow-sm shrink-0"
              title="Admin global vocabulaires"
            >
              <Globe size={14} />
              <span>Admin vocabs</span>
            </Link>
          )}

          {domainId && !isAdminRoute && (
            <Link
              to={`/vocabs/${domainId}/admin`}
              className="hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-full border border-[#dadce0] dark:border-[#5f6368] bg-white dark:bg-[#303134] hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043] text-[#5f6368] dark:text-[#e8eaed] text-sm font-medium transition-all shadow-sm shrink-0"
            >
              <Settings size={14} />
              <span>Admin</span>
            </Link>
          )}

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

          <div className="hidden sm:flex bg-[#f1f3f4] dark:bg-[#303134] p-[2px] rounded-full">
            {LANGS.map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  lang === l.id
                    ? 'bg-white dark:bg-[#3c4043] text-[#1a73e8] dark:text-[#8ab4f8] shadow-sm'
                    : 'text-[#5f6368] dark:text-[#9aa0a6] hover:bg-black/5 dark:hover:bg-white/5'
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
