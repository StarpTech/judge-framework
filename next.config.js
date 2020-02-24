const isProduction = process.env.NODE_ENV !== "development";

module.exports = {
  assetPrefix: isProduction
    ? "http://starptech.de/judge-framework/"
    : undefined,
  poweredByHeader: false
};
