"use client";

const brands = [
  { name: "ASUS", slug: "asus", color: "#00539B" },
  { name: "CORSAIR", slug: "corsair", color: "#E5C158" },
  { name: "INTEL", slug: "intel", color: "#0068B5" },
  { name: "AMD", slug: "amd", color: "#ED1C24" },
  { name: "NVIDIA", slug: "nvidia", color: "#76B900" },
  { name: "RAZER", slug: "razer", color: "#00FF00" },
  { name: "SAMSUNG", slug: "samsung", color: "#1428A0" },
  { name: "DELL", slug: "dell", color: "#007DB8" },
  { name: "HP", slug: "hp", color: "#0096D6" },
  { name: "LENOVO", slug: "lenovo", color: "#E2231A" },
  { name: "APPLE", slug: "apple", color: "#555555" }
];

export default function BrandMarquee() {
  return (
    <div className="bg-transparent py-10 overflow-hidden relative flex items-center mt-4 mb-16">
      {/* Fading edges for smooth enter/exit */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex w-max animate-marquee">
        {/* We duplicate the list to make the infinite loop seamless. 
            The animation translates the container from 0 to -50%. 
            Because there are two exact copies, when it reaches -50%, it snaps back to 0 perfectly. */}
        {[...brands, ...brands].map((brand, i) => (
          <div key={i} className="flex items-center px-12 group cursor-pointer w-[250px] justify-center gap-4" style={{ '--brand-color': brand.color } as React.CSSProperties}>
            <img 
              src={`https://cdn.simpleicons.org/${brand.slug}`} 
              alt={brand.name} 
              className="h-14 w-auto grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-sm group-hover:drop-shadow-md"
            />
            <span className="text-gray-400 font-bold tracking-widest uppercase opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[color:var(--brand-color)] transition-all duration-500 hidden md:block">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
