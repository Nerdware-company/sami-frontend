import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";

const HomePage = ({ global, translations }) => {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const {
    jwt,
    id: loggedInUserId,
    firstname,
    lastname,
    phoneNumber,
    accountType,
  } = user;
  const [counts, setCounts] = React.useState({
    tickets: 0,
    subscriptions: 0,
    customers: 0,
    customersSubcriptions: 0,
  });
  const [subscriptions, setSubscriptions] = React.useState([]);
  const [tickets, setTickets] = React.useState([]);

  const fetchCountsUser = async () => {
    let totalTickets,
      totalSubscriptions,
      totalCustomers,
      totalCustomerSubscriptions = 0;
    try {
      const response = await fetch(
        getStrapiURL(`/tickets/count?user.id=${loggedInUserId}`),
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
        console.log(responseJSON);
        totalTickets = responseJSON;
      }
    } catch (error) {
      console.log("the error", error);
    }
    try {
      let string = `?owner.id=${loggedInUserId}`;
      const response = await fetch(
        getStrapiURL(`/subscriptions/count${string}`),
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
        console.log(responseJSON);
        totalSubscriptions = responseJSON;
      }
    } catch (error) {
      console.log("the error", error);
    }
    try {
      let string = `?_where[_or][1][partner.id]=${loggedInUserId}`;
      const response = await fetch(
        getStrapiURL(`/subscriptions/count${string}`),
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
        totalCustomerSubscriptions = responseJSON;
      }
    } catch (error) {
      console.log("the error", error);
    }

    try {
      const response = await fetch(
        getStrapiURL(`/users/count?partner.id=${loggedInUserId}`),
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
        totalCustomers = responseJSON;
      }
    } catch (error) {
      console.log("the error", error);
    }

    setCounts({
      ...counts,
      tickets: totalTickets,
      subscriptions: totalSubscriptions,
      customers: totalCustomers,
      customersSubcriptions: totalCustomerSubscriptions,
    });
  };

  const fetchCountsSupport = async () => {
    try {
      const response = await fetch(getStrapiURL(`/tickets/count`), {
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
        console.log(responseJSON);
        setCounts({ ...counts, tickets: responseJSON });
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const fetchSubscriptions = async () => {
    let string = `[owner.id]=${loggedInUserId}&_where[_or][1][owner.partner.id]=${loggedInUserId}`;
    try {
      const response = await fetch(
        getStrapiURL(`/subscriptions/?_where[_or][0]${string}`),
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
        setSubscriptions(responseJSON);
      } else {
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await fetch(getStrapiURL(`/tickets?user.id=${id}`), {
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
        setTickets(responseJSON);
      } else {
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  React.useEffect(() => {
    if (accountType === "support") {
      fetchCountsSupport();
    } else {
      fetchCountsUser();
      fetchSubscriptions();
      fetchTickets();
    }
  }, []);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div>
          <h3 className="text-gray-700 text-3xl font-medium">
            {translations.dashboard}
          </h3>
          <div className="mt-4">
            <div className="flex flex-wrap -mx-6 gap-y-3">
              {/* <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
                <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                  <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                    <svg
                      className="h-8 w-8 text-white"
                      viewBox="0 0 28 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fill="currentColor"></path>
                      <path
                        d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>

                  <div className="mx-5">
                    <h4 className="text-2xl font-semibold text-gray-700">
                      8,282
                    </h4>
                    <div className="text-gray-500">New Users</div>
                  </div>
                </div>
              </div> */}

              {(accountType === "partner" || accountType === "accountant") && (
                <>
                  <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                    <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                      <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                        <svg
                          className="h-8 w-8 text-white"
                          viewBox="0 0 28 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.19999 1.4C3.4268 1.4 2.79999 2.02681 2.79999 2.8C2.79999 3.57319 3.4268 4.2 4.19999 4.2H5.9069L6.33468 5.91114C6.33917 5.93092 6.34409 5.95055 6.34941 5.97001L8.24953 13.5705L6.99992 14.8201C5.23602 16.584 6.48528 19.6 8.97981 19.6H21C21.7731 19.6 22.4 18.9732 22.4 18.2C22.4 17.4268 21.7731 16.8 21 16.8H8.97983L10.3798 15.4H19.6C20.1303 15.4 20.615 15.1004 20.8521 14.6261L25.0521 6.22609C25.2691 5.79212 25.246 5.27673 24.991 4.86398C24.7357 4.45123 24.2852 4.2 23.8 4.2H8.79308L8.35818 2.46044C8.20238 1.83722 7.64241 1.4 6.99999 1.4H4.19999Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M22.4 23.1C22.4 24.2598 21.4598 25.2 20.3 25.2C19.1403 25.2 18.2 24.2598 18.2 23.1C18.2 21.9402 19.1403 21 20.3 21C21.4598 21 22.4 21.9402 22.4 23.1Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M9.1 25.2C10.2598 25.2 11.2 24.2598 11.2 23.1C11.2 21.9402 10.2598 21 9.1 21C7.9402 21 7 21.9402 7 23.1C7 24.2598 7.9402 25.2 9.1 25.2Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>

                      <div className="mx-5">
                        <h4 className="text-2xl font-semibold text-gray-700">
                          {counts.customers}
                        </h4>
                        <div className="text-gray-500">
                          {translations.my_customers}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                    <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                      <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                        <svg
                          className="h-8 w-8 text-white"
                          viewBox="0 0 28 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.19999 1.4C3.4268 1.4 2.79999 2.02681 2.79999 2.8C2.79999 3.57319 3.4268 4.2 4.19999 4.2H5.9069L6.33468 5.91114C6.33917 5.93092 6.34409 5.95055 6.34941 5.97001L8.24953 13.5705L6.99992 14.8201C5.23602 16.584 6.48528 19.6 8.97981 19.6H21C21.7731 19.6 22.4 18.9732 22.4 18.2C22.4 17.4268 21.7731 16.8 21 16.8H8.97983L10.3798 15.4H19.6C20.1303 15.4 20.615 15.1004 20.8521 14.6261L25.0521 6.22609C25.2691 5.79212 25.246 5.27673 24.991 4.86398C24.7357 4.45123 24.2852 4.2 23.8 4.2H8.79308L8.35818 2.46044C8.20238 1.83722 7.64241 1.4 6.99999 1.4H4.19999Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M22.4 23.1C22.4 24.2598 21.4598 25.2 20.3 25.2C19.1403 25.2 18.2 24.2598 18.2 23.1C18.2 21.9402 19.1403 21 20.3 21C21.4598 21 22.4 21.9402 22.4 23.1Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M9.1 25.2C10.2598 25.2 11.2 24.2598 11.2 23.1C11.2 21.9402 10.2598 21 9.1 21C7.9402 21 7 21.9402 7 23.1C7 24.2598 7.9402 25.2 9.1 25.2Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>

                      <div className="mx-5">
                        <h4 className="text-2xl font-semibold text-gray-700">
                          {counts.customersSubcriptions}
                        </h4>
                        <div className="text-gray-500">
                          {translations.my_customers_subscriptions}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
                <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                  <div className="p-3 rounded-full bg-pink-600 bg-opacity-75">
                    <svg
                      className="h-8 w-8 text-white"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.99998 11.2H21L22.4 23.8H5.59998L6.99998 11.2Z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      ></path>
                      <path
                        d="M9.79999 8.4C9.79999 6.08041 11.6804 4.2 14 4.2C16.3196 4.2 18.2 6.08041 18.2 8.4V12.6C18.2 14.9197 16.3196 16.8 14 16.8C11.6804 16.8 9.79999 14.9197 9.79999 12.6V8.4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      ></path>
                    </svg>
                  </div>

                  <div className="mx-5">
                    <h4 className="text-2xl font-semibold text-gray-700">
                      {counts.tickets}
                    </h4>
                    <div className="text-gray-500">
                      {translations.support_tickets}
                    </div>
                  </div>
                </div>
              </div>

              {accountType !== "support" && (
                <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                  <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                    <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                      <svg
                        className="h-8 w-8 text-white"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.19999 1.4C3.4268 1.4 2.79999 2.02681 2.79999 2.8C2.79999 3.57319 3.4268 4.2 4.19999 4.2H5.9069L6.33468 5.91114C6.33917 5.93092 6.34409 5.95055 6.34941 5.97001L8.24953 13.5705L6.99992 14.8201C5.23602 16.584 6.48528 19.6 8.97981 19.6H21C21.7731 19.6 22.4 18.9732 22.4 18.2C22.4 17.4268 21.7731 16.8 21 16.8H8.97983L10.3798 15.4H19.6C20.1303 15.4 20.615 15.1004 20.8521 14.6261L25.0521 6.22609C25.2691 5.79212 25.246 5.27673 24.991 4.86398C24.7357 4.45123 24.2852 4.2 23.8 4.2H8.79308L8.35818 2.46044C8.20238 1.83722 7.64241 1.4 6.99999 1.4H4.19999Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M22.4 23.1C22.4 24.2598 21.4598 25.2 20.3 25.2C19.1403 25.2 18.2 24.2598 18.2 23.1C18.2 21.9402 19.1403 21 20.3 21C21.4598 21 22.4 21.9402 22.4 23.1Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M9.1 25.2C10.2598 25.2 11.2 24.2598 11.2 23.1C11.2 21.9402 10.2598 21 9.1 21C7.9402 21 7 21.9402 7 23.1C7 24.2598 7.9402 25.2 9.1 25.2Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>

                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700">
                        {counts.subscriptions}
                      </h4>
                      <div className="text-gray-500">
                        {translations.my_subscriptions}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12"></div>

          {accountType !== "support" && (
            <div className="flex flex-wrap justify-start w-full xl:gap-x-8 gap-y-8">
              <div className="w-full xl:w-1/4 bgw">
                <h1 className="my-4 text-2xl">
                  {translations.due_payment_subscriptions}
                </h1>
                <div className="flex flex-col w-full">
                  <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50  text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              {translations.subdomain}
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50  text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              {translations.total}
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white">
                          {subscriptions.map((item) => {
                            let lastInvoice = item.invoices
                              .filter((invoice) => invoice.status === "paid")
                              .map(function (e) {
                                return e.paidDate;
                              })
                              .sort()
                              .reverse()[0];

                            let hasPaidInvoice =
                              item.invoices.filter(
                                (invoice) => invoice.status === "paid"
                              ).length > 0;

                            let lastPaidInvoiceDate = new Date(
                              lastInvoice
                            ).toDateString();

                            let nextPaymentDate =
                              item.paymentRecurrence === "MONTHLY"
                                ? new Date(
                                    new Date(lastInvoice).setDate(
                                      new Date(lastInvoice).getDate() + 30
                                    )
                                  )
                                : new Date(
                                    new Date(lastInvoice).setDate(
                                      new Date(lastInvoice).getDate() + 365
                                    )
                                  );
                            if (
                              !hasPaidInvoice ||
                              nextPaymentDate < Date.now()
                            ) {
                              return (
                                <tr>
                                  <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    <div className="text-sm leading-5 text-gray-900">
                                      {item.subdomain}
                                    </div>
                                  </td>

                                  <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    <div className="text-sm leading-5 text-gray-900">
                                      ${item.total}
                                    </div>
                                  </td>
                                </tr>
                              );
                            } else {
                              return null;
                            }
                          })}
                          {subscriptions.filter((item) => {
                            let lastInvoice = item.invoices
                              .filter((invoice) => invoice.status === "paid")
                              .map(function (e) {
                                return e.paidDate;
                              })
                              .sort()
                              .reverse()[0];
                            let hasPaidInvoice =
                              item.invoices.filter(
                                (invoice) => invoice.status === "paid"
                              ).length > 0;
                            let nextPaymentDate =
                              item.paymentRecurrence === "MONTHLY"
                                ? new Date(
                                    new Date(lastInvoice).setDate(
                                      new Date(lastInvoice).getDate() + 30
                                    )
                                  )
                                : new Date(
                                    new Date(lastInvoice).setDate(
                                      new Date(lastInvoice).getDate() + 365
                                    )
                                  );
                            return (
                              !hasPaidInvoice || nextPaymentDate < Date.now()
                            );
                          }).length === 0 && (
                            <tr>
                              <td
                                className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                                colSpan={12}
                              >
                                <div className="text-sm text-center leading-5 font-medium text-gray-900">
                                  {
                                    translations.you_dont_have_due_payment_subscriptions
                                  }
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full xl:w-1/4">
                <h1 className="my-4 text-2xl">
                  {translations.inactive_subscriptions}
                </h1>
                <div className="flex flex-col w-full">
                  <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50  text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              {translations.subdomain}
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white">
                          {subscriptions
                            .filter((item) => item.active === false)
                            .map((item) => (
                              <tr>
                                <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                  <div className="text-sm leading-5 text-gray-900">
                                    {item.subdomain}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          {subscriptions.filter((item) => item.active === false)
                            .length < 1 && (
                            <tr>
                              <td
                                className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                                colSpan={12}
                              >
                                <div className="text-sm text-center leading-5 font-medium text-gray-900">
                                  {
                                    translations.you_dont_have_inactive_subscriptions
                                  }
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full xl:w-1/4">
                <h1 className="my-4 text-2xl">
                  {translations.unreplied_tickets}
                </h1>
                <div className="flex flex-col w-full">
                  <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50  text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              {translations.ticket_number}
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white">
                          {tickets
                            .filter(
                              (item) =>
                                item.replies[item.replies.length - 1].isAdmin
                            )
                            .map((item) => (
                              <tr>
                                <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                  <div className="text-sm leading-5 text-gray-900">
                                    #{item.id}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          {tickets.filter(
                            (item) =>
                              item.replies[item.replies.length - 1].isAdmin
                          ).length < 1 && (
                            <tr>
                              <td
                                className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                                colSpan={12}
                              >
                                <div className="text-sm text-center leading-5 font-medium text-gray-900">
                                  {
                                    translations.you_dont_have_unreplied_messages
                                  }
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {accountType === "support" && (
            <div className="flex flex-wrap justify-start w-full xl:gap-x-8 gap-y-8">
              <div className="w-full xl:w-1/4">
                <h1 className="my-4 text-2xl">
                  {translations.unreplied_tickets}
                </h1>
                <div className="flex flex-col w-full">
                  <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50  text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                              {translations.ticket_number}
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white">
                          {tickets
                            .filter(
                              (item) =>
                                !item.replies[item.replies.length - 1].isAdmin
                            )
                            .map((item) => (
                              <tr>
                                <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                  <div className="text-sm leading-5 text-gray-900">
                                    #{item.id}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          {tickets.filter(
                            (item) =>
                              !item.replies[item.replies.length - 1].isAdmin
                          ).length < 1 && (
                            <tr>
                              <td
                                className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                                colSpan={12}
                              >
                                <div className="text-sm text-center leading-5 font-medium text-gray-900">
                                  {
                                    translations.you_dont_have_unreplied_messages
                                  }
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </LayoutSidebar>
    </ProtectedRoute>
  );
};

export default HomePage;
