"use client";

import { useEffect, useRef } from "react";
import { fetchApi } from "@/lib/api";

export default function ViewIncrementer({ slug }: { slug: string }) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (!hasIncremented.current) {
      hasIncremented.current = true;
      fetchApi(`/products/${slug}/view`, {
        method: "POST",
      }).catch(console.error);
    }
  }, [slug]);

  return null;
}
