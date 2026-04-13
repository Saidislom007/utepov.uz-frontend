import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./newsPage.scss";

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalNews, setTotalNews] = useState(0);

    // Filter state
    const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");

    const newsPerPage = 9;

    useEffect(() => {
        // Update URL params
        const params = {};
        if (sortBy !== "newest") params.sort = sortBy;
        setSearchParams(params);
    }, [sortBy, setSearchParams]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                let url = `${import.meta.env.VITE_API_URL}/api/news/all/?page=${currentPage}&limit=${newsPerPage}`;

                if (sortBy === "oldest") {
                    url += `&sort=oldest`;
                } else if (sortBy === "popular") {
                    url += `&sort=popular`;
                }

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Agar API pagination qo'llab-quvvatlamasa
                if (Array.isArray(data)) {
                    let filteredData = [...data];

                    // Sort
                    if (sortBy === "oldest") {
                        filteredData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    } else if (sortBy === "popular") {
                        filteredData.sort((a, b) => (b.views || 0) - (a.views || 0));
                    } else {
                        filteredData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    }

                    // Pagination
                    const startIndex = (currentPage - 1) * newsPerPage;
                    const endIndex = startIndex + newsPerPage;
                    const paginatedData = filteredData.slice(startIndex, endIndex);

                    setNews(paginatedData);
                    setTotalNews(filteredData.length);
                    setTotalPages(Math.ceil(filteredData.length / newsPerPage));
                } else {
                    // Agar API pagination qo'llab-quvvatlasa
                    setNews(data.news || data.results || []);
                    setTotalNews(data.total || data.count || 0);
                    setTotalPages(data.totalPages || Math.ceil((data.total || data.count || 0) / newsPerPage));
                }

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
    }, [currentPage, sortBy]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "";

        const now = new Date();
        const diffTime = Math.abs(now - d);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return "Bugun";
        } else if (diffDays === 1) {
            return "Kecha";
        } else if (diffDays < 7) {
            return `${diffDays} kun oldin`;
        } else {
            return `${d.getDate()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
        }
    };

    const truncateText = (text, maxLength = 120) => {
        if (!text) return "";
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (error) {
        return (
            <section className="news-page">
                <div className="container">
                    <div className="breadcrumbs">
                        <Link to="/">Bosh sahifa</Link>
                        <span className="separator">/</span>
                        <span className="current">Yangiliklar</span>
                    </div>
                    <div className="error-container">
                        <div className="error-icon">📰</div>
                        <h2>{error}</h2>
                        <p>Iltimos, keyinroq qayta urinib ko'ring</p>
                        <button onClick={() => window.location.reload()} className="retry-btn">
                            Qayta yuklash
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="news-page">
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
                    <span className="separator">/</span>
                    <Link to="/news" className="breadcrumb-link active">
                        Yangiliklar
                    </Link>
                    {sortBy !== "newest" && (
                        <>
                            <span className="separator">/</span>
                            <span className="breadcrumb-current">
                                {sortBy === "oldest" ? "Eng eski" : "Eng ko'p o'qilgan"}
                            </span>
                        </>
                    )}
                </div>

                {/* Page header */}
                <div className="page-header">
                    <h1>Yangiliklar</h1>
                    <p>Eng so'nggi yangiliklar va e'lonlar</p>
                </div>

                

                {/* News grid */}
                {loading ? (
                    <div className="news-grid loading-grid">
                        {[...Array(6)].map((_, i) => (
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
                ) : news.length > 0 ? (
                    <>
                        <div className="news-grid">
                            {news.map((item) => (
                                <article key={item.id} className="news-card">
                                    <Link to={`/news/${item.id}`} className="news-link">
                                        {item.image && (
                                            <div className="news-image-wrapper">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = "/placeholder-image.jpg";
                                                        e.target.onerror = null;
                                                    }}
                                                />
                                                {item.views > 100 && (
                                                    <div className="popular-badge">
                                                        🔥 {item.views} ko'rish
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="news-info">
                                            <div className="news-meta">
                                                <time className="news-date">
                                                    {formatDate(item.created_at)}
                                                </time>
                                                {item.views && (
                                                    <span className="news-views">
                                                        👁️ {item.views}
                                                    </span>
                                                )}
                                            </div>
                                            <h3>{item.title || "Nomsiz yangilik"}</h3>
                                            <p>{truncateText(item.content)}</p>
                                            <div className="read-more">
                                                Batafsil o'qish
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination-btn"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    Oldingi
                                </button>

                                <div className="pagination-numbers">
                                    {getPageNumbers().map((page, index) => (
                                        <button
                                            key={index}
                                            className={`pagination-number ${page === currentPage ? "active" : ""} ${page === "..." ? "dots" : ""}`}
                                            onClick={() => typeof page === "number" && handlePageChange(page)}
                                            disabled={page === "..."}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    className="pagination-btn"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Keyingi
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📰</div>
                        <h3>Hech qanday yangilik topilmadi</h3>
                        <p>Hozircha yangiliklar mavjud emas</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewsPage;