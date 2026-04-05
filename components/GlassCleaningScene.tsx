'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GlassCleaningScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const dirtyLayerRef = useRef<HTMLDivElement>(null);
  const sprayRef = useRef<HTMLDivElement>(null);
  const cleanContentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    // ─── Canvas setup ───────────────────────────────────────────
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ─── Spray droplets state ────────────────────────────────────
    const droplets: {
      x: number; y: number; r: number; vx: number; vy: number; alpha: number;
    }[] = [];

    function generateDroplets() {
      droplets.length = 0;
      for (let i = 0; i < 120; i++) {
        droplets.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 3 + 1,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 3 + 1,
          alpha: Math.random() * 0.6 + 0.2,
        });
      }
    }
    generateDroplets();

    // ─── Wipe path state ─────────────────────────────────────────
    const wipeState = { progress: 0, sprayAlpha: 0 };

    // Organic bezier points for the wipe edge
    function getWipeEdge(progress: number, canvasW: number, canvasH: number) {
      const x = canvasW * progress;
      const amplitude = 24 + Math.sin(progress * Math.PI * 3) * 16;
      const pts: [number, number][] = [];
      const steps = 20;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const py = t * canvasH;
        const noise =
          Math.sin(t * 7.3 + progress * 5) * amplitude +
          Math.sin(t * 13.1 + progress * 9) * (amplitude * 0.4);
        pts.push([x + noise, py]);
      }
      return pts;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Spray droplets ────────────────────────────────────────
      if (wipeState.sprayAlpha > 0) {
        droplets.forEach((d) => {
          ctx.save();
          ctx.globalAlpha = d.alpha * wipeState.sprayAlpha;
          ctx.beginPath();
          ctx.ellipse(d.x, d.y, d.r * 1.4, d.r * 0.7, -0.3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(168, 220, 235, 0.9)';
          ctx.fill();
          // Tail
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - d.vx * 6, d.y - d.vy * 6);
          ctx.strokeStyle = 'rgba(168, 220, 235, 0.3)';
          ctx.lineWidth = d.r * 0.5;
          ctx.stroke();
          ctx.restore();
        });
      }

      // ── Wipe mask ─────────────────────────────────────────────
      if (wipeState.progress > 0) {
        const pts = getWipeEdge(wipeState.progress, canvas.width, canvas.height);

        // Dark gradient fade behind wipe
        const gradient = ctx.createLinearGradient(
          canvas.width * (wipeState.progress - 0.15), 0,
          canvas.width * wipeState.progress, 0
        );
        gradient.addColorStop(0, 'rgba(8,8,8,0)');
        gradient.addColorStop(0.6, 'rgba(8,8,8,0.3)');
        gradient.addColorStop(1, 'rgba(168,220,235,0.15)');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        pts.forEach(([px, py]) => ctx.lineTo(px, py));
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Wipe edge glow
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
          const [cx, cy] = pts[i];
          const [px, py] = pts[i - 1];
          ctx.quadraticCurveTo(px, py, (px + cx) / 2, (py + cy) / 2);
        }
        ctx.strokeStyle = `rgba(168, 220, 235, ${0.6 * wipeState.progress})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = 'rgba(168, 220, 235, 0.8)';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();

        // Water trail droplets at edge
        if (wipeState.progress > 0.05) {
          pts.forEach(([px, py], i) => {
            if (i % 3 === 0 && Math.random() > 0.6) {
              ctx.save();
              ctx.globalAlpha = 0.25 * wipeState.progress;
              ctx.beginPath();
              ctx.ellipse(px + 3, py + 5, 1.5, 2.5, 0.3, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(168, 220, 235, 0.8)';
              ctx.fill();
              ctx.restore();
            }
          });
        }
      }

      requestAnimationFrame(draw);
    }
    draw();

    // ─── GSAP ScrollTrigger timeline ─────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=350%',
        scrub: 1.2,
        pin: stickyRef.current,
        anticipatePin: 1,
      },
    });

    // Phase 1 (0-20%): Spray appears
    tl.to(wipeState, { sprayAlpha: 1, duration: 0.2, ease: 'power2.out' }, 0);
    tl.to(sprayRef.current, { opacity: 0.15, duration: 0.15 }, 0);

    // Phase 2 (20-80%): Wipe across
    tl.to(
      wipeState,
      { progress: 1, duration: 0.6, ease: 'power1.inOut' },
      0.2
    );

    // Phase 3 (50-80%): Fade spray
    tl.to(wipeState, { sprayAlpha: 0, duration: 0.2 }, 0.6);
    tl.to(sprayRef.current, { opacity: 0, duration: 0.15 }, 0.6);

    // Phase 4 (75-100%): Dirty layer fades, hero content reveals
    tl.to(dirtyLayerRef.current, { opacity: 0, duration: 0.2 }, 0.7);
    tl.to(canvas, { opacity: 0, duration: 0.15 }, 0.8);
    tl.to(cleanContentRef.current, { opacity: 1, duration: 0.2 }, 0.8);

    // Headline stagger
    tl.fromTo(
      headlineRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.25 },
      0.82
    );
    tl.fromTo(
      sublineRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.2 },
      0.88
    );
    tl.fromTo(
      ctaRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.18 },
      0.93
    );

    return () => {
      window.removeEventListener('resize', resize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: '450vh' }}>
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-obsidian"
      >
        {/* ─── Dirty glass layer ──────────────────────────────── */}
        <div
          ref={dirtyLayerRef}
          className="absolute inset-0 z-10"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 30%, rgba(180,160,130,0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(150,140,120,0.06) 0%, transparent 40%),
              linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 100%)
            `,
          }}
        >
          {/* Smudge textures */}
          {[
            { top: '15%', left: '25%', w: '18%', h: '4%', rot: '-8deg', op: 0.07 },
            { top: '45%', left: '55%', w: '22%', h: '3%', rot: '5deg', op: 0.06 },
            { top: '70%', left: '10%', w: '30%', h: '5%', rot: '-3deg', op: 0.08 },
            { top: '30%', left: '70%', w: '15%', h: '6%', rot: '12deg', op: 0.05 },
          ].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: s.top,
                left: s.left,
                width: s.w,
                height: s.h,
                transform: `rotate(${s.rot})`,
                background: `rgba(200,190,170,${s.op})`,
                filter: 'blur(8px)',
              }}
            />
          ))}

          {/* Grime overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(20,18,15,0.4) 0%, rgba(8,8,8,0.7) 100%)',
            }}
          />

          {/* Center text — "dirty" state */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p
              className="font-mono text-xs tracking-[0.5em] text-alabaster/15 uppercase mb-6"
              style={{ filter: 'blur(0.5px)' }}
            >
              Scroll to reveal
            </p>
            <h1
              className="font-display text-6xl md:text-8xl font-light text-center leading-none"
              style={{
                color: 'rgba(245,243,239,0.12)',
                filter: 'blur(1px)',
                letterSpacing: '0.05em',
              }}
            >
              CLEAN
              <br />
              VISION
            </h1>
            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-alabaster/20 to-transparent" />
              <svg className="w-5 h-5 text-alabaster/20 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* ─── Spray visual hint ──────────────────────────────── */}
        <div
          ref={sprayRef}
          className="absolute inset-0 z-20 opacity-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 30% 40%, rgba(168,220,235,0.12) 0%, transparent 60%)',
          }}
        />

        {/* ─── Canvas for wipe effect ─────────────────────────── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-30 pointer-events-none"
        />

        {/* ─── Clean content revealed ─────────────────────────── */}
        <div
          ref={cleanContentRef}
          className="absolute inset-0 z-20 opacity-0 flex flex-col items-center justify-center px-6"
        >
          {/* Background gradient for clean state */}
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/95 to-obsidian" />

          {/* Decorative orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-deep-teal/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-ice-blue/8 rounded-full blur-3xl" />

          <div className="relative z-10 text-center max-w-4xl">
            <p className="font-mono text-xs tracking-[0.5em] text-ice-blue/70 uppercase mb-6">
              Luxury Cleaning
            </p>
            <h1
              ref={headlineRef}
              className="font-display text-6xl md:text-8xl lg:text-9xl font-light leading-none mb-6"
              style={{ letterSpacing: '-0.02em' }}
            >
              <span className="gradient-text">Where Spaces</span>
              <br />
              <span className="text-alabaster italic">Become Art</span>
            </h1>
            <p
              ref={sublineRef}
              className="font-body text-lg text-alabaster/50 max-w-xl mx-auto leading-relaxed mb-10"
            >
              Immaculate environments crafted with precision, care, and an obsessive
              attention to every surface.
            </p>
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-ice-blue text-obsidian font-body text-sm font-medium tracking-widest uppercase hover:bg-deep-teal hover:text-alabaster transition-all duration-300"
              >
                Book Your Clean
              </a>
              <a
                href="/services"
                className="px-8 py-4 border border-alabaster/20 text-alabaster/70 font-body text-sm tracking-widest uppercase hover:border-ice-blue hover:text-ice-blue transition-all duration-300"
              >
                View Services
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="font-mono text-xs tracking-widest text-alabaster/30 uppercase">
              Explore
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-alabaster/30 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
