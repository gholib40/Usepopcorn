import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocaleStorage";
import { useKey } from "./useKey";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "f84fc31d";

export default function AppCopy() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const handleSelectMovie = (id) => {
    setSelectedId((state) => (state === id ? null : id));
  };

  function handleCloseMovie() {
    setSelectedId(null);
  }

  const handleAddMovies = (movie) => {
    setWatched((state) => [...state, movie]);
  };

  const handleDeleteWatched = (id) => {
    setWatched((state) => state.filter((movie) => movie.imdbID !== id));
  };

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        {/* <Box children={<MovieList movies={movies} />} />
        <Box
          children={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          }
        /> */}

        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddMovies}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

const Loader = () => {
  return (
    <>
      <p className="loader">Loading...</p>
    </>
  );
};

const ErrorMessage = ({ message }) => {
  return (
    <p className="error">
      <span>🔴</span> {message}
    </p>
  );
};

const NavBar = ({ children }) => {
  return <nav className="nav-bar">{children}</nav>;
};

const Search = ({ query, setQuery }) => {
  const inputEl = useRef(null);

  useKey("Enter", () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  // useEffect(() => {
  //   const callback = (e) => {
  //     if (document.activeElement === inputEl.current) return;
  //     if (e.code === "Enter") {
  //       inputEl.current.focus();
  //       setQuery("");
  //     }
  //   };
  //   document.addEventListener("keydown", callback);
  //   return () => document.addEventListener("keydown", callback);
  // }, [setQuery]);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
};

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

const NumResult = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
};

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};

const Box = ({ children }) => {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
};

const MovieList = ({ movies, onSelectMovie }) => {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
};

const Movie = ({ movie, onSelectMovie }) => {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
};

const MovieDetails = ({ selectedId, onCloseMovie, onAddWatched, watched }) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((data) => data.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current = countRef.current += 1;
  }, [userRating]);

  console.log(isWatched);
  const {
    Title,
    Year,
    Poster,
    Runtime,
    imdbRating,
    Plot,
    Released,
    Actors,
    Director,
    Genre,
    countRatingDecisions = countRef.current,
  } = movie;
  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title,
      Year,
      Poster,
      imdbRating: Number(imdbRating),
      Runtime: Number(Runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  };

  // useEffect(() => {
  //   const callback = (e) => {
  //     if (e.code === "Escape") {
  //       onCloseMovie();
  //       console.log("menutup");
  //     }
  //   };
  //   document.addEventListener("keydown", callback);

  //   return () => {
  //     document.removeEventListener("keydown", callback);
  //   };
  // }, [onCloseMovie]);

  useKey("Escape", onCloseMovie);

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      setIsLoading(true);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    };
    getData();
  }, [selectedId]);
  useEffect(() => {
    if (!Title) return;
    document.title = `Movie | ${Title}`;
    return () => {
      document.title = "usePopcorn";
      console.log(`cleaning up data ${Title}`);
    };
  }, [Title]);

  return (
    <>
      <div className="details">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <header>
              <button onClick={() => onCloseMovie()} className="btn-back">
                &larr;
              </button>
              <img src={Poster} alt={`Poster of movie ${Movie} Movie`} />
              <div className="details-overview">
                <h2>{Title}</h2>
                <p>
                  {Released} &bull; {Runtime}
                </p>
                <p>{Genre}</p>
                <p>
                  <span>🌟</span> {imdbRating} imdbRating
                </p>
              </div>
            </header>

            <section>
              <div className="rating">
                {!isWatched ? (
                  <>
                    <StarRating
                      maxRating={10}
                      size={24}
                      onSetRating={setUserRating}
                    />
                  </>
                ) : (
                  <p>
                    You Rated With Movie {watchedUserRating} <span>🌟</span>
                  </p>
                )}
              </div>
              {userRating > 0 && (
                <button className="btn-add" onClick={() => handleAdd()}>
                  + Add to list
                </button>
              )}

              <p>
                <em>{Plot}</em>
              </p>
              <p>Starring {Actors}</p>
              <p>Directed by {Director}</p>
            </section>
          </>
        )}
      </div>
    </>
  );
};

// const WatchedBox = () => {
//   const [watched, setWatched] = useState(tempWatchedData);
//   // const [movies, setMovies] = useState(tempMovieData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMovieList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// };

const WatchedSummary = ({ watched }) => {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};

const WatchedMovieList = ({ watched, onDeleteWatched }) => {
  return (
    <ul className="list">
      {watched?.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.Runtime} min</span>
            </p>
            <button
              className="btn-delete"
              onClick={() => onDeleteWatched(movie.imdbID)}
            >
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
