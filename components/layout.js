import React from "react";
import Navbar from "./elements/navbar";
import Footer from "./elements/footer";
import NotificationBanner from "./elements/notification-banner";
import Fab from "./elements/Fab";

const Layout = ({ children, global, pageContext }) => {
  const { navbar, footer, notificationBanner } = global;
  const [bannerIsShown, setBannerIsShown] = React.useState(true);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      {/* Aligned to the top */}
      <div className="flex-1">
        {/* {notificationBanner && bannerIsShown && (
          <NotificationBanner
            data={notificationBanner}
            closeSelf={() => setBannerIsShown(false)}
          />
        )} */}
        <Navbar navbar={navbar} pageContext={pageContext} />
        <div>{children}</div>
      </div>
      {/* Aligned to the bottom */}
      <Footer footer={footer} />
      <Fab />
    </div>
  );
};

export default Layout;
