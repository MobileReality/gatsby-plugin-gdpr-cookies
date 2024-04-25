const { GOOGLE_CONSENT_TAGS, COOKIE_CONSENT_COUNTRIES } = require(`./constants`)

exports.validGATrackingId = (options) =>
  options.trackingId && options.trackingId.trim() !== ``

exports.validGTMTrackingId = (options) =>
  options.trackingId && options.trackingId.trim() !== ``

exports.validFbPixelId = (options) =>
  options.pixelId && options.pixelId.trim() !== ``

exports.validTikTokPixelId = (options) =>
  options.pixelId && options.pixelId.trim() !== ``

exports.validHotjarId = (options) =>
  options.hjid &&
  options.hjid.trim() !== `` &&
  options.hjsv &&
  options.hjsv.trim() !== ``

exports.validChatwootConfig = (options) =>
  options.baseUrl &&
  options.baseUrl.trim() !== `` &&
  options.websiteToken &&
  options.websiteToken.trim() !== ``

exports.validLinkedinTrackingId = (options) =>
  options.trackingId && options.trackingId.trim() !== ``

exports.validHubspotTrackingId = (options) =>
  options.trackingId && options.trackingId.trim() !== ``

exports.validGTrackingId = (options) => options.trackingIds.length > 0

exports.getCookie = (name) => {
  const v = document.cookie.match(`(^|;) ?` + name + `=([^;]*)(;|$)`)
  return v ? v[2] : null
}

exports.isEnvironmentValid = (environments) => {
  const currentEnvironment =
    process.env.ENV || process.env.NODE_ENV || `development`
  return environments.includes(currentEnvironment)
}

exports.getGoogleConsentFromCookie = (consentOptions) => {
  return GOOGLE_CONSENT_TAGS.reduce((acc, tag) => {
    const camelCaseTag = tag.replace(/_(\w)/g, (_, p1) => p1.toUpperCase())

    const cookieName = consentOptions.cookieNames[camelCaseTag]
    const value =
      exports.getCookie(cookieName) === `true` ? `granted` : `denied`
    acc[tag] = value

    return acc
  }, {})
}

exports.setGoogleConsent = (consentOptions) => {
  if (
    typeof window.gtag === `function` &&
    window.googleConsentInitialized !== true
  ) {
    window.gtag(`consent`, `default`, {
      ...exports.getGoogleConsentFromCookie(consentOptions),
      security_storage: `granted`,
      region: COOKIE_CONSENT_COUNTRIES,
      wait_for_update: consentOptions.waitForUpdate,
    })

    window.gtag(`consent`, `default`, {
      ad_storage: `granted`,
      ad_user_data: `granted`,
      ad_personalization: `granted`,
      analytics_storage: `granted`,
      functionality_storage: `granted`,
      personalization_storage: `granted`,
      security_storage: `granted`,
      wait_for_update: consentOptions.waitForUpdate,
    })
    window.googleConsentInitialized = true
  }
}

exports.initializeGTagJS = (consentOptions) => {
  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer.push(arguments)
  }
  window.gtag(`js`, new Date())

  if (!window.isConsentInitialized) {
    window.isConsentInitialized = true
    exports.setGoogleConsent(consentOptions)
  }
}

exports.getDefaultConsentTagOptions = () => {
  return GOOGLE_CONSENT_TAGS.reduce((acc, tag) => {
    const kebabCaseTag = tag.replace(/_/g, `-`)
    const camelCaseTag = tag.replace(/_(\w)/g, (_, p1) => p1.toUpperCase())

    acc[camelCaseTag] = `gatsby-gdpr-google-${kebabCaseTag}`

    return acc
  }, {})
}
