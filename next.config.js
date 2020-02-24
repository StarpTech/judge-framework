const isProduction = process.env.NODE_ENV !== "development";

module.exports = {
  exportPathMap: () => ({
    "/": { page: "/" }
  }),
  assetPrefix: isProduction ? "/judge-framework" : "",
  poweredByHeader: false
};
