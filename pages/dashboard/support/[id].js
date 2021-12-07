import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import Router, { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import querystring from "querystring";
import axios from "axios";

const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || "";

const SupportTicketListPage = ({ global, translations }) => {
  const router = useRouter();
  const supportTypeId = capitalize(router.query.id);
  const { user } = React.useContext(AuthContext);
  const { jwt, id, firstname, lastname, phoneNumber } = user;
  const [subscriptions, setSubscriptions] = React.useState([]);

  const fetchTickets = async () => {
    try {
      const response = await fetch(
        getStrapiURL(`/tickets/?type=${supportTypeId}`),
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

  React.useEffect(() => {
    fetchTickets();
  }, [router.asPath]);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div>
          <div className="flex flex-row justify-between">
            <h3 className="text-gray-700 text-3xl font-medium">
              [{supportTypeId}] Support Tickets
            </h3>
          </div>

          <div className="flex flex-col mt-8">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Ticket Code
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Latest Reply
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
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
                            {translations.you_dont_have_tickets}
                          </div>
                        </td>
                      </tr>
                    )}
                    {subscriptions
                      .slice()
                      .sort((a, b) => b.id - a.id)
                      .map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <div className="text-sm leading-5 font-medium text-gray-900">
                              {item.code}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <div className="text-sm leading-5 font-medium text-gray-900">
                              {item.subject}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                            {item.type}
                          </td>

                          <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                            {item.replies[item.replies.length - 1].isAdmin
                              ? "You"
                              : "User"}
                          </td>

                          <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            {item.open ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Open
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Closed
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                            <a
                              href={`/dashboard/support/ticket/ticket-${item.code.toString()}`}
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </LayoutSidebar>
    </ProtectedRoute>
  );
};

export default SupportTicketListPage;
