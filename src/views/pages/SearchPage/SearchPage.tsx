import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { useSearchStore } from "../../../infrastructure/store/searchStore";
import "./SearchPage.css";

export const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [inputValue, setInputValue] = useState(initialQuery);
  const { movies, series, isLoading, error, hasSearched, search, clearSearch } = useSearchStore();

  // Recherche initiale si query dans l'URL
  useEffect(() => {
    if (initialQuery) {
      search(initialQuery);
    }
    return () => {
      clearSearch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fonction de recherche déclenchée par le bouton ou Entrée
  const handleSearch = useCallback(() => {
    if (inputValue.trim()) {
      search(inputValue);
      setSearchParams({ q: inputValue });
    } else {
      clearSearch();
      setSearchParams({});
    }
  }, [inputValue, search, clearSearch, setSearchParams]);

  // Gestion de la touche Entrée
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch],
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleMediaClick = (id: string) => {
    navigate(`/media/${id}`);
  };

  const handleSerieClick = (id: string) => {
    navigate(`/shows/${id}`);
  };

  const hasResults = movies.length > 0 || series.length > 0;

  return (
    <div className="search-page">
      {/* Header avec recherche */}
      <header className="search-page__header">
        <h1 className="search-page__title">Rechercher</h1>
        <form
          className="search-page__form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="search-page__input-wrapper">
            <svg
              className="search-page__icon"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="search-page__input"
              placeholder="Films, séries..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
              aria-label="Rechercher des contenus"
            />
          </div>
          <button type="submit" className="search-page__button" disabled={isLoading || !inputValue.trim()} aria-label="Lancer la recherche">
            Rechercher
          </button>
        </form>
      </header>

      {/* Résultats */}
      <div className="search-page__results">
        {/* État de chargement */}
        {isLoading && (
          <div className="search-page__loading">
            <div className="search-page__spinner"></div>
            <p>Recherche en cours...</p>
          </div>
        )}

        {/* Erreur - affichée uniquement s'il n'y a pas de résultats */}
        {error && !isLoading && !hasResults && (
          <div className="search-page__error">
            <p>{error}</p>
          </div>
        )}

        {/* État vide - pas encore de recherche */}
        {!isLoading && !hasSearched && !inputValue && (
          <div className="search-page__empty">
            <h2 className="search-page__empty-title">Explorez notre catalogue</h2>
            <p className="search-page__empty-text">Tapez le nom d'un film ou d'une série pour commencer.</p>
          </div>
        )}

        {/* Aucun résultat */}
        {!isLoading && hasSearched && !hasResults && inputValue && (
          <div className="search-page__empty">
            <h2 className="search-page__empty-title">Aucun résultat</h2>
            <p className="search-page__empty-text">Aucun contenu ne correspond à "{inputValue}". Essayez avec d'autres mots-clés.</p>
          </div>
        )}

        {/* Films */}
        {!isLoading && movies.length > 0 && (
          <section className="search-page__section">
            <h2 className="search-page__section-title">
              Films
              <span className="search-page__section-count">({movies.length})</span>
            </h2>
            <div className="search-page__grid">
              {movies.map((movie) => (
                <article
                  key={movie.id}
                  className="search-page__card"
                  onClick={() => movie.id && handleMediaClick(movie.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && movie.id && handleMediaClick(movie.id)}
                >
                  <img
                    src={movie.thumbnailUrl || logo}
                    alt={movie.name}
                    className="search-page__card-image"
                    onError={(e) => {
                      e.currentTarget.src = logo;
                    }}
                  />
                  <div className="search-page__card-overlay">
                    <h3 className="search-page__card-title">{movie.name}</h3>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Séries */}
        {!isLoading && series.length > 0 && (
          <section className="search-page__section">
            <h2 className="search-page__section-title">
              Séries
              <span className="search-page__section-count">({series.length})</span>
            </h2>
            <div className="search-page__grid">
              {series.map((serie) => (
                <article
                  key={serie.id}
                  className="search-page__card"
                  onClick={() => serie.id && handleSerieClick(serie.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && serie.id && handleSerieClick(serie.id)}
                >
                  <img
                    src={serie.posterURL || logo}
                    alt={serie.title}
                    className="search-page__card-image"
                    onError={(e) => {
                      e.currentTarget.src = logo;
                    }}
                  />
                  <div className="search-page__card-overlay">
                    <h3 className="search-page__card-title">{serie.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
