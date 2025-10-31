import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoriesUseCase, getMoviesUseCase } from "../../../infrastructure/config/dependencies";
import { useStore } from "../../../infrastructure/store";
import { Hero } from "../../components/Hero";
import { Loader } from "../../components/Loader";
import { MovieGrid } from "../../components/MovieGrid";
import { Navbar } from "../../components/Navbar";
import "./HomePage.css";

export const HomePage = () => {
  const navigate = useNavigate();
  const { movies, loading, error, setMovies, setLoading, setError } = useStore();
  const { setCategories } = useStore();

  useEffect(() => {
    loadMovies();
    loadCategories();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const moviesData = await getMoviesUseCase.execute();
      setMovies(moviesData);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des films");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategoriesUseCase.execute();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Erreur lors du chargement des catégories", err);
    }
  };

  const handleMovieClick = (movie: any) => {
    navigate("/movie/" + movie.id);
  };

  return (
    <div className="home">
      <Navbar />

      {movies.length > 0 && (
        <div className="home__hero">
          <Hero
            movie={movies[0]}
            onPlayClick={() => navigate("/watch/" + movies[0].id)}
            onInfoClick={() => navigate("/movie/" + movies[0].id)}
          />
        </div>
      )}

      <div className="container">
        <div className="home__content">
          <section className="home__section">
            <div className="home__section-header">
              <h2 className="home__section-title">Films Populaires</h2>
            </div>

            {loading && <Loader />}

            {error && (
              <div className="home__error">
                <p className="home__error-text">{error}</p>
              </div>
            )}

            {!loading && !error && <MovieGrid movies={movies} onMovieClick={handleMovieClick} />}
          </section>
        </div>
      </div>
    </div>
  );
};
