const withTM = require("next-transpile-modules")(["react-markdown"]);

module.exports = withTM({
  i18n: {
    locales: ["en", "ar"],
    defaultLocale: "en",
  },
});
