import { useEffect, useState } from 'react';
import { useFaqStore } from '../../../infrastructure/store/faqStore';
import './FaqPage.css';

export const FaqPage = () => {
  const { questions, isLoading, error, fetchFaq } = useFaqStore();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFaq().catch(() => {});
  }, [fetchFaq]);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="faq-page">
        <div className="faq-page__loading">
          <div className="faq-page__spinner" />
          <p>Chargement de la FAQ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="faq-page">
        <div className="faq-page__error">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={() => fetchFaq()} className="faq-page__btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="faq-page">
      <div className="faq-page__container">
        <header className="faq-page__header">
          <h1>Questions Fréquentes</h1>
          <p>Trouvez rapidement des réponses à vos questions sur Mirage</p>
        </header>

        <div className="faq-page__list">
          {questions.map((item, index) => (
            <div key={index} className={`faq-page__item ${openIndex === index ? 'faq-page__item--open' : ''}`}>
              <button className="faq-page__question" onClick={() => toggleQuestion(index)} aria-expanded={openIndex === index}>
                <span>{item.question.replace(/ \?/g, '\u00A0?')}</span>
                <svg
                  className="faq-page__icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="faq-page__answer">
                  <p>{item.answers}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {questions.length === 0 && !isLoading && !error && (
          <div className="faq-page__empty">
            <p>Aucune question disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
