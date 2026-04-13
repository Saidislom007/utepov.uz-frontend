import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./news.scss";

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news/all/`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                // Faqat 5 ta yangilik olamiz (1 featured + 3 ta)
                const limitedNews = Array.isArray(data) ? data.slice(0, 4) : [];
                setNews(limitedNews);
                setError(null);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Yangiliklarni yuklashda xatolik yuz berdi");
                setNews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "";
        
        const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 
                       'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
        
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const truncateText = (text, maxLength = 200) => {
        if (!text) return "";
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    // Eng so'nggi yangilik (birinchi element)
    const latestNews = news.length > 0 ? news[0] : null;
    // Qolgan 4 ta yangilik
    const otherNews = news.slice(1, 5);

    if (error) {
        return (
            <section className="news" aria-label="News">
                <div className="container">
                    <div className="news-error">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="retry-btn">
                            Qayta urunish
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="news" aria-label="News">
            <div className="container">
                <div className="news-top">
                    <h1>Yangiliklar</h1>
                    <p>Eng so‘nggi e’lonlar va xabarlar</p>
                </div>

                {loading ? (
                    <>
                        {/* Featured skeleton */}
                        <div className="featured-skeleton">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-line"></div>
                                <div className="skeleton-line"></div>
                                <div className="skeleton-line long"></div>
                            </div>
                        </div>
                        {/* Other skeletons */}
                        <div className="news-grid">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="news-card-skeleton">
                                    <div className="skeleton-image"></div>
                                    <div className="skeleton-content">
                                        <div className="skeleton-line"></div>
                                        <div className="skeleton-line"></div>
                                        <div className="skeleton-line short"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : news.length > 0 ? (
                    <>
                        {/* Featured latest news - kattaroq va boshqacha ko'rinish */}
                        {latestNews && (
                            <article className="featured-news">
                                <div className="featured-image">
                                    <img 
                                        src={latestNews.image} 
                                        alt={latestNews.title}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = "/placeholder-image.jpg";
                                            e.target.onerror = null;
                                        }}
                                    />
                                    <div className="featured-badge">Eng so'nggi</div>
                                </div>
                                <div className="featured-content">
                                    <time className="featured-date" dateTime={latestNews.created_at}>
                                        {formatDate(latestNews.created_at)}
                                    </time>
                                    <h2>{latestNews.title}</h2>
                                    <p>{truncateText(latestNews.content, 200)}</p>
                                    <div className="featured-meta">
                                        <Link to={`/news/${latestNews.id}`} className="read-more featured">
                                            Batafsil o‘qish
                                            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        )}

                        {/* Other news grid - 4 ta */}
                        {otherNews.length > 0 && (
                            <>
                                <div className="news-grid">
                                    {otherNews.map((item) => (
                                        <article key={item.id} className="news-card">
                                            {item.image && (
                                                <div className="news-image-wrapper">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.title || "Yangilik rasmi"}
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.src = "/placeholder-image.jpg";
                                                            e.target.onerror = null;
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <div className="news-info">
                                                {item.created_at && (
                                                    <time className="news-date" dateTime={item.created_at}>
                                                        {formatDate(item.created_at)}
                                                    </time>
                                                )}
                                                <h3>{item.title || "Nomsiz yangilik"}</h3>
                                                <Link to={`/news/${item.id}`} className="read-more">
                                                    Batafsil o‘qish
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                                
                                {/* Barcha yangiliklar button */}
                                <div className="news-all-btn">
                                    <Link to="/news" className="all-news-btn">
                                        Barcha yangiliklar
                                        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                                            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </Link>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="news-empty">
                        <p>Hozircha yangiliklar mavjud emas</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewsSection;