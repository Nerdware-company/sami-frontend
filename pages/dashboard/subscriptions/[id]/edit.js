import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import countries from "utils/countries";

const SubscriptionEditPage = ({ global, translations, system }) => {
  const router = useRouter();
  const subscriptionId = router.query.id;
  const { pricing_user_month, pricing_user_year } = system;
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

  const [formValues, setFormValues] = React.useState({
    title: "",
    numberOfUsers: 1,
    services: [],
    subTotal: 0.0,
    discount: null,
    total: 0.0,
  });

  const formState = {
    ...formValues,
  };

  const setFormState = (name, value) => {
    setFormValues((old) => ({ ...old, [name]: value }));
  };

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

  const handleSetNumberOfUsers = (val) => {
    console.log("is true", val.length > 0 && val == 0);
    if (val.length > 0 && val < 1) {
      return setFormState("numberOfUsers", 1);
    }
    return setFormState("numberOfUsers", val);
  };

  const handleChooseService = (serviceId) => {
    setFormState("services", [...formState.services, serviceId]);
  };

  const handleRemoveService = (serviceId) => {
    setFormState("services", [
      ...formState.services.filter((item) => item !== serviceId),
    ]);
  };

  const handleCalculateTotal = () => {
    let userPricing =
      subscription.paymentRecurrence === "MONTHLY"
        ? pricing_user_month
        : pricing_user_year;

    let discountPercentage =
      subscription.discount < 1 ? 1 : subscription.discount / 100;

    let calculateSubTotal =
      services
        .filter((item) => formState.services.indexOf(item.service_code) > -1)
        .reduce((partial_sum, arrayItem) => {
          switch (subscription.paymentRecurrence) {
            case "MONTHLY":
              return partial_sum + arrayItem.monthlyPrice;
            case "YEARLY":
              return partial_sum + arrayItem.yearlyPrice;
          }
        }, 0) +
      formState.numberOfUsers * userPricing;

    let calculateTotal = calculateSubTotal * discountPercentage;

    if (
      (formState.services.length > 0 && subscription.paymentRecurrence) ||
      formState.numberOfUsers > 0
    ) {
      setFormState("subTotal", calculateSubTotal);
      setFormState("total", calculateTotal);
    }
  };

  const handleSubmitData = async () => {
    const dataToSubmit = formState;

    if (
      !formState.title ||
      formState.numberOfUsers < 1 ||
      formState.services.length < 1
    ) {
      alert(translations.please_fill_all_fields);
      return;
    }

    for (var key in dataToSubmit) {
      if (dataToSubmit.hasOwnProperty(key)) {
        if (dataToSubmit[key] === null) delete dataToSubmit[key];
      }
    }

    dataToSubmit.services = dataToSubmit.services.map((item) => {
      return services.filter(
        (secondItem) => secondItem.service_code === item
      )[0].id;
    });

    try {
      const response = await fetch(
        getStrapiURL(`/subscriptions/${subscriptionId}`),
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      const { status } = response;

      if (status == 200) {
        router.push("/dashboard/subscriptions");
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const handlePay = () => {
    let validUntill =
      subscription.paymentRecurrence === "MONTHLY"
        ? new Date(
            new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 30)
          ).getTime()
        : new Date(
            new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 365)
          ).getTime();

    let serviceCodes = services
      .filter((item) => formState.services.includes(item.service_code))
      .map((item) => item.service_code)
      .join(",");

    let serviceIds = services
      .filter((item) => formState.services.includes(item.service_code))
      .map((item) => item.id)
      .join(",");

    let extractedCountryCode = countries.filter(
      (item) => ~subscription.owner.phoneNumber.indexOf(item.dial_code)
    )[0].dial_code;

    let phoneNumberWithoutCountryCode = subscription.owner.phoneNumber.replace(
      extractedCountryCode,
      ""
    );

    let dataToSend = {
      // Quota Info
      type_of_payment: "UPDATE",
      service_codes: serviceCodes,
      service_ids: serviceIds,
      valid_untill: validUntill,

      // Subscription Info
      id: subscription.id,
      subdomain: subscription.subdomain,
      company_name: subscription.title,
      subtotal: parseFloat(formState.subTotal),
      discount: subscription.discount ? subscription.discount : 0,
      total: parseFloat(formState.total),
      number_of_users: formState.numberOfUsers,

      // Owner Info
      email: subscription.owner.email,
      first_name: subscription.owner.firstname,
      last_name: subscription.owner.lastname,
    };

    goSell.config({
      gateway: {
        publicKey: "pk_test_L9gp7txMN3kcPWUwny1oEj8Y",
        language: "en",
        contactInfo: false,
        supportedCurrencies: "all",
        supportedPaymentMethods: "all",
        // supportedPaymentMethods: [
        //   "AMERICAN_EXPRESS",
        //   "MADA",
        //   "VISA",
        //   "MASTERCARD",
        //   "FAWRY",
        // ],
        saveCardOption: false,
        customerCards: true,
        notifications: "standard",
        callback: (response) => {
          console.log("response of callback", response);
        },
        onClose: () => {
          console.log("onClose Event");
        },
        backgroundImg: {
          url: "imgURL",
          opacity: "0.5",
        },
        labels: {
          cardNumber: "Card Number",
          expirationDate: "MM/YY",
          cvv: "CVV",
          cardHolder: "Name on Card",
          actionButton: "Pay",
        },
        style: {
          base: {
            color: "#535353",
            lineHeight: "18px",
            fontFamily: "sans-serif",
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "rgba(0, 0, 0, 0.26)",
              fontSize: "15px",
            },
          },
          invalid: {
            color: "red",
            iconColor: "#fa755a ",
          },
        },
      },
      customer: {
        first_name: dataToSend.first_name,
        middle_name: "",
        last_name: dataToSend.last_name,
        email: dataToSend.email,
        phone: {
          country_code: extractedCountryCode,
          number: phoneNumberWithoutCountryCode,
        },
      },
      order: {
        amount: dataToSend.total,
        currency: "USD",
        items: [
          {
            id: 0,
            name: `TOP1ERP Fees (UPGRADE) for subscription ID ${dataToSend.id}`,
            description: `(UPGRADE) Fees for subscription ID ${dataToSend.id}`,
            quantity: "1",
            amount_per_unit: 0,
            total_amount: dataToSend.total,
          },
        ],
      },
      transaction: {
        mode: "charge",
        charge: {
          auto: {
            time: 100,
            type: "VOID",
          },
          metadata: {
            ...dataToSend,
          },
          description: `(UPGRADE) Fees for subscription ID ${dataToSend.id}`,
          statement_descriptor: "statement_descriptor",
          saveCard: false,
          threeDSecure: true,
          redirect: `https://top1erp.com/dashboard/payment/verify`,
          post: null,
        },
      },
    });
    goSell.openLightBox();
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
        setFormState("title", responseJSON[0].title);
        setFormState("numberOfUsers", responseJSON[0].numberOfUsers);
        setFormState("subTotal", responseJSON[0].subTotal);
        setFormState("discount", responseJSON[0].discount);
        setFormState("total", responseJSON[0].total);
        let servicesArray = [];
        responseJSON[0].services.map((item) => {
          servicesArray.push(item.service_code);
        });
        setFormState("services", servicesArray);
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  React.useEffect(() => {
    fetchSubscription();
    fetchServices();
  }, []);

  React.useEffect(() => {
    handleCalculateTotal();
  }, [formState.services, formState.numberOfUsers, services]);

  React.useEffect(() => {
    console.log(formState);
  }, [formState]);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div>
          <div className="flex flex-row justify-between">
            <h3 className="text-gray-700 text-3xl font-medium">
              {translations.edit_subscription} #{subscriptionId}
            </h3>
            <a
              onClick={handlePay}
              className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {translations.pay_subscription}
            </a>
          </div>

          <div className="flex flex-row justify-between my-4">
            <h5 className="text-red-500 text-md font-medium">
              * {translations.edit_subscription_must_pay_immediately}
            </h5>
          </div>

          <div className="flex flex-col mt-8">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 ">
              <div className="align-middle inline-block min-w-full overflow-hidden sm:rounded-lg border-b border-gray-200 py-5 px-5 bg-white shadow">
                <div className="w-full">
                  <div className="md:flex md:flex-wrap md:flex-row">
                    <div className="md:w-8/12">
                      <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="numberOfUsers"
                          >
                            {translations.number_of_users}
                          </label>
                          <div className="flex flex-row justify-between items-center">
                            <input
                              onChange={(e) =>
                                handleSetNumberOfUsers(e.target.value)
                              }
                              value={formState.numberOfUsers}
                              max={100}
                              min={1}
                              type="number"
                              name="numberOfUsers"
                              id="numberOfUsers"
                              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 me-2"
                            />
                            <span className="block w-full py-3 mb-3">
                              {subscription.paymentRecurrence === "MONTHLY"
                                ? `$${pricing_user_month}`
                                : `$${pricing_user_year}`}{" "}
                              / {translations.user} /{" "}
                              {subscription.paymentRecurrence === "MONTHLY" ? (
                                <>{translations.monthly}</>
                              ) : (
                                <>{translations.yearly}</>
                              )}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs italic">
                            {
                              translations.helper_number_of_users_for_this_subscription
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-2">
                        <div className="w-full md:w-8/12 md:flex md:flex-nowrap md:flex-row md:items-start gap-2 px-3 mb-6 md:mb-0">
                          {services.map((service) => {
                            return (
                              <div
                                key={service.id}
                                onClick={
                                  formState.services.indexOf(
                                    service.service_code
                                  ) === -1
                                    ? () =>
                                        handleChooseService(
                                          service.service_code
                                        )
                                    : () =>
                                        handleRemoveService(
                                          service.service_code
                                        )
                                }
                                className={`mb-2 flex cursor-pointer border-2 ${
                                  formState.services.indexOf(
                                    service.service_code
                                  ) > -1
                                    ? " bg-primary-200 border-primary-700"
                                    : " bg-primary-50 border-gray-500"
                                } rounded p-5 justify-between items-center`}
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
                            );
                          })}
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
                        <p className="text-black mr-4">${formState.subTotal}</p>
                      </div>
                      {subscription.discount && (
                        <div
                          className={`
                            flex
                            justify-between
                            items-center
                            w-full
                            py-5
                            border-b-2 border-gray-200
                            ${subscription.discount > 0 && "bg-blue-100"}
                          `}
                        >
                          <p className={`ml-4`}>{translations.discount}</p>
                          <p
                            className={`mr-4
                         ${subscription.discount > 0 && "text-red-500"}
                         `}
                          >
                            {subscription.discount}%
                          </p>
                        </div>
                      )}
                      <div
                        className="
                flex
                justify-between
                items-center
                w-full
                py-5
              "
                      >
                        <p className="text-gray-400 ml-4">
                          {translations.total}
                        </p>
                        <p className="text-indigo-600 mr-4">
                          ${formState.total} {translations.billed}{" "}
                          {
                            translations[
                              subscription.paymentRecurrence?.toLowerCase()
                            ]
                          }
                        </p>
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

export default SubscriptionEditPage;
