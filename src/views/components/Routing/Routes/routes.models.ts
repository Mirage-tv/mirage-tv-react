// Public Route wrapper
export interface PublicRouteProps {
  readonly children: React.ReactElement;
}

export interface ProtectedRouteProps {
  readonly children: React.ReactElement;
  readonly requireSubscription?: boolean;
}
