import { redirect } from 'next/navigation';

/**
 * Static placeholder for the [id] segment.
 * This is a server component that only runs during build to satisfy Next.js routing.
 */
export function generateStaticParams() {
  return [{ id: 'details' }];
}

export default async function EventIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // We use a query-based pattern for actual app usage.
  // This redirect is safe as long as it points to a stable static page.
  redirect(`/event/?id=${id}`);
}
