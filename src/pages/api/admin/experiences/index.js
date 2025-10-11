// pages/api/admin/experiences/index.js
import dbConnect from "@/pages/api/dbConnect";
import Experience from "@/models/Experience";
import Theme from "@/models/Theme";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const experience = await Experience.create(req.body);

      // ✅ If a theme is linked, push the experience to that theme's 'experiences' array
      if (experience.theme) {
        await Theme.findByIdAndUpdate(experience.theme, {
          $addToSet: { experiences: experience._id },
        });
      }

      res.status(201).json({
        success: true,
        message: "Experience created successfully",
        data: experience,
      });
    } catch (error) {
      console.error("Error creating experience:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create experience",
        error: error.message,
      });
    }
  }

  if (req.method === "GET") {
    try {
      // ✅ Populate the linked theme when fetching experiences
      const experiences = await Experience.find().populate("theme", "name image description");
      res.status(200).json({ success: true, data: experiences });
    } catch (error) {
      console.error("Error fetching experiences:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch experiences",
        error: error.message,
      });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const experience = await Experience.findById(id);

      if (!experience) {
        return res.status(404).json({ success: false, message: "Experience not found" });
      }

      // ✅ Remove experience from Theme before deletion
      if (experience.theme) {
        await Theme.findByIdAndUpdate(experience.theme, {
          $pull: { experiences: experience._id },
        });
      }

      await Experience.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Experience deleted successfully" });
    } catch (error) {
      console.error("Error deleting experience:", error);
      res.status(500).json({ success: false, message: "Failed to delete experience" });
    }
  }
}
