'use client';

import { useState, useEffect } from 'react';

/**
 * Detects mobile viewport (max-width: 768px).
 * Uses matchMedia for performance — no resize listener overhead.
 * SSR-safe: defaults to false on the server, hydrates on mount.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (e) => setIsMobile(e.matches);

    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
}
