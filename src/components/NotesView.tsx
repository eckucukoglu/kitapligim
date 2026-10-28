import React, { useState, useMemo } from 'react';
import { Quote, Search, Plus, Filter, Trash2, Copy, Check, BookOpen } from 'lucide-react';
import { Book, BookNote } from '../types';

interface NotesViewProps {
  notes: BookNote[];
  books: Book[];
  isAuthorizedUser: boolean;
  onAddNoteClick: () => void;
  onDeleteNote: (noteId: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  books,
  isAuthorizedUser,
  onAddNoteClick,
  onDeleteNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookFilter, setSelectedBookFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (selectedBookFilter !== 'all' && n.bookId !== selectedBookFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inQuote = n.quote.toLowerCase().includes(q);
        const inThought = (n.thought || '').toLowerCase().includes(q);
        const inBook = n.bookTitle.toLowerCase().includes(q);
        const inAuthor = n.bookAuthor.toLowerCase().includes(q);
        const inTags = (n.tags || []).some((t) => t.toLowerCase().includes(q));
        return inQuote || inThought || inBook || inAuthor || inTags;
      }
      return true;
    });
  }, [notes, selectedBookFilter, searchQuery]);

  const handleCopy = (note: BookNote) => {
    const text = `"${note.quote}" — ${note.bookAuthor}, ${note.bookTitle}${note.pageNumber ? ` (s. ${note.pageNumber})` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-paper-900 dark:text-paper-100 flex items-center gap-2.5">
            <Quote className="w-7 h-7 text-amber-700 dark:text-amber-400" />
            <span>Kitap Notları & Alıntılar</span>
          </h2>
          <p className="text-xs sm:text-sm text-paper-500 dark:text-paper-400 mt-1">
            Okuduğunuz kitaplardan altını çizdiğiniz cümleler ve kişisel düşünceleriniz ({notes.length} not kayıtlı).
          </p>
        </div>

        <button
          onClick={onAddNoteClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 font-medium text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Not / Alıntı Ekle</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-paper-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Alıntı, düşünce, yazar veya etiketlerde ara..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-800 rounded-xl text-paper-900 dark:text-paper-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 shadow-sm"
          />
        </div>

        <div className="sm:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-paper-400">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedBookFilter}
            onChange={(e) => setSelectedBookFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-paper-900 border border-paper-200 dark:border-paper-800 rounded-xl text-paper-800 dark:text-paper-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-sm truncate"
          >
            <option value="all">Tüm Kitaplar ({books.length})</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.author})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-paper-900 rounded-3xl border border-dashed border-paper-300 dark:border-paper-800 p-8 shadow-sm">
          <Quote className="w-12 h-12 mx-auto text-amber-700/40 dark:text-amber-500/30 mb-3" />
          <h3 className="font-serif text-lg font-bold text-paper-900 dark:text-paper-100">
            Kayıtlı Not Bulunamadı
          </h3>
          <p className="text-xs sm:text-sm text-paper-500 dark:text-paper-400 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedBookFilter !== 'all'
              ? 'Arama kriterlerinize uyan bir not bulunamadı.'
              : 'Kitaplarınızdan önemli gördüğünüz noktaları ve alıntıları ekleyerek kendi edebi günlüğünüzü oluşturun.'}
          </p>
          <button
            onClick={onAddNoteClick}
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-600 text-xs font-medium shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>İlk Notu Ekleyin</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="group relative bg-white dark:bg-paper-900 rounded-3xl border border-paper-200 dark:border-paper-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Book Source & Actions */}
                <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-paper-100 dark:border-paper-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-sm text-paper-900 dark:text-paper-100 truncate">
                        {note.bookTitle}
                      </h4>
                      <p className="text-xs text-paper-500 dark:text-paper-400 truncate">
                        {note.bookAuthor}
                      </p>
                    </div>
                  </div>

                  {note.pageNumber && (
                    <span className="shrink-0 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-paper-100 dark:bg-paper-800 text-paper-700 dark:text-paper-300">
                      s. {note.pageNumber}
                    </span>
                  )}
                </div>

                {/* Quote Text */}
                <div className="relative pl-6 py-1">
                  <Quote className="w-5 h-5 text-amber-600/30 absolute -top-1 left-0" />
                  <p className="font-serif text-sm sm:text-base text-paper-900 dark:text-paper-100 italic leading-relaxed">
                    "{note.quote}"
                  </p>
                </div>

                {/* Personal Thought */}
                {note.thought && (
                  <div className="mt-4 p-3 bg-paper-50 dark:bg-paper-950/60 rounded-xl border border-paper-200/70 dark:border-paper-800/70 text-xs text-paper-700 dark:text-paper-300 leading-relaxed">
                    <strong className="text-amber-800 dark:text-amber-300 block mb-0.5 text-[11px] uppercase tracking-wider">
                      Kişisel Not:
                    </strong>
                    {note.thought}
                  </div>
                )}
              </div>

              {/* Footer: Tags & Quick Action Buttons */}
              <div className="mt-5 pt-3 border-t border-paper-100 dark:border-paper-800/80 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {(note.tags || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleCopy(note)}
                    title="Alıntıyı kopyala"
                    className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 dark:hover:text-paper-200 hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors"
                  >
                    {copiedId === note.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isAuthorizedUser && (
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      title="Notu sil"
                      className="p-1.5 rounded-lg text-paper-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
