import GlassCleaningScene from '@/components/GlassCleaningScene';
import ServicesSection from '@/components/ServicesSection';
import BeforeAfter from '@/components/BeforeAfter';
import TrustSection from '@/components/TrustSection';
import ProcessTimeline from '@/components/ProcessTimeline';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      {/* 1. Cinematic Glass Cleaning Hero */}
      <GlassCleaningScene />

      {/* 2. Services Preview */}
      <ServicesSection />

      {/* 3. Before / After */}
      <BeforeAfter />

      {/* 4. Trust / Counters / Testimonials */}
      <TrustSection />

      {/* 5. Process Timeline */}
      <ProcessTimeline />

      {/* 6. CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </>
  );
}
