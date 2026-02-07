import { redirect } from 'next/navigation';

/**
 * This page exists to satisfy Next.js static export requirements for the [id] dynamic segment.
 * The application primarily uses query parameters (e.g., /event?id=...) for data fetching.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  // We provide a dummy parameter to ensure the static exporter succeeds.
  return [{ id: 'view' }];
}

export default function EventIdPage() {
  // Redirect any legacy [id] paths to the query-param based /event page.
  redirect('/event');
}
