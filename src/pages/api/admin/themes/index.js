import dbConnect from "../../dbConnect";
import Theme from "@/models/Theme";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { v2 as cloudinary } from "cloudinary";
import Experience from "@/models/Experience";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Allow large payloads for image upload
    },
  },
};


export default async function handler(req, res) {
  await dbConnect();

  // Only admins can create a theme
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  switch (req.method) {
    // POST → Create a new theme
    case "POST":
      try {
        let { imageFile, minPrice, maxPrice, ...data } = req.body;

        // Handle image upload to Cloudinary
        if (imageFile && imageFile.startsWith("data:")) {
          const uploadRes = await cloudinary.uploader.upload(imageFile, {
            folder: "themes",
          });
          data.image = uploadRes.secure_url;
        }

        // Set priceRange
        data.priceRange = {
          min: minPrice ? Number(minPrice) : 0,
          max: maxPrice ? Number(maxPrice) : 0,
        };

        const theme = await Theme.create(data);
        res.status(201).json(theme);
      } catch (error) {
        console.error("POST Theme Error:", error);
        res.status(400).json({ error: error.message });
      }
      break;

    // GET → List all themes with populated experiences
    case "GET":
      try {
        const themes = await Theme.find().populate("experiences");
        res.status(200).json(themes);
      } catch (error) {
        console.error("GET Themes Error:", error);
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}