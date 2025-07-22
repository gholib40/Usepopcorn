import { useEffect, useState } from "react";

export function useMovies(query, callback) {
  const KEY = "f84fc31d";
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callback?.();
      const controller = new AbortController();
      const fetchMovies = async () => {
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          console.log(res);
          setIsLoading(true);
          setError("");
          if (!res.ok)
            throw new Error("something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found");
          setMovies(data.Search);
          setError("");
        } catch (error) {
          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      };
      if (query?.length < 2) {
        setMovies([]);
        setError("");
        return;
      }
      // handleCloseMovie();
      fetchMovies();
      return () => {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
