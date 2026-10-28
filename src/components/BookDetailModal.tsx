import React from 'react';
import { X, BookOpen, Star, Calendar, FileText, Quote, Plus, Edit3, Trash2, CheckCircle, Clock, Bookmark, BookMarked } from 'lucide-react';
import { Book, BookNote, BookStatus } from '../types';

interface BookDetailModalProps {
  book: Book | null;
  notes: BookNote[];
  isAuthorizedUser: boolean;
  onClose: () => void;
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
  onAddNote: (book: Book) => void;
  onDeleteNote: (noteId: string) => void;
}

const statusLabels: Record<BookStatus, { label: string; icon: React.ReactNode; color: string }> = {
  read: { label: 'Okundu', icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800' },
  reading: { label: 'Şu An Okuyorum', icon: <Clock className="w-4 h-4" />, color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800' },
  want_to_read: { label: 'Okumak İstiyorum', icon: <Bookmark className="w-4 h-4" />, color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800' },
  abandoned: { label: 'Yarım Bıraktım', icon: <BookMarked className="w-4 h-4" />, color: 'text-stone-700 dark:text-stone-400 bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-800' },
};

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  notes,
  isAuthorizedUser,
  onClose,
  onEdit,
  onDelete,
  onAddNote,
  onDeleteNote,
}) => {
  if (!book) return null;

  const bookNotes = notes.filter((n) => n.bookId === book.id);
  const statusInfo = statusLabels[book.status];

  const progressPercent =
    book.totalPages && book.currentPage
      ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100))
      : book.status === 'read'
      ? 100
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-paper-50 dark:bg-paper-900 rounded-3xl border border-paper-200 dark:border-paper-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-paper-400 hover:text-paper-700 dark:hover:text-paper-200 rounded-xl hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Section: Cover & Details */}
        <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-paper-200 dark:border-paper-800">
          
          {/* Cover */}
          <div className="w-28 sm:w-36 h-40 sm:h-52 shrink-0 rounded-2xl overflow-hidden shadow-lg bg-paper-100 dark:bg-paper-800 border border-paper-200 dark:border-paper-700/60 mx-auto sm:mx-0">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-amber-700/10 to-amber-900/20 dark:from-amber-600/20 dark:to-stone-900">
                <BookOpen className="w-8 h-8 text-amber-700 dark:text-amber-400 mb-2" />
                <span className="font-serif text-xs font-semibold text-paper-800 dark:text-paper-200">
                  {book.title}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                {statusInfo.icon}
                <span>{statusInfo.label}</span>
              </span>
              {book.category && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-paper-100 dark:bg-paper-800 text-paper-700 dark:text-paper-300 border border-paper-200 dark:border-paper-700">
                  {book.category}
                </span>
              )}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-paper-900 dark:text-paper-100 leading-tight">
              {book.title}
            </h2>
            <p className="text-base text-paper-600 dark:text-paper-400 font-medium mt-1">
              {book.author}
            </p>

            {/* Rating */}
            {book.rating ? (
              <div className="flex items-center justify-center sm:justify-start gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= (book.rating || 0)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-paper-300 dark:text-paper-700'
                    }`}
                  />
                ))}
                <span className="text-xs font-semibold text-paper-600 dark:text-paper-400 ml-1">
                  {book.rating} / 5
                </span>
              </div>
            ) : null}

            {/* Reading progress */}
            {book.totalPages ? (
              <div className="mt-4 pt-3 border-t border-paper-200 dark:border-paper-800/80">
                <div className="flex justify-between text-xs text-paper-600 dark:text-paper-400 mb-1">
                  <span>Okunan: {book.currentPage || 0} / {book.totalPages} sayfa</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">%{progressPercent}</span>
                </div>
                <div className="w-full bg-paper-200 dark:bg-paper-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 dark:bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : null}

            {/* Dates */}
            {(book.startDate || book.finishDate) && (
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-paper-500 dark:text-paper-400">
                {book.startDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Başlama: {book.startDate}
                  </span>
                )}
                {book.finishDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    Bitiş: {book.finishDate}
                  </span>
                )}
              </div>
            )}

            {/* Action buttons */}
            {isAuthorizedUser && (
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
                <button
                  onClick={() => { onClose(); onEdit(book); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-paper-200 dark:bg-paper-800 text-paper-800 dark:text-paper-200 hover:bg-paper-300 dark:hover:bg-paper-700 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Düzenle
                </button>
                <button
                  onClick={() => { onClose(); onDelete(book.id); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Sil
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Review Section */}
        {book.review && (
          <div className="py-5 border-b border-paper-200 dark:border-paper-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-paper-500 dark:text-paper-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Kişisel Değerlendirme & Yorum</span>
            </h4>
            <p className="text-sm text-paper-800 dark:text-paper-200 leading-relaxed font-sans bg-paper-100/70 dark:bg-paper-950/50 p-4 rounded-2xl border border-paper-200 dark:border-paper-800">
              {book.review}
            </p>
          </div>
        )}

        {/* Notes & Quotes Section */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-serif font-bold text-paper-900 dark:text-paper-100 flex items-center gap-2">
              <Quote className="w-4 h-4 text-amber-600" />
              <span>Kitaptan Önemli Noktalar & Alıntılar ({bookNotes.length})</span>
            </h4>
            {isAuthorizedUser && (
              <button
                onClick={() => { onClose(); onAddNote(book); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Not Ekle</span>
              </button>
            )}
          </div>

          {bookNotes.length === 0 ? (
            <div className="text-center py-8 bg-paper-100/40 dark:bg-paper-950/30 rounded-2xl border border-dashed border-paper-300 dark:border-paper-800">
              <Quote className="w-8 h-8 mx-auto text-paper-400 mb-2" />
              <p className="text-xs text-paper-500 dark:text-paper-400">
                Bu kitap için henüz alıntı veya not eklenmemiş.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookNotes.map((note) => (
                <div
                  key={note.id}
                  className="relative p-4 rounded-2xl bg-white dark:bg-paper-800 border border-paper-200 dark:border-paper-700/70 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {note.pageNumber ? (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                        Sayfa {note.pageNumber}
                      </span>
                    ) : <span />}

                    {isAuthorizedUser && (
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-paper-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                        title="Notu Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="font-serif text-sm text-paper-900 dark:text-paper-100 italic leading-relaxed">
                    "{note.quote}"
                  </p>

                  {note.thought && (
                    <p className="mt-2 text-xs text-paper-600 dark:text-paper-400 border-l-2 border-amber-600/40 pl-2.5">
                      {note.thought}
                    </p>
                  )}

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-paper-100 dark:bg-paper-900 text-paper-600 dark:text-paper-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
