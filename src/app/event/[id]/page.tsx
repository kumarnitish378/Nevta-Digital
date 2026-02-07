/**
 * This route is maintained only to satisfy the file structure during static export.
 * Navigation is handled via /event?id=...
 */

export function generateStaticParams() {
  // Provide a dummy param to satisfy the 'output: export' build requirement
  return [{ id: 'placeholder' }];
}

export default function EventIdPlaceholder() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Redirecting to event details...</p>
    </div>
  );
}
