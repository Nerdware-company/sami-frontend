import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React from "react";
import AuthContext from "store/authContext";
import { getStrapiURL } from "utils/api";

const SubscriptionViewPage = ({ global, translations }) => {
  const router = useRouter();
  const subscriptionId = router.query.id;
  const { user } = React.useContext(AuthContext);
  const { jwt, id: loggedInUserId, firstname, lastname, phoneNumber } = user;
  const [services, setServices] = React.useState([]);

  const [subscription, setSubscription] = React.useState({
    title: null,
    subdomain: null,
    numberOfUsers: 0,
    paymentRecurrence: null,
    subTotal: 0.0,
    total: 0.0,
    discount: null,
    active: true,
    services: [],
    coupon: null,
    owner: loggedInUserId,
  });

  const fetchServices = async () => {
    try {
      const response = await fetch(
        getStrapiURL(`/services?_locale=${parseCookies().NEXT_LOCALE || "en"}`),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const { status } = response;
      const responseJSON = await response.json();

      if (status == 200) {
        setServices(responseJSON);
      } else {
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await fetch(
        getStrapiURL(`/subscriptions?id=${subscriptionId}`),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const { status } = response;
      const responseJSON = await response.json();

      if (status == 200) {
        setSubscription(responseJSON[0]);
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  React.useEffect(() => {
    fetchServices();
    fetchSubscription();
  }, []);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div>
          <div className="flex flex-row justify-between">
            <h3 className="text-gray-700 text-3xl font-medium">
              {translations.view_subscription}
            </h3>
            {/* <a className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Save
            </a> */}
          </div>

          <div className="flex flex-col mt-8">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 ">
              <div className="align-middle inline-block min-w-full overflow-hidden sm:rounded-lg border-b border-gray-200 py-5 px-5 bg-white shadow">
                <div className="w-full">
                  <div className="md:flex md:flex-wrap md:flex-row">
                    <div className="md:w-8/12">
                      <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                        <div className="w-full px-3">
                          <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            {translations.owner}
                          </span>
                          <div className="flex flex-row justify-between items-center">
                            {subscription.owner.id === loggedInUserId ? (
                              <>{translations.you}</>
                            ) : (
                              <>{subscription.owner.email}</>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                        <div className="w-full px-3">
                          <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            {translations.title}
                          </span>
                          <div className="flex flex-row justify-between items-center">
                            {subscription.title}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                        <div className="w-full px-3">
                          <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            {translations.subdomain}
                          </span>
                          <div className="flex flex-row justify-between items-center">
                            {subscription.subdomain}.top1erp.com
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                        <div className="w-full px-3">
                          <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            {translations.payment_recurrence}
                          </span>
                          <div className="flex flex-row justify-between items-center">
                            {
                              translations[
                                subscription.paymentRecurrence?.toLowerCase()
                              ]
                            }
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-2">
                        <div className="w-full md:w-8/12 md:flex md:flex-nowrap md:flex-row md:items-start gap-2 px-3 mb-6 md:mb-0">
                          {services
                            .filter(
                              (item) =>
                                subscription.services.map(function (e) {
                                  return e.service_code;
                                })[0] === item.service_code
                            )
                            .map((service) => (
                              <div
                                key={service.id}
                                className={`mb-2 flex border-2 bg-primary-50 border-gray-500 rounded p-5 justify-between items-center`}
                              >
                                <div className="flex justify-start gap-5 items-center me-2">
                                  <div className="w-20 h-20 rounded-lg">
                                    <img
                                      className="object-contain w-20 h-20"
                                      src={getStrapiURL(service.picture.url)}
                                      alt={service.title}
                                    />
                                  </div>
                                  <div>
                                    <h1 className="font-bold tracking-wider text-gray-700">
                                      {service.title}
                                    </h1>
                                    <div>
                                      <span className="text-gray-500">$</span>{" "}
                                      <span className="text-3xl">
                                        {subscription.paymentRecurrence ===
                                        "MONTHLY"
                                          ? service.monthlyPrice
                                          : service.yearlyPrice}{" "}
                                      </span>{" "}
                                      <span className="text-gray-500">
                                        /{" "}
                                        {subscription.paymentRecurrence ===
                                        "MONTHLY" ? (
                                          <>{translations.monthly}</>
                                        ) : (
                                          <>{translations.yearly}</>
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className="w-full md:w-4/12 px-3 mb-6 md:mb-0"></div>
                      </div>
                    </div>
                    <div className="sm:w-8/12 md:w-4/12 flex flex-col justify-start items-center">
                      <h6 className="text-black font-medium">
                        {translations.order_summary}
                      </h6>
                      <div
                        className="
                flex
                justify-between
                items-center
                w-full
                py-5
                border-b-2 border-gray-200
              "
                      >
                        <p className="text-gray-400 ml-4">
                          {translations.subtotal}
                        </p>
                        <p className="text-black mr-4">
                          $ {subscription.subTotal}
                        </p>
                      </div>
                      <div
                        className={`
                            flex
                            justify-between
                            items-center
                            w-full
                            py-5
                            border-b-2 border-gray-200
                          `}
                      >
                        <p className={`ml-4`}>{translations.discount}</p>
                        <p
                          className={`mr-4
                         `}
                        >
                          {subscription.discount || 0}%
                        </p>
                      </div>
                      <div
                        className="
                flex
                justify-between
                items-center
                w-full
                py-5
                border-b-2 border-gray-200
              "
                      >
                        <p className="text-gray-400 ml-4">
                          {translations.total}
                        </p>
                        <p className="text-indigo-600 mr-4">
                          ${subscription.total} {translations.billed}{" "}
                          {
                            translations[
                              subscription.paymentRecurrence?.toLowerCase()
                            ]
                          }
                        </p>
                      </div>

                      <div
                        className="
                flex flex-col
                justify-between
                items-center
                px-3
                py-5
                w-full
              "
                      >
                        <div className="w-full mt-2 mb-4">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="couponCode"
                          >
                            {translations.coupon_code}
                          </label>
                          <span>
                            {subscription.coupon ? (
                              subscription.coupon
                            ) : (
                              <>{translations.empty}</>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutSidebar>
    </ProtectedRoute>
  );
};

export default SubscriptionViewPage;
