import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Statistics from "@/components/landing/Statistics";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Statistics />
      <CTA />
      <Footer />
    </main>
  );
}