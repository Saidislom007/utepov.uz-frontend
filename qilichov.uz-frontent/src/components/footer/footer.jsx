import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail, ArrowUp, Clock, Globe } from "lucide-react";
import { FaFacebookF, FaYoutube, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./footer.scss";

const Footer = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const location = useLocation();
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const footerLinks = [
        { name: "Kutubxona", path: "/library" },
        { name: "Yangiliklar", path: "/news" },
        { name: "Aloqa", path: "/contact" },
        { name: "Muallif bilan tanishish", path: "/resume" },
    ];

    const socialLinks = [
        { icon: <FaFacebookF />, url: "https://facebook.com", color: "#1877f2", name: "Facebook" },
        { icon: <FaYoutube />, url: "https://youtube.com", color: "#ff0000", name: "YouTube" },
        { icon: <FaTelegramPlane />, url: "https://t.me/Kilichov_Akobir", color: "#0088cc", name: "Telegram" },
        { icon: <FaInstagram />, url: "https://instagram.com", color: "#e4405f", name: "Instagram" },
        { icon: <FaLinkedinIn />, url: "https://linkedin.com", color: "#0077b5", name: "LinkedIn" },
    ];

    const contactInfo = [
        {
            icon: <Mail size={28} />,
            title: "Elektron manzil",
            value: "akobirkilichov05@gmail.com",
            link: "mailto:akobirkilichov05@gmail.com",
            type: "email"
        },
        {
            icon: <Phone size={28} />,
            title: "Telefon",
            value: "+998 91 003-83-86",
            link: "tel:+998910038386",
            type: "phone"
        },
        {
            icon: <MapPin size={28} />,
            title: "Manzil",
            value: "O'zbekiston, Toshkent",
            link: null,
            type: "address"
        },
        {
            icon: <Clock size={28} />,
            title: "Ish vaqti",
            value: "Dushanba - Juma: 09:00 - 18:00",
            link: null,
            type: "hours"
        }
    ];

    return (
        <footer className="footer" id="footer">
            {/* Scroll to top button */}
            {showScrollTop && (
                <button onClick={scrollToTop} className="scroll-top-btn" aria-label="Scroll to top">
                    <ArrowUp size={24} />
                </button>
            )}

            {/* Footer top section */}
            <div className="footer-top">
                <div className="footer-container">
                    <div className="footer-header">
                        <h2 className="footer-title">Bog'lanish</h2>
                        <p className="footer-subtitle">Biz bilan bog'lanib, savollaringizga javob oling</p>
                    </div>

                    <div className="footer-contact-grid">
                        {contactInfo.map((item, index) => (
                            <div key={index} className="footer-contact-card">
                                <div className="footer-contact-heading">
                                    <div className="icon-wrapper">
                                        {item.icon}
                                    </div>
                                    <h3>{item.title}</h3>
                                </div>
                                {item.link ? (
                                    <a href={item.link} className="contact-value-link">
                                        {item.value}
                                    </a>
                                ) : (
                                    <p className="contact-value">{item.value}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer bottom section */}
            <div className="footer-bottom">
                <div className="footer-container">
                    <div className="footer-brand-row">
                        <div className="footer-logo">
                            <div className="footer-logo-icon">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="footer-logo-text">
                                <h2>Qilichov.uz</h2>
                                <p>Professional portfolio</p>
                            </div>
                        </div>

                        <div className="footer-social-links">
                            <span className="social-label">Biz ijtimoiy tarmoqlarda:</span>
                            <div className="footer-socials">
                                {socialLinks.map((social, index) => (
                                    <a 
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-link"
                                        aria-label={social.name}
                                        style={{ '--hover-color': social.color }}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="footer-main-row">
                        <div className="footer-info">
                            <p className="footer-description">
                                Qilichov.uz - shaxsiy portfolio sayti. Bu yerda tajribalarim va
                                professional faoliyatim haqida ma'lumot olishingiz mumkin.
                            </p>
                            <div className="footer-stats">
                                <div className="stat-item">
                                    <span className="stat-number">50+</span>
                                    <span className="stat-label">Loyihalar</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">5+</span>
                                    <span className="stat-label">Yillik tajriba</span>
                                </div>
                            </div>
                        </div>

                        <ul className="footer-menu">
                            {footerLinks.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        to={link.path} 
                                        className={`footer-link ${location.pathname === link.path ? 'active' : ''}`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-line"></div>

                    <div className="footer-bottom-row">
                        <p className="copyright">
                            &copy; {currentYear} Qilichov.uz. Barcha huquqlar himoyalangan.
                        </p>
                        
                        <div className="footer-legal">
                            <Link to="/privacy">Maxfiylik siyosati</Link>
                            <Link to="/terms">Foydalanish shartlari</Link>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;