const {
  initializeAndTrackGoogleAnalytics,
  initializeAndTrackGoogleTagManager,
  initializeAndTrackFacebookPixel,
  initializeAndTrackTikTokPixel,
  initializeAndTrackHotjar,
  initializeChatwoot,
  initializeLinkedin,
  initializeHubspot,
  initializeAndTrackGoogleTag,
} = require("./services");

const { isEnvironmentValid } = require("./helper");

exports.initializeAndTrack = (location) => {
  const options = window.gatsbyPluginGDPRCookiesOptions;

  if (isEnvironmentValid(options.environments)) {
    if (location === undefined || location === null) {
      console.error(
        "Please provide a reach router location to the initializeAndTrack function."
      );
    } else {
      initializeAndTrackGoogleAnalytics(
        options.googleAnalytics,
        options.googleConsent,
        location
      );
      initializeAndTrackGoogleTagManager(
        options.googleTagManager,
        options.googleConsent,
        location
      );
      initializeAndTrackGoogleTag(
        options.googleTag,
        options.googleConsent,
        location
      );
      initializeAndTrackFacebookPixel(options.facebookPixel);
      initializeAndTrackTikTokPixel(options.tikTokPixel);
      initializeAndTrackHotjar(options.hotjar);
      initializeChatwoot(options.chatwoot);
      initializeLinkedin(options.linkedin);
      initializeHubspot(options.hubspot);
    }
  }
};
