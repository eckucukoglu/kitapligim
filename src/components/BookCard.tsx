import React from 'react';
import { Book, BookStatus } from '../types';
import { Star, BookOpen, CheckCircle, Clock, BookMarked, MoreVertical, Trash2, Edit3, MessageSquarePlus, Bookmark } from 'lucide-react';

interface BookCardProps {
  book: Book;
  isAuthorizedUser: boolean;
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (book: Book, newStatus: BookStatus) => void;
  onAddNote: (book: Book) => void;
  onSelect: (book: Book) => void;
}

const statusConfig: Record<BookStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  read: {
    label: 'Okundu',
    bg: 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800',
    text: 'text-emerald-800 dark:text-emerald-300',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  reading: {
    label: 'Okuyorum',
    bg: 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800',
    text: 'text-amber-800 dark:text-amber-300',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  want_to_read: {
    label: 'Okunacak',
    bg: 'bg-blue-100 dark:bg-blue-950/70 border-blue-300 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-300',
    icon: <Bookmark className="w-3.5 h-3.5" />,
  },
  abandoned: {
    label: 'Yarım',
    bg: 'bg-stone-100 dark:bg-stone-900 border-stone-300 dark:border-stone-800',
    text: 'text-stone-700 dark:text-stone-400',
    icon: <BookMarked className="w-3.5 h-3.5" />,
  },
};

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isAuthorizedUser,
  onEdit,
  onDelete,
  onStatusChange,
  onAddNote,
  onSelect,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const statusInfo = statusConfig[book.status];

  // Progress percentage
  const progressPercent =
    book.totalPages && book.currentPage
      ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100))
      : book.status === 'read'
      ? 100
      : 0;

  return (
    <div className="group relative bg-white dark:bg-paper-900 rounded-2xl border border-paper-200 dark:border-paper-800 p-4 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover & Main Row */}
        <div className="flex gap-4">
          
          {/* Cover image or fallback */}
          <div 
            onClick={() => onSelect(book)}
            className="w-20 h-28 sm:w-24 sm:h-36 shrink-0 rounded-xl overflow-hidden shadow-md bg-paper-100 dark:bg-paper-800 cursor-pointer relative border border-paper-200 dark:border-paper-700/60"
          >
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-br from-amber-700/10 to-amber-900/20 dark:from-amber-600/20 dark:to-stone-900">
                <BookOpen className="w-6 h-6 text-amber-700 dark:text-amber-400 mb-1" />
                <span className="font-serif text-[11px] font-semibold text-paper-800 dark:text-paper-200 line-clamp-2 leading-tight">
                  {book.title}
                </span>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusInfo.bg} ${statusInfo.text}`}
              >
                {statusInfo.icon}
                <span>{statusInfo.label}</span>
              </span>

              {/* Actions Dropdown for authorized users */}
              {isAuthorizedUser && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 rounded-lg text-paper-400 hover:text-paper-700 dark:hover:text-paper-200 hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-paper-800 rounded-xl shadow-xl border border-paper-200 dark:border-paper-700 py-1 z-20 text-xs">
                        <button
                          onClick={() => { setShowMenu(false); onEdit(book); }}
                          className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-paper-100 dark:hover:bg-paper-700 text-paper-800 dark:text-paper-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Düzenle</span>
                        </button>
                        <button
                          onClick={() => { setShowMenu(false); onAddNote(book); }}
                          className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-paper-100 dark:hover:bg-paper-700 text-paper-800 dark:text-paper-200"
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5" />
                          <span>Not / Alıntı Ekle</span>
                        </button>
                        <div className="border-t border-paper-200 dark:border-paper-700 my-1" />
                        <button
                          onClick={() => { setShowMenu(false); onDelete(book.id); }}
                          className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Kitabı Sil</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <h3 
              onClick={() => onSelect(book)}
              className="font-serif font-bold text-base sm:text-lg text-paper-900 dark:text-paper-100 line-clamp-1 mt-1.5 cursor-pointer hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
            >
              {book.title}
            </h3>
            <p className="text-xs sm:text-sm text-paper-600 dark:text-paper-400 font-medium line-clamp-1">
              {book.author}
            </p>

            {/* Category */}
            {book.category && (
              <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[11px] font-medium bg-paper-100 dark:bg-paper-800 text-paper-600 dark:text-paper-400">
                {book.category}
              </span>
            )}

            {/* Rating Stars */}
            {book.rating ? (
              <div className="flex items-center gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= (book.rating || 0)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-paper-300 dark:text-paper-700'
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Reading progress bar for 'reading' status */}
        {book.status === 'reading' && book.totalPages && (
          <div className="mt-3.5 pt-3 border-t border-paper-100 dark:border-paper-800/80">
            <div className="flex items-center justify-between text-[11px] text-paper-500 dark:text-paper-400 mb-1">
              <span>{book.currentPage || 0} / {book.totalPages} sayfa</span>
              <span className="font-semibold text-amber-700 dark:text-amber-400">%{progressPercent}</span>
            </div>
            <div className="w-full bg-paper-100 dark:bg-paper-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 dark:bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Short review / personal note snippet */}
        {book.review && (
          <p className="text-xs text-paper-500 dark:text-paper-400 italic line-clamp-2 mt-3 bg-paper-50 dark:bg-paper-950/40 p-2 rounded-lg border border-paper-200/60 dark:border-paper-800/60">
            "{book.review}"
          </p>
        )}
      </div>

      {/* Footer info & status quick switcher */}
      <div className="mt-3 pt-3 border-t border-paper-100 dark:border-paper-800/80 flex items-center justify-between text-xs text-paper-500 dark:text-paper-400">
        <button
          onClick={() => onSelect(book)}
          className="text-amber-700 dark:text-amber-400 hover:underline font-medium text-[11px]"
        >
          {book.notesCount ? `${book.notesCount} Not/Alıntı` : 'Detay & Notlar'}
        </button>

        {isAuthorizedUser && (
          <select
            value={book.status}
            onChange={(e) => onStatusChange(book, e.target.value as BookStatus)}
            className="text-[11px] bg-paper-100 dark:bg-paper-800 border border-paper-200 dark:border-paper-700 rounded-md px-2 py-0.5 text-paper-700 dark:text-paper-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="want_to_read">Okunacak</option>
            <option value="reading">Okuyorum</option>
            <option value="read">Okundu</option>
            <option value="abandoned">Yarım</option>
          </select>
        )}
      </div>
    </div>
  );
};
