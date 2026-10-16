import { useState } from 'react';
import { PRODUCTS, type Product } from '../data/products';
import { ProductCard, ProductModal } from './ProductCard';

export const ProductCollection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section id="products-section" className="py-24 px-6 md:px-12 bg-[#061D12]">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-sans-luxury text-xs tracking-[0.3em] text-[#E3C27E] uppercase mb-3">
            Curated Showcase
          </p>
          <h2 className="font-serif-luxury text-3xl md:text-5xl font-normal tracking-wide text-[#F5EBE1]">
            High Jewelry Collection
          </h2>
          <div className="w-16 h-px bg-[#D4AF37]/40 mx-auto mt-6" />
        </div>

        {/* 10 Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>

        {/* Product Detail Modal */}
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </section>
  );
};
