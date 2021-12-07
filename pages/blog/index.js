import {
  getGlobalData,
  getPageData,
  getStrapiURL,
  getSystemSettings,
  getUITranslations,
} from "utils/api";
import Seo from "@/components/elements/seo";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import React from "react";
import HtmlParser from "react-html-parser";
import { getLocalizedPaths } from "utils/localize";
import { parseCookies } from "nookies";

const BlogListPage = ({ preview, global, pageContext }) => {
  const router = useRouter();
  const [posts, setPosts] = React.useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(getStrapiURL(`/posts`), {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const { status } = response;
      const responseJSON = await response.json();

      if (status == 200) {
        setPosts(responseJSON);
      } else {
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  // Loading screen (only possible in preview mode)
  if (router.isFallback) {
    return <div className="container">Loading...</div>;
  }

  return (
    <Layout global={global} pageContext={pageContext}>
      {/* Add meta tags for SEO*/}
      {/* Display content sections */}
      <div className="container py-12">
        <div className="grid xs:grid-cols-1: md:grid-cols-3 grid-flow-row gap-2 -mx-4 -mb-10 -mt-4">
          {posts.map((item) => (
            <a
              href={`/${global.locale}/blog/${item.id}`}
              className="p-4 md:mb-0 mb-6 flex flex-col justify-center items-center min-w-full max-w-sm mx-auto"
            >
              <div
                className="bg-gray-300 h-56 w-full rounded-lg shadow-md bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1521185496955-15097b20c5fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1951&q=80",
                }}
              ></div>

              <div className="min-w-full bg-white -mt-10 shadow-lg rounded-lg overflow-hidden p-5">
                <div className="title-post font-medium">{item.subject}</div>

                <div className="summary-post text-base text-justify">
                  {HtmlParser(
                    item.content.replace(/(<([^>]+)>)/gi, "").slice(0, 120)
                  )}
                  ...
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { params, locale, locales, defaultLocale, preview = null } = context;

  const globalLocale = await getGlobalData(locale);
  // Fetch pages. Include drafts if preview mode is on

  const pageContext = {
    locales,
    defaultLocale,
  };

  const systemSettings = await getSystemSettings();
  const translations = await getUITranslations(
    parseCookies(context).NEXT_LOCALE
  );

  return {
    props: {
      preview,
      global: globalLocale,
      translations: translations,
      system: systemSettings,
      pageContext: {
        ...pageContext,
      },
    },
  };
}

export default BlogListPage;
