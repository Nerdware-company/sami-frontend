import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";

const CustomerListPage = () => {
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
      <LayoutSidebar>
        <div>
          <div className="flex flex-row justify-between">
            <h3 className="text-gray-700 text-3xl font-medium">
              Your Customers
            </h3>
            <a
              href="/dashboard/customers/create"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Create New Customer
            </a>
          </div>

          <div className="flex flex-col mt-8">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="align-middle inline-block min-w-full">
                {customers.length === 0 && (
                  <div className="text-sm text-center leading-5 font-medium text-gray-900">
                    You dont have any customers
                  </div>
                )}

                <div className="grid grid-flow-row grid-cols-4 gap-10">
                  {customers
                    .slice()
                    .sort((a, b) => b.id - a.id)
                    .map((item) => (
                      <div class="max-w-sm rounded-lg overflow-hidden shadow-lg mt-2 bg-white">
                        <div
                          class="relative z-10"
                          style={{
                            clipPath:
                              "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 5vw))",
                          }}
                        >
                          <img
                            class="w-full"
                            src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=880&q=80"
                            alt="Profile image"
                          />
                          <div
                            class="text-center absolute w-full"
                            style={{
                              bottom: "4rem",
                            }}
                          >
                            <p class="text-white tracking-wide uppercase text-lg font-bold">
                              {item.username}
                            </p>
                          </div>
                        </div>
                        <div class="pt pb-8 text-gray-600 text-center">
                          <p>{item.username} </p>
                          <p class="text-sm">{item.email}</p>
                        </div>

                        <div class="pb-10 uppercase text-center tracking-wide flex justify-around">
                          <a
                            href={`/dashboard/subscriptions/customer/${item.id}`}
                            class="p-4 text-white bg-primary-600 rounded-full hover:bg-primary-500 focus:bg-primary-700 transition ease-in duration-200 focus:outline-none"
                          >
                            View Subscriptions
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

export default CustomerListPage;
