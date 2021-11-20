import classNames from "classnames";
import NextImage from "../elements/image";
import Video from "../elements/video";
import CustomLink from "../elements/custom-link";

const FeatureGridGroup = ({ data }) => {
  return (
    <div className="bg-primary-500 py-12">
      <div className="container flex flex-col gap-12 py-12">
        <div className="flex flex-col justify-start md:justify-between gap-10 lg:flex-row">
          {/* Text section */}
          <div className="w-full lg:w-5/12 lg:pr-6 text-lg">
            <h3 className="title text-white">{data.title}</h3>
            <p className="my-6 text-2xl leading-9 text-white">
              {data.description}
            </p>
          </div>
          {/* Media section */}
          <div className="w-full sm:9/12 lg:w-6/12 max-h-full">
            <div className="w-full h-auto">
              <div className="grid grid-flow-row grid-cols-4 gap-x-5 gap-y-5">
                {data.features.map((feature, index) => (
                  <div
                    key={feature.id}
                    className="feature-grid-item flex flex-col items-center justify-center rounded-lg py-2 pt-3 px-4"
                  >
                    <NextImage media={feature.media} width="80" height="80" />
                    <span className="mt-2">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureGridGroup;
