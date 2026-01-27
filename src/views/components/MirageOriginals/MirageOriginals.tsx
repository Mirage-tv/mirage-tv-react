import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { useFeaturedStore } from '../../../infrastructure/store/featuredStore';
import './MirageOriginals.css';

export const MirageOriginals = () => {
  const navigate = useNavigate();
  const { trendingMedia, fetchTrendingNow } = useFeaturedStore();

  useEffect(() => {
    fetchTrendingNow().catch(() => {});
  }, [fetchTrendingNow]);

  // Prendre les 3 premiers pour l'affichage Originals
  const originals = trendingMedia?.slice(0, 3) || [];

  if (originals.length === 0) return null;

  return (
    <section className="mirage-originals">
      <div className="mirage-originals__header">
        <img src={logo} alt="Mirage" className="mirage-originals__logo" />
        <span className="mirage-originals__badge">ORIGINALS</span>
      </div>

      <div className="mirage-originals__grid">
        {originals.map((media) => (
          <div key={media.id} className="mirage-originals__card" onClick={() => navigate(`/media/${media.id}`)}>
            <img
              src={media.thumbnailUrl || logo}
              alt={media.name}
              className="mirage-originals__card-image"
              onError={(e) => {
                e.currentTarget.src = logo;
              }}
            />
            <div className="mirage-originals__card-overlay">
              <h3 className="mirage-originals__card-title">{media.name}</h3>
              <div className="mirage-originals__card-brand">
                <img src={logo} alt="Mirage" />
                <span>mirage</span>
                <span className="mirage-originals__card-badge">ORIGINALS</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
