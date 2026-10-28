export type BookStatus = 'want_to_read' | 'reading' | 'read' | 'abandoned';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  totalPages?: number;
  currentPage?: number;
  rating?: number; // 1 to 5
  category?: string;
  startDate?: string;
  finishDate?: string;
  isbn?: string;
  coverUrl?: string;
  review?: string;
  notesCount?: number;
  createdAt: number;
  updatedAt: number;
}

export interface BookNote {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  pageNumber?: number | null;
  quote: string; // The highlight or notable excerpt
  thought?: string; // Personal thought, reflection or reaction
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ReadingGoal {
  year: number;
  targetBooks: number;
  targetPages?: number;
  updatedAt: number;
}

export type ViewTab = 'library' | 'goals' | 'notes' | 'stats';

export interface BookFilter {
  status: BookStatus | 'all';
  searchQuery: string;
  category: string;
  sortBy: 'date_desc' | 'date_asc' | 'title_asc' | 'author_asc' | 'rating_desc' | 'pages_desc';
}
