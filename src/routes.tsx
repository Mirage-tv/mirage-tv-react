import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { Layout } from "./views/components/Layout/Layout";
import { LoadingFallback } from "./views/components/Routing/Loading/LoadingFallback";

const HomePage = lazy(() => import("./views/pages/HomePage/HomePage").then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import("./views/pages/LoginPage/LoginPage").then((m) => ({ default: m.LoginPage })));
const WatchPage = lazy(() => import("./views/pages/WatchPage/WatchPage").then((m) => ({ default: m.WatchPage })));
const SignUpPage = lazy(() => import("./views/pages/SignUpPage/SignUpPage").then((m) => ({ default: m.SignUpPage })));
const MoviesPage = lazy(() => import("./views/pages/MoviesPage/MoviesPage").then((m) => ({ default: m.MoviesPage })));
const ShowsPage = lazy(() => import("./views/pages/ShowsPage/ShowsPage").then((m) => ({ default: m.ShowsPage })));
const MyListPage = lazy(() => import("./views/pages/MyListPage/MyListPage").then((m) => ({ default: m.MyListPage })));

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
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "signup",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SignUpPage />
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div>Forgot Password Page - To be implemented</div>
          </Suspense>
        ),
      },
      {
        path: "watch/:mediaId",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <WatchPage />
          </Suspense>
        ),
      },
      {
        path: "media/:id",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div>Media Detail Page - To be implemented</div>
          </Suspense>
        ),
      },
      {
        path: "shows/:id",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div>Show Detail Page - To be implemented</div>
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
            <MyListPage />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div>Profile Page - To be implemented</div>
          </Suspense>
        ),
      },
      {
        path: "subscribe",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div>Subscription Page - To be implemented</div>
          </Suspense>
        ),
      },
      {
        path: "account",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div>Account Settings Page - To be implemented</div>
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
