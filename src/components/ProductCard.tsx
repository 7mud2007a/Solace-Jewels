import type { Product } from '../data/products';
import { ArrowUpRight, ShieldCheck, X } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-[#0B2B1B] rounded-2xl border border-[#133D28] overflow-hidden cursor-pointer transition-all duration-500 hover:border-[#D4AF37]/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#061D12]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B1B] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />

        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#061D12]/80 backdrop-blur-md border border-[#D4AF37]/30 text-[10px] font-sans-luxury tracking-widest text-[#E3C27E] uppercase">
          {product.karat}
        </span>
      </div>

      {/* Info Container */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <span className="font-sans-luxury text-[10px] tracking-[0.25em] text-[#E3C27E]/70 uppercase block mb-1">
            {product.category}
          </span>
          <h3 className="font-serif-luxury text-xl text-[#F5EBE1] group-hover:text-[#E3C27E] transition-colors duration-300 mb-2">
            {product.name}
          </h3>
          <p className="font-sans-luxury text-xs text-[#F5EBE1]/70 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        <div className="pt-4 border-t border-[#133D28] flex items-center justify-between">
          <span className="font-serif-luxury text-lg text-[#F5EBE1]">
            {product.formattedPrice}
          </span>
          <span className="p-2 rounded-full border border-[#D4AF37]/30 text-[#E3C27E] group-hover:bg-[#D4AF37] group-hover:text-[#061D12] transition-colors duration-300">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};

export const ProductModal = ({ product, onClose }: { product: Product | null; onClose: () => void }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#061D12]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0B2B1B] border border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#061D12]/80 text-[#E3C27E] hover:text-[#F5EBE1] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative aspect-square md:aspect-auto h-full bg-[#061D12]">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#E3C27E] text-xs font-sans-luxury tracking-widest uppercase mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Solace Atelier</span>
            </div>
            <h2 className="font-serif-luxury text-3xl text-[#F5EBE1] mb-2">{product.name}</h2>
            <p className="font-serif-luxury text-2xl text-[#E3C27E] mb-6">{product.formattedPrice}</p>
            <p className="font-sans-luxury text-sm text-[#F5EBE1]/80 leading-relaxed mb-6">
              {product.description}
            </p>
            <div className="p-4 rounded-xl bg-[#061D12] border border-[#133D28] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#E3C27E]/70">Purity Grade</span>
                <span className="text-[#F5EBE1] font-medium">{product.karat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E3C27E]/70">Craftsmanship</span>
                <span className="text-[#F5EBE1] font-medium">Hand-forged Atelier Spec</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#133D28]">
            <a
              href="#contact-section"
              onClick={onClose}
              className="block w-full py-3.5 text-center rounded-full bg-[#D4AF37] text-[#061D12] font-sans-luxury text-xs tracking-widest uppercase font-semibold hover:bg-[#F3E5AB] transition-colors"
            >
              INQUIRE WITH ATELIER
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
