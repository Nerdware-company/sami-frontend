import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import ReactHtmlParser from "react-html-parser";
import { parseCookies } from "nookies";

const FaqListPage = ({ global, translations }) => {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const { jwt, id, firstname, lastname, phoneNumber } = user;
  const [faqs, setFaqs] = React.useState([]);

  const fetchFaqs = async () => {
    let string = parseCookies().NEXT_LOCALE
      ? `?_locale=${parseCookies().NEXT_LOCALE}`
      : "";
    try {
      const response = await fetch(getStrapiURL(`/faqs${string}`), {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const { status } = response;
      const responseJSON = await response.json();

      if (status == 200) {
        setFaqs(responseJSON);
      } else {
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  React.useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div>
          <div className="flex flex-row justify-between">
            <h3 className="text-gray-700 text-3xl font-medium">
              {translations.knowledge_base}
            </h3>
          </div>

          <div className="flex flex-col mt-8">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="align-middle inline-block min-w-full overflow-hidden ">
                <div className="w-full md:w-12/12 grid grid-cols-4 grid-flow-row gap-4 px-3 mb-6 md:mb-0">
                  {faqs
                    .slice()
                    .sort((a, b) => b.id - a.id)
                    .map((item) => (
                      <a href={`/dashboard/knowledge-base/${item.id}`}>
                        <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
                          <div className="p-5">
                            <div className="flex flex-row">
                              {item.ftag &&
                                item.ftag.map((tag) => (
                                  <p
                                    key={tag.id}
                                    className="text-xs px-1 py-1 bg-gray-600 text-gray-100 font-bold rounded hover:bg-gray-500 me-1"
                                    href="#"
                                  >
                                    {tag.tname}
                                  </p>
                                ))}
                            </div>
                            <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">
                              {item.subject}
                            </h5>
                            <p className="font-normal text-gray-700 mb-3">
                              {ReactHtmlParser(
                                item.content
                                  .replace(/(<([^>]+)>)/gi, "")
                                  .slice(0, 120)
                              )}
                              ...
                            </p>
                            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center">
                              {translations.read_more}
                            </button>
                          </div>
                        </div>
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutSidebar>
    </ProtectedRoute>
  );
};

export default FaqListPage;
