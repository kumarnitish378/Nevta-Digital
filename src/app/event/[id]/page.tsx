import { redirect } from 'next/navigation';

/**
 * Static placeholder for the [id] segment.
 * Satisfies 'output: export' while supporting query-param fallback.
 */
export function generateStaticParams() {
  return [{ id: 'details' }];
}

export default async function EventIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // We perform the redirect to the query-param version which is stable for static export.
  redirect(`/event/?id=${id}`);
}
