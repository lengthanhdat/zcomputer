"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

interface VideoReviewProps {
  videos: any[];
}

const VideoCard = ({ video }: { video: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.muted = isMuted;
        videoRef.current.play().catch(err => console.error("Video play failed:", err));
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="bg-black rounded-[32px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden group relative aspect-[9/16] border-[6px] border-gray-900 transition-transform duration-500 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(220,38,38,0.2)]">
      {/* Video Player */}
      {video.videoFileUrl ? (
        <video 
          ref={videoRef}
          src={`${video.videoFileUrl}`} 
          className="w-full h-full object-cover cursor-pointer" 
          loop 
          playsInline 
          onClick={togglePlay}
        />
      ) : (
        <div className="w-full h-full relative cursor-pointer" onClick={togglePlay}>
          <Image 
            src={video.videoThumbnail?.startsWith('http') || video.videoThumbnail?.startsWith('data:') ? video.videoThumbnail : `${video.videoThumbnail}`} 
            alt={video.title || "Video"} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}

      {/* Dark overlay when paused or hovered */}
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${!isPlaying ? 'bg-black/30' : 'bg-transparent group-hover:bg-black/10'}`}></div>
      
      {/* Fake Channel Info */}
      <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-10 pointer-events-none">
        <div className="relative">
          <Image src="/logo.png" alt="ZComputer" width={36} height={36} className="w-9 h-9 rounded-full object-contain bg-white shadow-lg border border-white/50" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
        <div>
          <h3 className="text-white font-bold text-[13px] leading-tight drop-shadow-md">ZComputer Short</h3>
          <p className="text-white/80 text-[10px] font-medium drop-shadow-md">@zcomputer_official</p>
        </div>
      </div>

      {/* Play/Pause Button Overlay */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer group/play"
        >
          {/* Glowing ring */}
          <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-30"></div>
          <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full border border-white/30 group-hover/play:bg-red-600/90 transition-colors duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]"></div>
          <Play fill="currentColor" size={24} className="text-white relative z-10 ml-1" />
        </div>
      )}

      {/* Mute/Unmute Button Overlay */}
      {isPlaying && (
        <div 
          onClick={toggleMute}
          className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 border border-white/10 text-white w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer shadow-lg"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </div>
      )}

      {/* Redirect Button */}
      {(video.redirectLink || video.product_id) && (
        <div className="absolute bottom-6 left-5 right-5 z-20">
          {video.product_id ? (
            <Link 
              href={`/product/${video.product_id.slug}`}
              className="flex flex-col items-center justify-center w-full py-2 bg-white/10 hover:bg-red-600 text-white border border-white/20 hover:border-red-500 rounded-xl backdrop-blur-md transition-all shadow-[0_8px_16px_rgba(0,0,0,0.4)] group/btn"
            >
              <span className="font-bold text-[11px] uppercase opacity-80 group-hover/btn:opacity-100 mb-0.5">Sản phẩm trong video</span>
              <span className="font-bold text-sm line-clamp-1 px-2 text-center flex items-center gap-1">
                {video.product_id.name} <ChevronRight size={14} />
              </span>
            </Link>
          ) : (
            <a 
              href={video.redirectLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-red-600 text-white border border-white/20 hover:border-red-500 rounded-xl font-bold text-sm backdrop-blur-md transition-all shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
            >
              Xem Ngay <ChevronRight size={16} />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default function VideoReviewSection({ videos }: VideoReviewProps) {
  if (!videos || videos.length === 0) return null;
  return (
    <section className="container mx-auto px-4 mb-24 mt-12">
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black uppercase text-gray-900 tracking-tight flex items-center gap-3">
          <Play fill="currentColor" className="text-red-600" size={32} />
          <span>REVIEW <span className="text-red-600">SẢN PHẨM</span></span>
        </h2>
        <p className="text-gray-500 mt-2 font-medium">Trải nghiệm thực tế - Đánh giá chân thực</p>
      </div>

      {/* Videos Grid/Slider */}
      <div className="flex overflow-x-auto pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 px-4 md:px-0 -mx-4 md:mx-0">
        {videos.map((video) => (
          <div key={video._id} className="min-w-[260px] w-[75vw] sm:w-[45vw] md:w-auto md:min-w-0 shrink-0 snap-center md:snap-align-none">
            <VideoCard video={video} />
          </div>
        ))}
      </div>
    </section>
  );
}
