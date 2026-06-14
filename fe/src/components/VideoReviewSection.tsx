"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, ChevronRight, Pause, Volume2, VolumeX } from "lucide-react";
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group relative aspect-[9/16]">
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
            className="object-cover"
          />
        </div>
      )}

      {/* Dark overlay when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/20 pointer-events-none transition-colors"></div>
      )}
      
      {/* Fake Channel Info */}
      <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-10 pointer-events-none">
        <Image src="/logo.png" alt="ZComputer" width={40} height={40} className="w-10 h-10 rounded-full object-cover shadow-lg border-2 border-white shrink-0 bg-white" />
        <div>
          <h3 className="text-white font-bold text-sm leading-tight drop-shadow-md line-clamp-1">ZComputer Short</h3>
        </div>
      </div>

      {/* Play/Pause Button Overlay */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-red-600 bg-white/90 backdrop-blur-sm w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl scale-90 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
        >
          <Play fill="currentColor" size={32} className="ml-1" />
        </div>
      )}

      {/* Mute/Unmute Button Overlay */}
      {isPlaying && (
        <div 
          onClick={toggleMute}
          className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </div>
      )}

      {/* Redirect Button */}
      {video.redirectLink && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <a 
            href={video.redirectLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block w-full py-2.5 bg-red-600/90 hover:bg-red-600 text-white text-center rounded-xl font-bold backdrop-blur-md transition-colors shadow-lg"
          >
            Xem Chi Tiết
          </a>
        </div>
      )}
    </div>
  );
};

export default function VideoReviewSection({ videos }: VideoReviewProps) {
  if (!videos || videos.length === 0) return null;
  return (
    <section className="container mx-auto px-4 mb-20">
      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <h2 className="text-2xl font-black uppercase text-gray-900 tracking-tight">Review Sản Phẩm</h2>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </section>
  );
}
