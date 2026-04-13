import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "../../components/BookCard/BookCard";
import AudioBookCard from "../../components/AudioBookCard/AudioBookCard";
import "./allBooksPage.scss";

const AllBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [audioBooks, setAudioBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [booksRes, audioRes, genresRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/books/`),
          fetch(`${import.meta.env.VITE_API_URL}/api/audiobooks/`),
          fetch(`${import.meta.env.VITE_API_URL}/api/genres/`),
        ]);

        if (!booksRes.ok || !audioRes.ok || !genresRes.ok) {
          throw new Error("Ma'lumotlarni olishda xatolik yuz berdi");
        }

        const booksData = await booksRes.json();
        const audioData = await audioRes.json();
        const genresData = await genresRes.json();

        setBooks(Array.isArray(booksData) ? booksData : []);
        setAudioBooks(Array.isArray(audioData) ? audioData : []);
        setGenres(Array.isArray(genresData) ? genresData : []);
      } catch (err) {
        console.log(err);
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = activeGenre
    ? books.filter((book) => Number(book.genre) === Number(activeGenre))
    : books;

  const filteredAudioBooks = activeGenre
    ? audioBooks.filter((book) => Number(book.genre) === Number(activeGenre))
    : audioBooks;

  const activeGenreName = activeGenre
    ? genres.find((genre) => Number(genre.id) === Number(activeGenre))?.name
    : "Hamma";

  if (loading) {
    return (
      <div className="all-books-page">
        <div className="library-space"></div>
        <div className="container">
          <div className="all-loading">Yuklanmoqda...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-books-page">
        <div className="library-space"></div>
        <div className="container">
          <div className="all-loading">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="all-books-page">
      <div className="library-space"></div>
      <div className="container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link to="/" className="breadcrumb-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 9L12 3L21 9V20H3V9Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M9 20V12H15V20" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            Bosh sahifa
          </Link>
          <span className="separator">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <Link to="/all-books" className="breadcrumb-link active">
            Kutubxona
          </Link>
          {activeGenre && (
            <>
              <span className="separator">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="breadcrumb-current">{activeGenreName}</span>
            </>
          )}
        </div>

        <div className="all-books-layout">
          {/* Sidebar */}
          <aside className="genres-sidebar">
            <div className="genres-box">
              <div className="genres-head">
                <h2>Janrlar</h2>
                <span>{genres.length} janr</span>
              </div>

              <div className="genre-list">
                <button
                  className={!activeGenre ? "genre-item active" : "genre-item"}
                  onClick={() => setActiveGenre(null)}
                >
                  <span className="genre-name">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M4 6H20M4 12H20M4 18H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    Hammasi
                  </span>
                  <span className="genre-count">{books.length + audioBooks.length}</span>
                </button>

                {genres.map((genre) => {
                  const bookCount = books.filter(b => Number(b.genre) === Number(genre.id)).length;
                  const audioCount = audioBooks.filter(a => Number(a.genre) === Number(genre.id)).length;
                  const totalCount = bookCount + audioCount;
                  
                  return (
                    <button
                      key={genre.id}
                      className={
                        Number(activeGenre) === Number(genre.id)
                          ? "genre-item active"
                          : "genre-item"
                      }
                      onClick={() => setActiveGenre(genre.id)}
                    >
                      <span className="genre-name">{genre.name}</span>
                      <span className="genre-count">{totalCount}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="all-books-content">
            {/* Books Section */}
            <section className="all-section">
              <div className="section-header">
                <h1>{activeGenreName} kitoblar</h1>
                <span className="section-count">{filteredBooks.length} ta kitob</span>
              </div>

              {filteredBooks.length > 0 ? (
                <div className="books-grid">
                  {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="empty-section">
                  <div className="empty-icon">📚</div>
                  <p>Bu janrda kitob topilmadi</p>
                </div>
              )}
            </section>

            {/* Audiobooks Section */}
            <section className="all-section">
              <div className="section-header">
                <h1>{activeGenreName} audiokitoblar</h1>
                <span className="section-count">{filteredAudioBooks.length} ta audiokitob</span>
              </div>

              {filteredAudioBooks.length > 0 ? (
                <div className="books-grid">
                  {filteredAudioBooks.map((book) => (
                    <AudioBookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="empty-section">
                  <div className="empty-icon">🎧</div>
                  <p>Bu janrda audiokitob topilmadi</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBooksPage;