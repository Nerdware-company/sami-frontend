import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";

const SubscriptionCreatePage = ({ global, translations, system }) => {
  const router = useRouter();
  const { pricing_user_month, pricing_user_year } = system;
  const { user } = React.useContext(AuthContext);
  const { jwt, id: loggedInUserId, firstname, lastname, phoneNumber } = user;
  const [services, setServices] = React.useState([]);
  const [partneredUsers, setPartneredUsers] = React.useState([]);
  // Validation Consts
  const [errors, setErrors] = React.useState({
    subdomainExists: false,
  });

  const [formValues, setFormValues] = React.useState({
    title: "",
    subdomain: "",
    coupon_code: "",
    numberOfUsers: 1,
    paymentRecurrence: "MONTHLY",
    subTotal: 0.0,
    total: 0.0,
    discount: null,
    active: false,
    services: [],
    coupon: null,
    owner: loggedInUserId,
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

  const fetchPartneredUsers = async () => {
    try {
      const response = await fetch(
        getStrapiURL(`/users?partner.id=${loggedInUserId}`),
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
        setPartneredUsers(responseJSON);
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

  const handleCheckSubdomain = async (val) => {
    try {
      const response = await fetch(
        getStrapiURL(`/subscriptions?subdomain=${val}`),
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
        if (responseJSON.length > 0) {
          setErrors({ ...errors, subdomainExists: true });
        } else {
          setErrors({ ...errors, subdomainExists: false });
        }
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const handleApplyCode = async () => {
    if (formState.coupon_code.length < 4) return;
    try {
      const response = await fetch(
        getStrapiURL(`/coupons?code=${formState.coupon_code}`),
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
        if (responseJSON.length > 0) {
          let couponActive = responseJSON[0].active;
          let validUntil = responseJSON[0].validUntil;
          let validUntilUnix = new Date(validUntil).getTime();
          let currentUnixTime = Date.now().toString();
          if (currentUnixTime > validUntilUnix) {
            alert("Coupon has expired");
            return;
          } else if (!couponActive) {
            alert("Coupon not active");
            return;
          }
          setFormState("discount", responseJSON[0].discountPercentage);
          setFormState("coupon", responseJSON[0].code);
        }
      } else {
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const handleCalculateTotal = () => {
    let userPricing =
      formState.paymentRecurrence === "MONTHLY"
        ? pricing_user_month
        : pricing_user_year;

    let discountPercentage =
      formState.discount < 1 ? 1 : formState.discount / 100;

    let calculateSubTotal =
      services
        .filter((item) => formState.services.indexOf(item.service_code) > -1)
        .reduce((partial_sum, arrayItem) => {
          switch (formState.paymentRecurrence) {
            case "MONTHLY":
              return partial_sum + arrayItem.monthlyPrice;
            case "YEARLY":
              return partial_sum + arrayItem.yearlyPrice;
          }
        }, 0) +
      formState.numberOfUsers * userPricing;

    let calculateTotal = calculateSubTotal * discountPercentage;

    if (
      (formState.services.length > 0 && formState.paymentRecurrence) ||
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
      !formState.subdomain ||
      !formState.paymentRecurrence ||
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
      const response = await fetch(getStrapiURL(`/subscriptions`), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(dataToSubmit),
      });

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

  React.useEffect(() => {
    fetchPartneredUsers();
    fetchServices();
  }, []);

  React.useEffect(() => {
    handleCalculateTotal();
  }, [
    formState.services,
    formState.numberOfUsers,
    formState.discount,
    formState.paymentRecurrence,
    services,
  ]);

  React.useEffect(() => {
    handleCheckSubdomain(formState.subdomain);
  }, [formState.subdomain]);

  React.useEffect(() => {
    if (router.query.services) {
      let queryPaymentRecurrence = router.query.paymentRecurrence;
      let queryNumberOfUsers = router.query.numberOfUsers;
      let queryServices = router.query.services.split(",");
      setFormState("numberOfUsers", queryNumberOfUsers);
      setFormState("services", [...formState.services, ...queryServices]);
      setFormState("paymentRecurrence", queryPaymentRecurrence);
    }
  }, [router]);

  React.useEffect(() => {
    console.log(formState.services);
  }, [formState.services]);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div>
          <div className="flex flex-row justify-between">
            <h3 className="text-gray-700 text-3xl font-medium">
              {translations.create_subscription}
            </h3>
            <a
              onClick={handleSubmitData}
              className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {translations.create}
            </a>
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
                            htmlFor="owner"
                          >
                            {translations.owner}
                          </label>
                          <div className="flex flex-row justify-between items-center">
                            <select
                              onChange={(e) =>
                                setFormState("owner", e.target.value)
                              }
                              value={formState.owner}
                              id="owner"
                              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            >
                              <option value={loggedInUserId}>
                                {translations.you}
                              </option>
                              {partneredUsers.length > 0 &&
                                partneredUsers.map((partneredUserItem) => (
                                  <option value={partneredUserItem.id}>
                                    {partneredUserItem.email}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <p className="text-gray-600 text-xs italic">
                            {/* {translations.helper_title_for_this_subscription} */}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="title"
                          >
                            {translations.title}
                          </label>
                          <div className="flex flex-row justify-between items-center">
                            <input
                              onChange={(e) =>
                                setFormState("title", e.target.value)
                              }
                              name="title"
                              id="title"
                              type="text"
                              placeholder={translations.title}
                              className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 me-2`}
                            />
                          </div>
                          <p className="text-gray-600 text-xs italic">
                            {translations.helper_title_for_this_subscription}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="subdomain"
                          >
                            {translations.subdomain}
                          </label>
                          <div className="flex flex-row justify-between items-center">
                            <input
                              onChange={(e) =>
                                setFormState("subdomain", e.target.value)
                              }
                              name="subdomain"
                              id="subdomain"
                              type="text"
                              placeholder="example"
                              className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 me-2
                              ${errors.subdomainExists && "border-red-500"}
                              `}
                            />
                            <span className="block w-full py-3 mb-3">
                              .top1erp.com
                            </span>
                          </div>
                          {errors.subdomainExists && (
                            <p className="text-red-600 text-xs italic">
                              This subdomain already exists
                            </p>
                          )}
                          <p className="text-gray-600 text-xs italic">
                            {
                              translations.helper_subdomain_for_this_subscription
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="paymentRecurrence"
                          >
                            {translations.paymentRecurrence}
                          </label>
                          <select
                            onChange={(e) =>
                              setFormState("paymentRecurrence", e.target.value)
                            }
                            value={formState.paymentRecurrence}
                            id="paymentRecurrence"
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          >
                            <option value={"MONTHLY"}>
                              {translations.monthly}
                            </option>
                            <option value={"YEARLY"}>
                              {translations.yearly}
                            </option>
                          </select>
                          <p className="text-gray-600 text-xs italic mt-4">
                            {
                              translations.helper_recurrence_for_this_subscription
                            }
                          </p>
                        </div>
                      </div>

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
                              {formState.paymentRecurrence === "MONTHLY"
                                ? `$${pricing_user_month}`
                                : `$${pricing_user_year}`}{" "}
                              / User /{" "}
                              {formState.paymentRecurrence === "MONTHLY" ? (
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
                          {services.map((service) => (
                            <div
                              key={service.id}
                              onClick={
                                formState.services.indexOf(
                                  service.service_code
                                ) === -1
                                  ? () =>
                                      handleChooseService(service.service_code)
                                  : () =>
                                      handleRemoveService(service.service_code)
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
                                      {formState.paymentRecurrence === "MONTHLY"
                                        ? service.monthlyPrice
                                        : service.yearlyPrice}{" "}
                                    </span>{" "}
                                    <span className="text-gray-500">
                                      /{" "}
                                      {formState.paymentRecurrence ===
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
                      {/* <div
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
                      </div> */}
                      {/* {formState.discount && (
                        <div
                          className={`
                            flex
                            justify-between
                            items-center
                            w-full
                            py-5
                            border-b-2 border-gray-200
                            ${formState.discount > 0 && "bg-blue-100"}
                          `}
                        >
                          <p className={`ml-4`}>{translations.discount}</p>
                          <p
                            className={`mr-4
                         ${formState.discount > 0 && "text-red-500"}
                         `}
                          >
                            {formState.discount}%
                          </p>
                        </div>
                      )} */}
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
                          ${formState.total} {translations.billed}{" "}
                          {
                            translations[
                              formState.paymentRecurrence.toLowerCase()
                            ]
                          }
                        </p>
                      </div>

                      {/* <div
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
                          <input
                            onChange={(e) =>
                              setFormState("coupon_code", e.target.value)
                            }
                            disabled={formState.discount > 0}
                            type="text"
                            name="couponCode"
                            id="couponCode"
                            placeholder={translations.coupon_code}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          />
                        </div>
                        <button
                          onClick={handleApplyCode}
                          disabled={formState.discount > 0}
                          className={`w-full  text-white px-2 py-2 rounded-md ${
                            formState.discount > 0
                              ? "bg-gray-500"
                              : "bg-indigo-600"
                          }`}
                        >
                          {translations.apply_code}
                        </button>
                      </div> */}
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

export default SubscriptionCreatePage;
