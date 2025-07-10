'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  const isManagementPage = pathname.startsWith('/management');

  if (isManagementPage) {
    return null;
  }

  return <Navigation />;
} 