import React, { useState, useEffect } from "react";
import instance from "./axios";
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseUrl = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(
    () => {
      async function fetchData() {
        const request = await instance.get(fetchUrl);
        setMovies(request.data.results);
        return request;
      }
      fetchData();
    },
    [fetchUrl] //if [] run once when the row loads and, don't run again
  );

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    console.log(movie.name);
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          console.log("trailerUrl" + url);
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div>
      <div className="row">
        <h2>{title}</h2>
        <div className="row_posters">
          {movies.map((movie) => (
            <img
              key={movie.id}
              onClick={() => handleClick(movie)}
              src={`${baseUrl}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.name}
              className={`row_poster ${isLargeRow && "row_posterlarge"}`}
            />
          ))}
        </div>
        {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  );
}

export default Row;
