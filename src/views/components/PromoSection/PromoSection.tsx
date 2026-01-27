import promoImage from "../../../assets/couple-devant-tv.png";
import logo from "../../../assets/logo.png";
import "./PromoSection.css";

export const PromoSection = () => {
  return (
    <div className="promo-section">
      <div className="promo-section__image">
        <img src={promoImage} alt="Couple regardant la télévision" />
      </div>
      <div className="promo-section__content">
        <div className="promo-section__logo">
          <img src={logo} alt="Mirage TV" />
          <span>mirage</span>
        </div>
        <h2 className="promo-section__title">
          Regardez maintenant <br />
          dans toutes les langues
        </h2>
        <p className="promo-section__subtitle">
          Découvrez des milliers de films et séries avec sous-titres et doublages dans votre langue préférée.
        </p>
      </div>
    </div>
  );
};
