import React from "react";
import { getPageData, fetchAPI, getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import { setCookie, parseCookies } from "nookies";
import AuthContext from "store/authContext";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";

const LoginPage = ({ sections, metadata, preview, global, pageContext }) => {
  const router = useRouter();
  const { login, errors } = React.useContext(AuthContext);

  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  const handleLogin = async () => {
    const credentials = {
      identifier: email,
      password,
    };

    login(credentials);
  };

  const jwt = parseCookies(pageContext).jwt;

  React.useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <ProtectedRoute router={router}>
      <div className="flex items-center min-h-screen p-6 bg-gray-200">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-contain w-full h-full LoginPagehidden"
                src="../../assets/images/geekware-macbook.png"
                alt="Office"
              />
            </div>
            <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 ">
                  Login
                </h1>
                {errors.includes("Auth.form.error.invalid") && (
                  <div
                    className="my-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
                    role="alert"
                  >
                    <strong className="font-bold">Wrong Credentials!</strong>
                    <span className="block">
                      Please check your email and/or password.
                    </span>
                  </div>
                )}
                <label className="block text-sm">
                  <span className="text-gray-700">Email</span>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="block w-full mt-1 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                    placeholder="Jane Doe"
                  />
                </label>
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 ">Password</span>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="block w-full mt-1 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                    placeholder="***************"
                    type="password"
                  />
                </label>

                <button
                  onClick={handleLogin}
                  className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  Log in
                </button>

                <hr className="my-8" />

                <p className="mt-4">
                  <a
                    className="text-sm font-medium text-purple-600 LoginPagetext-purple-400 hover:underline"
                    href="./forgot-password.html"
                  >
                    Forgot your password?
                  </a>
                </p>
                <p className="mt-1">
                  <a
                    className="text-sm font-medium text-purple-600 LoginPagetext-purple-400 hover:underline"
                    href="/dashboard/register"
                  >
                    Create account
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export async function getStaticProps(context) {
  const { params, locale, locales, defaultLocale, preview = null } = context;

  const globalLocale = await getGlobalData(locale);
  // Fetch pages. Include drafts if preview mode is on

  const pageContext = {
    locales,
    defaultLocale,
    slug: "testing",
  };

  const localizedPaths = getLocalizedPaths(pageContext);

  return {
    props: {
      global: globalLocale,
      pageContext: {
        ...pageContext,
        localizedPaths,
      },
    },
  };
}

export default LoginPage;
