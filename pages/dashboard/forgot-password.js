import React from "react";
import { getPageData, fetchAPI, getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import { setCookie, parseCookies } from "nookies";
import AuthContext from "store/authContext";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import { getStrapiMedia } from "utils/media";

const ForgotPasswordPage = ({ global, translations }) => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSendForgotPasswordEmail = async () => {
    try {
      const response = await fetch(getStrapiURL("/auth/forgot-password"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const { status } = response;
      const responseJSON = await response.json();

      if (status == 200) {
        setError(false);
        setSuccess(true);
      } else {
        setError(true);
        setSuccess(false);
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  return (
    <ProtectedRoute router={router}>
      <div className="flex items-center min-h-screen p-6 bg-gray-200">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-contain w-full h-full ForgotPasswordPagehidden"
                src={getStrapiMedia(global.ClientArea.loginImage.url)}
                alt="Office"
              />
            </div>
            <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 ">
                  {translations.forgot_password}
                </h1>
                {error && (
                  <div
                    className="my-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
                    role="alert"
                  >
                    <strong className="font-bold">
                      {translations.warning}
                    </strong>
                    <span className="block">
                      {translations.please_check_email}
                    </span>
                  </div>
                )}
                {success && (
                  <div
                    className="my-10 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative"
                    role="alert"
                  >
                    <strong className="font-bold">
                      {translations.success}
                    </strong>
                    <span className="block">
                      {translations.you_received_password_reset_email}
                    </span>
                  </div>
                )}
                <label className="block text-sm">
                  <span className="text-gray-700">{translations.email}</span>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="block w-full mt-2 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                    placeholder="janedoe@example.com"
                  />
                </label>
                <button
                  onClick={handleSendForgotPasswordEmail}
                  className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  {translations.send_email}
                </button>

                <hr className="my-8" />

                <p className="mt-4">
                  <a
                    className="text-sm font-medium text-purple-600 ForgotPasswordPagetext-purple-400 hover:underline"
                    href="/dashboard/login"
                  >
                    {translations.login}
                  </a>
                </p>
                <p className="mt-1">
                  <a
                    className="text-sm font-medium text-purple-600 ForgotPasswordPagetext-purple-400 hover:underline"
                    href="/dashboard/register"
                  >
                    {translations.create_account}
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

export default ForgotPasswordPage;
