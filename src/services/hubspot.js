const { validHubspotTrackingId, getCookie } = require("../helper");

exports.addHubspot = (options) => {
  return new Promise((resolve, reject) => {
    if (window.gatsbyPluginGDPRCookiesHubspotAdded) return resolve(true);

    const head = document.body;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "hs-script-loader";
    script.key = "gatsby-plugin-hubspot";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.gatsbyPluginGDPRCookiesHubspotAdded = true;
      resolve(true);
    };
    script.src = `//js.hs-scripts.com/${options.trackingId}.js`;

    head.appendChild(script);
  });
};

exports.initializeHubspot = (options) => {
  if (
    !window.gatsbyPluginGDPRCookiesHubspotInitialized &&
    getCookie(options.cookieName) === "true" &&
    validHubspotTrackingId(options)
  ) {
    window.gatsbyPluginGDPRCookiesHubspotInitialized = true;
  }
};
