// src/app/packages/[type]/[id]/page.tsx

import { getPackageByTypeAndId } from '@/lib/getPackageByTypeAndId';
import TravelPackageDisplay from '@/app/components/TravelPackageDisplay';

export default async function Page({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  // Await the params since it's now a Promise in Next.js 15
  const { type, id } = await params;
  
  const travelPackage = await getPackageByTypeAndId(type, id);

  return (
    <div>
      <TravelPackageDisplay travelPackage={travelPackage} />
    </div>
  );
}

// If you have generateMetadata function, update it similarly:
export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  
  return {
    title: `Package ${id} - ${type}`,
    description: `Details for ${type} package ${id}`,
    // Add other metadata as needed
  };
}

// If you need generateStaticParams for static generation:
export async function generateStaticParams() {
  // Return the static params you want to pre-generate
  return [
    // Example:
    // { type: 'adventure', id: '1' },
    // { type: 'luxury', id: '2' },
    // etc.
  ];
}
