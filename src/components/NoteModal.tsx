import React, { useState, useEffect } from 'react';
import { X, Quote, Bookmark, Tag } from 'lucide-react';
import { Book, BookNote } from '../types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<BookNote>) => void;
  books: Book[];
  initialNote?: BookNote | null;
  selectedBook?: Book | null;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  books,
  initialNote,
  selectedBook,
}) => {
  const [bookId, setBookId] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [quote, setQuote] = useState('');
  const [thought, setThought] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (initialNote) {
      setBookId(initialNote.bookId || '');
      setBookTitle(initialNote.bookTitle || '');
      setBookAuthor(initialNote.bookAuthor || '');
      setPageNumber(initialNote.pageNumber ? String(initialNote.pageNumber) : '');
      setQuote(initialNote.quote || '');
      setThought(initialNote.thought || '');
      setTagsInput((initialNote.tags || []).join(', '));
    } else if (selectedBook) {
      setBookId(selectedBook.id);
      setBookTitle(selectedBook.title);
      setBookAuthor(selectedBook.author);
      setPageNumber('');
      setQuote('');
      setThought('');
      setTagsInput('');
    } else {
      const firstBook = books[0];
      setBookId(firstBook ? firstBook.id : '');
      setBookTitle(firstBook ? firstBook.title : '');
      setBookAuthor(firstBook ? firstBook.author : '');
      setPageNumber('');
      setQuote('');
      setThought('');
      setTagsInput('');
    }
  }, [initialNote, selectedBook, books, isOpen]);

  if (!isOpen) return null;

  const handleBookSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setBookId(selectedId);
    const found = books.find((b) => b.id === selectedId);
    if (found) {
      setBookTitle(found.title);
      setBookAuthor(found.author);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      ...(initialNote ? { id: initialNote.id } : {}),
      bookId: bookId || (selectedBook ? selectedBook.id : 'custom'),
      bookTitle: bookTitle || 'Belirtilmemiş Kitap',
      bookAuthor: bookAuthor || 'Belirtilmemiş Yazar',
      pageNumber: pageNumber ? parseInt(pageNumber, 10) : null,
      quote: quote.trim(),
      thought: thought.trim() || undefined,
      tags: parsedTags,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-paper-50 dark:bg-paper-900 rounded-2xl border border-paper-200 dark:border-paper-800 shadow-2xl p-6 sm:p-8">
        
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
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-paper-900 dark:text-paper-100">
              {initialNote ? 'Notu / Alıntıyı Düzenle' : 'Kitaptan Not & Alıntı Ekle'}
            </h2>
            <p className="text-xs text-paper-500 dark:text-paper-400">
              Önemli gördüğünüz cümleleri ve kişisel düşüncelerinizi kaydedin.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Book Selector */}
          <div>
            <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              <span>İlgili Kitap *</span>
            </label>
            {books.length > 0 ? (
              <select
                value={bookId}
                onChange={handleBookSelect}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} — {b.author}
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Kitap Adı"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl"
                />
                <input
                  type="text"
                  required
                  placeholder="Yazar"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  className="px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Page Number */}
          <div>
            <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
              Sayfa Numarası (İsteğe Bağlı)
            </label>
            <input
              type="number"
              min="1"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              placeholder="Örn: 42"
              className="w-full sm:w-1/3 px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
            />
          </div>

          {/* Quote */}
          <div>
            <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
              Önemli Nokta / Alıntı *
            </label>
            <textarea
              required
              rows={4}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Kitapta altını çizdiğiniz veya sizi etkileyen cümleler..."
              className="w-full px-3 py-2.5 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none font-serif leading-relaxed resize-none"
            />
          </div>

          {/* Thought / Reflection */}
          <div>
            <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
              Kişisel Yorumum & Düşüncem (İsteğe Bağlı)
            </label>
            <textarea
              rows={3}
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Bu alıntı size ne düşündürdü? Kişisel notlarınız..."
              className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <span>Etiketler (Virgülle ayırın)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Felsefe, Yaşam, Sevgi, Toplum"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
            />
          </div>

          {/* Actions */}
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
              {initialNote ? 'Notu Güncelle' : 'Notu Kaydet'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
