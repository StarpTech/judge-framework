const isProduction = process.env.NODE_ENV !== "development";

module.exports = {
  exportPathMap: () => ({
    "/": { page: "/" }
  }),
  assetPrefix: "",
  poweredByHeader: false,
  env: {
    ROOT_PATH: "/",
    DOMAIN: isProduction ? "http://judge-framework.starptech.de" : "http://localhost:3000"
  }
};
