'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Signature from './Signature';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debug current pathname
  useEffect(() => {
    console.log('Current pathname:', pathname);
  }, [pathname]);

  const navItems = [
    { href: '/', label: 'בית' },
    { href: '/projects', label: 'פרויקטים' },
    { href: '/about', label: 'אודות' },
    { href: '/contact', label: 'צור קשר' },
  ];

  const handleNavigation = (href: string) => {
    console.log('Attempting to navigate to:', href);
    try {
      router.push(href);
      console.log('Navigation successful');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-sm' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div onClick={() => handleNavigation('/')} className="cursor-pointer">
            <Signature />
          </div>
          
          <div className="flex gap-8">
            {navItems.map((item) => (
              <div
                key={item.href}
                onClick={() => {
                  console.log('Nav item clicked:', item.href);
                  handleNavigation(item.href);
                }}
                className={`text-sm font-light transition-colors duration-300 cursor-pointer ${
                  pathname === item.href
                    ? 'text-yellow-600'
                    : 'text-gray-700 hover:text-yellow-600'
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
} 