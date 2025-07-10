'use client';

import { usePathname } from 'next/navigation';
import ContactModalWrapper from './ContactModalWrapper';

export default function ConditionalContactModal() {
  const pathname = usePathname();
  const isManagementPage = pathname.startsWith('/management');

  if (isManagementPage) {
    return null;
  }

  return <ContactModalWrapper />;
} 