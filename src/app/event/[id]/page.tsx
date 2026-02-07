/**
 * Static export placeholder for dynamic [id] route.
 * Redirects or renders nothing if not built with specific IDs.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  // Return an empty array to satisfy static export requirements
  // since we use query parameters (/event?id=...) for dynamic data.
  return [];
}

export default function EventIdPage() {
  return null;
}
