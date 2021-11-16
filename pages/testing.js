import ErrorPage from "next/error";
import { getPageData, fetchAPI, getGlobalData } from "utils/api";
import Sections from "@/components/sections";
import Seo from "@/components/elements/seo";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { getLocalizedPaths } from "utils/localize";

const TestingPage = ({ sections, metadata, preview, global, pageContext }) => {
  const router = useRouter();

  //   // Check if the required data was provided
  //   if (!router.isFallback && !sections?.length) {
  //     return <ErrorPage statusCode={404} />;
  //   }

  //   // Loading screen (only possible in preview mode)
  //   if (router.isFallback) {
  //     return <div className="container">Loading...</div>;
  //   }

  //   return <div>Hii</div>;

  return (
    <Layout global={global} pageContext={pageContext}>
      {/* Add meta tags for SEO*/}
      {/* Display content sections */}
      {/* <Sections sections={sections} preview={preview} /> */}
    </Layout>
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

export default TestingPage;
