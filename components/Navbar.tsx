'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial reveal
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.5 }
    );

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-white/5 py-3'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden">
              <img src="/logo.png" alt="Amin Crystal Clean Logo" className="object-contain w-full h-full" />
            </div>
            <span className="font-display text-xl font-light tracking-[0.15em] text-alabaster uppercase">
              AMIN <span className="text-ice-blue">CRYSTAL CLEAN</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm tracking-widest text-alabaster/60 hover:text-ice-blue transition-colors duration-300 uppercase"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="px-5 py-2.5 text-xs tracking-widest uppercase font-medium border border-ice-blue/40 text-ice-blue hover:bg-ice-blue hover:text-obsidian transition-all duration-300 rounded-none"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-8 h-5 flex flex-col justify-between"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-px bg-alabaster transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2.5' : ''
              }`}
            />
            <span
              className={`block h-px bg-alabaster transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-px bg-alabaster transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2.5' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-obsidian flex flex-col items-center justify-center transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-4xl font-light text-alabaster hover:text-ice-blue transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-4 px-8 py-3 border border-ice-blue text-ice-blue font-body text-sm tracking-widest uppercase"
          >
            Book Now
          </Link>
        </div>
      </div>
    </>
  );
}
