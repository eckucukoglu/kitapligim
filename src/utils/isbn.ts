export interface FetchedBookData {
  title?: string;
  author?: string;
  totalPages?: number;
  coverUrl?: string;
  category?: string;
  isbn?: string;
}

export async function fetchBookByISBN(isbnInput: string): Promise<FetchedBookData | null> {
  const cleanIsbn = isbnInput.replace(/[^0-9Xx]/g, '').trim();
  if (!cleanIsbn) return null;

  try {
    // 1. Try Open Library
    const olRes = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`);
    if (olRes.ok) {
      const data = await olRes.json();
      const bookData = data[`ISBN:${cleanIsbn}`];
      if (bookData) {
        return {
          title: bookData.title,
          author: (bookData.authors || []).map((a: { name: string }) => a.name).join(', '),
          totalPages: bookData.number_of_pages,
          coverUrl: bookData.cover?.large || bookData.cover?.medium || bookData.cover?.small,
          category: bookData.subjects?.[0]?.name,
          isbn: cleanIsbn,
        };
      }
    }

    // 2. Fallback to Google Books
    const gbRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`);
    if (gbRes.ok) {
      const gbData = await gbRes.json();
      const item = gbData.items?.[0]?.volumeInfo;
      if (item) {
        return {
          title: item.title,
          author: (item.authors || []).join(', '),
          totalPages: item.pageCount,
          coverUrl: item.imageLinks?.thumbnail?.replace('http:', 'https:') || item.imageLinks?.smallThumbnail?.replace('http:', 'https:'),
          category: item.categories?.[0],
          isbn: cleanIsbn,
        };
      }
    }
  } catch (err) {
    console.warn('Error fetching book info:', err);
  }

  return null;
}
