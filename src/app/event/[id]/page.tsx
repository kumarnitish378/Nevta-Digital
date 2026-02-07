
/**
 * Static placeholder to satisfy Next.js build requirements.
 * Actual event management happens at /event/ via query parameters.
 */
export function generateStaticParams() {
  return [{ id: 'details' }];
}

export default function EventIdPlaceholder() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-6">
        <h2 className="text-xl font-bold mb-2">Redirecting...</h2>
        <p className="text-muted-foreground">Please use the main event management dashboard.</p>
      </div>
    </div>
  );
}
