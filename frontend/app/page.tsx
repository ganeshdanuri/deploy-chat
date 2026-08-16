import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ChatLauncher from "./components/ChatLauncher";
import FeaturesSection from "./components/FeaturesSection";
import ConnectorsSection from "./components/ConnectorsSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

/* Server component. The registration handler lives in lib/openRegister so
   this page does not need to be a client component to pass it down. */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ConnectorsSection />
      <FAQSection />
      <CTASection />
      <Footer />
      <ChatLauncher />
    </main>
  );
}
