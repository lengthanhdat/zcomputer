"use client";
import { useEffect, useState } from "react";
import PreviewClient from "./PreviewClient";

export default function PreviewPage() {
  const [product, setProduct] = useState<any>(null);
  
  useEffect(() => {
    const previewData = localStorage.getItem("product_preview");
    if (previewData) {
      try {
        setProduct(JSON.parse(previewData));
      } catch (e) {
        console.error("Failed to parse preview data", e);
      }
    }
  }, []);

  if (!product) {
    return <div className="flex items-center justify-center min-h-screen">Loading preview...</div>;
  }

  return <PreviewClient product={product} />;
}
