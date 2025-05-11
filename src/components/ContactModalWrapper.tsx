'use client';

import ContactModal from "@/components/ContactModal";
import { usePathname } from "next/navigation";

export default function ContactModalWrapper() {
  const pathname = usePathname();
  if (pathname === "/contact") return null;
  return <ContactModal />;
} 