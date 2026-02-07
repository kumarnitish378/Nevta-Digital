"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * This page acts as a redirector to the static /event?id=... route.
 * It also provides generateStaticParams to satisfy the 'output: export' requirement.
 */

export function generateStaticParams() {
  // Return an empty array to allow the build to pass. 
  // Actual navigation is handled by /event?id=...
  return [];
}

export default function EventIdRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/event?id=${params.id}`);
    } else {
      router.replace('/dashboard');
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}