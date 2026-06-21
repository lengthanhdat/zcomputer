import HomeClient from "@/components/HomeClient";

export const metadata = {
  title: "ZCOMPUTER - PC Gaming, Laptop, Workstation",
  description: "ZCOMPUTER chuyên cung cấp PC Gaming, Laptop, Workstation uy tín giá rẻ.",
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ZCOMPUTER",
    "url": "https://zcomputer.vn",
    "logo": "https://zcomputer.vn/logo_broken.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-977-334-415",
      "contactType": "customer service"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      <HomeClient />
    </>
  );
}
