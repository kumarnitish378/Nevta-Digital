import { redirect } from 'next/navigation';

/**
 * Static placeholder for the [id] segment.
 * This satisfies the 'output: export' requirement by providing a fallback path.
 */
export function generateStaticParams() {
  return [{ id: 'details' }];
}

export default async function EventIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // We perform the redirect to the query-param version which is 100% static-safe.
  redirect(`/event/?id=${id}`);
}
