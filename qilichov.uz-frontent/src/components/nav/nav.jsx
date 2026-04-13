import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { BookOpen, Headphones, Newspaper, Phone, Menu, X, Search, User } from 'lucide-react'
import './nav.scss'

const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
            setSearchQuery('')
            setIsMenuOpen(false)
        }
    }

    const menuItems = [
        { name: 'Kutubxona', path: '/all-books', icon: <BookOpen size={18} /> },
        { name: 'Yangiliklar', path: '/news', icon: <Newspaper size={18} /> },
        { name: 'Aloqa', action: 'footer', icon: <Phone size={18} /> },
        { name: 'Loyiha Muallifi', path: '/resume', icon: <User size={18} /> }
    ]

    const scrollToFooter = () => {
        document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })
        setIsMenuOpen(false)
    }

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                {/* Logo */}
                <Link to="/" className="logo">
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
                    </div>
                </Link>

                {/* Search Form */}
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Kitob yoki muallif nomi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button type="button" className="clear-btn" onClick={() => setSearchQuery('')}>
                                ✕
                            </button>
                        )}
                        <button type="submit" className="search-btn">
                            <Search size={16} />
                        </button>
                    </div>
                </form>

                {/* Desktop Menu */}
                <div className="desktop-menu">
                    {menuItems.map((item, index) => (
                        item.path ? (
                            <Link
                                key={index}
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        ) : (
                            <button
                                key={index}
                                onClick={scrollToFooter}
                                className="nav-link"
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </button>
                        )
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`mobile-btn ${isMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-menu-header">
                        <div className="mobile-logo">Qilichov.uz</div>
                        <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
                            <X size={22} />
                        </button>
                    </div>
                    <div className="mobile-menu-items">
                        {menuItems.map((item, index) => (
                            item.path ? (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className="mobile-link"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            ) : (
                                <button
                                    key={index}
                                    onClick={scrollToFooter}
                                    className="mobile-link"
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </button>
                            )
                        ))}
                    </div>
                </div>

                {/* Overlay */}
                <div className={`overlay ${isMenuOpen ? 'visible' : ''}`} onClick={() => setIsMenuOpen(false)} />
            </div>
        </nav>
    )
}

export default Nav