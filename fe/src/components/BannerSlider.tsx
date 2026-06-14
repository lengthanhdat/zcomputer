"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

type Banner = {
  _id: string;
  title?: string;
  link?: string;
  image?: string;
};

interface BannerSliderProps {
  banners: Banner[];
  apiBase: string;
}

export default function BannerSlider({ banners, apiBase }: BannerSliderProps) {
  const length = banners.length;

  if (!banners || length === 0) {
    return (
      <div className="w-full rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-[#1a1a1a] via-[#3a0d0d] to-[#111111] aspect-[21/9]" />
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500 group">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800} // Thời gian chuyển mờ dần (0.8s) rất mượt
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-2.5 !h-2.5 !transition-all !duration-300 !cursor-pointer',
          bulletActiveClass: '!bg-primary !w-8 !rounded-full'
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // Dừng khi di chuột vào
        }}
        loop={length > 1}
        className="w-full"
      >
        {banners.map((banner) => {
          const imageUrl = banner.image
            ? banner.image.startsWith("http") || banner.image.startsWith("data:") || banner.image.startsWith("/uploads")
              ? banner.image
              : `${apiBase}${banner.image}`
            : null;

          return (
            <SwiperSlide key={banner._id} className="relative w-full overflow-hidden flex items-center justify-center bg-[#111]">
              <Link href={banner.link || "/"} className="block relative w-full group/slide">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={banner.title || "Banner"}
                    className="w-full h-auto object-contain transition-transform duration-[15000ms] group-hover/slide:scale-105"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full aspect-[21/9] bg-gradient-to-br from-[#1a1a1a] via-[#3a0d0d] to-[#111111]" />
                )}


              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Tùy chỉnh mũi tên điều hướng (Ẩn đi, chỉ hiện khi hover) */}
      <style>{`
        .swiper-button-next-custom, .swiper-button-prev-custom {
          position: absolute;
          top: 50%;
          transform: translateY(-50%) scale(0.9);
          z-index: 10;
          cursor: pointer;
          width: 48px;
          height: 48px;
          background-color: rgba(0,0,0,0.3);
          backdrop-filter: blur(4px);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }
        .group:hover .swiper-button-next-custom,
        .group:hover .swiper-button-prev-custom {
          opacity: 1;
          transform: translateY(-50%) scale(1);
        }
        .swiper-button-next-custom:hover, .swiper-button-prev-custom:hover {
          background-color: #dc2626; /* Màu đỏ ZComputer */
          transform: translateY(-50%) scale(1.1) !important;
        }
        .swiper-button-prev-custom { left: 24px; }
        .swiper-button-next-custom { right: 24px; }
        
        .swiper-pagination {
          bottom: 20px !important;
          z-index: 10;
        }
      `}</style>
      
      {length > 1 && (
        <>
          <div className="swiper-button-prev-custom shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <div className="swiper-button-next-custom shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </>
      )}
    </div>
  );
}
