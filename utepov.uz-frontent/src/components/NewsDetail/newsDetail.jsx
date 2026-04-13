import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./newsDetail.scss";

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news/${id}/`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setNews(data);
                setError(null);
                
                // Tegishli yangiliklarni yuklash
                await fetchRelatedNews(data.category || data.id);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Yangilikni yuklashda xatolik yuz berdi");
                setNews(null);
            } finally {
                setLoading(false);
            }
        };

        const fetchRelatedNews = async (category) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news/related/${category}/?exclude=${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setRelatedNews(Array.isArray(data) ? data.slice(0, 3) : []);
                }
            } catch (err) {
                console.error("Related news error:", err);
                setRelatedNews([]);
            }
        };

        if (id) {
            fetchNewsDetail();
        }
        
        // Scroll to top when opening detail page
        window.scrollTo(0, 0);
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "";
        
        const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 
                       'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
        
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const formatViews = (views) => {
        if (!views) return "0";
        if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}k`;
        }
        return views.toString();
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return "";
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    if (loading) {
        return (
            <section className="news-detail-page">
                <div className="news-detail-container">
                    <div className="loading-skeleton">
                        <div className="skeleton-header"></div>
                        <div className="skeleton-image"></div>
                        <div className="skeleton-content">
                            <div className="skeleton-line"></div>
                            <div className="skeleton-line"></div>
                            <div className="skeleton-line long"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !news) {
        return (
            <section className="news-detail-page">
                <div className="news-detail-container">
                    <div className="error-container">
                        <div className="error-icon">⚠️</div>
                        <h2>{error || "Yangilik topilmadi"}</h2>
                        <p>Kechirasiz, siz qidirayotgan yangilik mavjud emas yoki o'chirilgan bo'lishi mumkin.</p>
                        <Link to="/news" className="back-button">
                            ← Yangiliklar sahifasiga qaytish
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="news-detail-page">
            <div className="news-detail-container">
                {/* Back button */}
                <div className="breadcrumbs">
                        <Link to="/">Bosh sahifa</Link>
                        <span>{'>'}</span>
                        <Link to="/news">Yangiliklar</Link>
                        <span>{'>'}</span>
                        <span className="current">{news.title?.slice(0, 50)}...</span>
                </div>

                <article className="news-detail-card">
                    {/* Breadcrumbs */}
                    

                    {/* Header info */}
                    <div className="news-detail-header">
                        <h1>{news.title}</h1>
                        <div className="news-meta">
                            <div className="meta-item">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 3.5V8L10.5 10.5M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                </svg>
                                <span>{formatDate(news.created_at)}</span>
                            </div>
                            {news.views && (
                                <div className="meta-item">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M1 8C1 8 3 3 8 3C13 3 15 8 15 8C15 8 13 13 8 13C3 13 1 8 1 8Z" stroke="currentColor" strokeWidth="1.2"/>
                                        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                                    </svg>
                                    <span>{formatViews(news.views)} ko'rish</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Featured image */}
                    {news.image && (
                        <div className="news-detail-image">
                            <img 
                                src={news.image} 
                                alt={news.title}
                                onError={(e) => {
                                    e.target.src = "/placeholder-image-large.jpg";
                                    e.target.onerror = null;
                                }}
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="news-detail-content">
                        <div className="content-body">
                            {news.content?.split('\n').map((paragraph, idx) => (
                                paragraph.trim() && <p key={idx}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    {/* Share section */}
                    <div className="news-share-section">
                        <div className="share-label">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M13 6L15 4L13 2M5 13L3 15L5 17M17 5C17 6.65685 15.6569 8 14 8C12.3431 8 11 6.65685 11 5C11 3.34315 12.3431 2 14 2C15.6569 2 17 3.34315 17 5ZM7 13C7 14.6569 5.65685 16 4 16C2.34315 16 1 14.6569 1 13C1 11.3431 2.34315 10 4 10C5.65685 10 7 11.3431 7 13ZM17 13C17 14.6569 15.6569 16 14 16C12.3431 16 11 14.6569 11 13C11 11.3431 12.3431 10 14 10C15.6569 10 17 11.3431 17 13ZM6.5 6.5L11.5 11.5M11.5 6.5L6.5 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                            <span>Ushbu yangilikni ulashish</span>
                        </div>
                        <div className="share-buttons">
                            <button className="share-btn telegram" onClick={() => window.open(`https://t.me/share/url?url=${window.location.href}&text=${news.title}`, '_blank')}>
                                Telegram
                            </button>
                            <button className="share-btn facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}>
                                Facebook
                            </button>
                            <button className="share-btn twitter" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${news.title}&url=${window.location.href}`, '_blank')}>
                                Twitter
                            </button>
                            <button className="share-btn copy" onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Link nusxalandi!");
                            }}>
                                Link
                            </button>
                        </div>
                    </div>
                </article>

                {/* Related news */}
                {/* {relatedNews.length > 0 && (
                    <div className="related-news">
                        <h3>O'xshash yangiliklar</h3>
                        <div className="related-grid">
                            {relatedNews.map((item) => (
                                <Link to={`/news/${item.id}`} key={item.id} className="related-card">
                                    {item.image && (
                                        <div className="related-image">
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                    )}
                                    <div className="related-info">
                                        <time>{formatDate(item.created_at)}</time>
                                        <h4>{truncateText(item.title, 60)}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )} */}
            </div>
        </section>
    );
};

export default NewsDetail;