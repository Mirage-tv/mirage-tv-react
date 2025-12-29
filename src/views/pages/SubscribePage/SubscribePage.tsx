import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { PlanDTO, SubscriptionDTO } from '../../../core/domain/types';
import { useAuth } from '../../../core/hooks';
import { subscriptionService } from '../../../infrastructure/adapters/api';
import './SubscribePage.css';

type PageState = 'plans' | 'success' | 'cancel' | 'loading' | 'error';

export const SubscribePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isSubscriber, user, refreshProfile } = useAuth();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [plans, setPlans] = useState<PlanDTO[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Determine page state based on URL
  useEffect(() => {
    if (location.pathname.includes('/payment-success')) {
      setPageState('success');
      // Confirm the checkout session
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');
      if (sessionId) {
        confirmCheckout(sessionId);
      }
    } else if (location.pathname.includes('/cancel')) {
      setPageState('cancel');
    } else {
      loadPlans();
    }
  }, [location.pathname, location.search]);

  const loadPlans = async () => {
    setPageState('loading');
    setError(null);
    try {
      const plansData = await subscriptionService.getPlans();
      setPlans(Array.isArray(plansData) ? plansData : [plansData]);
      setPageState('plans');
    } catch (err) {
      console.error('Failed to load plans:', err);
      setError('Impossible de charger les offres. Veuillez réessayer.');
      setPageState('error');
    }
  };

  const confirmCheckout = async (sessionId: string) => {
    try {
      const confirmedSub = await subscriptionService.confirmCheckout({ sessionId });
      setSubscription(confirmedSub);
      // Refresh profile to update subscription status in global state (Navbar, etc.)
      await refreshProfile();
    } catch (err) {
      console.error('Failed to confirm checkout:', err);
      // Still show success page, the webhook might handle it
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!planId) {
      setError('Veuillez sélectionner un plan valide.');
      return;
    }

    setCheckoutLoading(planId);
    setError(null);

    try {
      const checkoutSession = await subscriptionService.createCheckoutSession({ planId });
      // Redirect to Stripe Checkout
      window.location.href = checkoutSession.url;
    } catch (err) {
      console.error('Failed to create checkout session:', err);
      setError('Impossible de créer la session de paiement. Veuillez réessayer.');
      setCheckoutLoading(null);
    }
  };

  const formatPrice = (priceCents: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(priceCents / 100);
  };

  const getDurationLabel = (duration: string): string => {
    switch (duration) {
      case 'weekly':
        return 'par semaine';
      case 'monthly':
        return 'par mois';
      case 'yearly':
        return 'par an';
      default:
        return '';
    }
  };

  const getDurationBadge = (duration: string): string => {
    switch (duration) {
      case 'weekly':
        return 'Hebdomadaire';
      case 'monthly':
        return 'Mensuel';
      case 'yearly':
        return 'Annuel';
      default:
        return '';
    }
  };

  const isPopularPlan = (plan: PlanDTO): boolean => {
    return plan.duration === 'monthly';
  };

  // Success page
  if (pageState === 'success') {
    return (
      <div className="subscribe-page">
        <div className="subscribe-page__container subscribe-page__result">
          <div className="subscribe-page__success-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          <h1 className="subscribe-page__result-title">Paiement réussi !</h1>
          <p className="subscribe-page__result-text">Merci pour votre abonnement. Vous avez maintenant accès à tout le contenu Mirage.</p>
          {subscription && (
            <div className="subscribe-page__subscription-info">
              <p>
                <strong>Plan :</strong> {subscription.planName}
              </p>
              <p>
                <strong>Prix :</strong> {formatPrice(subscription.price * 100)}
              </p>
              <p>
                <strong>Date de début :</strong> {new Date(subscription.startDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          )}
          <div className="subscribe-page__result-actions">
            <button className="subscribe-page__btn subscribe-page__btn--primary" onClick={() => navigate('/')}>
              Commencer à regarder
            </button>
            <button className="subscribe-page__btn subscribe-page__btn--secondary" onClick={() => navigate('/profile')}>
              Voir mon profil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cancel page
  if (pageState === 'cancel') {
    return (
      <div className="subscribe-page">
        <div className="subscribe-page__container subscribe-page__result">
          <div className="subscribe-page__cancel-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className="subscribe-page__result-title">Paiement annulé</h1>
          <p className="subscribe-page__result-text">Le paiement a été annulé. Vous pouvez réessayer à tout moment.</p>
          <div className="subscribe-page__result-actions">
            <button className="subscribe-page__btn subscribe-page__btn--primary" onClick={() => navigate('/subscribe')}>
              Voir les offres
            </button>
            <button className="subscribe-page__btn subscribe-page__btn--secondary" onClick={() => navigate('/')}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (pageState === 'loading') {
    return (
      <div className="subscribe-page">
        <div className="subscribe-page__container">
          <div className="subscribe-page__loading">
            <div className="subscribe-page__spinner"></div>
            <p>Chargement des offres...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (pageState === 'error') {
    return (
      <div className="subscribe-page">
        <div className="subscribe-page__container subscribe-page__result">
          <div className="subscribe-page__error-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1 className="subscribe-page__result-title">Une erreur est survenue</h1>
          <p className="subscribe-page__result-text">{error}</p>
          <div className="subscribe-page__result-actions">
            <button className="subscribe-page__btn subscribe-page__btn--primary" onClick={loadPlans}>
              Réessayer
            </button>
            <button className="subscribe-page__btn subscribe-page__btn--secondary" onClick={() => navigate('/')}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Already subscribed
  if (isSubscriber) {
    return (
      <div className="subscribe-page">
        <div className="subscribe-page__container subscribe-page__result">
          <div className="subscribe-page__success-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          <h1 className="subscribe-page__result-title">Vous êtes déjà abonné !</h1>
          <p className="subscribe-page__result-text">
            Vous bénéficiez actuellement de l'abonnement <strong>{user?.planName || 'Premium'}</strong>.
          </p>
          <div className="subscribe-page__result-actions">
            <button className="subscribe-page__btn subscribe-page__btn--primary" onClick={() => navigate('/')}>
              Regarder du contenu
            </button>
            <button className="subscribe-page__btn subscribe-page__btn--secondary" onClick={() => navigate('/profile')}>
              Gérer mon abonnement
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Plans display
  return (
    <div className="subscribe-page">
      <div className="subscribe-page__container">
        <div className="subscribe-page__header">
          <h1 className="subscribe-page__title">Choisissez votre abonnement</h1>
          <p className="subscribe-page__subtitle">Accédez à des milliers de films et séries en illimité. Annulez à tout moment.</p>
        </div>

        {error && <div className="subscribe-page__error-message">{error}</div>}

        <div className="subscribe-page__plans">
          {plans.map((plan) => (
            <div
              key={plan.id || plan.name}
              className={`subscribe-page__plan ${isPopularPlan(plan) ? 'subscribe-page__plan--popular' : ''}`}
            >
              {isPopularPlan(plan) && <div className="subscribe-page__plan-badge">Le plus populaire</div>}
              <div className="subscribe-page__plan-header">
                <h2 className="subscribe-page__plan-name">{plan.name}</h2>
                <span className="subscribe-page__plan-duration-badge">{getDurationBadge(plan.duration)}</span>
              </div>
              <div className="subscribe-page__plan-price">
                <span className="subscribe-page__plan-amount">{formatPrice(plan.priceCents)}</span>
                <span className="subscribe-page__plan-period">{getDurationLabel(plan.duration)}</span>
              </div>
              <ul className="subscribe-page__plan-features">
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  Accès illimité à tout le catalogue
                </li>
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  Qualité HD et 4K disponible
                </li>
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  Regardez sur tous vos appareils
                </li>
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  Sans engagement, annulez quand vous voulez
                </li>
                {plan.duration === 'yearly' && (
                  <li className="subscribe-page__plan-feature--highlight">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                    Économisez 2 mois offerts !
                  </li>
                )}
              </ul>
              <button
                className={`subscribe-page__btn ${isPopularPlan(plan) ? 'subscribe-page__btn--primary' : 'subscribe-page__btn--secondary'}`}
                onClick={() => handleSubscribe(plan.id!)}
                disabled={checkoutLoading !== null || !plan.id}
              >
                {checkoutLoading === plan.id ? (
                  <>
                    <span className="subscribe-page__btn-spinner"></span>
                    Redirection...
                  </>
                ) : (
                  'Choisir cette offre'
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="subscribe-page__footer">
          <p className="subscribe-page__secure-payment">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Paiement sécurisé par Stripe
          </p>
          {!isAuthenticated && (
            <p className="subscribe-page__login-prompt">
              Vous avez déjà un compte ?{' '}
              <button className="subscribe-page__link" onClick={() => navigate('/login')}>
                Connectez-vous
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
