import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import moment from "moment";
import { getStrapiMedia } from "utils/media";
import ReactHtmlParser from "react-html-parser";
import { parseCookies } from "nookies";

const FaqViewPage = ({ global, translations }) => {
  const router = useRouter();
  const faqId = router.query.id;
  const { user } = React.useContext(AuthContext);
  const { jwt, id, firstname, lastname, phoneNumber } = user;
  const [faqData, setFaqData] = React.useState({
    subject: "",
    content: "",
    created_at: "",
  });

  const fetchFaqData = async () => {
    let string = parseCookies().NEXT_LOCALE
      ? `&_locale=${parseCookies().NEXT_LOCALE}`
      : "";
    try {
      const response = await fetch(
        getStrapiURL(`/faqs/?id=${faqId}${string}`),
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
        setFaqData(responseJSON[0]);
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  React.useEffect(() => {
    fetchFaqData();
  }, []);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div>
          <div className="w-12/12 px-10 my-4 py-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <span className="font-light text-gray-600">
                {moment(faqData.created_at).format("MMMM Do YYYY")}
              </span>
              <div className="flex flex-row">
                {faqData.ftag &&
                  faqData.ftag.map((tag) => (
                    <p
                      className="px-2 py-1 bg-gray-600 text-gray-100 font-bold rounded hover:bg-gray-500 me-1"
                      href="#"
                    >
                      {tag.tname}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mt-2">
              <h1
                className="text-2xl text-gray-700 font-bold hover:text-gray-600"
                href="#"
              >
                {faqData.subject}
              </h1>
              <div className="mt-2 text-gray-600">
                {ReactHtmlParser(faqData.content, {
                  transform: (node) => {
                    if (node.name === "img") {
                      return (
                        <img
                          src={getStrapiMedia(
                            `/${node.attribs.src
                              .split("/")
                              .splice(node.attribs.src.split("../").length - 1)
                              .join("/")}`
                          )}
                        />
                      );
                    }
                  },
                })}
              </div>
            </div>
          </div>
        </div>
      </LayoutSidebar>
    </ProtectedRoute>
  );
};

export default FaqViewPage;
