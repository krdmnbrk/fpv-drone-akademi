import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { LanguageSwitcher } from '@/components/settings/LanguageSwitcher';
import { MotionToggle } from '@/components/settings/MotionToggle';
import { cn } from '@/lib/cn';

const navItems = [
  { to: '/', key: 'home', end: true },
  { to: '/hardware', key: 'hardware', end: false },
  { to: '/flight', key: 'flight', end: false },
  { to: '/sozluk', key: 'glossary', end: false },
  { to: '/progress', key: 'progress', end: false },
] as const;

function navLinkClasses({ isActive }: { isActive: boolean }): string {
  return cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-fast ease-standard',
    isActive ? 'bg-white/10 text-white' : 'text-brand-100 hover:bg-white/5 hover:text-white',
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

export function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-950/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-base font-bold text-white"
          onClick={() => setMenuOpen(false)}
        >
          <span
            aria-hidden="true"
            className="inline-block h-3 w-3 rotate-45 rounded-sm bg-brand-400"
          />
          {t('common.appName')}
        </NavLink>

        <nav aria-label={t('common.appName')} className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClasses}>
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <MotionToggle />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-100 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </Container>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-white/10 bg-brand-950 md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClasses}
                onClick={() => setMenuOpen(false)}
              >
                {t(`nav.${item.key}`)}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-3">
              <LanguageSwitcher />
              <MotionToggle />
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
