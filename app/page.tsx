import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import MorphEngine from "@/components/sections/MorphEngine";
import LiveTransformations from "@/components/sections/LiveTransformations";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import TheFuture from "@/components/sections/TheFuture";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative">
        <Hero />
        <Problem />
        <MorphEngine />
        <LiveTransformations />
        <HowItWorks />
        <Features />
        <TheFuture />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
