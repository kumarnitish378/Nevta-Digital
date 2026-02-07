import { redirect } from 'next/navigation';

/**
 * This page handles legacy or direct [id] paths by redirecting to the query-param based /event page.
 * We force dynamic rendering to avoid build-time SSG errors in static-optimization environments.
 */
export const dynamic = 'force-dynamic';

export default function EventIdPage() {
  redirect('/event');
}
