"use client";

const brands = [
  { name: "ASUS", slug: "asus" },
  { name: "CORSAIR", slug: "corsair" },
  { name: "INTEL", slug: "intel" },
  { name: "AMD", slug: "amd" },
  { name: "NVIDIA", slug: "nvidia" },
  { name: "RAZER", slug: "razer" },
  { name: "SAMSUNG", slug: "samsung" },
  { name: "DELL", slug: "dell" },
  { name: "HP", slug: "hp" },
  { name: "LENOVO", slug: "lenovo" },
  { name: "APPLE", slug: "apple" }
];

export default function BrandMarquee() {
  return (
    <div className="bg-[#111] py-8 overflow-hidden relative flex items-center border-y border-gray-800 mt-8 mb-12">
      {/* Fading edges for smooth enter/exit */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#111] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#111] to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex w-max animate-marquee">
        {/* We duplicate the list to make the infinite loop seamless. 
            The animation translates the container from 0 to -50%. 
            Because there are two exact copies, when it reaches -50%, it snaps back to 0 perfectly. */}
        {[...brands, ...brands].map((brand, i) => (
          <div key={i} className="flex items-center px-12 group cursor-pointer w-[250px] justify-center gap-4">
            <img 
              src={`https://cdn.simpleicons.org/${brand.slug}/ffffff`} 
              alt={brand.name} 
              className="h-10 w-auto opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            />
            <span className="text-gray-500 font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
