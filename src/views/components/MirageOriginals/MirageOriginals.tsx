import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { mediaService } from "../../../infrastructure/adapters/api";
import "./MirageOriginals.css";

interface OriginalMedia {
  id: string;
  name: string;
  thumbnailUrl: string;
}

export const MirageOriginals = () => {
  const navigate = useNavigate();
  const [originals, setOriginals] = useState<OriginalMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOriginals = async () => {
      try {
        const data = await mediaService.getMediaByCategory("originals", { page: 1, per: 3 });
        const validItems: OriginalMedia[] = data.items
          .filter((item) => item.id != null)
          .slice(0, 3)
          .map((item) => ({
            id: item.id!,
            name: item.name ?? "Sans titre",
            thumbnailUrl: item.thumbnailUrl ?? "",
          }));
        setOriginals(validItems);
      } catch {
        // En cas d'erreur, on laisse la liste vide
      } finally {
        setLoading(false);
      }
    };

    fetchOriginals();
  }, []);

  if (loading) return null;
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
