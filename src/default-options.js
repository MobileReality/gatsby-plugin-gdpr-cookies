import { getDefaultConsentTagOptions } from "./helper"

export const defaultOptions = {
  environments: [`production`],
  googleConsent: {
    cookieNames: getDefaultConsentTagOptions(),
    waitForUpdate: 500,
  },
  googleAnalytics: {
    anonymize: true,
    allowAdFeatures: false,
  },
  googleTagManager: {
    dataLayerName: `dataLayer`,
    routeChangeEvent: `gatsbyRouteChange`,
  },
  facebookPixel: {
    cookieName: `gatsby-gdpr-facebook-pixel`,
  },
  tikTokPixel: {
    cookieName: `gatsby-gdpr-tiktok-pixel`,
  },
  hotjar: {
    cookieName: `gatsby-gdpr-hotjar`,
  },
  chatwoot: {
    cookieName: `gatsby-gdpr-chatwoot`,
  },
  linkedin: {
    cookieName: `gatsby-gdpr-linkedin`,
  },
  hubspot: {
    cookieName: `gatsby-gpdr-hubspot`,
  },
}
