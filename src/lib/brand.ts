/**
 * Central brand identity for FeruToys.
 * Import from here instead of hardcoding company details in components.
 */

export const brand = {
  name: "ferutoys",
  displayName: "FeruToys",
  domain: "ferutoys.com",
  url: "https://ferutoys.com",
  tagline: "Intimacy, beautifully considered.",
  description:
    "FeruToys — a tasteful intimacy boutique based in Estonia, shipping across Europe. Pleasure, wellness & self-care, lingerie, couples' essentials and considered gifting — chosen with care, shipped in discreet packaging, with secure and private checkout.",
  applicationName: "FeruToys",

  company: {
    legalName: "FERUTAX OÜ",
    number: "17559757",
    address: {
      line1: "Tornimäe tn 7",
      line2: "Kesklinna linnaosa",
      city: "Tallinn",
      region: "Harju maakond",
      postcode: "10145",
      country: "Estonia",
    },
  },

  contact: {
    email: "info@ferutoys.com",
    emailB2B: "info@ferutoys.com",
    // Empty until FERUTAX OÜ provides an Estonian support line — the UI hides
    // the phone row rather than showing a placeholder number.
    phone: "",
    phoneHref: "",
    contactPage: "/contact",
  },

  social: {
    linkedin: "https://www.linkedin.com/company/ferutoys/",
    instagram: "https://www.instagram.com/ferutoys/",
    twitter: "@ferutoys",
  },
} as const;

export const brandAddressLine = [
  brand.company.address.line1,
  brand.company.address.line2,
  brand.company.address.city,
  brand.company.address.region,
  brand.company.address.postcode,
  brand.company.address.country,
].join(", ");

export const brandLegalLine = `${brand.company.legalName} · Company number ${brand.company.number} · ${brandAddressLine}`;
