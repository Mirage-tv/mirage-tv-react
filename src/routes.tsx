import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { Layout } from "./views/components/Layout/Layout";
import { LoadingFallback } from "./views/components/Routing/Loading/LoadingFallback";
import { ProtectedRoute } from "./views/components/Routing/Routes/ProctectedRoute";
import { PublicRoute } from "./views/components/Routing/Routes/PublicRoute";

const HomePage = lazy(() => import("./views/pages/HomePage/HomePage").then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import("./views/pages/LoginPage/LoginPage").then((m) => ({ default: m.LoginPage })));
const WatchPage = lazy(() => import("./views/pages/WatchPage/WatchPage").then((m) => ({ default: m.WatchPage })));
const SignUpPage = lazy(() => import("./views/pages/SignUpPage/SignUpPage").then((m) => ({ default: m.SignUpPage })));
const MoviesPage = lazy(() => import("./views/pages/MoviesPage/MoviesPage").then((m) => ({ default: m.MoviesPage })));
const ShowsPage = lazy(() => import("./views/pages/ShowsPage/ShowsPage").then((m) => ({ default: m.ShowsPage })));

// Ajoutez ici les autres pages lazy si besoin

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          </Suspense>
        ),
      },
      {
        path: "signup",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PublicRoute>
              <div>Forgot Password Page - To be implemented</div>
            </PublicRoute>
          </Suspense>
        ),
      },
      {
        path: "watch/:mediaId",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute requireSubscription>
              <WatchPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "media/:id",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <div>Media Detail Page - To be implemented</div>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "shows/:id",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <div>Show Detail Page - To be implemented</div>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "browse/movies",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MoviesPage />
          </Suspense>
        ),
      },
      {
        path: "browse/shows",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ShowsPage />
          </Suspense>
        ),
      },
      {
        path: "browse/category/:category",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div>Category Browse Page - To be implemented</div>
          </Suspense>
        ),
      },
      {
        path: "my-list",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <div>My List Page - To be implemented</div>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <div>Profile Page - To be implemented</div>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "subscribe",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <div>Subscription Page - To be implemented</div>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "account",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <div>Account Settings Page - To be implemented</div>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <div className="not-found">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">Go back to home</a>
          </div>
        ),
      },
    ],
  },
];

export default routes;
