"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Clock,
  Hotel,
  Image as ImageIcon,
  IndianRupee,
  Minus,
  PackageOpen,
  Plus,
  Upload,
} from "lucide-react";
import Image from "next/image";

interface Activity {
  name: string;
  time: string;
  additionalDetails: string;
}

interface Day {
  day: number;
  title: string;
  description: string;
  stay: string;
  activities: Activity[];
}

interface ImageData {
  url: string;
  public_id: string;
}

interface FormDataProps {
  name: string;
  places: string;
  OnwardPrice: number;
  description: string;
  duration: string;
  itinerary: Day[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  availability: {
    startDate: string;
    endDate: string;
  };
  images: ImageData[];
}

type EditableArrayKeys = 'highlights' | 'inclusions' | 'exclusions';

export default function EditPackageForm() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormDataProps>({
    name: "",
    places: "",
    OnwardPrice: 0,
    description: "",
    duration: "",
    itinerary: [],
    highlights: [""],
    inclusions: [""],
    exclusions: [""],
    availability: {
      startDate: "",
      endDate: "",
    },
    images: [],
  });

  useEffect(() => {
    async function fetchPackage() {
      try {
        const res = await fetch(`/api/packages/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const sanitizedItinerary = (data.itinerary || []).map((day: any, index: number) => ({
          day: index + 1,
          title: day.title || "",
          description: day.description || "",
          stay: day.stay || "",
          activities: Array.isArray(day.activities)
            ? day.activities
            : [{ name: "", time: "", additionalDetails: "" }],
        }));

        setFormData({
          ...data,
          itinerary: sanitizedItinerary,
          OnwardPrice: data.OnwardPrice ?? 0,
          availability: {
            startDate: data.availability?.startDate?.slice(0, 10) ?? "",
            endDate: data.availability?.endDate?.slice(0, 10) ?? "",
          },
        });
      } catch (err) {
        toast.error("Failed to load package");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchPackage();
  }, [id]);

  // Form utilities
  const handleArrayChange = (field: EditableArrayKeys, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: EditableArrayKeys) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field: EditableArrayKeys, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleItineraryChange = (field: keyof Day, idx: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => (i === idx ? { ...day, [field]: value } : day)),
    }));
  };

  const handleActivityChange = (
    dayIndex: number,
    activityIndex: number,
    field: keyof Activity,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              activities: day.activities.map((act, aIdx) =>
                aIdx === activityIndex ? { ...act, [field]: value } : act
              ),
            }
          : day
      ),
    }));
  };

  const addDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: "",
          description: "",
          stay: "",
          activities: [{ name: "", time: "", additionalDetails: "" }],
        },
      ],
    }));
  };

  const removeDay = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })),
    }));
  };

  const addActivity = (dayIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              activities: [...day.activities, { name: "", time: "", additionalDetails: "" }],
            }
          : day
      ),
    }));
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              activities: day.activities.filter((_, aIdx) => aIdx !== activityIndex),
            }
          : day
      ),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploads: ImageData[] = [];
    for (const file of Array.from(files)) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", "txupload");

      const res = await fetch("https://api.cloudinary.com/v1_1/dgbhkfp0r/image/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.secure_url) {
        uploads.push({ url: data.secure_url, public_id: data.public_id });
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploads],
    }));
  };

  const handleImageDelete = (public_id: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.public_id !== public_id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();
      toast.success("Package updated!");
      router.push("/admin/package");
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  if (loading) return <p className="py-24 text-center">Loading...</p>;

  const tabs = [
    { id: "basic", label: "Basic Info", icon: PackageOpen },
    { id: "details", label: "Package Details", icon: Clock },
    { id: "media", label: "Media", icon: ImageIcon },
  ];

  return (
    <form onSubmit={handleSubmit} className="py-24 max-w-6xl mx-auto px-4 space-y-8">
      <div className="bg-white p-6 rounded shadow">
        {/* Tab Navigation */}
        <div className="mb-4 border-b pb-2 flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                activeTab === tab.id ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Basic Info */}
        {activeTab === "basic" && (
          <div className="space-y-4">
            <input
              placeholder="Package Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border px-4 py-2 rounded"
            />
            <input
              placeholder="Places (e.g., Manali-Shimla)"
              value={formData.places}
              onChange={(e) => setFormData({ ...formData, places: e.target.value })}
              className="w-full border px-4 py-2 rounded"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border px-4 py-2 rounded"
            />
            <input
              placeholder="Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full border px-4 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.OnwardPrice}
              onChange={(e) => setFormData({ ...formData, OnwardPrice: Number(e.target.value) })}
              className="w-full border px-4 py-2 rounded"
            />
          </div>
        )}

        {/* Package Details */}
        {activeTab === "details" && (
          <div className="space-y-6">
            {(["highlights", "inclusions", "exclusions"] as EditableArrayKeys[]).map((field) => (
              <div key={field}>
                <h3 className="font-semibold capitalize">{field}</h3>
                {formData[field].map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      className="flex-1 border px-4 py-2 rounded"
                      value={item}
                      onChange={(e) => handleArrayChange(field, index, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(field, index)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(field)}
                  className="text-blue-500 text-sm"
                >
                  + Add {field.slice(0, -1)}
                </button>
              </div>
            ))}

            <div>
              <h3 className="font-semibold">Availability</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={formData.availability.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      availability: { ...prev.availability, startDate: e.target.value },
                    }))
                  }
                  className="border px-4 py-2 rounded"
                />
                <input
                  type="date"
                  value={formData.availability.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      availability: { ...prev.availability, endDate: e.target.value },
                    }))
                  }
                  className="border px-4 py-2 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Image Upload */}
        {activeTab === "media" && (
          <div>
            <h3 className="font-semibold mb-2">Images</h3>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {formData.images.map((img) => (
                <div key={img.public_id} className="relative group">
                  <img src={img.url} alt="uploaded" className="w-full h-32 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(img.public_id)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 py-0.5 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}
