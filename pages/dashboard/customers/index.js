import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import { getStrapiMedia } from "utils/media";

const CustomerListPage = ({ global, translations }) => {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const { jwt, id: loggedInUserId } = user;
  const [customers, setCustomers] = React.useState([]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        getStrapiURL(`/users/?partner.id=${loggedInUserId}`),
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
        setCustomers(responseJSON);
      } else {
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div>
          <div className="flex flex-row justify-between">
            <h3 className="text-gray-700 text-3xl font-medium">
              {translations.my_customers}
            </h3>
          </div>

          <div className="flex flex-col mt-8">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="align-middle inline-block min-w-full">
                {customers.length === 0 && (
                  <div className="text-sm text-center leading-5 font-medium text-gray-900">
                    {translations.you_dont_have_customers}
                  </div>
                )}

                <div className="grid grid-flow-row grid-cols-4 gap-10">
                  {customers
                    .slice()
                    .sort((a, b) => b.id - a.id)
                    .map((item) => (
                      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg mt-2 bg-white">
                        <div
                          className="relative z-10"
                          style={{
                            clipPath:
                              "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 5vw))",
                          }}
                        >
                          <img
                            className="w-full"
                            src={
                              item?.picture?.url
                                ? getStrapiMedia(item?.picture?.url)
                                : getStrapiMedia(
                                    global.Dashboard.defaultUserImage.url
                                  )
                            }
                            alt="Profile image"
                          />
                          <div
                            className="text-center absolute w-full"
                            style={{
                              bottom: "4rem",
                            }}
                          >
                            {/* <p className="text-white bg-gray-400 tracking-wide uppercase text-lg font-bold">
                              {item.firstname}
                            </p> */}
                          </div>
                        </div>
                        <div className="pt pb-8 text-gray-600 text-center">
                          <p>{item.firstname} </p>
                          <p className="text-sm">{item.email}</p>
                        </div>

                        <div className="pb-10 uppercase text-center tracking-wide flex justify-around">
                          <a
                            href={`/dashboard/subscriptions/customer/${item.id}`}
                            className="p-4 text-white bg-primary-600 rounded-full hover:bg-primary-500 focus:bg-primary-700 transition ease-in duration-200 focus:outline-none"
                          >
                            {translations.view_subscriptions}
                          </a>
                        </div>
                      </div>
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

export default CustomerListPage;
