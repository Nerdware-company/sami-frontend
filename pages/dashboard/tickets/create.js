import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";

const PRICING_USER_PER_MONTH = 5;

const TicketCreatePage = () => {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const { jwt, id, username } = user;
  const [services, setServices] = React.useState([]);
  // Validation Consts
  const [errors, setErrors] = React.useState({
    subdomainExists: false,
  });

  const [formValues, setFormValues] = React.useState({
    user: id,
    subject: "",
    type: "",
    message: "",
  });

  const formState = {
    ...formValues,
  };

  const setFormState = (name, value) => {
    setFormValues((old) => ({ ...old, [name]: value }));
  };
  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleSubmitData = async () => {
    const ticketCode = makeid(6);
    try {
      const response = await fetch(getStrapiURL(`/tickets`), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          code: ticketCode,
          user: formState.user,
          subject: formState.subject,
          type: formState.type,
          replies: [
            {
              __component: "useful.ticket-reply",
              isAdmin: false,
              message: formState.message,
              replyDate: Date.now(),
            },
          ],
        }),
      });

      const { status } = response;
      const responseJSON = await response.json();

      if (status == 200) {
        router.push(`/dashboard/tickets/ticket-${ticketCode}`);
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
          if (formState.paymentRecurrence === "YEARLY") {
            return partial_sum + arrayItem.yearlyPrice;
          } else {
            return partial_sum + arrayItem.monthlyPrice;
          }
        }, 0) +
      formState.numberOfUsers *
        (formState.paymentRecurrence === "YEARLY"
          ? PRICING_USER_PER_MONTH * 12
          : PRICING_USER_PER_MONTH);

    let discountPercentage =
      formState.discountPercentage < 1 ? 1 : formState.discountPercentage / 100;

    let calculatedTotal = calculatedSubtotal * discountPercentage;

    setFormState("subtotal", calculatedSubtotal);
    setFormState("total", calculatedTotal);
  };

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar>
        <div>
          <div className="flex flex-row justify-between">
            <h3 className="text-gray-700 text-3xl font-medium">
              Open new ticket
            </h3>
            <a
              onClick={handleSubmitData}
              className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Create
            </a>
          </div>

          <div className="flex flex-col mt-8">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 ">
              <div className="align-middle inline-block min-w-full overflow-hidden sm:rounded-lg border-b border-gray-200 py-5 px-5 bg-white shadow">
                <div className="w-full">
                  <div className="md:flex md:flex-wrap md:flex-row">
                    <div className="md:w-full">
                      <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="subject"
                          >
                            Subject
                          </label>
                          <div className="flex flex-row justify-between items-center">
                            <input
                              onChange={(e) =>
                                setFormState("subject", e.target.value)
                              }
                              name="subject"
                              id="subject"
                              type="text"
                              placeholder="Type ticket subject"
                              className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 me-2
                              ${errors.subdomainExists && "border-red-500"}
                              `}
                            />
                          </div>
                          <p className="text-gray-600 text-xs italic">
                            Subject for this ticket
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="type"
                          >
                            Ticket Type
                          </label>
                          <select
                            onChange={(e) =>
                              setFormState("type", e.target.value)
                            }
                            value={formState.type}
                            id="type"
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          >
                            <option value="Technical">Technical</option>
                            <option value="Sales">Sales</option>
                          </select>
                          <p className="text-gray-600 text-xs italic">
                            Type for this ticket
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="numberOfUsers"
                          >
                            Message
                          </label>
                          <div className="flex flex-row justify-between items-center">
                            <textarea
                              onChange={(e) =>
                                setFormState("message", e.target.value)
                              }
                              value={formState.message}
                              className={`appearance-none form-textarea block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                              rows="3"
                              placeholder="Type your reply"
                            ></textarea>
                          </div>
                        </div>
                      </div>
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

export default TicketCreatePage;
