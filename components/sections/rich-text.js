import PropTypes from "prop-types";
import HtmlParser from "react-html-parser";

const RichText = ({ data }) => {
  return (
    <div className="prose prose-lg container py-12">
      {HtmlParser(data.content)}
    </div>
  );
};

RichText.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string,
  }),
};

export default RichText;
