export const dynamicParams = false;

export function generateStaticParams() {
  // Return an empty array to satisfy static export requirements
  // as we use query parameters (/event?id=...) for actual data fetching.
  return [];
}

export default function EventIdPage() {
  return null;
}
