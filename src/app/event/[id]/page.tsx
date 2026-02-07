import { redirect } from 'next/navigation';

/**
 * This page handles legacy or direct [id] paths by redirecting to the query-param based /event page.
 * We force dynamic rendering to ensure that Firebase App Hosting / Next.js standalone build
 * does not try to statically pre-render this route, which avoids build-time errors.
 */
export const dynamic = 'force-dynamic';

export default function EventIdPage() {
  redirect('/event');
}
