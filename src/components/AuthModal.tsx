import React, { useState } from 'react';
import { X, Mail, Lock, AlertCircle, CheckCircle2, Send, KeyRound } from 'lucide-react';
import { sendLoginLink, loginWithEmail, sendResetEmail } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'link' | 'password' | 'reset'>('link');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Lütfen e-posta adresinizi girin.');
      return;
    }

    setLoading(true);
    try {
      await sendLoginLink(cleanEmail);
      setSuccessMsg('Giriş bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzdaki (ve spam klasöründeki) bağlantıya tıklayın.');
    } catch (err: any) {
      if (err.message === 'Yetkisiz e-posta adresi.') {
        setError('Bu e-posta adresi ile giriş yapılamaz.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('E-posta bağlantısı yöntemi etkinleştirilmemiş. Lütfen şifre ile giriş yapmayı deneyin.');
        setMode('password');
      } else {
        setError(err.message || 'Bağlantı gönderilemedi. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(cleanEmail, password);
      onSuccess();
      onClose();
    } catch {
      setError('E-posta veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Lütfen e-posta adresinizi girin.');
      return;
    }

    setLoading(true);
    try {
      await sendResetEmail(cleanEmail);
      setSuccessMsg('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    } catch {
      setError('İşlem gerçekleştirilemedi. Lütfen e-posta adresinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-paper-50 dark:bg-paper-900 rounded-3xl border border-paper-200 dark:border-paper-800 shadow-2xl p-6 sm:p-8">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-paper-400 hover:text-paper-700 dark:hover:text-paper-200 rounded-xl hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-paper-900 dark:text-paper-100">
            {mode === 'link' ? 'Giriş Yap' : mode === 'password' ? 'Şifre ile Giriş' : 'Şifremi Unuttum'}
          </h2>
          <p className="text-xs text-paper-500 dark:text-paper-400 mt-1">
            {mode === 'link'
              ? 'E-posta adresinize tek kullanımlık güvenli giriş bağlantısı gönderilir.'
              : mode === 'password'
              ? 'Mevcut hesap şifrenizle giriş yapın.'
              : 'Şifrenizi sıfırlamak için bağlantı gönderilir.'}
          </p>
        </div>

        {/* Tab switch between Link & Password */}
        <div className="flex bg-paper-100 dark:bg-paper-800/80 p-1 rounded-xl mb-5 text-xs font-medium">
          <button
            type="button"
            onClick={() => { setMode('link'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'link'
                ? 'bg-white dark:bg-paper-700 text-amber-800 dark:text-amber-200 shadow-sm'
                : 'text-paper-600 dark:text-paper-400 hover:text-paper-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Maile Bağlantı İle</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('password'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'password' || mode === 'reset'
                ? 'bg-white dark:bg-paper-700 text-amber-800 dark:text-amber-200 shadow-sm'
                : 'text-paper-600 dark:text-paper-400 hover:text-paper-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Şifre İle</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Mode: Magic Link */}
        {mode === 'link' && (
          <form onSubmit={handleSendLink} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-paper-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-sm text-paper-900 dark:text-paper-100 placeholder-paper-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-all"
                  placeholder="ornek@eposta.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Gönderiliyor...' : 'Giriş Bağlantısı Gönder'}</span>
            </button>
          </form>
        )}

        {/* Mode: Password */}
        {mode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-paper-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-sm text-paper-900 dark:text-paper-100 placeholder-paper-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-all"
                  placeholder="ornek@eposta.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300">
                  Şifre
                </label>
                <button
                  type="button"
                  onClick={() => { setMode('reset'); setError(null); setSuccessMsg(null); }}
                  className="text-xs text-amber-700 dark:text-amber-400 hover:underline"
                >
                  Şifremi unuttum
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-paper-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-sm text-paper-900 dark:text-paper-100 placeholder-paper-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}</span>
            </button>
          </form>
        )}

        {/* Mode: Reset */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-paper-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-sm text-paper-900 dark:text-paper-100 placeholder-paper-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-all"
                  placeholder="ornek@eposta.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode('password'); setError(null); }}
                className="text-xs text-paper-600 dark:text-paper-400 hover:underline"
              >
                Giriş ekranına geri dön
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
