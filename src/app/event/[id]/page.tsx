import { redirect } from 'next/navigation';

/**
 * Static placeholder for the [id] segment.
 * Redirects to the search-param based event page to maintain 
 * compatibility with static exports.
 */
export function generateStaticParams() {
  return [{ id: 'details' }];
}

export default async function EventIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/event/?id=${id}`);
}
