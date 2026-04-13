import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  Share2,
  ChevronRight,
  BookOpen,
  Send,
  X,
} from "lucide-react";

import { FaFacebookF, FaInstagram } from "react-icons/fa";
import "./bookDetailPage.scss";

const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [showShareBox, setShowShareBox] = useState(false);
  const shareRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/books/${id}/`)
      .then((res) => res.json())
      .then((data) => setBook(data))
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setShowShareBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!book) {
    return <div className="book-detail-loading">Yuklanmoqda...</div>;
  }

  const rating = Number(book?.rating || 3.8);
  const reviewsCount = book?.reviews_count || 6;

  const currentUrl = window.location.href;
  const shareText = `${book.title} - ${book.author}`;

  const telegramShare = `https://t.me/share/url?url=${encodeURIComponent(
    currentUrl
  )}&text=${encodeURIComponent(shareText)}`;

  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}`;

  const instagramLink = "https://www.instagram.com/";

  return (
    <section className="book-detail-page">
      <div className="book-detail-container">
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
          <Link to="/all-books" className="breadcrumb-link">
            Kutubxona
          </Link>
          <span className="separator">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
         
          <span className="breadcrumb-current">{book.title?.slice(0, 40)}...</span>
        </div>

        <div className="book-detail-left">
          <div className="book-cover-box">
            <img src={book.image} alt={book.title} />
          </div>

          <div className="book-rating-box">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star
                key={item}
                size={20}
                fill={item <= Math.round(rating) ? "#f5b301" : "transparent"}
                color={item <= Math.round(rating) ? "#f5b301" : "#cbd5e1"}
              />
            ))}
          </div>
        </div>

        <div className="book-detail-right">
          <div className="book-top-actions">
            <div className="book-type-tabs">
              <button className="active">Tekst</button>
              <button>Audio</button>
            </div>

            <div className="share-wrapper" ref={shareRef}>
              <button
                className="share-btn"
                onClick={() => setShowShareBox((prev) => !prev)}
              >
                <Share2 size={16} />
                <span>Ulashish</span>
              </button>

              {showShareBox && (
                <div className="share-popup">
                  <div className="share-popup-header">
                    <h4>Ulashish</h4>
                    <button
                      className="close-share-btn"
                      onClick={() => setShowShareBox(false)}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="share-popup-links">
                    <a
                      href={telegramShare}
                      target="_blank"
                      rel="noreferrer"
                      className="share-item telegram"
                    >
                      <div className="share-icon">
                        <Send size={18} />
                      </div>
                      <span>Telegram</span>
                    </a>

                    <a
                      href={facebookShare}
                      target="_blank"
                      rel="noreferrer"
                      className="share-item facebook"
                    >
                      <div className="share-icon">
                        <FaFacebookF size={16} />
                      </div>
                      <span>Facebook</span>
                    </a>

                    <a
                      href={instagramLink}
                      target="_blank"
                      rel="noreferrer"
                      className="share-item instagram"
                    >
                      <div className="share-icon">
                        <FaInstagram size={16} />
                      </div>
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="book-author-row">
            <span>{book.author}</span>
            <ChevronRight size={18} />
          </div>

          <h1>{book.title}</h1>

          <div className="book-tags">
            <span>O‘zbek adabiyoti</span>
            <span>Sarguzasht</span>
            <span>Tavsiya etiladi</span>
            <span>Yosh 9+</span>
          </div>

          <div className="book-stats">
            <div className="book-stat-item">
              <div className="stat-main rating-main">
                <Star size={16} fill="#f5b301" color="#f5b301" />
                <strong>{rating}</strong>
              </div>
              <span>baholar</span>
            </div>

            <div className="book-stat-item">
              <strong>{reviewsCount}</strong>
              <span>izohlar</span>
            </div>

            <div className="book-stat-item">
              <strong>{book.year}</strong>
              <span>yil</span>
            </div>

            <div className="book-stat-item">
              <strong>{book.pages}</strong>
              <span>bet</span>
            </div>
          </div>

          <div className="book-actions">
            <Link to={`/books/${book.id}/read`} className="read-btn">
              <BookOpen size={18} />
              <span>O‘qish</span>
            </Link>
          </div>

          <div className="book-content-tabs">
            <button
              className={activeTab === "about" ? "active" : ""}
              onClick={() => setActiveTab("about")}
            >
              Kitob haqida
            </button>
            <button
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => setActiveTab("reviews")}
            >
              Izohlar
            </button>
          </div>

          <div className="book-content-box">
            {activeTab === "about" ? (
              <p>{book.description}</p>
            ) : (
              <div className="empty-reviews">Hozircha izohlar yo‘q.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDetailPage;