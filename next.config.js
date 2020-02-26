const isProduction = process.env.NODE_ENV !== "development";

module.exports = {
  exportPathMap: () => ({
    "/": { page: "/" }
  }),
  assetPrefix: isProduction ? "/judge-framework" : "",
  poweredByHeader: false,
  env: {
    ROOT_PATH: isProduction ? "/judge-framework" : "/",
    DOMAIN: isProduction ? "http://starptech.de" : "http://localhost:3000"
  }
};
