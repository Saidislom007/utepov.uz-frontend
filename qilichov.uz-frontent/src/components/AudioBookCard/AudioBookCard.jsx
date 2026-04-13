import React from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import "./audioBookCard.scss";

const AudioBookCard = ({ book }) => {
  return (
    <Link to={`/audiobooks/${book.id}`} className="audio-card">
      <div className="audio-card-image">
        <img src={book.image} alt={book.title} />

        {/* 🔥 play overlay */}
        <div className="play-overlay">
          <Play size={22} />
        </div>
      </div>

      <div className="audio-card-body">
        <p className="audio-author">{book.author}</p>
        <h3 className="audio-title">{book.title}</h3>
      </div>
    </Link>
  );
};

export default AudioBookCard;