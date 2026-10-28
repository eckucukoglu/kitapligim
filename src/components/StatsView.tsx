import React from 'react';
import { BarChart3, BookOpen, CheckCircle, Clock, Bookmark, Star, Download, Sparkles } from 'lucide-react';
import { Book, BookNote } from '../types';

interface StatsViewProps {
  books: Book[];
  notes: BookNote[];
}

export const StatsView: React.FC<StatsViewProps> = ({ books, notes }) => {
  const readBooks = books.filter((b) => b.status === 'read');
  const readingBooks = books.filter((b) => b.status === 'reading');
  const wantBooks = books.filter((b) => b.status === 'want_to_read');
  
  const totalPagesRead = readBooks.reduce((acc, b) => acc + (b.totalPages || 0), 0) +
    readingBooks.reduce((acc, b) => acc + (b.currentPage || 0), 0);

  const avgPages = readBooks.length > 0 ? Math.round(totalPagesRead / readBooks.length) : 0;

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  books.forEach((b) => {
    const cat = b.category || 'Diğer';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  // Rating breakdown
  const ratedBooks = books.filter((b) => b.rating && b.rating > 0);
  const avgRating = ratedBooks.length > 0
    ? (ratedBooks.reduce((acc, b) => acc + (b.rating || 0), 0) / ratedBooks.length).toFixed(1)
    : '0';

  // Export JSON backup
  const handleExportData = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      version: '0.0.1',
      books,
      notes,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kitapligim-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-paper-900 dark:text-paper-100 flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-amber-700 dark:text-amber-400" />
            <span>Okuma İstatistikleri</span>
          </h2>
          <p className="text-xs sm:text-sm text-paper-500 dark:text-paper-400 mt-1">
            Kişisel kütüphane ve okuma alışkanlıklarınıza dair detaylı veriler.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-paper-100 hover:bg-paper-200 dark:bg-paper-800 dark:hover:bg-paper-700 text-paper-800 dark:text-paper-200 border border-paper-200 dark:border-paper-700 font-medium text-xs sm:text-sm shadow-sm transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Verileri İndir (JSON Yedek)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-paper-900 rounded-3xl border border-paper-200 dark:border-paper-800 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-paper-900 dark:text-paper-100">
            {readBooks.length}
          </div>
          <div className="text-xs text-paper-500 dark:text-paper-400 font-medium mt-1">
            Okunan Kitap
          </div>
        </div>

        <div className="bg-white dark:bg-paper-900 rounded-3xl border border-paper-200 dark:border-paper-800 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-paper-900 dark:text-paper-100">
            {totalPagesRead.toLocaleString('tr-TR')}
          </div>
          <div className="text-xs text-paper-500 dark:text-paper-400 font-medium mt-1">
            Okunan Toplam Sayfa
          </div>
        </div>

        <div className="bg-white dark:bg-paper-900 rounded-3xl border border-paper-200 dark:border-paper-800 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-paper-900 dark:text-paper-100">
            {readingBooks.length}
          </div>
          <div className="text-xs text-paper-500 dark:text-paper-400 font-medium mt-1">
            Şu An Okunan
          </div>
        </div>

        <div className="bg-white dark:bg-paper-900 rounded-3xl border border-paper-200 dark:border-paper-800 p-5 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-paper-900 dark:text-paper-100">
            {notes.length}
          </div>
          <div className="text-xs text-paper-500 dark:text-paper-400 font-medium mt-1">
            Kaydedilen Alıntı / Not
          </div>
        </div>
      </div>

      {/* Grid: Category distribution & Rating breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Categories */}
        <div className="bg-white dark:bg-paper-900 rounded-3xl border border-paper-200 dark:border-paper-800 p-6 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-paper-900 dark:text-paper-100 mb-4">
            Kategoriye Göre Dağılım
          </h3>
          {sortedCategories.length === 0 ? (
            <p className="text-xs text-paper-500 italic">Kategori bilgisi bulunmuyor.</p>
          ) : (
            <div className="space-y-3">
              {sortedCategories.map(([cat, count]) => {
                const percent = Math.round((count / books.length) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs text-paper-700 dark:text-paper-300">
                      <span className="font-medium">{cat}</span>
                      <span className="text-paper-500 font-mono">{count} kitap (%{percent})</span>
                    </div>
                    <div className="w-full bg-paper-100 dark:bg-paper-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-600 dark:bg-amber-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reading Habits & Highlights */}
        <div className="bg-white dark:bg-paper-900 rounded-3xl border border-paper-200 dark:border-paper-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-paper-900 dark:text-paper-100 mb-4">
              Okuma Alışkanlıkları
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-paper-50 dark:bg-paper-950/60 border border-paper-200/70 dark:border-paper-800/70 flex items-center justify-between">
                <div>
                  <div className="text-xs text-paper-500 dark:text-paper-400">Ortalama Kitap Kalınlığı</div>
                  <div className="text-lg font-bold font-serif text-paper-900 dark:text-paper-100">
                    {avgPages > 0 ? `${avgPages} sayfa` : '—'}
                  </div>
                </div>
                <BookOpen className="w-7 h-7 text-amber-600/40" />
              </div>

              <div className="p-4 rounded-2xl bg-paper-50 dark:bg-paper-950/60 border border-paper-200/70 dark:border-paper-800/70 flex items-center justify-between">
                <div>
                  <div className="text-xs text-paper-500 dark:text-paper-400">Ortalama Puanlama</div>
                  <div className="text-lg font-bold font-serif text-paper-900 dark:text-paper-100 flex items-center gap-1.5">
                    <span>{avgRating}</span>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-normal text-paper-500">({ratedBooks.length} kitap puanlandı)</span>
                  </div>
                </div>
                <Star className="w-7 h-7 text-amber-500/40" />
              </div>

              <div className="p-4 rounded-2xl bg-paper-50 dark:bg-paper-950/60 border border-paper-200/70 dark:border-paper-800/70 flex items-center justify-between">
                <div>
                  <div className="text-xs text-paper-500 dark:text-paper-400">Sırada Bekleyenler</div>
                  <div className="text-lg font-bold font-serif text-paper-900 dark:text-paper-100">
                    {wantBooks.length} kitap
                  </div>
                </div>
                <Bookmark className="w-7 h-7 text-blue-500/40" />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
