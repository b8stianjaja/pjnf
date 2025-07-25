import React, { useState, useEffect } from 'react';

const MusicPanel = () => {
    const song = { title: 'Starlight Voyage', artist: 'Cosmic Echoes', duration: 212 };
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(t => t >= song.duration ? (setIsPlaying(false), 0) : t + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, song.duration]);

    const formatTime = (time) => `${Math.floor(time/60)}:${Math.floor(time%60).toString().padStart(2,'0')}`;

    return (
        <div className="content-panel active" id="music-panel">
            <div className="content-header"><h1>Music Player</h1></div>
            <div className="music-player">
                <div className="album-art"></div><div className="song-info"><h2>{song.title}</h2><span>{song.artist}</span></div>
                <div className="progress-bar-container"><span>{formatTime(currentTime)}</span><div className="progress-bar"><div className="progress" style={{width: `${(currentTime/song.duration)*100}%`}}></div></div><span>{formatTime(song.duration)}</span></div>
                <div className="music-controls"><button>&#9664;&#9664;</button><button className="play-button" onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? '❚❚' : '▶'}</button><button>&#9654;&#9654;</button></div>
            </div>
        </div>
    );
};

export default MusicPanel;