import React, { useRef, useState, useEffect } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, ListMusic, Download, Maximize2, Clock, X
} from "lucide-react";
import "./audioPlayer.scss";

const AudioPlayer = ({ src, title, author, image, onClose }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
      audioRef.current.volume = volume;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  // ✅ TO'G'RILANGAN SKIP FUNKSIYASI
  const skip = (seconds) => {
    if (audioRef.current && duration) {
      let newTime = audioRef.current.currentTime + seconds;
      
      // Chegaralarni tekshirish
      if (newTime < 0) {
        newTime = 0;
      } else if (newTime > duration) {
        newTime = duration;
      }
      
      audioRef.current.currentTime = newTime;
      setProgress(newTime); // Muhim: progressni yangilash
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
    if (audioRef.current) {
      audioRef.current.loop = !isRepeat;
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getProgressPercentage = () => {
    if (!duration) return 0;
    return (progress / duration) * 100;
  };

  return (
    <div className={`audio-player ${isExpanded ? 'expanded' : ''}`}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="player-container">
        {/* Mini Player */}
        <div className="mini-player">
          <div className="player-info">
            {image && (
              <img src={image} alt={title} className="player-thumb" />
            )}
            <div className="player-meta">
              <h4 className="player-title">{title}</h4>
              {author && <span className="player-author">{author}</span>}
            </div>
          </div>

          <div className="player-controls">
            {/* ✅ ORQAGA SKIP - 10 soniya */}
            <button className="control-btn" onClick={() => skip(-10)} title="10 soniya orqaga">
              <SkipBack size={18} />
              <span className="btn-label">10</span>
            </button>

            <button className="play-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {/* ✅ OLDDINGA SKIP - 10 soniya */}
            <button className="control-btn" onClick={() => skip(10)} title="10 soniya oldinga">
              <SkipForward size={18} />
              <span className="btn-label">10</span>
            </button>
          </div>

          <div className="player-extras">
            <button className="extras-btn" onClick={toggleRepeat} title="Takrorlash">
              <Repeat size={18} className={isRepeat ? 'active' : ''} />
            </button>
            <button className="extras-btn" onClick={() => setIsExpanded(!isExpanded)} title="Kengaytirish">
              <Maximize2 size={18} />
            </button>
            <button className="extras-btn" onClick={handleDownload} title="Yuklab olish">
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <span className="time-current">{formatTime(progress)}</span>
          <div className="progress-bar">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
              className="progress-input"
              style={{
                background: `linear-gradient(90deg, #16a34a ${getProgressPercentage()}%, #e5e7eb ${getProgressPercentage()}%)`
              }}
            />
          </div>
          <span className="time-duration">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Expanded Player (qisqartirilgan) */}
      {isExpanded && (
        <div className="expanded-player">
          <div className="expanded-overlay" onClick={() => setIsExpanded(false)} />
          <div className="expanded-content">
            <button className="close-expanded" onClick={() => setIsExpanded(false)}>
              <X size={20} />
            </button>
            
            <div className="expanded-artwork">
              {image ? (
                <img src={image} alt={title} />
              ) : (
                <div className="artwork-placeholder">
                  <ListMusic size={64} />
                </div>
              )}
            </div>

            <div className="expanded-info">
              <h2>{title}</h2>
              <p>{author || "Audio kitob"}</p>
            </div>

            {/* Expanded kontroller - 15 soniya skip bilan */}
            <div className="expanded-controls">
              <button className="expanded-skip" onClick={() => skip(-15)}>
                <SkipBack size={28} />
                <span>15</span>
              </button>
              <button className="expanded-play" onClick={togglePlay}>
                {isPlaying ? <Pause size={36} /> : <Play size={36} />}
              </button>
              <button className="expanded-skip" onClick={() => skip(15)}>
                <SkipForward size={28} />
                <span>15</span>
              </button>
            </div>

            <div className="expanded-progress">
              <span>{formatTime(progress)}</span>
              <div className="progress-bar large">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={progress}
                  onChange={handleSeek}
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="expanded-actions">
              <div className="volume-control">
                <button onClick={toggleMute}>
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
              <div className="playback-controls">
                <button onClick={toggleRepeat} className={isRepeat ? 'active' : ''}>
                  <Repeat size={20} />
                </button>
                <button onClick={() => {
                  let newRate = playbackRate + 0.25;
                  if (newRate > 2) newRate = 0.5;
                  setPlaybackRate(newRate);
                }}>
                  <Clock size={20} />
                  <span>{playbackRate}x</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;