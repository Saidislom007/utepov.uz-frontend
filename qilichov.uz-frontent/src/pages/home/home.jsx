import React, { useEffect, useRef, useState, useCallback } from "react";
import Herobg from "../../components/imgs/section.webp";
import BookCard from "../../components/BookCard/BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./home.scss";
import AudioBookCard from "../../components/AudioBookCard/AudioBookCard";
import { Link } from "react-router-dom";
import NewsSection from "../../components/News/news";

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const swiperInstanceRef = useRef(null);
    const [audioBooks, setAudioBooks] = useState([]);
    const [audioLoading, setAudioLoading] = useState(true);

    // Fetch audio books
    useEffect(() => {
        const fetchAudioBooks = async () => {
            try {
                setAudioLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/audiobooks/`);
                const data = await res.json();
                setAudioBooks(Array.isArray(data) ? data.slice(0, 10) : []);
            } catch (err) {
                console.error("Error fetching audio books:", err);
            } finally {
                setAudioLoading(false);
            }
        };
        fetchAudioBooks();
    }, []);

    // Fetch books
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/home/`);
                if (!response.ok) throw new Error("Failed to fetch books");
                const data = await response.json();
                setBooks(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching books:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    // Initialize Swiper navigation
    useEffect(() => {
        if (swiperInstanceRef.current && prevRef.current && nextRef.current) {
            swiperInstanceRef.current.params.navigation.prevEl = prevRef.current;
            swiperInstanceRef.current.params.navigation.nextEl = nextRef.current;
            swiperInstanceRef.current.navigation.init();
            swiperInstanceRef.current.navigation.update();
        }
    }, [books]);

    const stats = [
        {
            icon: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
            count: "3190+",
            label: "Kitoblar",
            color: "blue"
        },
        {
            icon: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",
            count: "1040+",
            label: "Audiokitoblar",
            color: "purple"
        },
        {
            icon: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M8.5 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M12 12h8v8h-8z",
            count: "967+",
            label: "O‘quvchilar",
            color: "green"
        }
    ];

    if (error) {
        return (
            <div className="error-state">
                <div className="error-state__icon">⚠️</div>
                <p>Xatolik yuz berdi: {error}</p>
                <button onClick={() => window.location.reload()}>Qayta urinib ko'ring</button>
            </div>
        );
    }

    return (
        <main className="mainn">
            {/* Hero Section */}
            <section className="hero" aria-label="Hero section">
                <div className="hero-content">
                    <h1>
                        Qilichov.uz <span>platformasi</span>
                    </h1>
                    <p>
                        Ushbu platformada siz minglab kitoblar va audiokitoblarni
                        topasiz. Qulay vaqtda o‘qing, yo‘lda tinglang va har kuni
                        rivojlaning.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/all-books" className="btn-link">
                            <button className="primary">
                                Kitob o‘qish
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </Link>
                        <Link to="/all-books" className="btn-link">
                            <button className="secondary" aria-label="Audiokitob tinglash">
                                <svg stroke="currentColor" fill="currentColor" viewBox="0 0 1024 1024" height="18" width="18">
                                    <path d="M1023.84 604.56c.096-21.056-3.216-100.497-5.744-123.217-29.12-260.752-240.752-450-503.184-450-273.344 0-494.815 210.624-509.84 489.904-.32 6.096-2.56 49.344-2.72 75.088l-.08 14.32C.96 616.575.16 622.687.16 628.991v278.656c0 46.88 38.128 85.008 85.008 85.008h86.288c46.88 0 85.023-38.128 85.023-85.008v-278.64c0-46.88-38.16-85.008-85.024-85.008h-86.32a85.65 85.65 0 0 0-17.184 1.744c.48-10.383.912-18.591 1.024-21.055C82.16 279.904 276.111 95.344 514.911 95.344c229.28 0 414.128 165.344 439.568 393.12 1.088 9.504 2.464 33.664 3.569 57.92-6.24-1.44-12.609-2.385-19.233-2.385h-85.28c-46.88 0-85.008 38.128-85.008 85.008V906.67c0 46.895 38.128 85.007 85.008 85.007h85.28c46.88 0 85.024-38.127 85.024-85.007V629.007c0-5.216-.64-10.288-1.568-15.216.928-2.944 1.536-6.017 1.569-9.233zm-938.704 3.439h86.288c11.6 0 21.023 9.408 21.023 21.008v278.656c0 11.616-9.44 21.008-21.024 21.008H85.135c-11.6 0-21.008-9.409-21.008-21.008V629.007c.032-11.6 9.44-21.008 21.009-21.008zM959.84 906.655c0 11.6-9.44 21.008-21.023 21.008h-85.28c-11.6 0-21.009-9.408-21.009-21.008V629.007c0-11.6 9.409-21.007 21.008-21.007h85.28c11.6 0 21.024 9.408 21.024 21.007v277.648z"></path>
                                </svg>
                                Audiokitob tinglash
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="hero-image">
                    <img
                        src={Herobg}
                        alt="Kitob.uz platformasi hero tasviri"
                        loading="eager"
                        width="900"
                        height="400"
                    />
                </div>

                <div className="stats">
                    {stats.map((stat, index) => (
                        <div className="stat" key={index}>
                            <div className={`svg-container ${stat.color}`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d={stat.icon}></path>
                                    {stat.color === "green" && (
                                        <>
                                            <circle cx="8.5" cy="7" r="4"></circle>
                                            <rect x="12" y="12" width="8" height="8" rx="2"></rect>
                                        </>
                                    )}
                                </svg>
                            </div>
                            <div>
                                <h2>{stat.count}</h2>
                                <span>{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Books Section */}
            <section className="home-books" aria-label="Yangi kitoblar">
                <div className="container">
                    <div className="home-books-top">
                        <div className="home-books-title">
                            <h1>Biz eng yaxshi yangi chiqishlarni qo'shamiz</h1>
                            <p>Har kuni 220 ta kitob. Mashhur mualliflar va eksklyuziv nashriyotlar</p>
                        </div>
                        {!loading && books.length > 0 && (
                            <div className="slider-buttons">
                                <button
                                    ref={prevRef}
                                    className="slider-btn slider-btn--prev"
                                    aria-label="Oldingi kitoblar"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                <button
                                    ref={nextRef}
                                    className="slider-btn slider-btn--next"
                                    aria-label="Keyingi kitoblar"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="books-loading">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="book-card-skeleton"></div>
                            ))}
                        </div>
                    ) : books.length > 0 ? (
                        <Swiper
                            modules={[Navigation, Autoplay, A11y]}
                            spaceBetween={16}
                            loop={books.length > 5}
                            speed={800}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            navigation={{
                                prevEl: prevRef.current,
                                nextEl: nextRef.current,
                            }}
                            onSwiper={(swiper) => {
                                swiperInstanceRef.current = swiper;
                            }}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 12 },
                                480: { slidesPerView: 2.2, spaceBetween: 12 },
                                640: { slidesPerView: 2.5, spaceBetween: 16 },
                                768: { slidesPerView: 3, spaceBetween: 16 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                                1280: { slidesPerView: 5, spaceBetween: 24 },
                            }}
                            className="books-swiper"
                        >
                            {books.map((book) => (
                                <SwiperSlide key={book.id}>
                                    <BookCard book={book} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="books-empty">
                            <p>Hozircha kitoblar mavjud emas</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Audiobooks Section */}
            <section className="home-books" aria-label="Audiokitoblar">
                <div className="container">
                    <div className="home-books-top">
                        <div className="home-books-title">
                            <h1>Audiokitoblar</h1>
                            <p>Eng so‘nggi qo‘shilgan audiokitoblar</p>
                        </div>
                    </div>

                    {audioLoading ? (
                        <div className="books-loading">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="book-card-skeleton"></div>
                            ))}
                        </div>
                    ) : audioBooks.length > 0 ? (
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={16}
                            loop={audioBooks.length > 5}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 12 },
                                480: { slidesPerView: 2.2, spaceBetween: 12 },
                                640: { slidesPerView: 2.5, spaceBetween: 16 },
                                768: { slidesPerView: 3, spaceBetween: 16 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                                1280: { slidesPerView: 5, spaceBetween: 24 },
                            }}
                            className="books-swiper"
                        >
                            {audioBooks.map((book) => (
                                <SwiperSlide key={book.id}>
                                    <AudioBookCard book={book} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="books-empty">
                            <p>Hozircha audiokitoblar yo‘q</p>
                        </div>
                    )}
                </div>
            </section>

            {/* News Section */}
            <section className="news_section">
                <NewsSection />
            </section>
        </main>
    );
};

export default Home;