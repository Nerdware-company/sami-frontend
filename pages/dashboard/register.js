import React from "react";
import { getGlobalData, getStrapiURL } from "utils/api";
import Router, { useRouter } from "next/router";
import { getLocalizedPaths } from "utils/localize";
import { setCookie } from "nookies";
import AuthContext from "store/authContext";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { getStrapiMedia } from "utils/media";

const ACCOUNT_TYPES = [
  {
    id: 1,
    name: "customer",
  },
  {
    id: 2,
    name: "partner",
  },
  {
    id: 3,
    name: "accountant",
  },
];

const RegisterPage = (props) => {
  const router = useRouter();
  const { login } = React.useContext(AuthContext);
  const [accountType, setAccountType] = React.useState(ACCOUNT_TYPES[0].id);
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleRegister = async () => {
    const registerInfo = {
      username,
      email,
      password,
      accountType: ACCOUNT_TYPES.filter(
        (item) => item.id.toString() === accountType.toString()
      )[0].name,
    };

    // return console.log(registerInfo);

    try {
      const response = await fetch(getStrapiURL("/auth/local/register"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerInfo),
      });

      const { status } = response;

      if (status == 200) {
        login({ identifier: email, password });
      } else {
        // Handle validation errors
        alert("Handle validation errors");
      }
    } catch (error) {
      alert("Server error");
      console.log(error);
    }
  };

  return (
    <ProtectedRoute router={router}>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 bg-gray-200">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-contain w-full h-full"
                src={getStrapiMedia("erponelogo_54b888850f.png")}
                alt="Office"
              />
            </div>
            <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700">
                  Create account
                </h1>
                <label className="block text-sm">
                  <span className="text-gray-700">Email</span>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full mt-1 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                    placeholder="janedoe@example.com"
                  />
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700">Username</span>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full mt-1 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                    placeholder="Jane Doe"
                  />
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700">Password</span>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full mt-1 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                    placeholder="***************"
                    type="password"
                  />
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700">Confirm password</span>
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full mt-1 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                    placeholder="***************"
                    type="password"
                  />
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700">Account Type</span>
                  <div className="w-full flex flex-row mt-1">
                    {ACCOUNT_TYPES.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => setAccountType(item.id)}
                        className={`cursor-pointer text-sm rounded-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input me-2 ${
                          index < ACCOUNT_TYPES.length - 1 && "me-2"
                        }${
                          accountType === item.id
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-600 bg-gray-100"
                        }`}
                      >
                        <span>{`${item.name
                          .charAt(0)
                          .toUpperCase()}${item.name.slice(1)}`}</span>
                      </div>
                    ))}
                  </div>
                </label>

                <div className="flex mt-6 text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="text-purple-600 form-checkbox bg-gray-400 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple focus:shadow-outline-gray"
                    />
                    <span className="ml-2 text-gray-700">
                      I agree to the{" "}
                      <span className="underline">privacy policy</span>
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleRegister}
                  className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  Create account
                </button>

                <hr className="my-8" />

                <p className="mt-4">
                  <a
                    className="text-sm font-medium text-purple-600 text-purple-400 hover:underline"
                    href="/dashboard/login"
                  >
                    Already have an account? Login
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

export default RegisterPage;
