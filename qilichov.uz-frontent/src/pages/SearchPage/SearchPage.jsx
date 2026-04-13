import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./SearchPage.scss";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");

    const [books, setBooks] = useState([]);
    const [audiobooks, setAudiobooks] = useState([]);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalAudiobooks, setTotalAudiobooks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("all"); // all, books, audiobooks

    useEffect(() => {
        if (!query) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        fetch(`${import.meta.env.VITE_API_URL}/api/search/?q=${query}`)
            .then(res => {
                if (!res.ok) throw new Error("Xatolik yuz berdi");
                return res.json();
            })
            .then(data => {
                setBooks(data.books || []);
                setAudiobooks(data.audiobooks || []);
                setTotalBooks(data.total_books || 0);
                setTotalAudiobooks(data.total_audiobooks || 0);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Ma'lumotlarni yuklashda xatolik");
                setLoading(false);
            });
    }, [query]);

    const getFilteredData = () => {
        switch (activeTab) {
            case "books":
                return books;
            case "audiobooks":
                return audiobooks;
            default:
                return [...books, ...audiobooks];
        }
    };

    const getTotalCount = () => {
        switch (activeTab) {
            case "books":
                return totalBooks;
            case "audiobooks":
                return totalAudiobooks;
            default:
                return totalBooks + totalAudiobooks;
        }
    };

    const formatDuration = (duration) => {
        if (!duration) return "";
        return duration;
    };

    if (!query) {
        return (
            <div className="search-page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-state__icon">🔍</div>
                        <h2>Hech narsa qidirilmagan</h2>
                        <p>Qidiruv so'zini kiriting va natijalarni ko'ring</p>
                        <Link to="/" className="empty-state__btn">Bosh sahifaga qaytish</Link>
                    </div>
                </div>
            </div>
        );
    }

    const filteredData = getFilteredData();
    const totalCount = getTotalCount();

    return (
        <div className="search-page">
            <div className="container">
                {/* Header */}
                <div className="search-header">
                    <div className="search-header__info">
                        <h1>Qidiruv natijalari</h1>
                        <p className="search-query">
                            <span className="search-query__label">Siz qidirdingiz:</span>
                            <span className="search-query__text">“{query}”</span>
                        </p>
                    </div>
                    <div className="search-header__count">
                        <span className="count-badge">{totalCount}</span>
                        <span>ta natija topildi</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="search-tabs">
                    <button 
                        className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                        onClick={() => setActiveTab("all")}
                    >
                        Barchasi
                        <span className="tab-count">{totalBooks + totalAudiobooks}</span>
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === "books" ? "active" : ""}`}
                        onClick={() => setActiveTab("books")}
                    >
                        Kitoblar
                        <span className="tab-count">{totalBooks}</span>
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === "audiobooks" ? "active" : ""}`}
                        onClick={() => setActiveTab("audiobooks")}
                    >
                        Audio kitoblar
                        <span className="tab-count">{totalAudiobooks}</span>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="loading-grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="item-skeleton">
                                <div className="skeleton-cover"></div>
                                <div className="skeleton-content">
                                    <div className="skeleton-line"></div>
                                    <div className="skeleton-line short"></div>
                                    <div className="skeleton-line"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="error-state">
                        <div className="error-state__icon">⚠️</div>
                        <h3>{error}</h3>
                        <p>Iltimos, keyinroq qayta urinib ko'ring</p>
                        <button onClick={() => window.location.reload()} className="error-state__btn">
                            Qayta yuklash
                        </button>
                    </div>
                )}

                {/* Results */}
                {!loading && !error && filteredData.length > 0 && (
                    <div className="items-grid">
                        {filteredData.map(item => (
                            <Link 
                                to={item.audio_file ? `/audiobooks/${item.id}` : `/books/${item.id}`} 
                                key={item.id} 
                                className="item-card"
                            >
                                <div className="item-card__cover">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} />
                                    ) : (
                                        <div className="item-card__placeholder">
                                            {item.audio_file ? (
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                                    <path d="M9 18V6L19 12L9 18Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
                                                </svg>
                                            ) : (
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                                    <path d="M4 6H20M4 12H20M4 18H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                                </svg>
                                            )}
                                        </div>
                                    )}
                                    {item.audio_file && (
                                        <div className="audio-badge">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                <path d="M9 18V6L19 12L9 18Z" fill="white"/>
                                            </svg>
                                            Audio
                                        </div>
                                    )}
                                </div>
                                <div className="item-card__info">
                                    <h3 className="item-title">{item.title}</h3>
                                    <p className="item-author">{item.author}</p>
                                    {item.description && (
                                        <p className="item-description">
                                            {item.description.length > 100 
                                                ? `${item.description.slice(0, 100)}...` 
                                                : item.description}
                                        </p>
                                    )}
                                    <div className="item-meta">
                                        {item.year && (
                                            <span className="item-year">{item.year}</span>
                                        )}
                                        {item.duration && (
                                            <span className="item-duration">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                                                </svg>
                                                {item.duration}
                                            </span>
                                        )}
                                        <span className="read-more">
                                            {item.audio_file ? "Eshitish →" : "Batafsil →"}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && !error && filteredData.length === 0 && (
                    <div className="no-results">
                        <div className="no-results__icon">📚</div>
                        <h3>Hech qanday natija topilmadi</h3>
                        <p>“{query}” bo'yicha hech qanday natija topilmadi</p>
                        <div className="no-results__suggestions">
                            <p>Quyidagilarni sinab ko'ring:</p>
                            <ul>
                                <li>Boshqa so'zlar bilan qidirish</li>
                                <li>Muallif nomini to'liq yozish</li>
                                <li>Kitob nomini qisqartirish</li>
                            </ul>
                        </div>
                        <Link to="/" className="no-results__btn">Bosh sahifaga qaytish</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;