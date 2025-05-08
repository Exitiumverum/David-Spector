'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Signature from './Signature';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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
    console.log('Navigating to:', href);
    router.push(href);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-sm' : 'bg-transparent'} ${isMenuOpen ? 'hidden' : 'block'}`}>
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div 
              onClick={() => handleNavigation('/')} 
              className="cursor-pointer"
            >
              <Signature />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`text-lg font-light transition-colors duration-300 cursor-pointer ${
                    pathname === item.href
                      ? 'text-yellow-600'
                      : 'text-gray-700 hover:text-yellow-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 text-gray-700 hover:text-yellow-600 transition-colors ${isMenuOpen ? 'hidden' : 'block'}`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-white z-40"
          >
            <div className="h-full flex flex-col">
              {/* Top Bar with Signature and Close Button */}
              <div className="flex justify-between items-center p-4">
                <div 
                  onClick={() => handleNavigation('/')} 
                  className="cursor-pointer"
                >
                  <Signature />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    console.log('Closing menu');
                    setIsMenuOpen(false);
                  }}
                  className="p-2 text-gray-700 hover:text-yellow-600 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 flex flex-col items-center justify-center gap-8">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`text-2xl font-light transition-colors duration-300 ${
                      pathname === item.href
                        ? 'text-yellow-600'
                        : 'text-gray-700 hover:text-yellow-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 