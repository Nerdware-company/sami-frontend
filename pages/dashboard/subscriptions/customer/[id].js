import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import querystring from "querystring";

const SubscriptionListPage = () => {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const { jwt, id: loggedInUserId, username } = user;
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

  const handlePay = async (subscription) => {
    const paymentData = {
      entityId: "8a8294174b7ecb28014b9699220015ca",
      amount: "92.00",
      currency: "EUR",
      paymentBrand: "VISA",
      paymentType: "DB",
      "card.number": "4200000000000000",
      "card.holder": "Jane Jones",
      "card.expiryMonth": "05",
      "card.expiryYear": "2034",
      "card.cvv": "123",
      "standingInstruction.mode": "INITIAL",
      "standingInstruction.type": "UNSCHEDULED",
      "standingInstruction.source": "CIT",
      createRegistration: "true",
    };
    try {
      const response = await fetch(
        "https://cors-anywhere.herokuapp.com/https://eu-test.oppwa.com:443/v1/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Bearer OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=",
          },
          body: querystring.stringify(paymentData),
        }
      );

      const { status } = response;
      const responseJSON = await response.json();
      return console.log(responseJSON);
      if (status == 200) {
        // router.push("/dashboard/subscriptions");
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  React.useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar>
        <div className="flex flex-row justify-between">
          <h3 className="text-gray-700 text-3xl font-medium">
            Customer Subscriptions
          </h3>
          <a
            href="/dashboard/subscriptions/create"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Create
          </a>
        </div>

        <div className="flex flex-col mt-8">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
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
                        <button
                          onClick={() => handlePay(item)}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Pay
                        </button>
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

export default SubscriptionListPage;
