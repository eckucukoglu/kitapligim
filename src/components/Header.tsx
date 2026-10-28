import React from 'react';
import { BookOpen, Target, Quote, BarChart3, LogIn, LogOut, ShieldCheck, Moon, Sun } from 'lucide-react';
import { ViewTab } from '../types';

interface HeaderProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  isAuthorizedUser: boolean;
  userEmail?: string | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isAuthorizedUser,
  onOpenAuth,
  onLogout,
  darkMode,
  onToggleDarkMode
}) => {
  return (
    <header className="sticky top-0 z-30 bg-paper-50/90 dark:bg-paper-950/90 backdrop-blur-md border-b border-paper-200 dark:border-paper-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-700/10 dark:bg-amber-500/10 border border-amber-700/20 dark:border-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400 shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-paper-900 dark:text-paper-100">
                  Kitaplığım
                </h1>
                <span className="app-version px-2 py-0.5 text-[11px] font-mono font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                  0.0.3
                </span>
              </div>
              <p className="text-xs text-paper-500 dark:text-paper-400 hidden sm:block">
                Kişisel Kitaplık, Notlar & Okuma Hedefleri
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-paper-100 dark:bg-paper-900/60 p-1 rounded-xl border border-paper-200 dark:border-paper-800">
            <button
              onClick={() => onTabChange('library')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'library'
                  ? 'bg-white dark:bg-paper-800 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-paper-600 dark:text-paper-400 hover:text-paper-900 dark:hover:text-paper-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kitaplarım</span>
            </button>
            <button
              onClick={() => onTabChange('goals')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'goals'
                  ? 'bg-white dark:bg-paper-800 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-paper-600 dark:text-paper-400 hover:text-paper-900 dark:hover:text-paper-200'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Hedeflerim</span>
            </button>
            <button
              onClick={() => onTabChange('notes')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-paper-800 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-paper-600 dark:text-paper-400 hover:text-paper-900 dark:hover:text-paper-200'
              }`}
            >
              <Quote className="w-4 h-4" />
              <span>Notlar & Alıntılar</span>
            </button>
            <button
              onClick={() => onTabChange('stats')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'stats'
                  ? 'bg-white dark:bg-paper-800 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-paper-600 dark:text-paper-400 hover:text-paper-900 dark:hover:text-paper-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>İstatistikler</span>
            </button>
          </nav>

          {/* Right actions: Theme & Auth */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              aria-label="Tema değiştir"
              className="p-2 rounded-lg text-paper-600 dark:text-paper-400 hover:bg-paper-200/50 dark:hover:bg-paper-800 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthorizedUser ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Yönetici</span>
                </span>
                <button
                  onClick={onLogout}
                  title="Çıkış yap"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg border border-rose-200 dark:border-rose-900/50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-300 bg-amber-100/80 hover:bg-amber-200 dark:bg-amber-950/50 dark:hover:bg-amber-900/50 rounded-lg border border-amber-300 dark:border-amber-800 transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Giriş Yap</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-2 border-t border-paper-200 dark:border-paper-800/80 no-scrollbar">
          <button
            onClick={() => onTabChange('library')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'library'
                ? 'bg-amber-700 text-white dark:bg-amber-600'
                : 'bg-paper-100 dark:bg-paper-900 text-paper-700 dark:text-paper-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Kitaplarım
          </button>
          <button
            onClick={() => onTabChange('goals')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'goals'
                ? 'bg-amber-700 text-white dark:bg-amber-600'
                : 'bg-paper-100 dark:bg-paper-900 text-paper-700 dark:text-paper-300'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Hedeflerim
          </button>
          <button
            onClick={() => onTabChange('notes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-amber-700 text-white dark:bg-amber-600'
                : 'bg-paper-100 dark:bg-paper-900 text-paper-700 dark:text-paper-300'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            Notlar
          </button>
          <button
            onClick={() => onTabChange('stats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-amber-700 text-white dark:bg-amber-600'
                : 'bg-paper-100 dark:bg-paper-900 text-paper-700 dark:text-paper-300'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            İstatistik
          </button>
        </div>

      </div>
    </header>
  );
};
