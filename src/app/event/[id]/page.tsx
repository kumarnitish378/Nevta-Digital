import { redirect } from 'next/navigation';

/**
 * This page handles dynamic [id] paths by redirecting to the query-param based /event page.
 * We include generateStaticParams and force-dynamic to satisfy all possible build environments (Static vs App Hosting).
 */
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  // Return a dummy entry to satisfy the build process for static routes
  return [{ id: 'view' }];
}

export default function EventIdPage() {
  redirect('/event');
}
