const isProduction = process.env.NODE_ENV !== "development";

module.exports = {
  assetPrefix: isProduction ? "/judge-framework" : undefined,
  poweredByHeader: false
};
