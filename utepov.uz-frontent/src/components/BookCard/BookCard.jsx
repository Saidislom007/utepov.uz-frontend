import React from "react";
import { Link } from "react-router-dom";
import { Star, StarHalf } from "lucide-react";
import "./BookCard.scss";

const BookCard = ({ book }) => {
  const rating = Number(book?.rating || 3.8);
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <Link to={`/books/${book.id}`} className="book-card">
      <div className="book-card-image">
        <img src={book.image} alt={book.title} className="aa"/>
      </div>

      <div className="book-card-body">
        <div className="book-rating">
          <div className="stars">
            {[...Array(fullStars)].map((_, i) => (
              <Star key={`full-${i}`} size={18} fill="#f5b301" color="#f5b301" />
            ))}

            {hasHalf && <StarHalf size={18} fill="#f5b301" color="#f5b301" />}

            {[...Array(emptyStars)].map((_, i) => (
              <Star key={`empty-${i}`} size={18} color="#cfd4dc" />
            ))}
          </div>

          <span>{rating}</span>
        </div>

        <p className="book-author">{book.author}</p>
        <h3 className="book-title">{book.title}</h3>
      </div>
    </Link>
  );
};

export default BookCard;