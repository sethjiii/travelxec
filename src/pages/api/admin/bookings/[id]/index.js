// src/pages/api/admin/bookings/[id]/index.js
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import dbConnect from "@/pages/api/dbConnect";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ✅ Connect to Mongo via Mongoose
    await dbConnect();
    const db = mongoose.connection.db; // ✅ Native DB object for aggregation

    // ✅ Auth check
    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    // ✅ Handle new /package/[type]/[id] route — extract ID from query
    const { id } = req.query; // Next.js still sends `id` from [id] in the filename
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    // ✅ Aggregation to join user + package
    const booking = await db
      .collection("bookings")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $addFields: {
            userId: {
              $cond: {
                if: { $not: [{ $eq: [{ $type: "$userId" }, "objectId"] }] },
                then: { $toObjectId: "$userId" },
                else: "$userId",
              },
            },
            packageId: {
              $cond: {
                if: { $not: [{ $eq: [{ $type: "$packageId" }, "objectId"] }] },
                then: { $toObjectId: "$packageId" },
                else: "$packageId",
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "travelpackages",
            localField: "packageId",
            foreignField: "_id",
            as: "package",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$package", preserveNullAndEmptyArrays: true } },
      ])
      .toArray();

    if (!booking || booking.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.status(200).json(booking[0]);
  } catch (error) {
    console.error("❌ Error fetching booking:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
