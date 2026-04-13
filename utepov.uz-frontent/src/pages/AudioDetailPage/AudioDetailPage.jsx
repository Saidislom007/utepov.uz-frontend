import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  Share2,
  ChevronRight,
  Play,
  Pause,
  Send,
  X,
} from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import "./audioDetailPage.scss";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";

const AudioDetailPage = () => {
  const { id } = useParams();
  const [audioBook, setAudioBook] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showShareBox, setShowShareBox] = useState(false);

  const shareRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/audiobooks/${id}/`)
      .then((res) => res.json())
      .then((data) => setAudioBook(data))
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

  const togglePlay = () => {
    if (!showPlayer) {
      setShowPlayer(true);
      setIsPlaying(true);

      setTimeout(() => {
        const audio = document.getElementById("audio-player");
        if (audio) audio.play();
      }, 100);

      return;
    }

    const audio = document.getElementById("audio-player");
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  if (!audioBook) {
    return <div className="audio-loading">Yuklanmoqda...</div>;
  }

  const rating = 4.2;

  const currentUrl = window.location.href;
  const shareText = `${audioBook.title} - ${audioBook.author}`;

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
          
          
          <span className="breadcrumb-current">{audioBook.title?.slice(0, 40)}...</span>
        </div>

        <div className="book-detail-left">
          <div className="book-cover-box">
            <img src={audioBook.image} alt={audioBook.title} />
          </div>

          <div className="book-rating-box">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star
                key={item}
                size={22}
                fill={item <= Math.round(rating) ? "#f5b301" : "transparent"}
                color={item <= Math.round(rating) ? "#f5b301" : "#cbd5e1"}
              />
            ))}
          </div>
        </div>

        <div className="book-detail-right">
          <div className="book-top-actions">
            <div className="book-type-tabs">
              <button>Tekst</button>
              <button className="active">Audio</button>
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
                        <FaFacebookF size={15} />
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
                        <FaInstagram size={15} />
                      </div>
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="book-author-row">
            <span>{audioBook.author}</span>
            <ChevronRight size={20} />
          </div>

          <h1>{audioBook.title}</h1>

          <div className="book-tags">
            <span>Audiokitob</span>
            <span>Top</span>
            <span>Tavsiya etiladi</span>
          </div>

          <div className="book-stats">
            <div className="book-stat-item">
              <div className="stat-main rating-main">
                <Star size={18} fill="#f5b301" color="#f5b301" />
                <strong>{rating}</strong>
              </div>
              <span>baholar</span>
            </div>

            <div className="book-stat-item">
              <strong>{audioBook.year}</strong>
              <span>yil</span>
            </div>

            <div className="book-stat-item">
              <strong>{audioBook.duration || "—"}</strong>
              <span>davomiylik</span>
            </div>
          </div>

          <div className="book-actions">
            <button className="read-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              <span>{isPlaying ? "To‘xtatish" : "Eshitish"}</span>
            </button>
          </div>

          <div className="book-content-tabs">
            <button
              className={activeTab === "about" ? "active" : ""}
              onClick={() => setActiveTab("about")}
            >
              Audiokitob haqida
            </button>
          </div>

          <div className="book-content-box">
            <p>{audioBook.description}</p>
          </div>
        </div>
      </div>

      {showPlayer && audioBook.audio_file && (
        <AudioPlayer
          id="audio-player"
          src={audioBook.audio_file}
          title={audioBook.title}
        />
      )}
    </section>
  );
};

export default AudioDetailPage;