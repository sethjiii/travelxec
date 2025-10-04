// src/app/packages/[type]/[id]/page.tsx

import { getPackageByTypeAndId } from "@/lib/getPackageByTypeAndId";
import TravelPackageDisplay from "@/app/components/TravelPackageDisplay";

// Add this to prevent static-to-dynamic runtime errors
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  // Await the params (Next.js 15 behavior)
  const { type, id } = await params;

  const travelPackage = await getPackageByTypeAndId(type, id);

  return (
    <div>
      <TravelPackageDisplay travelPackage={travelPackage} />
    </div>
  );
}

// ✅ Dynamic metadata with brand name
export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;

  const travelPackage = await getPackageByTypeAndId(type, id);

  const packageName = travelPackage?.name || "Travel Package";
  const description =
    travelPackage?.description || "Explore our curated travel packages with TravelXec.";

  return {
    title: `${packageName} | TravelXec`,
    description,
    openGraph: {
      title: `${packageName} | TravelXec`,
      description,
      images: travelPackage?.image ? [travelPackage.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${packageName} | TravelXec`,
      description,
      images: travelPackage?.image ? [travelPackage.image] : [],
    },
  };
}

// Optional: Pre-generate some params
export async function generateStaticParams() {
  return [
    // { type: "luxury", id: "123" },
    // { type: "adventure", id: "456" },
  ];
}
