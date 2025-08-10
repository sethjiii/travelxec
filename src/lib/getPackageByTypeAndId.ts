// app/lib/getPackageByTypeAndId.ts
export async function getPackageByTypeAndId(type: string, id: string) {
  // Ensure base URL is available and properly formatted
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://travelxec.com';
  const cleanBaseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  
  const url = `${cleanBaseUrl}/api/packages/${type}/${id}`;
  
  console.log('Fetching package from:', url); // Debug log for production
  
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch package. Status: ${res.status}, URL: ${url}`);
      throw new Error(`Failed to fetch package: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error in getPackageByTypeAndId:', error);
    console.error('URL:', url);
    console.error('Type:', type);
    console.error('ID:', id);
    throw error;
  }
}
