import React, { useState } from 'react';
import { X, Mail, Lock, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { AUTHORIZED_EMAIL, loginWithEmail, sendResetEmail } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState(AUTHORIZED_EMAIL);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== AUTHORIZED_EMAIL.toLowerCase()) {
      setError(`Bu uygulama kişiseldir. Yalnızca yetkili e-posta adresi (${AUTHORIZED_EMAIL}) ile veri değişikliği yapılabilir.`);
      return;
    }

    if (isResetMode) {
      setLoading(true);
      try {
        await sendResetEmail(cleanEmail);
        setResetSent(true);
      } catch (err: any) {
        setError(err.message || 'Şifre sıfırlama bağlantısı gönderilemedi.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setError('Lütfen şifrenizi girin.');
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(cleanEmail, password);
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Hatalı şifre veya e-posta. Lütfen kontrol edip tekrar deneyin.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.');
      } else {
        setError(err.message || 'Giriş yapılırken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-paper-50 dark:bg-paper-900 rounded-2xl border border-paper-200 dark:border-paper-800 shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-paper-400 hover:text-paper-700 dark:hover:text-paper-200 rounded-lg hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-paper-900 dark:text-paper-100">
            {isResetMode ? 'Şifre Sıfırlama' : 'Yetkili Girişi'}
          </h2>
          <p className="text-xs sm:text-sm text-paper-600 dark:text-paper-400 mt-1">
            Kişisel kütüphane ve okuma hedeflerini düzenlemek için yetkili hesapla giriş yapın.
          </p>
        </div>

        {/* Informational banner about authorized email */}
        <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            Veri değişikliği (ekleme, düzenleme, silme) yalnızca <strong>{AUTHORIZED_EMAIL}</strong> adresine açıktır.
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSent && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-paper-600 dark:text-paper-400 mb-1.5">
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
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-sm text-paper-900 dark:text-paper-100 placeholder-paper-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-all font-mono"
                placeholder={AUTHORIZED_EMAIL}
              />
            </div>
          </div>

          {!isResetMode && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-paper-600 dark:text-paper-400">
                  Şifre
                </label>
                <button
                  type="button"
                  onClick={() => { setIsResetMode(true); setError(null); }}
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
                  required={!isResetMode}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-sm text-paper-900 dark:text-paper-100 placeholder-paper-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>İşleniyor...</span>
              ) : isResetMode ? (
                <span>Sıfırlama Bağlantısı Gönder</span>
              ) : (
                <span>Giriş Yap</span>
              )}
            </button>
          </div>

          {isResetMode && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setIsResetMode(false); setError(null); }}
                className="text-xs text-paper-600 dark:text-paper-400 hover:underline"
              >
                Giriş ekranına geri dön
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
};
