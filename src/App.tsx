import React, { useState, useEffect } from 'react';
import { ViewTab, Book, BookNote, ReadingGoal, BookStatus } from './types';
import { 
  subscribeToAuth, 
  subscribeToBooks, 
  subscribeToNotes, 
  subscribeToGoal, 
  saveBookToCloud, 
  deleteBookFromCloud, 
  saveNoteToCloud, 
  deleteNoteFromCloud, 
  saveGoalToCloud, 
  logOut,
  handleEmailLinkSignIn 
} from './lib/firebase';
import { INITIAL_BOOKS, INITIAL_NOTES, INITIAL_GOAL } from './utils/initialData';
import { Header } from './components/Header';
import { LibraryView } from './components/LibraryView';
import { GoalsView } from './components/GoalsView';
import { NotesView } from './components/NotesView';
import { StatsView } from './components/StatsView';
import { AuthModal } from './components/AuthModal';
import { BookModal } from './components/BookModal';
import { NoteModal } from './components/NoteModal';
import { GoalModal } from './components/GoalModal';
import { BookDetailModal } from './components/BookDetailModal';
import { ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('library');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Auth State
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isAuthorizedUser, setIsAuthorizedUser] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Data State
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('kitapligim_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });
  const [notes, setNotes] = useState<BookNote[]>(() => {
    const saved = localStorage.getItem('kitapligim_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });
  const [goal, setGoal] = useState<ReadingGoal | null>(() => {
    const saved = localStorage.getItem('kitapligim_goal');
    return saved ? JSON.parse(saved) : INITIAL_GOAL;
  });

  // Modal States
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<BookNote | null>(null);
  const [selectedBookForNote, setSelectedBookForNote] = useState<Book | null>(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedBookDetail, setSelectedBookDetail] = useState<Book | null>(null);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Check for Email Link sign-in on app load
  useEffect(() => {
    handleEmailLinkSignIn()
      .then((user) => {
        if (user) {
          showToast('Giriş başarılı! Hoş geldiniz.', 'success');
        }
      })
      .catch((err) => {
        console.error('Email link sign in error:', err);
      });
  }, []);

  // Firebase Auth listener
  useEffect(() => {
    const unsub = subscribeToAuth((user, isAuth) => {
      setCurrentUserEmail(user?.email || null);
      setIsAuthorizedUser(isAuth);
      if (user && !isAuth) {
        showToast('Yetkisiz hesap. Oturum kapatılıyor.', 'error');
        logOut();
      }
    });
    return () => unsub();
  }, []);

  // Sync books with Firestore (with local persistence fallback)
  useEffect(() => {
    const unsub = subscribeToBooks(
      (cloudBooks) => {
        if (cloudBooks && cloudBooks.length > 0) {
          setBooks(cloudBooks);
          localStorage.setItem('kitapligim_books', JSON.stringify(cloudBooks));
        }
      },
      () => {
        // Fallback to local storage if Firestore is offline / unconfigured
      }
    );
    return () => unsub();
  }, []);

  // Sync notes with Firestore
  useEffect(() => {
    const unsub = subscribeToNotes(
      (cloudNotes) => {
        if (cloudNotes && cloudNotes.length > 0) {
          setNotes(cloudNotes);
          localStorage.setItem('kitapligim_notes', JSON.stringify(cloudNotes));
        }
      },
      () => {}
    );
    return () => unsub();
  }, []);

  // Sync goal with Firestore
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const unsub = subscribeToGoal(
      currentYear,
      (cloudGoal) => {
        if (cloudGoal) {
          setGoal(cloudGoal);
          localStorage.setItem('kitapligim_goal', JSON.stringify(cloudGoal));
        }
      },
      () => {}
    );
    return () => unsub();
  }, []);

  // Guard Helper: verifies permission before action
  const requireAuth = (actionName: string): boolean => {
    if (!isAuthorizedUser) {
      showToast(`${actionName} için yönetici girişi yapmalısınız.`, 'info');
      setIsAuthModalOpen(true);
      return false;
    }
    return true;
  };

  // Book Handlers
  const handleSaveBook = async (bookData: Partial<Book>) => {
    if (!requireAuth('Kitap kaydetmek')) return;

    try {
      const now = Date.now();
      const bookToSave: Book = {
        id: bookData.id || `book-${now}`,
        title: bookData.title || 'Başlıksız Kitap',
        author: bookData.author || 'Bilinmeyen Yazar',
        status: bookData.status || 'want_to_read',
        totalPages: bookData.totalPages,
        currentPage: bookData.currentPage,
        rating: bookData.rating,
        category: bookData.category,
        startDate: bookData.startDate,
        finishDate: bookData.finishDate,
        isbn: bookData.isbn,
        coverUrl: bookData.coverUrl,
        review: bookData.review,
        notesCount: bookData.notesCount || 0,
        createdAt: bookData.createdAt || now,
        updatedAt: now,
      };

      // Optimistic update
      setBooks((prev) => {
        const idx = prev.findIndex((b) => b.id === bookToSave.id);
        const updated = idx >= 0 ? [...prev] : [bookToSave, ...prev];
        if (idx >= 0) updated[idx] = bookToSave;
        localStorage.setItem('kitapligim_books', JSON.stringify(updated));
        return updated;
      });

      // Save to Cloud Firestore
      await saveBookToCloud(bookToSave);
      showToast('Kitap başarıyla kaydedildi.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Kitap kaydedilirken hata oluştu.', 'error');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!requireAuth('Kitap silmek')) return;
    if (!window.confirm('Bu kitabı kütüphanenizden silmek istediğinize emin misiniz?')) return;

    try {
      // Optimistic update
      setBooks((prev) => {
        const updated = prev.filter((b) => b.id !== bookId);
        localStorage.setItem('kitapligim_books', JSON.stringify(updated));
        return updated;
      });

      await deleteBookFromCloud(bookId);
      showToast('Kitap silindi.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Kitap silinirken hata oluştu.', 'error');
    }
  };

  const handleStatusChange = async (book: Book, newStatus: BookStatus) => {
    if (!requireAuth('Okuma durumunu değiştirmek')) return;

    const updatedBook: Book = {
      ...book,
      status: newStatus,
      finishDate: newStatus === 'read' && !book.finishDate ? new Date().toISOString().slice(0, 10) : book.finishDate,
      startDate: newStatus === 'reading' && !book.startDate ? new Date().toISOString().slice(0, 10) : book.startDate,
      updatedAt: Date.now(),
    };

    setBooks((prev) => {
      const updated = prev.map((b) => (b.id === book.id ? updatedBook : b));
      localStorage.setItem('kitapligim_books', JSON.stringify(updated));
      return updated;
    });

    try {
      await saveBookToCloud(updatedBook);
      showToast(`Durum güncellendi: ${newStatus}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Durum kaydedilemedi.', 'error');
    }
  };

  // Note Handlers
  const handleSaveNote = async (noteData: Partial<BookNote>) => {
    if (!requireAuth('Not eklemek')) return;

    try {
      const now = Date.now();
      const noteToSave: BookNote = {
        id: noteData.id || `note-${now}`,
        bookId: noteData.bookId || 'custom',
        bookTitle: noteData.bookTitle || 'Kitap',
        bookAuthor: noteData.bookAuthor || 'Yazar',
        pageNumber: noteData.pageNumber || null,
        quote: noteData.quote || '',
        thought: noteData.thought,
        tags: noteData.tags || [],
        createdAt: noteData.createdAt || now,
        updatedAt: now,
      };

      // Optimistic update
      setNotes((prev) => {
        const idx = prev.findIndex((n) => n.id === noteToSave.id);
        const updated = idx >= 0 ? [...prev] : [noteToSave, ...prev];
        if (idx >= 0) updated[idx] = noteToSave;
        localStorage.setItem('kitapligim_notes', JSON.stringify(updated));
        return updated;
      });

      // Update notes count on book
      setBooks((prev) => {
        const updated = prev.map((b) =>
          b.id === noteToSave.bookId ? { ...b, notesCount: (b.notesCount || 0) + 1 } : b
        );
        localStorage.setItem('kitapligim_books', JSON.stringify(updated));
        return updated;
      });

      await saveNoteToCloud(noteToSave);
      showToast('Not / alıntı kaydedildi.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Not kaydedilirken hata oluştu.', 'error');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!requireAuth('Not silmek')) return;
    if (!window.confirm('Bu notu silmek istediğinize emin misiniz?')) return;

    try {
      setNotes((prev) => {
        const updated = prev.filter((n) => n.id !== noteId);
        localStorage.setItem('kitapligim_notes', JSON.stringify(updated));
        return updated;
      });

      await deleteNoteFromCloud(noteId);
      showToast('Not silindi.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Not silinirken hata oluştu.', 'error');
    }
  };

  // Goal Handler
  const handleSaveGoal = async (newGoal: ReadingGoal) => {
    if (!requireAuth('Okuma hedefini düzenlemek')) return;

    try {
      setGoal(newGoal);
      localStorage.setItem('kitapligim_goal', JSON.stringify(newGoal));
      await saveGoalToCloud(newGoal);
      showToast('Okuma hedefi kaydedildi.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Hedef kaydedilirken hata oluştu.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper-50 dark:bg-paper-950 text-paper-900 dark:text-paper-100 transition-colors duration-200">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAuthorizedUser={isAuthorizedUser}
        userEmail={currentUserEmail}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={async () => {
          await logOut();
          showToast('Çıkış yapıldı. Salt-okunur moda geçildi.', 'info');
        }}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Guest Mode Banner */}
      {!isAuthorizedUser && (
        <div className="bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-500/20 py-2 px-4 text-center text-xs text-amber-800 dark:text-amber-300">
          <span>
            Şu an <strong>Salt-Okunur</strong> moddasınız. Kitap ekleme veya düzenleme için{' '}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="underline font-semibold hover:text-amber-950 dark:hover:text-amber-100 ml-1"
            >
              Giriş Yapın
            </button>.
          </span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'library' && (
          <LibraryView
            books={books}
            isAuthorizedUser={isAuthorizedUser}
            onAddBookClick={() => {
              if (requireAuth('Yeni kitap eklemek')) {
                setEditingBook(null);
                setIsBookModalOpen(true);
              }
            }}
            onEditBook={(b) => {
              if (requireAuth('Kitap düzenlemek')) {
                setEditingBook(b);
                setIsBookModalOpen(true);
              }
            }}
            onDeleteBook={handleDeleteBook}
            onStatusChange={handleStatusChange}
            onAddNote={(b) => {
              if (requireAuth('Not eklemek')) {
                setSelectedBookForNote(b);
                setEditingNote(null);
                setIsNoteModalOpen(true);
              }
            }}
            onSelectBook={(b) => setSelectedBookDetail(b)}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsView
            goal={goal}
            books={books}
            isAuthorizedUser={isAuthorizedUser}
            onEditGoalClick={() => {
              if (requireAuth('Okuma hedefini düzenlemek')) {
                setIsGoalModalOpen(true);
              }
            }}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView
            notes={notes}
            books={books}
            isAuthorizedUser={isAuthorizedUser}
            onAddNoteClick={() => {
              if (requireAuth('Not eklemek')) {
                setSelectedBookForNote(null);
                setEditingNote(null);
                setIsNoteModalOpen(true);
              }
            }}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView books={books} notes={notes} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-paper-200 dark:border-paper-800/80 py-6 text-center text-xs text-paper-500 dark:text-paper-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>Kitaplığım &copy; {new Date().getFullYear()} — Kişisel Kütüphane & Okuma Hedefleri</span>
            <span className="ml-2 font-mono text-[10px] bg-paper-200 dark:bg-paper-800 px-1.5 py-0.5 rounded">v0.0.4</span>
          </div>
          <div className="text-[11px] text-paper-400">
            {isAuthorizedUser ? (
              <span className="text-emerald-600 dark:text-emerald-400">Yönetici Oturumu Açık</span>
            ) : (
              <span>Salt-Okunur Ziyaretçi Modu</span>
            )}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          showToast('Hoş geldiniz! Giriş başarıyla sağlandı.', 'success');
        }}
      />

      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setEditingBook(null);
        }}
        onSave={handleSaveBook}
        initialBook={editingBook}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
          setSelectedBookForNote(null);
        }}
        onSave={handleSaveNote}
        books={books}
        initialNote={editingNote}
        selectedBook={selectedBookForNote}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
        currentGoal={goal}
      />

      <BookDetailModal
        book={selectedBookDetail}
        notes={notes}
        isAuthorizedUser={isAuthorizedUser}
        onClose={() => setSelectedBookDetail(null)}
        onEdit={(b) => {
          setSelectedBookDetail(null);
          if (requireAuth('Kitap düzenlemek')) {
            setEditingBook(b);
            setIsBookModalOpen(true);
          }
        }}
        onDelete={(id) => {
          setSelectedBookDetail(null);
          handleDeleteBook(id);
        }}
        onAddNote={(b) => {
          setSelectedBookDetail(null);
          if (requireAuth('Not eklemek')) {
            setSelectedBookForNote(b);
            setEditingNote(null);
            setIsNoteModalOpen(true);
          }
        }}
        onDeleteNote={handleDeleteNote}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-medium border ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-paper-900 text-white dark:bg-paper-100 dark:text-paper-900 border-paper-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <ShieldAlert className="w-4 h-4 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
