import React, { useEffect, useState } from "react";
import Search from "./components/search"
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite"

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMBD_API_KEY;


const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('')

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {
    setisLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query 
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();

      if(data.response === 'False') {
        setErrorMessage( data.Error || 'failed to fetch movies');
        setMovieList([]);
        return;     
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0 ){
        await updateSearchCount(query, data.results[0]);
      }


    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');      
    } finally {
      setisLoading(false);
    }
  }


  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);



  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="./src/assets/hero.png" alt="Hero Banner"/>
          <h1>
            Find <span className="text-gradient">Movies</span> You´ll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">
            All movies
          </h2>

            {isLoading ? (
              <Spinner/>
            ) : errorMessage ? (
              <p className="text-red-500">
                {errorMessage}
              </p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>


      </div>

    </main>

  )
}

export default App
