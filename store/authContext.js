import Router from "next/router";
import React, { createContext } from "react";
import { destroyCookie, parseCookies } from "nookies";
import { getStrapiURL } from "utils/api";
import Cookies from "js-cookie";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  checkUser: () => {},
  authReady: false,
  errors: [],
});
const initialUser = {
  jwt: null,
  id: null,
  email: null,
  username: null,
  confirmed: null,
  blocked: null,
  accountType: "",
};

export const AuthContextProvider = ({ children }) => {
  const [authReady, setAuthReady] = React.useState(false);
  const [user, setUser] = React.useState(initialUser);
  const [errors, setErrors] = React.useState([]);

  React.useEffect(() => {
    // Init "Strapi" identity connection

    const jwt = parseCookies().jwt;
    if (jwt) {
      checkUser(jwt);
    } else {
      setAuthReady(true);
    }
  }, []);

  const checkUser = async (jwt) => {
    try {
      const response = await fetch(getStrapiURL("/users/me"), {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      const { status } = response;
      const responseJSON = await response.json();

      if (status == 200) {
        handleSetUser(jwt, responseJSON);
        Cookies.set("jwt", jwt, {
          httpOnly: false,
          secure: false,
          // maxAge: 60 * 60 * 24 * 30,
          sameSite: "strict",
          path: "/",
        });
        setAuthReady(true);
      } else {
        logout();
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(getStrapiURL("/auth/local"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const { status } = response;
      const responseJSON = await response.json();

      if (status == 200) {
        const { jwt } = responseJSON;

        checkUser(jwt);
        Router.push("/dashboard");
      } else {
        const { message } = responseJSON;
        setErrors(message[0].messages.map((i) => i.id));
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const logout = async () => {
    destroyCookie(null, "jwt", { path: "/" });
    setUser(initialUser);
    Router.push("/");
  };

  const handleSetUser = (jwt, userInfo) => {
    const { id, email, username, confirmed, blocked, accountType, picture } =
      userInfo;

    setUser({
      jwt,
      id,
      email,
      username,
      confirmed,
      blocked,
      accountType,
      picture,
    });
  };

  const context = {
    user: user,
    login: login,
    checkUser: checkUser,
    logout: logout,
    errors: errors,
  };

  if (authReady === false) {
    return <div>Loadingd...</div>;
  }

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
