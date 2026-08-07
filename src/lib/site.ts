// Central place for site-wide constants used in metadata, sitemap.xml,
// robots.txt, and structured data. Set NEXT_PUBLIC_SITE_URL in your
// deployment environment (e.g. Vercel project settings) once you connect a
// custom domain — everything below picks it up automatically.
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "Stonebridge Finance";
export const SITE_TITLE = "Stonebridge Finance — Online Banking";
export const SITE_DESCRIPTION =
  "Open a checking or savings account in minutes, send money instantly with Zelle, and manage your money from one app with no hidden fees.";
