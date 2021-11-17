import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import AuthContext from "store/authContext";
import {
  ViewGridIcon,
  UsersIcon,
  CollectionIcon,
  DocumentReportIcon,
  MailIcon,
  InformationCircleIcon,
  TicketIcon,
} from "@heroicons/react/solid";
import { getStrapiMedia } from "utils/media";

const links = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: (props) => <ViewGridIcon className={props.classes} />,
  },
  {
    title: "Tickets/Technical",
    path: "/dashboard/support/technical",
    icon: (props) => <TicketIcon className={props.classes} />,
    acl: ["support"],
  },
  {
    title: "Tickets/Sales",
    path: "/dashboard/support/sales",
    icon: (props) => <TicketIcon className={props.classes} />,
    acl: ["support"],
  },
  {
    title: "My Customers",
    path: "/dashboard/customers",
    icon: (props) => <UsersIcon className={props.classes} />,
    acl: ["accountant", "partner"],
  },
  {
    title: "My Subscriptions",
    path: "/dashboard/subscriptions",
    icon: (props) => <CollectionIcon className={props.classes} />,
    acl: ["customer", "accountant", "partner"],
  },
  {
    title: "Invoices",
    path: "/dashboard/invoices",
    icon: (props) => <DocumentReportIcon className={props.classes} />,
    acl: ["customer", "accountant", "partner"],
  },
  {
    title: "Support Tickets",
    path: "/dashboard/tickets",
    icon: (props) => <MailIcon className={props.classes} />,
    acl: ["customer", "accountant", "partner"],
  },
  {
    title: "Knowledge Base",
    path: "/dashboard/knowledge-base",
    icon: (props) => <InformationCircleIcon className={props.classes} />,
    acl: ["customer", "accountant", "partner"],
  },
];

export default function LayoutSidebar({ children }) {
  const router = useRouter();
  const { user, logout } = React.useContext(AuthContext);
  const { username, accountType } = user;
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  const closeNotification = () => {
    setNotificationOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openDropdown = () => {
    setDropdownOpen(true);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Dark Overlay */}
      <div
        onClick={closeSidebar}
        className={`${
          sidebarOpen ? "block" : "hidden"
        } fixed z-20 inset-0 bg-black opacity-50 transition-opacity lg:hidden`}
      ></div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in"
        } bg-light-100 dark:bg-gray-900 fixed z-30 inset-y-0 left-0 w-full md:w-1/5 lg:w-1/6 transition duration-300 transform border-e border-gray-100 shadow-xl overflow-y-auto lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <img
              className="h-12"
              src={getStrapiMedia("erponelogo_54b888850f.png")}
            />

            {/* <span className="text-gray-500 dark:text-white text-opacity-75 text-3xl mx-2 font-semibold">
              Dashboard
            </span> */}
          </div>
        </div>

        <nav className="flex flex-col items-center mt-10">
          {links.map((link, index) => {
            return !link.acl || link.acl.indexOf(accountType) > -1 ? (
              <Link href={link.path} key={index}>
                <a
                  className={`group dark:bg-purple-200 dark:hover:bg-purple-300 transition-all ease-in rounded w-10/12 mt-4 py-4 px-6 flex ${
                    router.pathname.split("/").splice(1, 2).join("/") ===
                    link.path.split("/").splice(1).join("/")
                      ? "bg-purple-400 dark:bg-purple-700 dark:hover:bg-purple-900 text-white font-semibold shadow-xl"
                      : "hover:bg-purple-100 text-black"
                  }`}
                  href={link.path}
                >
                  {link.icon &&
                    link.icon({
                      classes: `h-6 w-6 ${
                        router.pathname.split("/").splice(1, 2).join("/") ===
                        link.path.split("/").splice(1).join("/")
                          ? "text-white"
                          : "text-purple-700"
                      }`,
                    })}

                  <span className="ms-3 group-hover:ms-4 transition-all">
                    {link.title}
                  </span>
                </a>
              </Link>
            ) : null;
          })}
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="flex justify-between items-center py-4 px-6 "
          style={{
            backgroundColor: "#EEF1F8",
          }}
        >
          <div className="flex items-center">
            <button
              onClick={openSidebar}
              className="text-gray-500 focus:outline-none lg:hidden"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6H20M4 12H20M4 18H11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>

            <div className="relative mx-4 lg:mx-0">
              <span className="text-gray-700 font-semibold uppercase me-2">
                Account type
              </span>
              <span className="text-primary-500 font-medium border border-dashed border-primary-500 rounded px-2">
                {user.accountType.charAt(0).toUpperCase() +
                  user.accountType.slice(1)}
              </span>
            </div>

            {/* <div className="relative mx-4 lg:mx-0">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </span>

              <input
                className="form-input w-32 sm:w-64 rounded-md pl-10 pr-4 focus:border-indigo-600"
                type="text"
                placeholder="Search"
              />
            </div> */}
          </div>

          <div className="flex items-center">
            {/* MODE TOGGLE */}
            {/* <div className="relative xs:me-2 me-4">
              <div className="flex flex-row space-x-2 max-w-5xl">
                <span className="hidden md:block text-sm text-gray-800">
                  Light
                </span>
                <input type="checkbox" id="toggleTheme" className="hidden" />
                <label htmlFor="toggleTheme">
                  <div className="toggle-background w-10 h-5 flex items-center bg-gray-300 rounded-full px-1 py-2">
                    <div className="transform duration-300 ease-in-out toggle-dot w-4 h-4 bg-white rounded-full shadow-md"></div>
                  </div>
                </label>
                <span className="hidden md:block text-sm text-gray-800">
                  Dark
                </span>
              </div>
            </div> */}

            {/* USER */}
            <div className="relative xs:me-2 sm:me-2 md:me-0">
              <div className="flex flex-row justify-between">
                <a
                  onClick={toggleDropdown}
                  className="relative flex flex-row items-center cursor-pointer"
                >
                  <div className="relative block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none me-2">
                    <img
                      className="h-full w-full object-contain bg-white border"
                      src={getStrapiMedia(
                        user.picture
                          ? user.picture.url
                          : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
                      )}
                      alt="Your avatar"
                    />
                  </div>
                  <b>{username}</b>
                </a>
              </div>

              <div
                onClick={closeDropdown}
                className="fixed inset-0 h-full w-full z-10"
                style={{ display: dropdownOpen ? "block" : "none" }}
              ></div>
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10"
                style={{ display: dropdownOpen ? "block" : "none" }}
              >
                <a
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
                >
                  My Account
                </a>
                <a
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white cursor-pointer"
                >
                  Logout
                </a>
              </div>
            </div>

            {/* NOTIFICATIONS */}
            <div className="relative">
              <button
                onClick={toggleNotification}
                className="flex ms-4 text-gray-600 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>

              <div
                onClick={closeNotification}
                className="fixed inset-0 h-full w-full z-10"
                style={{
                  display: notificationOpen ? "block" : "none",
                }}
              ></div>

              <div
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-10"
                style={{
                  display: notificationOpen ? "block" : "none",
                  widows: notificationOpen ? 200 : 0,
                }}
              >
                <a
                  href="#"
                  className="flex items-center px-4 py-3 text-gray-600 hover:text-white hover:bg-indigo-600 -mx-2"
                >
                  <p className="text-sm mx-2">
                    Your subscription{" "}
                    <span className="font-bold" href="#">
                      example.geekware.com
                    </span>{" "}
                    has ended, please pay your invoice.
                  </p>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-200">
          <div className="container max-w-full mx-auto px-8 py-8 ">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
