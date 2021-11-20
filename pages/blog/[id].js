import React from "react";
import { fetchAPI, getGlobalData, getStrapiURL } from "utils/api";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { getLocalizedPaths } from "utils/localize";
import Sections from "@/components/sections";
import moment from "moment";
import HtmlParser from "react-html-parser";

const BlogViewPage = ({ sections, metadata, preview, global, pageContext }) => {
  const router = useRouter();
  const [postData, setPostData] = React.useState({
    subject: "",
    content: "",
    picture: {},
    created_at: "",
  });

  const fetchPostData = async () => {
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
        setPostData(responseJSON[0]);
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  React.useEffect(() => {
    fetchPostData();
  }, []);

  // Loading screen (only possible in preview mode)
  if (router.isFallback) {
    return <div className="container">Loading...</div>;
  }

  return (
    <Layout global={global} pageContext={pageContext}>
      {/* Add meta tags for SEO*/}
      {/* <Seo metadata={metadata} /> */}
      {/* Display content sections */}
      <div className="container py-12">
        <div className="flex flex-col">
          <div className="w-12/12 px-10 my-4 py-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <span className="font-light text-gray-600">
                {moment(postData.created_at).format("MMMM Do YYYY")}
              </span>
            </div>
            <div className="mt-2">
              <h1
                className="text-2xl text-gray-700 font-bold hover:text-gray-600"
                href="#"
              >
                {postData.subject}
              </h1>
              <div className="mt-2 text-gray-600">
                {HtmlParser(postData.content, {
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
      </div>
    </Layout>
  );
};

export async function getStaticPaths(context) {
  // Get all posts from Strapi
  const allPosts = context.locales.map(async (locale) => {
    const localePosts = await fetchAPI(`/posts?_locale=${locale}`);
    return localePosts;
  });

  const posts = await (await Promise.all(allPosts)).flat();

  const paths = posts.map((post) => {
    // Decompose the slug that was saved in Strapi

    return {
      params: { id: `${post.id.toString()}` },
      // Specify the locale to render
      locale: post.locale,
    };
  });
  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const { params, locale, locales, defaultLocale, preview = null } = context;

  const globalLocale = await getGlobalData(locale);

  // We have the required page data, pass it to the page component

  const pageContext = {
    locales,
    defaultLocale,
  };

  const localizedPaths = getLocalizedPaths(pageContext);

  return {
    props: {
      preview,
      global: globalLocale,
      pageContext: {
        ...pageContext,
        localizedPaths,
      },
    },
  };
}

export default BlogViewPage;
