import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Restores the last authenticated route after a successful sign-in. */
export function useRouteRestoration(): void {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/app") || location.pathname.startsWith("/settings")) {
      sessionStorage.setItem("docket:lastRoute", `${location.pathname}${location.search}`);
    }
  }, [location.pathname, location.search]);
}

/** Returns and clears the last stored authenticated route. */
export function takeRestoredRoute(): string {
  const route = sessionStorage.getItem("docket:lastRoute") ?? "/app";
  sessionStorage.removeItem("docket:lastRoute");
  return route;
}
