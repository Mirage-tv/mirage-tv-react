import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Layout } from './views/components/Layout/Layout';
import { LoadingFallback } from './views/components/Routing/Loading/LoadingFallback';

const HomePage = lazy(() => import('./views/pages/HomePage/HomePage').then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('./views/pages/LoginPage/LoginPage').then((m) => ({ default: m.LoginPage })));
const WatchPage = lazy(() => import('./views/pages/WatchPage/WatchPage').then((m) => ({ default: m.WatchPage })));
const SignUpPage = lazy(() => import('./views/pages/SignUpPage/SignUpPage').then((m) => ({ default: m.SignUpPage })));
const MoviesPage = lazy(() => import('./views/pages/MoviesPage/MoviesPage').then((m) => ({ default: m.MoviesPage })));
const ShowsPage = lazy(() => import('./views/pages/ShowsPage/ShowsPage').then((m) => ({ default: m.ShowsPage })));
const ShowDetailPage = lazy(() => import('./views/pages/ShowDetailPage/ShowDetailPage').then((m) => ({ default: m.ShowDetailPage })));
const MediaDetailPage = lazy(() => import('./views/pages/MediaDetailPage/MediaDetailPage').then((m) => ({ default: m.MediaDetailPage })));
const MyListPage = lazy(() => import('./views/pages/MyListPage/MyListPage').then((m) => ({ default: m.MyListPage })));
const ProfilePage = lazy(() => import('./views/pages/ProfilePage/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const SubscribePage = lazy(() => import('./views/pages/SubscribePage/SubscribePage').then((m) => ({ default: m.SubscribePage })));
const AccountPage = lazy(() => import('./views/pages/AccountPage/AccountPage').then((m) => ({ default: m.AccountPage })));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        )
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LoginPage />
          </Suspense>
        )
      },
      {
        path: 'signup',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SignUpPage />
          </Suspense>
        )
      },
      {
        path: 'forgot-password',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div className="placeholder-page">
              <h1>Mot de passe oublié</h1>
              <p>Cette fonctionnalité sera bientôt disponible.</p>
              <a href="/login">Retour à la connexion</a>
            </div>
          </Suspense>
        )
      },
      {
        path: 'watch/:mediaId',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <WatchPage />
          </Suspense>
        )
      },
      {
        path: 'media/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MediaDetailPage />
          </Suspense>
        )
      },
      {
        path: 'shows/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ShowDetailPage />
          </Suspense>
        )
      },
      {
        path: 'browse/movies',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MoviesPage />
          </Suspense>
        )
      },
      {
        path: 'browse/shows',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ShowsPage />
          </Suspense>
        )
      },
      {
        path: 'browse/category/:category',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div className="placeholder-page">
              <h1>Explorer par catégorie</h1>
              <p>Cette page sera bientôt disponible.</p>
              <a href="/">Retour à l'accueil</a>
            </div>
          </Suspense>
        )
      },
      {
        path: 'my-list',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MyListPage />
          </Suspense>
        )
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProfilePage />
          </Suspense>
        )
      },
      {
        path: 'subscribe',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SubscribePage />
          </Suspense>
        )
      },
      {
        path: 'payment-success',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SubscribePage />
          </Suspense>
        )
      },
      {
        path: 'subscribe/cancel',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SubscribePage />
          </Suspense>
        )
      },
      {
        path: 'account',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AccountPage />
          </Suspense>
        )
      },
      {
        path: 'pricing',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SubscribePage />
          </Suspense>
        )
      },
      {
        path: 'faq',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div className="placeholder-page">
              <h1>Foire aux questions</h1>
              <p>Cette page sera bientôt disponible.</p>
              <a href="/">Retour à l'accueil</a>
            </div>
          </Suspense>
        )
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div className="placeholder-page">
              <h1>À propos de Mirage</h1>
              <p>Cette page sera bientôt disponible.</p>
              <a href="/">Retour à l'accueil</a>
            </div>
          </Suspense>
        )
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div className="placeholder-page">
              <h1>Nous contacter</h1>
              <p>Cette page sera bientôt disponible.</p>
              <a href="/">Retour à l'accueil</a>
            </div>
          </Suspense>
        )
      },
      {
        path: 'privacy',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div className="placeholder-page">
              <h1>Politique de confidentialité</h1>
              <p>Cette page sera bientôt disponible.</p>
              <a href="/">Retour à l'accueil</a>
            </div>
          </Suspense>
        )
      },
      {
        path: 'terms',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div className="placeholder-page">
              <h1>Conditions d'utilisation</h1>
              <p>Cette page sera bientôt disponible.</p>
              <a href="/">Retour à l'accueil</a>
            </div>
          </Suspense>
        )
      },
      {
        path: 'legals',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div className="placeholder-page">
              <h1>Mentions légales</h1>
              <p>Cette page sera bientôt disponible.</p>
              <a href="/">Retour à l'accueil</a>
            </div>
          </Suspense>
        )
      },
      {
        path: '*',
        element: (
          <div className="not-found">
            <h1>404 - Page introuvable</h1>
            <p>La page que vous recherchez n'existe pas.</p>
            <a href="/">Retour à l'accueil</a>
          </div>
        )
      }
    ]
  }
];

export default routes;
