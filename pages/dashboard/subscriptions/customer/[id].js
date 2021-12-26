import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import querystring from "querystring";
import DropDownButton from "@/components/elements/dropDownButton";
import Link from "next/link";
import countries from "utils/countries";

const SubscriptionListPage = ({ global, translations }) => {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const { jwt, id: loggedInUserId } = user;
  const [subscriptions, setSubscriptions] = React.useState([]);

  const fetchSubscriptions = async () => {
    let string = `[owner.id]=${router.query.id}`;
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

  const handlePay = (itemToSell, typeOfPayment) => {
    let validUntill =
      itemToSell.paymentRecurrence === "MONTHLY"
        ? new Date(
            new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 30)
          ).getTime()
        : new Date(
            new Date(Date.now()).setDate(new Date(Date.now()).getDate() + 365)
          ).getTime();

    let serviceCodes = itemToSell.services
      .map((item) => item.service_code)
      .join(",");
    let serviceIds = itemToSell.services.map((item) => item.id).join(",");

    let extractedCountryCode = countries.filter(
      (item) => ~itemToSell.owner.phoneNumber.indexOf(item.dial_code)
    )[0].dial_code;

    let phoneNumberWithoutCountryCode = itemToSell.owner.phoneNumber.replace(
      extractedCountryCode,
      ""
    );

    let dataToSend = {
      // Quota Info
      type_of_payment: typeOfPayment,
      service_codes: serviceCodes,
      service_ids: serviceIds,
      valid_untill: validUntill,

      // Subscription Info
      id: itemToSell.id,
      subdomain: itemToSell.subdomain,
      company_name: itemToSell.title,
      subtotal: parseFloat(itemToSell.subTotal),
      discount: itemToSell.discount ? itemToSell.discount : 0,
      total: parseFloat(itemToSell.total),
      number_of_users: itemToSell.numberOfUsers,

      // Owner Info
      email: itemToSell.owner.email,
      first_name: itemToSell.owner.firstname,
      last_name: itemToSell.owner.lastname,
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
            name: `TOP1ERP Fees for subscription ID ${dataToSend.id}`,
            description: `Fees for subscription ID ${dataToSend.id}`,
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
          description: `Fees for subscription ID ${dataToSend.id}`,
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

  React.useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div className="flex flex-row justify-between">
          <h3 className="text-gray-700 text-3xl font-medium">
            {translations.my_subscriptions}
          </h3>
          <Link href="/dashboard/subscriptions/create">
            <a
              href="/dashboard/subscriptions/create"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {translations.create_new}
            </a>
          </Link>
        </div>

        {/* <form id="form-container" method="post" action="/charge">
          <div id="element-container"></div>
          <div id="error-handler" role="alert"></div>
          <div
            id="success"
            style={{
              display: "none",
              position: "relative",
              float: "left",
            }}
          >
            Success! Your token is <span id="token"></span>
          </div>
          <button id="tap-btn">Submit</button>
        </form> */}

        <div className="flex flex-col mt-8">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block min-w-full shadow overflow-x-hidden sm:rounded-lg border-b border-gray-200">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.owner}
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.subdomain}
                    </th>
                    {/* <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Services
                      </th> */}
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.total}
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.payment_recurrence}
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.status}
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.last_payment}
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.next_payment}
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {subscriptions.length === 0 && (
                    <tr>
                      <td
                        className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                        colSpan={12}
                      >
                        <div className="text-sm text-center leading-5 font-medium text-gray-900">
                          {translations.you_dont_have_subscriptions}
                        </div>
                      </td>
                    </tr>
                  )}
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
                    return (
                      <tr key={item.id}>
                        <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          <div className="text-sm leading-5 font-medium text-gray-900">
                            {item.owner.id === loggedInUserId ? (
                              "You"
                            ) : (
                              <>{item.owner.email}</>
                            )}
                          </div>
                        </td>

                        <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          <div className="text-sm leading-5 font-medium text-gray-900">
                            {item.subdomain}.top1erp.com
                          </div>
                        </td>

                        <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                          ${item.total}&nbsp;
                        </td>

                        <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                          {translations[item.paymentRecurrence?.toLowerCase()]}
                        </td>

                        <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {item.active ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Activated within 24hrs
                            </span>
                          )}
                        </td>

                        <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {hasPaidInvoice ? (
                            <>{lastPaidInvoiceDate}</>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Data Unavailable
                            </span>
                          )}
                        </td>

                        <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          {hasPaidInvoice ? (
                            <>{nextPaymentDate.toDateString()}</>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Data Unavailable
                            </span>
                          )}
                        </td>

                        <td className="flex flex-row justify-between text-center px-6 py-4 border-b border-gray-200 text-sm leading-5 font-medium">
                          <Link
                            href={`/dashboard/subscriptions/${item.id}/edit`}
                          >
                            <a
                              href={`/dashboard/subscriptions/${item.id}/edit`}
                              className="bg-yellow-300 hover:bg-yellow-400 me-2 text-white font-bold py-2 px-4 rounded"
                            >
                              <span>{translations.edit}</span>
                            </a>
                          </Link>
                          <Link href={`/dashboard/subscriptions/${item.id}`}>
                            <a
                              href={`/dashboard/subscriptions/${item.id}`}
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                              {translations.view}
                            </a>
                          </Link>
                        </td>
                        <td className="text-center px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                          {(nextPaymentDate < Date.now() || !lastInvoice) && (
                            <Link
                              href={`/dashboard/subscriptions/${item.id}/checkout`}
                            >
                              <a
                                href={`/dashboard/subscriptions/${item.id}/checkout`}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                              >
                                {translations.pay_subscription}
                              </a>
                            </Link>
                          )}{" "}
                          {/* {(nextPaymentDate < Date.now() || !lastInvoice) && (
                            <DropDownButton
                              buttonName={translations.pay_subscription}
                              options={[
                                {
                                  text: translations.credit_card,
                                  action: () => {
                                    handlePay(item);
                                  },
                                },
                                {
                                  text: translations.crypto_currency,
                                  action: () => {},
                                },
                                {
                                  text: translations.bank_transfer,
                                  action: () => {
                                    // handleCreateBankTransferInvoice(item);
                                  },
                                },
                              ]}
                            />
                          )} */}
                        </td>
                        {/* 
                          <td className="text-center px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </a>
                          </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </LayoutSidebar>
    </ProtectedRoute>
  );
};

export default SubscriptionListPage;
