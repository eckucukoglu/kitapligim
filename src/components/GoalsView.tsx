import React from 'react';
import { Target, Award, Calendar, BookOpen, Flame, TrendingUp, CheckCircle, Edit3 } from 'lucide-react';
import { Book, ReadingGoal } from '../types';

interface GoalsViewProps {
  goal: ReadingGoal | null;
  books: Book[];
  isAuthorizedUser?: boolean;
  onEditGoalClick: () => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goal,
  books,
  onEditGoalClick,
}) => {
  const currentYear = new Date().getFullYear();
  const targetYear = goal?.year || currentYear;
  const targetBooks = goal?.targetBooks || 24;
  const targetPages = goal?.targetPages || 6000;

  // Filter books finished in this year
  const finishedBooksThisYear = books.filter((b) => {
    if (b.status !== 'read') return false;
    if (b.finishDate) {
      return b.finishDate.startsWith(String(targetYear));
    }
    // Fallback: if updated or created this year
    const d = new Date(b.updatedAt || b.createdAt);
    return d.getFullYear() === targetYear;
  });

  const completedBooksCount = finishedBooksThisYear.length;
  const completedPagesCount = finishedBooksThisYear.reduce((acc, b) => acc + (b.totalPages || 0), 0);

  const percentBooks = Math.min(100, Math.round((completedBooksCount / targetBooks) * 100));
  const percentPages = targetPages ? Math.min(100, Math.round((completedPagesCount / targetPages) * 100)) : 0;
  const remainingBooks = Math.max(0, targetBooks - completedBooksCount);

  // Month calculation
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const remainingMonths = Math.max(1, 12 - currentMonth + 1);
  const neededPerMonth = remainingBooks > 0 ? (remainingBooks / remainingMonths).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-paper-900 dark:text-paper-100 flex items-center gap-2.5">
            <Target className="w-7 h-7 text-amber-700 dark:text-amber-400" />
            <span>{targetYear} Okuma Hedefleri</span>
          </h2>
          <p className="text-xs sm:text-sm text-paper-500 dark:text-paper-400 mt-1">
            Yıllık okuma alışkanlığınızı takip edin ve hedeflerinize ulaşın.
          </p>
        </div>

        <button
          onClick={onEditGoalClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 font-medium text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>Hedefi Düzenle</span>
        </button>
      </div>

      {/* Main Challenge Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Progress summary */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>Yıllık Okuma Maratonu</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              {completedBooksCount} / {targetBooks} Kitap
            </h3>

            <p className="text-sm text-amber-100/90 leading-relaxed max-w-md">
              {percentBooks >= 100
                ? 'Tebrikler! Yıllık okuma hedefinizi başarıyla tamamladınız! 🏆'
                : remainingBooks === 1
                ? 'Hedefe ulaşmak için yalnızca 1 kitap kaldı! 🎯'
                : `Yıllık hedefinizi tamamlamak için ${remainingBooks} kitap kaldı. Yıl sonuna kadar ayda yaklaşık ${neededPerMonth} kitap okumanız yeterli.`}
            </p>

            {/* Book Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-amber-200">
                <span>Kitap İlerlemesi</span>
                <span>%{percentBooks}</span>
              </div>
              <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="bg-gradient-to-r from-amber-300 to-amber-100 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${percentBooks}%` }}
                />
              </div>
            </div>

            {/* Pages Progress Bar (if pages specified) */}
            {targetPages ? (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold text-amber-200">
                  <span>Sayfa İlerlemesi ({completedPagesCount.toLocaleString('tr-TR')} / {targetPages.toLocaleString('tr-TR')} sayfa)</span>
                  <span>%{percentPages}</span>
                </div>
                <div className="w-full bg-black/30 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentPages}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Stat Badges */}
          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <Flame className="w-5 h-5 text-amber-300 mb-2" />
              <div className="text-2xl font-bold font-serif">{completedBooksCount}</div>
              <div className="text-xs text-amber-200/80">Okunan Kitap</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <BookOpen className="w-5 h-5 text-amber-300 mb-2" />
              <div className="text-2xl font-bold font-serif">{completedPagesCount.toLocaleString('tr-TR')}</div>
              <div className="text-xs text-amber-200/80">Okunan Sayfa</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <TrendingUp className="w-5 h-5 text-amber-300 mb-2" />
              <div className="text-2xl font-bold font-serif">{remainingBooks}</div>
              <div className="text-xs text-amber-200/80">Kalan Kitap</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <Calendar className="w-5 h-5 text-amber-300 mb-2" />
              <div className="text-2xl font-bold font-serif">{neededPerMonth}</div>
              <div className="text-xs text-amber-200/80">Aylık Gereken</div>
            </div>
          </div>

        </div>
      </div>

      {/* Finished books of this year */}
      <div className="bg-white dark:bg-paper-900 rounded-3xl border border-paper-200 dark:border-paper-800 p-6 sm:p-8 shadow-sm">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-paper-900 dark:text-paper-100 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{targetYear} Yılında Bitirilen Kitaplar ({finishedBooksThisYear.length})</span>
        </h3>

        {finishedBooksThisYear.length === 0 ? (
          <p className="text-xs sm:text-sm text-paper-500 dark:text-paper-400 italic py-4">
            Bu yıl henüz bitirilen kitap kaydedilmemiş. Okudukça listeniz burada birikecektir.
          </p>
        ) : (
          <div className="divide-y divide-paper-100 dark:divide-paper-800">
            {finishedBooksThisYear.map((book, idx) => (
              <div key={book.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-paper-900 dark:text-paper-100">
                      {book.title}
                    </h4>
                    <p className="text-xs text-paper-500 dark:text-paper-400">
                      {book.author} {book.totalPages ? `• ${book.totalPages} sayfa` : ''}
                    </p>
                  </div>
                </div>

                {book.finishDate && (
                  <span className="text-xs text-paper-500 font-mono shrink-0">
                    {book.finishDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
