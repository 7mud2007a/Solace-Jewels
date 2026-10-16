import { SOCIAL_LINKS, type SocialLink } from '../data/socials';
import { Camera, Video, ArrowUpRight, Share2 } from 'lucide-react';

const renderSocialIcon = (iconType: SocialLink['icon']) => {
  switch (iconType) {
    case 'instagram':
      return <Share2 className="w-5 h-5" />;
    case 'pinterest':
      return <Camera className="w-5 h-5" />;
    case 'tiktok':
      return <Video className="w-5 h-5" />;
    default:
      return <Share2 className="w-5 h-5" />;
  }
};

export const SocialMedia = () => {
  return (
    <section id="social-section" className="py-20 px-6 md:px-12 bg-[#061D12] border-t border-[#133D28]">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-sans-luxury text-xs tracking-[0.3em] text-[#E3C27E] uppercase mb-3">
          Editorial & Visual Archive
        </p>
        <h2 className="font-serif-luxury text-3xl md:text-4xl text-[#F5EBE1] mb-12">
          Connect With Our Atelier
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow Solace Jewels on ${link.name}`}
              className="p-8 rounded-2xl bg-[#0B2B1B] border border-[#133D28] hover:border-[#D4AF37]/60 group transition-all duration-300 flex flex-col items-center justify-between"
            >
              <div className="p-4 rounded-full bg-[#061D12] text-[#E3C27E] group-hover:scale-110 transition-transform duration-300 mb-4">
                {renderSocialIcon(link.icon)}
              </div>
              <div>
                <h3 className="font-serif-luxury text-lg text-[#F5EBE1] mb-1">{link.name}</h3>
                <span className="font-sans-luxury text-xs text-[#E3C27E]/80 tracking-wider">
                  {link.handle}
                </span>
              </div>
              <div className="mt-6 flex items-center text-xs font-sans-luxury tracking-widest text-[#E3C27E] opacity-70 group-hover:opacity-100 transition-opacity">
                <span>VISIT ARCHIVE</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
