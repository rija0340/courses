import React, { useContext, useState, useEffect } from 'react';
import { Settings, Languages, Moon, Sun } from 'lucide-react';
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
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.includes('/admin');
  const showAdmin = !isAdminRoute || location.pathname === '/admin';

  const adminTo = domainId ? `/admin?domain=${domainId}` : '/admin';

  const handleToggleTheme = () => {
    setTheme(toggleSessionTheme());
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b border-lh-border shadow-lh backdrop-blur-md"
      style={{ backgroundColor: 'var(--lh-nav)', borderColor: 'var(--lh-nav-border)' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img
            src={`${process.env.PUBLIC_URL || ''}/logo.svg`}
            alt="LearnHub"
            className="w-8 h-8 rounded-lg shrink-0"
            width={32}
            height={32}
          />
          <span className="font-medium text-lg sm:text-xl text-lh-text truncate">LearnHub</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={handleToggleTheme}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-lh-border bg-lh-card text-lh-secondary hover:bg-lh-muted transition-all"
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            aria-label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {showAdmin && (
            <>
              <CompactMenu
                className="sm:hidden"
                trigger={(open) => <MenuTrigger icon={Settings} label="Administration" open={open} />}
              >
                <MenuLink to={adminTo}>
                  <Settings size={15} className="text-lh-secondary" />
                  Admin
                </MenuLink>
              </CompactMenu>
              <Link
                to={adminTo}
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-lh-border bg-lh-card hover:bg-lh-muted text-lh-secondary text-sm font-medium transition-all shadow-lh shrink-0"
                title="Administration"
              >
                <Settings size={14} />
                <span>Admin</span>
              </Link>
            </>
          )}

          <CompactMenu
            className="sm:hidden"
            trigger={(open) => (
              <MenuTrigger icon={Languages} label="Langue de l'interface" open={open} badge={lang} />
            )}
          >
            {LANGS.map((l) => (
              <MenuButton key={l.id} active={lang === l.id} onClick={() => setLang(l.id)}>
                <span className="w-7 text-[11px] font-bold uppercase text-lh-faint">{l.id}</span>
                {l.label}
              </MenuButton>
            ))}
          </CompactMenu>

          <div className="hidden sm:flex bg-lh-muted p-[2px] rounded-full">
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  lang === l.id
                    ? 'bg-lh-card text-lh-accent shadow-lh'
                    : 'text-lh-secondary hover:bg-black/5 dark:hover:bg-white/5'
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
