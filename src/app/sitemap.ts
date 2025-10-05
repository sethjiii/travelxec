import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.travelxec.com";

  // --- 1️⃣ Static Routes ---
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

  // --- 2️⃣ Fetch All Package Categories Dynamically ---
  const packageTypes = [
    "packages",
    "interpackages",
    "luxurypackages",
    "experiencepackages",
    "musicfestpackages",
  ];

  const allPackages: any[] = [];

  for (const type of packageTypes) {
    try {
      const res = await fetch(`${baseUrl}/api/${type}`, {
        next: { revalidate: 120 },
      });

      if (res.ok) {
        const data = await res.json();

        // Detect array type automatically
        const pkgArray = Array.isArray(data.packages)
          ? data.packages
          : Array.isArray(data)
          ? data
          : [];

        // Add type info (fallback if missing)
        pkgArray.forEach((pkg: any) =>
          allPackages.push({
            ...pkg,
            type: pkg.type || type.replace("packages", "") || "default",
          })
        );
      }
    } catch (err) {
      console.error(`❌ Failed to fetch ${type}:`, err);
    }
  }

  const packageRoutes: MetadataRoute.Sitemap = allPackages.map((pkg: any) => ({
    url: `${baseUrl}/packages/${pkg.type}/${pkg._id}`,
    lastModified: new Date(pkg.updatedAt || Date.now()),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // --- 3️⃣ International Destinations ---
  let destinations: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/internationaldestinations`, {
      next: { revalidate: 120 },
    });
    if (res.ok) {
      const data = await res.json();
      const destArray = Array.isArray(data.internationalDestinations)
        ? data.internationalDestinations
        : Array.isArray(data)
        ? data
        : [];

      destinations = destArray;
    }
  } catch (err) {
    console.error("❌ Failed to fetch destinations:", err);
  }

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((dest: any) => ({
    url: `${baseUrl}/InternationalDestination/${dest._id}`,
    lastModified: new Date(dest.updatedAt || Date.now()),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // --- ✅ Combine and Return Everything ---
  return [...staticRoutes, ...packageRoutes, ...destinationRoutes] as MetadataRoute.Sitemap;
}
