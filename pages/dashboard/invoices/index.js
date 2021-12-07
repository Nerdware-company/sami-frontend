import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import Link from "next/link";

const InvoiceListPage = ({ global, translations }) => {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const { jwt, id: loggedInUserId, firstname, lastname, phoneNumber } = user;
  const [invoices, setInvoices] = React.useState([]);

  const fetchInvoices = async () => {
    let string = `[subscription.owner.id]=${loggedInUserId}&_where[_or][1][subscription.owner.partner.id]=${loggedInUserId}`;
    try {
      const response = await fetch(
        getStrapiURL(`/invoices?_where[_or][0]${string}`),
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
  }, []);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div className="flex flex-row justify-between">
          <h3 className="text-gray-700 text-3xl font-medium">
            {translations.invoices}
          </h3>
        </div>

        <div className="flex flex-col mt-8">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block min-w-full shadow overflow-x-hidden sm:rounded-lg border-b border-gray-200">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.invoice_number}
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.owner}
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.subdomain}
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.subtotal}
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.total}
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.period}
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {translations.status}
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {invoices.length === 0 && (
                    <tr>
                      <td
                        className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                        colSpan={12}
                      >
                        <div className="text-sm text-center leading-5 font-medium text-gray-900">
                          {translations.you_dont_have_invoices}
                        </div>
                      </td>
                    </tr>
                  )}
                  {invoices.map((item) => (
                    <tr key={item.id}>
                      <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                        {item.id}
                      </td>

                      <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                        {item.subscription.owner.firstname}{" "}
                        {item.subscription.owner.lastname}
                      </td>

                      <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                        {item.subscription.subdomain}
                      </td>

                      <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                        ${item.subTotal}&nbsp;
                      </td>

                      <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                        ${item.total}&nbsp;
                        {item.discount > 0 && (
                          <span className="text-xs text-red-500">
                            ({item.discount}%)
                          </span>
                        )}
                      </td>

                      <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                        {new Date(item.paidDate).toDateString()} -{" "}
                        {item.subscription.paymentRecurrence === "MONTHLY"
                          ? new Date(
                              new Date(item.paidDate).setDate(
                                new Date(item.paidDate).getDate() + 30
                              )
                            ).toDateString()
                          : new Date(
                              new Date(item.paidDate).setDate(
                                new Date(item.paidDate).getDate() + 365
                              )
                            ).toDateString()}
                      </td>

                      <td className="text-center px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        {item.status === "paid" ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {translations.paid}
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            {translations.pending}
                          </span>
                        )}
                      </td>

                      <td className="text-center px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                        <Link href={`/dashboard/invoices/${item.id}`}>
                          <a
                            href={`/dashboard/invoices/${item.id}`}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          >
                            {translations.view}
                          </a>
                        </Link>
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

export default InvoiceListPage;
