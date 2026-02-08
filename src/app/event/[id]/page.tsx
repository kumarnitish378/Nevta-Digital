import { redirect } from 'next/navigation';

/**
 * Satisfies Next.js build requirements for static routes.
 * This route is handled via query params in the main app logic.
 */
export function generateStaticParams() {
  return [{ id: 'view' }];
}

export const dynamic = 'force-dynamic';

export default function EventIdPage() {
  redirect('/event');
}