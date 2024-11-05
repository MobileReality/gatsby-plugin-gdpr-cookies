const { validGTrackingId, getCookie, initializeGTagJS } = require("../helper");
import { Minimatch } from "minimatch";

exports.addGoogleTag = (options) => {
  return new Promise((resolve, reject) => {
    if (window.gatsbyPluginGDPRCookiesGoogleTagAdded) return resolve(true);

    const pluginConfig = options.pluginConfig || {};

    const origin = pluginConfig.origin || "https://www.googletagmanager.com";

    const head = document.getElementsByTagName("head")[0];

    const link = document.createElement("link");
    link.rel = "preconnect";
    link.key = "preconnect-google-gtag";
    link.href = origin;

    const link2 = document.createElement("link");
    link2.rel = "dns-prefetch";
    link2.key = "dns-prefetch-google-gtag";
    link2.href = origin;

    const firstTrackingId =
      options.trackingIds && options.trackingIds.length
        ? options.trackingIds[0]
        : "";

    const script = document.createElement("script");
    script.key = "gatsby-plugin-google-gtag";
    script.async = true;

    script.onload = () => {
      window.gatsbyPluginGDPRCookiesGoogleTagAdded = true;
      resolve(true);
    };

    script.src = `${origin}/gtag/js?id=${firstTrackingId}`;

    head.appendChild(link);
    head.appendChild(link2);
    head.appendChild(script);
  });
};

exports.initializeGoogleTag = (options, consentOptions) => {
  if (
    !window.gatsbyPluginGDPRCookiesGoogleTagInitialized &&
    validGTrackingId(options)
  ) {
    const gtagConfig = options.gtagConfig || {};
    const pluginConfig = options.pluginConfig || {};

    // Prevent duplicate or excluded pageview events being emitted on initial load of page by the `config` command
    // https://developers.google.com/analytics/devguides/collection/gtagjs/#disable_pageview_tracking

    gtagConfig.send_page_view = false;

    const excludeGtagPaths = [];

    // (function(){
    if (typeof pluginConfig.exclude !== "undefined") {
      pluginConfig.exclude.map((exclude) => {
        const mm = new Minimatch(exclude);
        excludeGtagPaths.push(mm.makeRe());
      });
    }

    const firstTrackingId =
      options.trackingIds && options.trackingIds.length
        ? options.trackingIds[0]
        : "";

    const restTrackingIds = options.trackingIds.slice(1);

    const renderHtml = () => `
      ${
        excludeGtagPaths.length
          ? `window.excludeGtagPaths=[${excludeGtagPaths.join(",")}];`
          : ""
      }
      ${
        typeof gtagConfig.anonymize_ip !== "undefined" &&
        gtagConfig.anonymize_ip === true
          ? `function gaOptout(){document.cookie=disableStr+'=true; expires=Thu, 31 Dec 2099 23:59:59 UTC;path=/',window[disableStr]=!0}var gaProperty='${firstTrackingId}',disableStr='ga-disable-'+gaProperty;document.cookie.indexOf(disableStr+'=true')>-1&&(window[disableStr]=!0);`
          : ""
      }
      if(${
        pluginConfig.respectDNT
          ? '!(navigator.doNotTrack == "1" || window.doNotTrack == "1")'
          : "true"
      }) {
        ${initializeGTagJS(consentOptions)}
        ${restTrackingIds
          .map(
            (trackingId) =>
              `window.gtag('config', '${trackingId}', ${JSON.stringify(
                gtagConfig
              )});`
          )
          .join("")}
      }
      `;

    const script = document.createElement("script");
    script.key = "gatsby-plugin-google-gtag-config";
    script.innerHTML = renderHtml();
    const head = document.getElementsByTagName("head")[0];
    head.appendChild(script);

    window.gatsbyPluginGDPRCookiesGoogleTagInitialized = true;
  }
};

exports.trackGoogleTag = (options, location) => {
  if (
    !window.gatsbyPluginGDPRCookiesGoogleTagInitialized &&
    getCookie(options.cookieName) === "true" &&
    validGTrackingId(options)
  ) {
    const pathIsExcluded =
      location &&
      typeof window.excludeGtagPaths !== "undefined" &&
      window.excludeGtagPaths.some((rx) => rx.test(location.pathname));

    if (pathIsExcluded) return null;

    // wrap inside a timeout to make sure react-helmet is done with its changes (https://github.com/gatsbyjs/gatsby/issues/11592)
    const sendPageView = () => {
      const pagePath = location
        ? location.pathname + location.search + location.hash
        : undefined;
      window.gtag("event", "page_view", { page_path: pagePath });
    };

    if ("requestAnimationFrame" in window) {
      requestAnimationFrame(() => {
        requestAnimationFrame(sendPageView);
      });
    } else {
      // simulate 2 rAF calls
      setTimeout(sendPageView, 32);
    }
  }
};
