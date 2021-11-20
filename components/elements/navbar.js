import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";

import { getButtonAppearance } from "utils/button";
import {
  mediaPropTypes,
  linkPropTypes,
  buttonLinkPropTypes,
} from "utils/types";
import { MdMenu } from "react-icons/md";
import MobileNavMenu from "./mobile-nav-menu";
import ButtonLink from "./button-link";
import NextImage from "./image";
import CustomLink from "./custom-link";
import LocaleSwitch from "../locale-switch";
import AuthContext from "store/authContext";

const Navbar = ({ navbar, pageContext }) => {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const [mobileMenuIsShown, setMobileMenuIsShown] = React.useState(false);
  const [navbarActive, setNavbarActive] = React.useState(true);

  // const handleSetNavbarActive = () => {
  //   if (window.scrollY >= 80) {
  //     return setNavbarActive(true);
  //   }
  //   setNavbarActive(false);
  // };

  // window.addEventListener("scroll", handleSetNavbarActive);

  return (
    <>
      {/* The actual navbar */}
      <nav
        className={`flex items-center sticky top-0 z-50 py-6 lg:h-20 sm:py-2 ${
          navbarActive
            ? `bg-white border-gray-200 border-b-2`
            : `bg-primary-500 border-primary-500 border-b-2`
        }`}
      >
        <div className="container flex flex-row items-center justify-between">
          {/* Content aligned to the left */}
          <div className="flex flex-row items-center">
            <Link href="/">
              <a className="h-12 w-32">
                <NextImage width="120" height="50" media={navbar.logo} />
              </a>
            </Link>
            {/* List of links on desktop */}
            <ul className="hidden list-none md:flex flex-row gap-4 items-baseline ms-10">
              {navbar.links.map((navLink) => (
                <li key={navLink.id}>
                  <CustomLink link={navLink} locale={router.locale}>
                    <div
                      className={`px-2 py-1 overflow-hidden ${
                        navbarActive
                          ? `text-gray-700 hover:text-gray-900 `
                          : `text-white font-bold`
                      }`}
                    >
                      {navLink.text}
                    </div>
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex">
            {/* Locale Switch Mobile */}
            {pageContext.localizedPaths && (
              <div className="md:hidden">
                <LocaleSwitch pageContext={pageContext} />
              </div>
            )}
            {/* Hamburger menu on mobile */}
            <button
              onClick={() => setMobileMenuIsShown(true)}
              className="p-1 block md:hidden"
            >
              <MdMenu className="h-8 w-auto" />
            </button>
            {/* CTA button on desktop */}
            {navbar.button && !user.id && (
              <div className="hidden md:block">
                <ButtonLink
                  button={navbar.button}
                  appearance={getButtonAppearance(navbar.button.type, "light")}
                  compact
                />
              </div>
            )}
            {user.id && (
              <div className="hidden md:block">
                <ButtonLink
                  button={{
                    newTab: true,
                    url: "/dashboard",
                    text: "Go to Dashboard",
                  }}
                  appearance={getButtonAppearance(navbar.button.type, "light")}
                  compact
                />
              </div>
            )}
            {/* Locale Switch Desktop */}
            {pageContext.localizedPaths && (
              <div className="hidden md:block">
                <LocaleSwitch pageContext={pageContext} />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile navigation menu panel */}
      {mobileMenuIsShown && (
        <MobileNavMenu
          navbar={navbar}
          closeSelf={() => setMobileMenuIsShown(false)}
        />
      )}
    </>
  );
};

Navbar.propTypes = {
  navbar: PropTypes.shape({
    logo: PropTypes.shape({
      image: mediaPropTypes,
      url: PropTypes.string,
    }),
    links: PropTypes.arrayOf(linkPropTypes),
    button: buttonLinkPropTypes,
  }),
  initialLocale: PropTypes.string,
};

export default Navbar;
