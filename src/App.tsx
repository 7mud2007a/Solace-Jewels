import { Header } from './components/Header';
import { HeroWebGL } from './components/HeroWebGL';
import { CustomScrollSection } from './components/CustomScrollSection';
import { GoldPrices } from './components/GoldPrices';
import { ProductCollection } from './components/ProductCollection';
import { SocialMedia } from './components/SocialMedia';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="min-h-screen bg-[#061D12] text-[#F5EBE1] font-sans-luxury selection:bg-[#D4AF37] selection:text-[#061D12]">
      {/* 1. Header and navigation */}
      <Header />

      {/* 2. Hero section with WebGL experience matching reference image */}
      <HeroWebGL />

      {/* 3. An intentionally empty custom scroll section */}
      <CustomScrollSection />

      {/* 4. International gold prices section */}
      <GoldPrices />

      {/* 5. Editable collection of approximately 10 products */}
      <ProductCollection />

      {/* 6. Social media section */}
      <SocialMedia />

      {/* 7. Email contact form */}
      <ContactForm />

      {/* 8. Footer with copyright information */}
      <Footer />
    </div>
  );
}

export default App;
