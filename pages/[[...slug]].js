import ErrorPage from "next/error";
import { getPageData, fetchAPI, getGlobalData } from "utils/api";
import Sections from "@/components/sections";
import Seo from "@/components/elements/seo";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { getLocalizedPaths } from "utils/localize";

// The file is called [[...slug]].js because we're using Next's
// optional catch all routes feature. See the related docs:
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes

const DynamicPage = ({ sections, metadata, preview, global, pageContext }) => {
  const router = useRouter();

  // Check if the required data was provided
  if (!router.isFallback && !sections?.length) {
    return <ErrorPage statusCode={404} />;
  }

  // Loading screen (only possible in preview mode)
  if (router.isFallback) {
    return <div className="container">Loading...</div>;
  }

  return (
    <Layout global={global} pageContext={pageContext}>
      {/* Add meta tags for SEO*/}
      <Seo metadata={metadata} />
      {/* Display content sections */}
      <Sections sections={sections} preview={preview} />
    </Layout>
  );
};

export default DynamicPage;
