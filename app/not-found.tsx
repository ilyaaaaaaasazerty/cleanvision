import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs tracking-[0.5em] text-ice-blue/50 uppercase mb-6">404</p>
      <h1 className="font-display text-7xl md:text-9xl font-light text-alabaster mb-4 leading-none">
        Not Found
      </h1>
      <p className="font-body text-lg text-alabaster/30 mb-12 max-w-sm">
        This page doesn't exist — or has been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-4 border border-ice-blue/30 text-ice-blue font-mono text-xs tracking-widest uppercase hover:bg-ice-blue hover:text-obsidian transition-all duration-300"
      >
        Return Home
      </Link>
    </div>
  );
}
