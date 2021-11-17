import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";

const InvoiceListPage = () => {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const { jwt, id: loggedInUserId, username } = user;
  const [invoices, setInvoices] = React.useState([]);

  const fetchInvoices = async () => {
    let string = `[subscription.owner.id]=${loggedInUserId}&_where[_or][1][subscription.partner.id]=${loggedInUserId}`;
    try {
      const response = await fetch(
        getStrapiURL(`/invoices/?_where[_or][0]${string}`),
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
        setInvoices(responseJSON);
      } else {
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  React.useEffect(() => {
    fetchInvoices();
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
          <h3 className="text-gray-700 text-3xl font-medium">Your Invoices</h3>
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
                      Invoice #
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Subdomain
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {invoices.length === 0 && (
                    <tr>
                      <td
                        className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                        colSpan={12}
                      >
                        <div className="text-sm text-center leading-5 font-medium text-gray-900">
                          You dont have any invoices
                        </div>
                      </td>
                    </tr>
                  )}
                  {invoices.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                        {item.id}
                      </td>

                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                        {item.subscription.owner.username}
                      </td>

                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                        {item.subscription.subdomain}
                      </td>

                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                        {item.subTotal}&nbsp;USD&nbsp;
                      </td>

                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                        {item.total}&nbsp;USD&nbsp;
                        {item.discount > 0 && (
                          <span className="text-xs text-red-500">
                            ({item.discount}%)
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        {item.status === "paid" ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Paid
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Unpaid
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                        <a
                          href={`/dashboard/invoices/${item.id}`}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          View Invoice
                        </a>
                      </td>
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

export default InvoiceListPage;
