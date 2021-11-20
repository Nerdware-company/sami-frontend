import ErrorPage from "next/error";
import { getPageData, fetchAPI, getGlobalData } from "utils/api";
import Sections from "@/components/sections";
import Seo from "@/components/elements/seo";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { getLocalizedPaths } from "utils/localize";
import Slider from "react-slick";

const TestingPage = ({ sections, metadata, preview, global, pageContext }) => {
  const router = useRouter();

  const settings = {
    // rtl: true,
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div dir="rtl" className="mt-10 text-center bg-gray-200 py-6">
      <Slider {...settings}>
        <div className="bg-white shadow-sm p-3 rounded-md ">
          <h1 className="text-xl font-bold marked-text">المطاعم والكافيهات</h1>
          <h3 className="leading-7 mt-2">
            نظام متكامل لنقاط البيع داخل المطاعم والكافيهات وربطه مع الحسابات ،
            تحديد صلاحيات العاملين
          </h3>
        </div>
      </Slider>
    </div>
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
