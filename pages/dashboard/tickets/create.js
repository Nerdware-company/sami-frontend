import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";

const TicketCreatePage = ({ global, translations }) => {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const { jwt, id, firstname, lastname, phoneNumber } = user;
  const [services, setServices] = React.useState([]);
  // Validation Consts
  const [errors, setErrors] = React.useState({
    subdomainExists: false,
  });

  const [formValues, setFormValues] = React.useState({
    user: id,
    subject: "",
    type: "technical",
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
    if (!formState.subject || !formState.type || !formState.message) {
      alert(translations.please_fill_all_fields);
      return;
    }
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

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div>
          <div className="flex flex-row justify-between">
            <h3 className="text-gray-700 text-3xl font-medium">
              {translations.create_ticket}
            </h3>
            <a
              onClick={handleSubmitData}
              className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {translations.create}
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
                            {translations.subject}
                          </label>
                          <div className="flex flex-row justify-between items-center">
                            <input
                              onChange={(e) =>
                                setFormState("subject", e.target.value)
                              }
                              name="subject"
                              id="subject"
                              type="text"
                              placeholder={translations.subject}
                              className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 me-2
                              ${errors.subdomainExists && "border-red-500"}
                              `}
                            />
                          </div>
                          <p className="text-gray-600 text-xs italic">
                            {translations.helper_subject_for_this_ticket}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="type"
                          >
                            {translations.type}
                          </label>
                          <select
                            onChange={(e) =>
                              setFormState("type", e.target.value)
                            }
                            value={formState.type}
                            id="type"
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          >
                            <option value="technical">
                              {translations.technical}
                            </option>
                            <option value="sales">{translations.sales}</option>
                          </select>
                          <p className="text-gray-600 text-xs italic">
                            {translations.helper_type_for_this_ticket}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap -mx-3 mb-6 max-w-lg">
                        <div className="w-full px-3">
                          <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="numberOfUsers"
                          >
                            {translations.message}
                          </label>
                          <div className="flex flex-row justify-between items-center">
                            <textarea
                              onChange={(e) =>
                                setFormState("message", e.target.value)
                              }
                              value={formState.message}
                              className={`appearance-none form-textarea block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                              rows="3"
                              placeholder={translations.message}
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

export default TicketCreatePage;
