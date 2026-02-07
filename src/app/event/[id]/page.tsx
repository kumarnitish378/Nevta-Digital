
/**
 * This route is intended to be replaced by /event?id=... for static exports.
 * We provide generateStaticParams and dynamicParams = false to satisfy the 
 * 'output: export' requirement of Next.js during the build process.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return [];
}

export default function Page() {
  return null;
}
