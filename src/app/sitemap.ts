import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.travelxec.com";

  // --- Static pages ---
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about-us",
    "/contact-us",
    "/packages",
    "/destinations",
    "/curate",
    "/favorites",
    "/privacy-policy",
    "/terms-and-conditions",
    "/cookie-policy",
    "/refund-policy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // --- Fetch dynamic packages ---
  let packages: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/packages`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      packages = data.packages || data || [];
    }
  } catch (error) {
    console.error("❌ Failed to fetch packages:", error);
  }

  const packageRoutes: MetadataRoute.Sitemap = packages.map((pkg: any) => ({
    url: `${baseUrl}/packages/${pkg.type || "default"}/${pkg._id}`,
    lastModified: new Date(pkg.updatedAt || Date.now()),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // --- Fetch international destinations ---
  let destinations: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/internationaldestinations`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      destinations = data.internationalDestinations || data || [];
    }
  } catch (error) {
    console.error("❌ Failed to fetch destinations:", error);
  }

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((dest: any) => ({
    url: `${baseUrl}/InternationalDestination/${dest._id}`,
    lastModified: new Date(dest.updatedAt || Date.now()),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // ✅ Correct return type
  return [
    ...staticRoutes,
    ...packageRoutes,
    ...destinationRoutes,
  ];
}
