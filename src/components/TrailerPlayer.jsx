function TrailerPlayer({ videoKey }) {
    return (
      <div>
        <iframe
          width="300"
          height="169"
          src={`https://www.youtube.com/embed/${videoKey}`}
          title="Movie Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
  
  export default TrailerPlayer;