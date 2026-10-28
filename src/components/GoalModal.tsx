import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { ReadingGoal } from '../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: ReadingGoal) => void;
  currentGoal: ReadingGoal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentGoal,
}) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentGoal?.year || currentYear);
  const [targetBooks, setTargetBooks] = useState<string>(
    currentGoal?.targetBooks ? String(currentGoal.targetBooks) : '24'
  );
  const [targetPages, setTargetPages] = useState<string>(
    currentGoal?.targetPages ? String(currentGoal.targetPages) : '6000'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const booksNum = parseInt(targetBooks, 10);
    const pagesNum = targetPages ? parseInt(targetPages, 10) : undefined;
    if (isNaN(booksNum) || booksNum < 1) return;

    onSave({
      year,
      targetBooks: booksNum,
      targetPages: pagesNum,
      updatedAt: Date.now(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-paper-50 dark:bg-paper-900 rounded-2xl border border-paper-200 dark:border-paper-800 shadow-2xl p-6 sm:p-8">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-paper-400 hover:text-paper-700 dark:hover:text-paper-200 rounded-lg hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-paper-900 dark:text-paper-100">
              Okuma Hedefi Belirle
            </h2>
            <p className="text-xs text-paper-500 dark:text-paper-400">
              Yıllık okuma motivasyonunuzu yüksek tutun.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
              Hedef Yılı
            </label>
            <input
              type="number"
              min="2020"
              max="2035"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              required
              className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
              Yıllık Hedef Kitap Sayısı *
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={targetBooks}
              onChange={(e) => setTargetBooks(e.target.value)}
              required
              placeholder="Örn: 24"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
            />
            <p className="text-[11px] text-paper-500 mt-1">
              (Yılda {targetBooks || 0} kitap: Ayda yaklaşık {Math.round(((parseInt(targetBooks, 10) || 0) / 12) * 10) / 10} kitap)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
              Hedef Toplam Sayfa Sayısı (İsteğe Bağlı)
            </label>
            <input
              type="number"
              min="1"
              value={targetPages}
              onChange={(e) => setTargetPages(e.target.value)}
              placeholder="Örn: 6000"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-paper-700 dark:text-paper-300 hover:bg-paper-200/50 dark:hover:bg-paper-800 rounded-xl transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-xl shadow-md transition-all"
            >
              Hedefi Kaydet
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
