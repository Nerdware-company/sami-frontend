import React from "react";
import { getGlobalData, getStrapiURL } from "utils/api";
import Router, { useRouter } from "next/router";
import { getLocalizedPaths } from "utils/localize";
import { setCookie } from "nookies";
import AuthContext from "store/authContext";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { getStrapiMedia } from "utils/media";
import countries from "utils/countries";

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

const RegisterPage = ({ global, translations }) => {
  const router = useRouter();
  const { login } = React.useContext(AuthContext);
  const [accountType, setAccountType] = React.useState(ACCOUNT_TYPES[0].id);
  const [countryCode, setCountryCode] = React.useState(countries[0].dial_code);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [partnerCode, setPartnerCode] = React.useState("");

  const handleRegister = async () => {
    if (
      !firstname ||
      !lastname ||
      !phoneNumber ||
      !email ||
      !password ||
      !confirmPassword ||
      !countryCode
    ) {
      alert(translations.please_fill_star_fields);
      return;
    }
    const registerInfo = {
      phoneNumber: countryCode + phoneNumber,
      firstname,
      lastname,
      email,
      password,
      accountType: ACCOUNT_TYPES.filter(
        (item) => item.id.toString() === accountType.toString()
      )[0].name,
    };

    if (partnerCode) {
      let partnerId = partnerCode.split("-")[1];
      registerInfo.partner = partnerId;
    }

    if (
      ACCOUNT_TYPES.filter(
        (item) => item.id.toString() === accountType.toString()
      )[0].name !== "customer"
    ) {
      registerInfo.active = false;
    } else {
      registerInfo.active = true;
    }
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
        if (accountType === "customer") {
          login({ identifier: email, password });
        }
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
                src={getStrapiMedia(global.ClientArea.loginImage.url)}
                alt="Office"
              />
            </div>
            <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700">
                  {translations.create_account}
                </h1>

                <div className="flex flex-row justify-between">
                  <label className="block text-sm">
                    <span className="text-gray-700">
                      {translations.first_name}
                    </span>
                    <span className="ms-2 text-red-700">*</span>
                    <input
                      name="firstname"
                      onChange={(e) => setFirstname(e.target.value)}
                      className="block w-full mt-1 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                      placeholder="Jane"
                      autoFocus={true}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-gray-700">
                      {translations.last_name}
                    </span>
                    <span className="ms-2 text-red-700">*</span>
                    <input
                      name="lastname"
                      onChange={(e) => setLastname(e.target.value)}
                      className="block w-full mt-1 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                      placeholder="Doe"
                    />
                  </label>
                </div>

                <div className="flex flex-row justify-between mt-4">
                  <label className="block text-sm w-full">
                    <span className="text-gray-700">
                      {translations.phone_number}
                    </span>
                    <span className="ms-2 text-red-700">*</span>

                    <div className="flex flex-row justify-between mt-1">
                      <select
                        name="countryCode"
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="block w-1/3 me-2 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                      >
                        {countries.map((item) => (
                          <option key={item.name} value={item.dial_code}>
                            {item.code} {item.dial_code}
                          </option>
                        ))}
                      </select>
                      <input
                        name="phoneNumber"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="block w-2/3 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                        placeholder="790101010"
                        maxLength={12}
                      />
                    </div>
                  </label>
                </div>

                <label className="block text-sm mt-4">
                  <span className="text-gray-700">{translations.email}</span>
                  <span className="ms-2 text-red-700">*</span>

                  <input
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full mt-1 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                    placeholder="janedoe@example.com"
                  />
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700">{translations.password}</span>
                  <span className="ms-2 text-red-700">*</span>
                  <input
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full mt-1 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                    placeholder="***************"
                    type="password"
                  />
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700">
                    {translations.confirm_password}
                  </span>
                  <span className="ms-2 text-red-700">*</span>
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full mt-1 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                    placeholder="***************"
                    type="password"
                  />
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700">
                    {translations.partner_code}
                  </span>
                  <input
                    onChange={(e) => setPartnerCode(e.target.value)}
                    className="block w-full mt-1 text-sm rounded-sm border-gray-600 bg-gray-100 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-input"
                    placeholder={translations.partner_code}
                    type="text"
                  />
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700">
                    {translations.account_type}
                  </span>
                  <span className="ms-2 text-red-700">*</span>
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
                        <span>{`${
                          translations[`account_type_${item.name}`]
                        }`}</span>
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
                    <span className="ms-2 text-gray-700">
                      {translations.i_agree}{" "}
                      <span className="underline">
                        {translations.privacy_policy}
                      </span>
                      <span className="ms-2 text-red-700">*</span>
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleRegister}
                  className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  {translations.create_account}
                </button>

                <hr className="my-8" />

                <p className="mt-4">
                  <a
                    className="text-sm font-medium text-purple-600 text-purple-400 hover:underline"
                    href="/dashboard/login"
                  >
                    {translations.already_have_account}{" "}
                    {translations.login_instead}
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

export default RegisterPage;
