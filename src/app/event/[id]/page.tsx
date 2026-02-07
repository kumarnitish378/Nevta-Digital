/**
 * Static export placeholder for dynamic [id] route.
 * Redirects or renders nothing if not built with specific IDs.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  // Return an empty array or pre-defined list of IDs if known.
  // For output: export, this must provide all possible segments or dynamicParams: false.
  return [];
}

export default function EventIdPage() {
  return null;
}