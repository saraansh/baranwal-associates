'use client';

import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { Suspense, useEffect } from 'react';

const PostHogPageView = () => {
  const pathname = usePathname();
  const posthog = usePostHog();

  // Track pageviews without any searchParams to avoid static-to-dynamic conversion
  useEffect(() => {
    if (pathname && posthog) {
      // Only track the pathname, not search params to avoid the error
      const url = window.origin + pathname;

      posthog.capture('$pageview', { $current_url: url });
    }
  }, [pathname, posthog]);

  return null;
};

// Wrap this in Suspense to avoid any potential hydration issues
export const SuspendedPostHogPageView = () => {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
};
