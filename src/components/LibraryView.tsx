import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, ArrowUpDown, BookOpen, Bookmark, CheckCircle, Clock, BookMarked } from 'lucide-react';
import { Book, BookStatus, BookFilter } from '../types';
import { BookCard } from './BookCard';

interface LibraryViewProps {
  books: Book[];
  isAuthorizedUser: boolean;
  onAddBookClick: () => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onStatusChange: (book: Book, newStatus: BookStatus) => void;
  onAddNote: (book: Book) => void;
  onSelectBook: (book: Book) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  isAuthorizedUser,
  onAddBookClick,
  onEditBook,
  onDeleteBook,
  onStatusChange,
  onAddNote,
  onSelectBook,
}) => {
  const [filter, setFilter] = useState<BookFilter>({
    status: 'all',
    searchQuery: '',
    category: 'all',
    sortBy: 'date_desc',
  });

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.category && set.add(b.category));
    return Array.from(set).sort();
  }, [books]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: books.length,
      reading: books.filter((b) => b.status === 'reading').length,
      read: books.filter((b) => b.status === 'read').length,
      want_to_read: books.filter((b) => b.status === 'want_to_read').length,
      abandoned: books.filter((b) => b.status === 'abandoned').length,
    };
  }, [books]);

  // Filter & Sort
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Status
        if (filter.status !== 'all' && book.status !== filter.status) {
          return false;
        }
        // Category
        if (filter.category !== 'all' && book.category !== filter.category) {
          return false;
        }
        // Search
        if (filter.searchQuery.trim()) {
          const q = filter.searchQuery.toLowerCase();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchCategory = (book.category || '').toLowerCase().includes(q);
          return matchTitle || matchAuthor || matchCategory;
        }
        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'date_desc') return b.createdAt - a.createdAt;
        if (filter.sortBy === 'date_asc') return a.createdAt - b.createdAt;
        if (filter.sortBy === 'title_asc') return a.title.localeCompare(b.title, 'tr');
        if (filter.sortBy === 'author_asc') return a.author.localeCompare(b.author, 'tr');
        if (filter.sortBy === 'rating_desc') return (b.rating || 0) - (a.rating || 0);
        if (filter.sortBy === 'pages_desc') return (b.totalPages || 0) - (a.totalPages || 0);
        return 0;
      });
  }, [books, filter]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-paper-900 dark:text-paper-100">
            Kişisel Kütüphane
          </h2>
          <p className="text-xs sm:text-sm text-paper-500 dark:text-paper-400 mt-1">
            Toplam {books.length} kitap kayıtlı ({counts.read} okundu, {counts.reading} okunuyor, {counts.want_to_read} sırada).
          </p>
        </div>

        <button
          onClick={onAddBookClick}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 font-medium text-sm shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kitap Ekle</span>
        </button>
      </div>

      {/* Filter Tabs by Status */}
      <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar border-b border-paper-200 dark:border-paper-800/80">
        <button
          onClick={() => setFilter((f) => ({ ...f, status: 'all' }))}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
            filter.status === 'all'
              ? 'bg-paper-900 text-white dark:bg-paper-100 dark:text-paper-900 shadow-sm'
              : 'text-paper-600 dark:text-paper-400 hover:bg-paper-100 dark:hover:bg-paper-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Tümü</span>
          <span className="text-[11px] opacity-75 font-mono">({counts.all})</span>
        </button>

        <button
          onClick={() => setFilter((f) => ({ ...f, status: 'reading' }))}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
            filter.status === 'reading'
              ? 'bg-amber-700 text-white dark:bg-amber-600 shadow-sm'
              : 'text-paper-600 dark:text-paper-400 hover:bg-paper-100 dark:hover:bg-paper-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Şu An Okuyorum</span>
          <span className="text-[11px] opacity-75 font-mono">({counts.reading})</span>
        </button>

        <button
          onClick={() => setFilter((f) => ({ ...f, status: 'read' }))}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
            filter.status === 'read'
              ? 'bg-emerald-700 text-white dark:bg-emerald-600 shadow-sm'
              : 'text-paper-600 dark:text-paper-400 hover:bg-paper-100 dark:hover:bg-paper-800'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Okudum</span>
          <span className="text-[11px] opacity-75 font-mono">({counts.read})</span>
        </button>

        <button
          onClick={() => setFilter((f) => ({ ...f, status: 'want_to_read' }))}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
            filter.status === 'want_to_read'
              ? 'bg-blue-700 text-white dark:bg-blue-600 shadow-sm'
              : 'text-paper-600 dark:text-paper-400 hover:bg-paper-100 dark:hover:bg-paper-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Okumak İstiyorum</span>
          <span className="text-[11px] opacity-75 font-mono">({counts.want_to_read})</span>
        </button>

        <button
          onClick={() => setFilter((f) => ({ ...f, status: 'abandoned' }))}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
            filter.status === 'abandoned'
              ? 'bg-stone-700 text-white dark:bg-stone-600 shadow-sm'
              : 'text-paper-600 dark:text-paper-400 hover:bg-paper-100 dark:hover:bg-paper-800'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>Yarım Bıraktım</span>
          <span className="text-[11px] opacity-75 font-mono">({counts.abandoned})</span>
        </button>
      </div>

      {/* Search & Sort Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-paper-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => setFilter((f) => ({ ...f, searchQuery: e.target.value }))}
            placeholder="Kitap veya yazar ara..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-800 rounded-xl text-paper-900 dark:text-paper-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 shadow-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-paper-400">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <select
            value={filter.category}
            onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}
            className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-800 rounded-xl text-paper-800 dark:text-paper-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-sm"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="sm:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-paper-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </div>
          <select
            value={filter.sortBy}
            onChange={(e) => setFilter((f) => ({ ...f, sortBy: e.target.value as any }))}
            className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-800 rounded-xl text-paper-800 dark:text-paper-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-sm"
          >
            <option value="date_desc">En Yeni Eklenen</option>
            <option value="date_asc">En Eski Eklenen</option>
            <option value="title_asc">Kitap Adı (A-Z)</option>
            <option value="author_asc">Yazar (A-Z)</option>
            <option value="rating_desc">En Yüksek Puan</option>
            <option value="pages_desc">En Çok Sayfa</option>
          </select>
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-paper-900 rounded-3xl border border-dashed border-paper-300 dark:border-paper-800 p-8 shadow-sm">
          <BookOpen className="w-12 h-12 mx-auto text-amber-700/40 dark:text-amber-500/30 mb-3" />
          <h3 className="font-serif text-lg font-bold text-paper-900 dark:text-paper-100">
            Kitap Bulunamadı
          </h3>
          <p className="text-xs sm:text-sm text-paper-500 dark:text-paper-400 mt-1 max-w-sm mx-auto">
            {filter.searchQuery || filter.category !== 'all' || filter.status !== 'all'
              ? 'Arama kriterlerinize uyan bir kitap bulunamadı. Filtreleri temizlemeyi deneyin.'
              : 'Kütüphanenizde henüz kitap bulunmuyor. Yeni bir kitap ekleyerek başlayabilirsiniz.'}
          </p>
          <button
            onClick={onAddBookClick}
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-600 text-xs font-medium shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>İlk Kitabınızı Ekleyin</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isAuthorizedUser={isAuthorizedUser}
              onEdit={onEditBook}
              onDelete={onDeleteBook}
              onStatusChange={onStatusChange}
              onAddNote={onAddNote}
              onSelect={onSelectBook}
            />
          ))}
        </div>
      )}

    </div>
  );
};
