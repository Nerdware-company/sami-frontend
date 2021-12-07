import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";

const PaymentFailure = ({ global, translations }) => {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const { jwt, id: loggedInUserId, firstname, lastname, phoneNumber } = user;

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div class="bg-white p-6  md:mx-auto">
          <svg viewBox="0 0 24 24" class="text-red-600 w-16 h-16 mx-auto my-6">
            <path
              fill="currentColor"
              d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
            ></path>
          </svg>
          <div class="text-center">
            <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">
              {translations.payment_fail}
            </h3>
            <p class="text-gray-600 my-2">{translations.please_try_again}</p>
            {/* <div class="py-10 text-center">
              <a
                href="#"
                class="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
              >
                GO BACK
              </a>
            </div> */}
          </div>
        </div>
      </LayoutSidebar>
    </ProtectedRoute>
  );
};

export default PaymentFailure;
