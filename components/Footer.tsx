import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  const links = {
    Services: [
      { label: 'Residential', href: '/services' },
      { label: 'Commercial', href: '/services' },
      { label: 'Post-Construction', href: '/services' },
      { label: 'Window & Glass', href: '/services' },
    ],
    Company: [
      { label: 'About', href: '#' },
      { label: 'Process', href: '#process' },
      { label: 'Book Now', href: '/contact' },
      { label: 'Admin', href: '/admin' },
    ],
    Contact: [
      { label: '+213 555 000 000', href: 'tel:+213555000000' },
      { label: 'info@amin-crystalclean.dz', href: 'mailto:info@amin-crystalclean.dz' },
      { label: 'Algiers, Algeria', href: '#' },
    ],
  };

  return (
    <footer className="bg-obsidian border-t border-white/5 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 font-display text-lg font-light tracking-[0.15em] text-alabaster uppercase">
              <div className="relative w-8 h-8 overflow-hidden">
                <img src="/logo.png" alt="Amin Crystal Clean Logo" className="object-contain w-full h-full" />
              </div>
              <span>AMIN <span className="text-ice-blue">CRYSTAL CLEAN</span></span>
            </Link>
            <p className="font-body text-sm text-alabaster/40 leading-relaxed max-w-xs mb-8">
              Where spaces become art. Premium cleaning services for those who
              demand nothing less than perfection.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Facebook', 'LinkedIn'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 glass border border-white/5 flex items-center justify-center text-alabaster/30 hover:text-ice-blue hover:border-ice-blue/30 transition-all duration-300 text-xs font-mono"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([col, items]) => (
            <div key={col}>
              <h4 className="font-mono text-xs tracking-[0.3em] uppercase text-ice-blue/60 mb-6">
                {col}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="font-body text-sm text-alabaster/40 hover:text-alabaster/80 transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-alabaster/25 tracking-wider">
            © {year} Amin Crystal Clean. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((link) => (
              <a
                key={link}
                href="#"
                className="font-mono text-xs text-alabaster/25 hover:text-alabaster/50 transition-colors duration-300 tracking-wider"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
