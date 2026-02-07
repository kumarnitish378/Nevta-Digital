import { redirect } from 'next/navigation';

/**
 * This page handles legacy or direct [id] paths by redirecting to the query-param based /event page.
 * The application primarily uses /event?id=... for data fetching to ensure maximum compatibility.
 */

export default function EventIdPage() {
  redirect('/event');
}
