import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";

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

const InvoiceViewPage = () => {
  const router = useRouter();
  const invoiceId = router.query.id;
  const { user } = React.useContext(AuthContext);
  const { jwt, id: loggedInUserId, username } = user;

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
      <LayoutSidebar>
        <div class="container mt-5 mb-3">
          <div class="flex flex-wrap flex-row justify-center">
            <div class="md:w-2/3  bg-white rounded-xs">
              <div class="card">
                <div class="flex flex-row p-2 pr-4 pl-4">
                  <img src="https://i.imgur.com/vzlPPh3.png" width="48" />
                  <div class="flex flex-col">
                    <span class="font-bold">Invoice</span>{" "}
                    <small>INV-{invoice.id}</small>{" "}
                  </div>
                </div>
                <hr />
                <div class="block w-full overflow-auto scrolling-touch p-2 pr-4 pl-4">
                  <table class="w-full max-w-full mb-4 bg-transparent table-borderless">
                    <tbody>
                      <tr class="add">
                        <td>To</td>
                        <td>From</td>
                      </tr>
                      <tr class="content">
                        <td class="font-bold">
                          {username} <br />
                        </td>
                        <td class="font-bold">
                          Decart Group <br /> Amman, Jordan
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <hr />
                <div class="products p-2 pr-4 pl-4">
                  <table class="w-full max-w-full mb-4 bg-transparent table-borderless">
                    <tbody>
                      <tr class="add">
                        <td>Description</td>
                      </tr>
                      <tr class="content">
                        <td>Website Redesign</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <hr />
                <div class="products p-2 pr-4 pl-4">
                  <table class="w-full max-w-full mb-4 bg-transparent table-borderless">
                    <tbody>
                      <tr class="add">
                        <td></td>
                        <td>Subtotal</td>
                        <td>Discount(%)</td>
                        <td class="text-center">Total</td>
                      </tr>
                      <tr class="content">
                        <td></td>
                        <td>${invoice.subTotal}</td>
                        <td>{invoice.discount || 0}</td>
                        <td class="text-center">${invoice.subTotal}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* <hr />
                <div class="address p-2 pr-4 pl-4">
                  <table class="table table-borderless">
                    <tbody>
                      <tr class="add">
                        <td>Bank Details</td>
                      </tr>
                      <tr class="content">
                        <td>
                          {" "}
                          Bank Name : ADS BANK <br /> Swift Code : ADS1234Q{" "}
                          <br /> Account Holder : Jelly Pepper <br /> Account
                          Number : 5454542WQR <br />{" "}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </LayoutSidebar>
    </ProtectedRoute>
  );
};

export default InvoiceViewPage;
