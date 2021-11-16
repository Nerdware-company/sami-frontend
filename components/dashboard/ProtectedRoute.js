// import { appRoutes } from "../constants";
import { parseCookies } from "nookies";
import { unprotectedRoutes } from "../../constants";

//check if you are on the client (browser) or server
const isBrowser = () => typeof window !== "undefined";

const ProtectedRoute = ({ ctx, router, children }) => {
  const jwt = parseCookies(ctx).jwt;

  const isAuthenticated = !!jwt;

  let routesUnprotected = unprotectedRoutes;

  /**
   * @var pathIsProtected Checks if path exists in the unprotectedRoutes routes array
   */
  let pathIsProtected = routesUnprotected.indexOf(router.pathname) === -1;

  if (isBrowser() && !isAuthenticated && pathIsProtected) {
    router.push("/dashboard/login");
  }

  if (isAuthenticated && !pathIsProtected) {
    router.push("/dashboard");
  }

  return children;
};

export default ProtectedRoute;
