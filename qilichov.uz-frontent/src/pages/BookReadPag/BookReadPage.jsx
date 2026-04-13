import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "./bookReadPage.scss";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const BookReadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/books/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goPrev = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const goNext = () => {
    if (pageNumber < numPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const zoomOut = () => {
    if (scale > 0.6) {
      setScale((prev) => +(prev - 0.1).toFixed(1));
    }
  };

  const zoomIn = () => {
    if (scale < 2.5) {
      setScale((prev) => +(prev + 0.1).toFixed(1));
    }
  };

  const enterFullScreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    }
  };

  if (loading) {
    return <div className="reader-loading">Yuklanmoqda...</div>;
  }

  if (!book || !book.pdf_file) {
    return <div className="reader-loading">PDF topilmadi</div>;
  }

  return (
    <div className="book-reader-page">
      <div className="reader-topbar">
        <button className="back-btn" onClick={() => navigate(`/books/${id}`)}>
          ← Kitobga qaytish
        </button>

        <h2>{book.title}</h2>

        <div className="topbar-empty"></div>
      </div>

      <div className="reader-body">
        <Document
          file={book.pdf_file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading="PDF yuklanmoqda..."
          error="PDF ochilmadi"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      <div className="reader-controls">
        <button onClick={goPrev} disabled={pageNumber <= 1}>
          Oldingi
        </button>

        <div className="page-info">
          <span>{pageNumber}</span>
          <span>
            / {numPages || 0}
          </span>
        </div>

        <button onClick={goNext} disabled={pageNumber >= numPages}>
          Keyingi
        </button>

        <button onClick={zoomOut}>−</button>

        <div className="zoom-info">{Math.round(scale * 100)}%</div>

        <button onClick={zoomIn}>+</button>

        <button onClick={enterFullScreen}>⛶</button>
      </div>
    </div>
  );
};

export default BookReadPage;