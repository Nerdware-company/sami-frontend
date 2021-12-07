import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import { getStrapiMedia } from "utils/media";

const InvoiceViewPage = ({ global, translations }) => {
  const router = useRouter();
  const invoiceId = router.query.id;
  const { user } = React.useContext(AuthContext);
  const { jwt, id: loggedInUserId, firstname, lastname, phoneNumber } = user;

  const [invoice, setInvoice] = React.useState({});

  const fetchInvoice = async () => {
    try {
      const response = await fetch(getStrapiURL(`/invoices/?id=${invoiceId}`), {
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
        setInvoice(responseJSON[0]);
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  React.useEffect(() => {
    fetchInvoice();
  }, []);

  if (!invoice?.id) return <div>Loading..</div>;
  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div className="container mt-5 mb-3">
          <div className="flex flex-wrap flex-row justify-center">
            <div className="md:w-1/3 bg-white border border-gray-400 rounded-xs">
              <div className="py-2">
                <div className="flex flex-row justify-between px-8 py-6">
                  <img
                    src={getStrapiMedia(global.Dashboard.logo.url)}
                    style={{
                      height: 40,
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="text-gray-400">
                      # {translations.invoice_number}
                    </span>{" "}
                    <small className="text-black font-bold">
                      INV-{invoice.id}
                    </small>
                  </div>
                </div>
                <hr className="text-gray-300" />
                <div className="block w-full overflow-auto scrolling-touch px-8 py-6">
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col justify-start items-start">
                      <span className="text-gray-400">{translations.from}</span>
                      <span className="text-black font-bold">Decart Group</span>
                    </div>
                    <div className="flex flex-col justify-center items-start">
                      <span className="text-gray-400">{translations.to}</span>
                      <span className="text-black font-bold">
                        {firstname} {lastname}
                      </span>
                    </div>
                  </div>
                </div>
                <hr className="text-gray-300" />
                <div className="products px-8 py-6">
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col justify-start items-start">
                      <span className="text-gray-400">
                        {translations.details}
                      </span>
                      <span className="text-black font-bold">
                        {translations.subscription_number_fees} #
                        {invoice.subscription.id}{" "}
                        {
                          translations[
                            invoice.subscription.paymentRecurrence?.toLowerCase()
                          ]
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <hr className="text-gray-300" />
                <div className="products px-8 py-6">
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col justify-start items-start">
                      <span className="text-gray-400">
                        {translations.period}
                      </span>
                      <span className="text-black font-bold">
                        {new Date(invoice.paidDate).toDateString()}-{" "}
                        {invoice.subscription.paymentRecurrence === "MONTHLY"
                          ? new Date(
                              new Date(invoice.paidDate).setDate(
                                new Date(invoice.paidDate).getDate() + 30
                              )
                            ).toDateString()
                          : new Date(
                              new Date(invoice.paidDate).setDate(
                                new Date(invoice.paidDate).getDate() + 365
                              )
                            ).toDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <hr className="text-gray-300" />
                <div className="products px-8 py-6">
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col justify-start items-start">
                      <span className="text-gray-400">
                        {translations.subtotal}
                      </span>
                      <span className="text-black font-bold">
                        ${invoice.subTotal}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center items-start">
                      <span className="text-gray-400">
                        {translations.discount} (%)
                      </span>
                      <span className="text-black font-bold">
                        {invoice.discount ? <>${invoice.discount}%</> : <>0%</>}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center items-start">
                      <span className="text-gray-400">
                        {translations.total}
                      </span>
                      <span className="text-black font-bold">
                        ${invoice.total}
                      </span>
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

export default InvoiceViewPage;
