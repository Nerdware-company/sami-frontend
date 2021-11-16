import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import querystring from "querystring";
import DropDownButton from "@/components/elements/dropDownButton";

const SubscriptionListPage = () => {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const { jwt, id: loggedInUserId, username } = user;
  const [subscriptions, setSubscriptions] = React.useState([]);
  // const tap = Tapjsli("pk_test_L9gp7txMN3kcPWUwny1oEj8Y");
  // const elements = tap.elements({});
  // const style = {
  //   base: {
  //     color: "#535353",
  //     lineHeight: "18px",
  //     fontFamily: "sans-serif",
  //     fontSmoothing: "antialiased",
  //     fontSize: "16px",
  //     "::placeholder": {
  //       color: "rgba(0, 0, 0, 0.26)",
  //       fontSize: "15px",
  //     },
  //   },
  //   invalid: {
  //     color: "red",
  //   },
  // };
  // // input labels/placeholders
  // const labels = {
  //   cardNumber: "Card Number",
  //   expirationDate: "MM/YY",
  //   cvv: "CVV",
  //   cardHolder: "Card Holder Name",
  // };
  // //payment options
  // const paymentOptions = {
  //   currencyCode: ["KWD", "USD", "SAR"],
  //   labels: labels,
  //   TextDirection: "ltr",
  // };
  // //create element, pass style and payment options
  // const card = elements.create("card", { style: style }, paymentOptions);

  const fetchSubscriptions = async () => {
    let string = `[owner.id]=${loggedInUserId}&_where[_or][1][partner.id]=${loggedInUserId}`;
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

  const handlePay = () => {
    goSell.config({
      gateway: {
        publicKey: "pk_test_L9gp7txMN3kcPWUwny1oEj8Y",
        merchantId: null,
        language: "en",
        contactInfo: true,
        supportedCurrencies: "all",
        supportedPaymentMethods: [
          "AMERICAN_EXPRESS",
          "MADA",
          "VISA",
          "MASTERCARD",
          "FAWRY",
        ],
        saveCardOption: false,
        customerCards: true,
        notifications: "standard",
        callback: (response) => {
          console.log("response", response);
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
        id: null,
        first_name: "First Name",
        middle_name: "Middle Name",
        last_name: "Last Name",
        email: "demo@email.com",
        phone: {
          country_code: "965",
          number: "99999999",
        },
      },
      order: {
        amount: 100,
        currency: "KWD",
        items: [
          {
            id: 1,
            name: "item1",
            description: "item1 desc",
            quantity: "1",
            amount_per_unit: "00.000",
            discount: {
              type: "P",
              value: "10%",
            },
            total_amount: "000.000",
          },
          {
            id: 2,
            name: "item2",
            description: "item2 desc",
            quantity: "2",
            amount_per_unit: "00.000",
            discount: {
              type: "P",
              value: "10%",
            },
            total_amount: "000.000",
          },
          {
            id: 3,
            name: "item3",
            description: "item3 desc",
            quantity: "1",
            amount_per_unit: "00.000",
            discount: {
              type: "P",
              value: "10%",
            },
            total_amount: "000.000",
          },
        ],
        shipping: null,
        taxes: null,
      },
      transaction: {
        mode: "charge",
        charge: {
          saveCard: false,
          threeDSecure: true,
          description: "Test Description",
          statement_descriptor: "Sample",
          reference: {
            transaction: "txn_0001",
            order: "ord_0001",
          },
          hashstring: "",
          metadata: {},
          receipt: {
            email: false,
            sms: true,
          },
          redirect: "http://localhost/redirect.html",
          post: null,
        },
      },
    });
    goSell.openLightBox();
  };

  React.useEffect(() => {
    fetchSubscriptions();
    // //mount element
    // card.mount("#element-container");
    // //card change event listener
    // card.addEventListener("change", function (event) {
    //   if (event.loaded) {
    //     console.log("UI loaded :" + event.loaded);
    //     console.log("current currency is :" + card.getCurrency());
    //   }
    //   var displayError = document.getElementById("error-handler");
    //   if (event.error) {
    //     displayError.textContent = event.error.message;
    //   } else {
    //     displayError.textContent = "";
    //   }
    // });
    // const form = document.getElementById("form-container");
    // form.addEventListener("submit", function (event) {
    //   event.preventDefault();

    //   tap.createToken(card).then(function (result) {
    //     console.log(result);
    //     if (result.error) {
    //       // Inform the user if there was an error
    //       var errorElement = document.getElementById("error-handler");
    //       errorElement.textContent = result.error.message;
    //     } else {
    //       // Send the token to your server
    //       var errorElement = document.getElementById("success");
    //       errorElement.style.display = "block";
    //       var tokenElement = document.getElementById("token");
    //       tokenElement.textContent = result.id;
    //       tapTokenHandler(token);
    //     }
    //   });
    // });
  }, []);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar>
        <div className="flex flex-row justify-between">
          <h3 className="text-gray-700 text-3xl font-medium">
            Your Subscriptions
          </h3>
          <a
            href="/dashboard/subscriptions/create"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Create
          </a>
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
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Subdomain
                    </th>
                    {/* <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Services
                      </th> */}
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Payment Recurrence
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                          You dont have any subscriptions
                        </div>
                      </td>
                    </tr>
                  )}
                  {subscriptions.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="text-sm leading-5 font-medium text-gray-900">
                          {item.owner.id === loggedInUserId ? (
                            "You"
                          ) : (
                            <a
                              href={`/customers/${item.owner.id}`}
                              className="text-blue-400 underline"
                            >
                              {item.owner.username}
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="text-sm leading-5 font-medium text-gray-900">
                          {item.subdomain}.geekware.com
                        </div>
                      </td>

                      {/* <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          <div className="grid grid-cols-2">
                            {item.services.map((service, i) => (
                              <div
                                key={`user-${item.id}-${service.id}`}
                                className={`flex flex-row  ${
                                  item.services.length > 1 &&
                                  i < item.services.length - 1 &&
                                  "me-1"
                                }`}
                              >
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 me-2">
                                    <img
                                      className="h-6 w-6 rounded-full"
                                      src={getStrapiURL(service.picture.url)}
                                      alt=""
                                    />
                                  </div>
                                  <div
                                    className={`text-sm leading-5 text-gray-900`}
                                  >
                                    {service.title}{" "}
                                    <span className="text-xs text-gray-400">
                                      (
                                      {item.paymentRecurrence === "YEARLY"
                                        ? service.yearlyPrice
                                        : service.monthlyPrice}{" "}
                                      USD)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td> */}

                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                        {item.total}&nbsp;USD&nbsp;
                        {item.discount > 0 && (
                          <span className="text-xs text-red-500">
                            ({item.discount}%)
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                        {item.paymentRecurrence}
                      </td>

                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        {item.active ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                        <a
                          href={`/dashboard/subscriptions/${item.id}`}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          View Subscription
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                        <DropDownButton
                          options={[
                            {
                              text: "Credit Card",
                              action: () => {
                                handlePay(item);
                              },
                            },
                            {
                              text: "Crypto Currency",
                              action: () => {},
                            },
                          ]}
                        />
                      </td>
                      {/* 
                        <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </a>
                        </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </LayoutSidebar>
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

export default SubscriptionListPage;
