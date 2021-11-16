import App from "next/app";
import Head from "next/head";
import ErrorPage from "next/error";
import Router from "next/router";
import { DefaultSeo } from "next-seo";
import { getStrapiMedia } from "utils/media";
import { getGlobalData } from "utils/api";
import { parseCookies } from "nookies";
import "@/styles/index.css";
// import "@tap-payments/gosell/dist/assets/css/notifications.css";
import { AuthContextProvider } from "store/authContext";
import React from "react";

const MyApp = ({ Component, pageProps }) => {
  // Extract the data we need
  const { global } = pageProps;
  if (global == null) {
    return <ErrorPage statusCode={404} />;
  }

  const { metadata } = global;

  return (
    <AuthContextProvider>
      {/* Favicon */}
      <Head>
        <link rel="shortcut icon" href={getStrapiMedia(global.favicon.url)} />
      </Head>
      {/* Global site metadata */}
      <DefaultSeo
        titleTemplate={`%s | ${global.metaTitleSuffix}`}
        title="Page"
        description={metadata.metaDescription}
        openGraph={{
          images: Object.values(metadata.shareImage.formats).map((image) => {
            return {
              url: getStrapiMedia(image.url),
              width: image.width,
              height: image.height,
            };
          }),
        }}
        twitter={{
          cardType: metadata.twitterCardType,
          handle: metadata.twitterUsername,
        }}
      />
      {/* Display the content */}
      <div
        // className="dark"
        dir={parseCookies().NEXT_LOCALE === "ar" ? "rtl" : "ltr"}
      >
        <Component {...pageProps} />
      </div>
    </AuthContextProvider>
  );
};

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So [[...slug]] pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949

// function redirectUser(ctx, location) {
//   ctx.res.writeHead(302, { Location: location });
//   ctx.res.end();
//   return {};
// }

MyApp.getInitialProps = async (appContext) => {
  // const { ctx } = appContext;
  // const jwt = parseCookies(ctx).jwt;

  // if (!jwt) {
  //   if (ctx.pathname === "/dashboard/register") {
  //     ctx.res.writeHead(307, { Location: "/dashboard/login" });
  //     ctx.res.end();
  //     return {};
  //   }
  // }

  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  const globalLocale = await getGlobalData(appContext.router.locale);

  return {
    ...appProps,
    pageProps: {
      global: globalLocale,
    },
  };
};

export default MyApp;
