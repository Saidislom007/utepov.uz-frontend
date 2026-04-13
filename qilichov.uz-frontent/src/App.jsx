import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/nav/nav'
import Home from './pages/home/home'
import BookDetail from './pages/BookDetail/BookDetail'
import BookReadPage from './pages/BookReadPag/BookReadPage'
import AudioDetailPage from './pages/AudioDetailPage/AudioDetailPage'
import AllBooksPage from './pages/AllBooksPage/AllBooksPage'
import Footer from './components/footer/footer'
import ModernResume from './components/Resume/resume'
import NewsDetail from './components/NewsDetail/newsDetail'
import NewsPage from './pages/NewsPage/newsPage'
import SearchPage from './pages/SearchPage/SearchPage'

const App = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/resume' element={<ModernResume/>}/>
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/books/:id/read" element={<BookReadPage />} />
        <Route path="/audiobooks/:id" element={<AudioDetailPage />} />
        <Route path="/all-books" element={<AllBooksPage />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path='/news' element={<NewsPage/>}/>
        <Route path="/search" element={<SearchPage />} />
      </Routes>
      <Footer />
    </>
  )
}

const AppContext = () => {
  return (
    <>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </>
  )
}




export default AppContext