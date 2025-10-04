function TrailerPlayer({ videoKey }) {
  return (
    <div className="trailer-player">
      <div className="trailer-player-iframe-wrapper">
        <iframe
          className="trailer-player-iframe"
          src={`https://www.youtube.com/embed/${videoKey}`}
          title="Movie Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default TrailerPlayer;