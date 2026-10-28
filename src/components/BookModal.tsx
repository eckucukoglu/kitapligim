import React, { useState, useEffect } from 'react';
import { X, Search, BookOpen, Star, Loader2, Sparkles } from 'lucide-react';
import { Book, BookStatus } from '../types';
import { fetchBookByISBN } from '../utils/isbn';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Partial<Book>) => void;
  initialBook?: Book | null;
}

const CATEGORIES = [
  'Dünya Klasikleri',
  'Türk Edebiyatı',
  'Roman',
  'Öykü',
  'Felsefe',
  'Tarih',
  'Bilim & Teknoloji',
  'Psikoloji',
  'Sosyoloji',
  'Kişisel Gelişim',
  'Biyografi',
  'Şiir',
  'Sanat & Mimari',
  'Diğer'
];

export const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialBook
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<BookStatus>('want_to_read');
  const [totalPages, setTotalPages] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [category, setCategory] = useState<string>('Roman');
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [isbn, setIsbn] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [review, setReview] = useState('');
  const [fetchingIsbn, setFetchingIsbn] = useState(false);
  const [isbnMessage, setIsbnMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialBook) {
      setTitle(initialBook.title || '');
      setAuthor(initialBook.author || '');
      setStatus(initialBook.status || 'want_to_read');
      setTotalPages(initialBook.totalPages ? String(initialBook.totalPages) : '');
      setCurrentPage(initialBook.currentPage ? String(initialBook.currentPage) : '');
      setRating(initialBook.rating || 0);
      setCategory(initialBook.category || 'Roman');
      setStartDate(initialBook.startDate || '');
      setFinishDate(initialBook.finishDate || '');
      setIsbn(initialBook.isbn || '');
      setCoverUrl(initialBook.coverUrl || '');
      setReview(initialBook.review || '');
    } else {
      setTitle('');
      setAuthor('');
      setStatus('want_to_read');
      setTotalPages('');
      setCurrentPage('');
      setRating(0);
      setCategory('Roman');
      setStartDate('');
      setFinishDate('');
      setIsbn('');
      setCoverUrl('');
      setReview('');
    }
    setIsbnMessage(null);
  }, [initialBook, isOpen]);

  if (!isOpen) return null;

  const handleIsbnLookup = async () => {
    if (!isbn.trim()) {
      setIsbnMessage('Lütfen geçerli bir ISBN numarası girin.');
      return;
    }
    setFetchingIsbn(true);
    setIsbnMessage(null);
    try {
      const data = await fetchBookByISBN(isbn);
      if (data) {
        if (data.title && !title) setTitle(data.title);
        if (data.author && !author) setAuthor(data.author);
        if (data.totalPages && !totalPages) setTotalPages(String(data.totalPages));
        if (data.coverUrl) setCoverUrl(data.coverUrl);
        if (data.category && !category) setCategory(data.category);
        setIsbnMessage('Kitap bilgileri başarıyla getirildi!');
      } else {
        setIsbnMessage('Bu ISBN ile kitap bulunamadı, bilgileri manuel girebilirsiniz.');
      }
    } catch {
      setIsbnMessage('Arama sırasında bir hata oluştu.');
    } finally {
      setFetchingIsbn(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    onSave({
      ...(initialBook ? { id: initialBook.id } : {}),
      title: title.trim(),
      author: author.trim(),
      status,
      totalPages: totalPages ? parseInt(totalPages, 10) : undefined,
      currentPage: currentPage ? parseInt(currentPage, 10) : (status === 'read' && totalPages ? parseInt(totalPages, 10) : 0),
      rating: rating > 0 ? rating : undefined,
      category,
      startDate: startDate || undefined,
      finishDate: finishDate || undefined,
      isbn: isbn.trim() || undefined,
      coverUrl: coverUrl.trim() || undefined,
      review: review.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-paper-50 dark:bg-paper-900 rounded-2xl border border-paper-200 dark:border-paper-800 shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-paper-400 hover:text-paper-700 dark:hover:text-paper-200 rounded-lg hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-paper-900 dark:text-paper-100">
              {initialBook ? 'Kitabı Düzenle' : 'Yeni Kitap Ekle'}
            </h2>
            <p className="text-xs text-paper-500 dark:text-paper-400">
              Kişisel kütüphanenize kitap kaydedin veya detaylarını güncelleyin.
            </p>
          </div>
        </div>

        {/* ISBN Quick Fill */}
        <div className="mb-6 p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/40">
          <label className="block text-xs font-semibold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ISBN ile Otomatik Doldur (İsteğe Bağlı)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="Örn: 9789750719387"
              className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-paper-800 border border-amber-300 dark:border-amber-700 rounded-lg text-paper-900 dark:text-paper-100 font-mono"
            />
            <button
              type="button"
              onClick={handleIsbnLookup}
              disabled={fetchingIsbn}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 disabled:opacity-50 flex items-center gap-1.5"
            >
              {fetchingIsbn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Bilgi Getir</span>
            </button>
          </div>
          {isbnMessage && (
            <p className="text-[11px] mt-1.5 text-amber-800 dark:text-amber-300 font-medium">
              {isbnMessage}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
                Kitap Adı *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Dönüşüm"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
                Yazar *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Örn: Franz Kafka"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
                Okuma Durumu
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookStatus)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
              >
                <option value="want_to_read">Okumak İstiyorum</option>
                <option value="reading">Şu An Okuyorum</option>
                <option value="read">Okudum</option>
                <option value="abandoned">Yarım Bıraktım</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
                Kategori / Tür
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
                Toplam Sayfa
              </label>
              <input
                type="number"
                min="1"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                placeholder="Örn: 240"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
                Şu Anki Sayfa
              </label>
              <input
                type="number"
                min="0"
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                placeholder="Örn: 80"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
                Puanım (1-5)
              </label>
              <div className="flex items-center gap-1 h-9">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star === rating ? 0 : star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-paper-300 dark:text-paper-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
                Başlama Tarihi
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
                Bitirme Tarihi
              </label>
              <input
                type="date"
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
              Kapak Resmi Bağlantısı (URL)
            </label>
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-paper-700 dark:text-paper-300 mb-1">
              Genel Yorum / Değerlendirme
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Kitap hakkında kısa kişisel düşünceleriniz..."
              className="w-full px-3 py-2 text-sm bg-white dark:bg-paper-800 border border-paper-300 dark:border-paper-700 rounded-xl text-paper-900 dark:text-paper-100 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 outline-none resize-none"
            />
          </div>

          {/* Submit */}
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
              {initialBook ? 'Değişiklikleri Kaydet' : 'Kitabı Ekle'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
