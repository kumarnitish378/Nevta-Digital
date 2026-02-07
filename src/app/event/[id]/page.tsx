
/**
 * Static placeholder for dynamic route.
 * Real navigation happens via /event/?id=...
 */
export function generateStaticParams() {
  return [{ id: 'details' }];
}

export default function EventIdPlaceholder() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
