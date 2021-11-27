import classNames from "classnames";
import NextImage from "../elements/image";
import Video from "../elements/video";
import CustomLink from "../elements/custom-link";
import Slider from "react-slick";

const PictureCarouselGroup = ({ data }) => {
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
    <div className="bg-gray-100 py-12">
      <div className="container py-12">
        <h1 className="text-3xl font-bold text-center mb-4">{data.title}</h1>
        <h3 className="text-md text-center mb-12">{data.description}</h3>

        <div
          className="flex flex-col justify-start md:justify-between gap-10 lg:flex-row"
          style={{ height: 300 }}
        >
          {/* Text section */}
          <div
            dir="rtl"
            className="w-full text-center min-h-full"
            style={{ height: 300 }}
          >
            <Slider {...settings} className="min-h-full">
              {data.pictures.map((picture, index) => (
                <div
                  key={picture.id}
                  className="bg-white shadow-sm p-3 py-12 rounded-md min-h-full cursor-pointer"
                >
                  <h1 className="text-xl font-bold text-primary-600 mb-4">
                    {picture.title}
                  </h1>
                  <NextImage width="200" height="70" media={picture.media} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PictureCarouselGroup;
