// app/lib/getPackageByTypeAndId.ts
export async function getPackageByTypeAndId(type: string, id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/packages/${type}/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch package");
  }

  return res.json();
}
