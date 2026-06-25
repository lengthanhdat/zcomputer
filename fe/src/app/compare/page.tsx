import CompareClient from "./CompareClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "So sánh sản phẩm | ZCOMPUTER",
  description: "So sánh cấu hình và giá các dòng máy tính, laptop tại ZCOMPUTER.",
};

export default function ComparePage() {
  return <CompareClient />;
}
