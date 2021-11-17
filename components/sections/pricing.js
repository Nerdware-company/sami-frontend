import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React from "react";
import { getStrapiURL } from "utils/api";

const PRICING_USER_PER_MONTH = 5;
const PAYMENT_RECURRENCE_OPTIONS = {
  monthly: {
    id: "monthly",
    multiplicationFactor: 1,
  },
  yearly: {
    id: "yearly",
    multiplicationFactor: 12,
  },
};
const Pricing = ({ data }) => {
  const router = useRouter();
  const [services, setServices] = React.useState([]);
  // Validation Consts
  const [errors, setErrors] = React.useState({
    subdomainExists: false,
  });

  const [formValues, setFormValues] = React.useState({
    title: "",
    subdomain: "",
    coupon_code: "",
    numberOfUsers: 1,
    paymentRecurrence: PAYMENT_RECURRENCE_OPTIONS.monthly.id,
    subTotal: 0.0,
    total: 0.0,
    discount: null,
    active: true,
    services: [],
    coupon: null,
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
          let validUntil = responseJSON[0].validUntil;
          let validUntilUnix = new Date(validUntil).getTime();
          let currentUnixTime = Date.now().toString();
          if (currentUnixTime > validUntilUnix) {
            alert("Coupon has expired");
            return;
          }
          setFormState("discount", responseJSON[0].discountPercentage);
        }
      } else {
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const handleCalculateTotal = () => {
    let calculatedSubtotal =
      services
        .filter((item) => formState.services.indexOf(item.id) > -1)
        .reduce((partial_sum, arrayItem) => {
          switch (formState.paymentRecurrence) {
            case PAYMENT_RECURRENCE_OPTIONS.monthly.id:
              return partial_sum + arrayItem.monthlyPrice;
            case PAYMENT_RECURRENCE_OPTIONS.yearly.id:
              return partial_sum + arrayItem.yearlyPrice;
          }
        }, 0) +
      formState.numberOfUsers *
        (formState.paymentRecurrence === PAYMENT_RECURRENCE_OPTIONS.monthly.id
          ? PRICING_USER_PER_MONTH
          : PRICING_USER_PER_MONTH *
            PAYMENT_RECURRENCE_OPTIONS.yearly.multiplicationFactor);

    let discountPercentage =
      formState.discount < 1 ? 1 : formState.discount / 100;

    let calculatedTotal = calculatedSubtotal * discountPercentage;

    setFormState("subTotal", calculatedSubtotal);
    setFormState("total", calculatedTotal);
  };

  React.useEffect(() => {
    fetchServices();
  }, []);

  React.useEffect(() => {
    handleCalculateTotal();
  }, [
    formState.services,
    formState.numberOfUsers,
    formState.discount,
    formState.paymentRecurrence,
  ]);

  return (
    <div className="container w-10/12">
      <div className="mt-10 mb-10 text-center">
        <h1 className="text-3xl font-bold">{data.title}</h1>
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
                        htmlFor="paymentRecurrence"
                      >
                        Payment Recurrance
                      </label>
                      <select
                        onChange={(e) =>
                          setFormState("paymentRecurrence", e.target.value)
                        }
                        value={formState.paymentRecurrence}
                        id="paymentRecurrence"
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      >
                        {Object.values(PAYMENT_RECURRENCE_OPTIONS).map(
                          (item) => (
                            <option value={item.id}>{item.id}</option>
                          )
                        )}
                      </select>
                      <p className="text-gray-600 text-xs italic">
                        Payment Recurrence for this subscription
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                    <div className="w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="numberOfUsers"
                      >
                        Number of Users
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
                          {formState.paymentRecurrence ===
                          PAYMENT_RECURRENCE_OPTIONS.monthly.id
                            ? PRICING_USER_PER_MONTH
                            : PRICING_USER_PER_MONTH *
                              PAYMENT_RECURRENCE_OPTIONS.yearly
                                .multiplicationFactor}{" "}
                          USD / User /{" "}
                          {formState.paymentRecurrence ===
                          PAYMENT_RECURRENCE_OPTIONS.monthly.id
                            ? "Month"
                            : "Year"}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs italic">
                        Number of users for this subscription
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-8/12 md:flex md:flex-nowrap md:flex-row md:items-start gap-2 px-3 mb-6 md:mb-0">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          onClick={
                            formState.services.indexOf(service.id) === -1
                              ? () => handleChooseService(service.id)
                              : () => handleRemoveService(service.id)
                          }
                          className={`mb-2 flex cursor-pointer border-2 ${
                            formState.services.indexOf(service.id) > -1
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
                                  {formState.paymentRecurrence ===
                                  PAYMENT_RECURRENCE_OPTIONS.monthly.id
                                    ? service.monthlyPrice
                                    : service.yearlyPrice}{" "}
                                </span>{" "}
                                <span className="text-gray-500">
                                  /{" "}
                                  {formState.paymentRecurrence ===
                                  PAYMENT_RECURRENCE_OPTIONS.monthly.id
                                    ? "Month"
                                    : "Year"}
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
                  <h6 className="text-black font-medium">Order summary</h6>
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
                    <p className="text-gray-400 ml-4">Subtotal</p>
                    <p className="text-black mr-4">${formState.subTotal}</p>
                  </div>
                  {formState.discount && (
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
                      <p className={`ml-4`}>Discount</p>
                      <p
                        className={`mr-4
                         ${formState.discount > 0 && "text-red-500"}
                         `}
                      >
                        {formState.discount}%
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
                    <p className="text-gray-400 ml-4">Total</p>
                    <p className="text-indigo-600 mr-4">
                      ${formState.total} Billed {formState.paymentRecurrence}
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
                    <a
                      target="_blank"
                      href={`/dashboard/subscriptions/create?services=${formState.services
                        .map((a) => JSON.stringify(a))
                        .join()}&numberOfUsers=${
                        formState.numberOfUsers
                      }&paymentRecurrence=${formState.paymentRecurrence}`}
                      className={`text-center w-full button  text-white px-2 py-2 rounded-md bg-indigo-600`}
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
