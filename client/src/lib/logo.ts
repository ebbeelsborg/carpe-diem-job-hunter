/**
 * Extracts domain from a URL string
 * @param url - Full URL string
 * @returns Domain name without protocol or path
 */
function extractDomainFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Converts company name to a likely domain
 * @param companyName - Company name
 * @returns Best-guess domain name
 */
function companyNameToDomain(companyName: string): string {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '')
    .replace(/-+/g, '')
    + '.com';
}

/**
 * Generates a company logo URL using Clearbit's free Logo API
 * @param jobUrl - Optional job posting URL
 * @param companyName - Company name
 * @returns Logo URL from Clearbit
 */
export function getCompanyLogoUrl(jobUrl: string | undefined | null, companyName: string): string {
  let domain: string;

  if (jobUrl) {
    const extractedDomain = extractDomainFromUrl(jobUrl);
    if (extractedDomain) {
      domain = extractedDomain;
    } else {
      domain = companyNameToDomain(companyName);
    }
  } else {
    domain = companyNameToDomain(companyName);
  }

  return `https://logo.clearbit.com/${domain}?size=128`;
}
