"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({ label = "Quay lại", className = "" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      className={`inline-flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm ${className}`}
    >
      <ArrowLeft size={16} />
      {label && <span>{label}</span>}
    </button>
  );
}
