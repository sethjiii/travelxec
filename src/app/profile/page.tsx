"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthProvider";
import { Mail, Phone, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type User = {
  _id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatarUrl?: string;
};

type UserProfileData = {
  fullName?: string;
  bio?: string;
  email?: string;
  phoneNumber?: string;
  city?: string;
  profilePicture?: string;
  countriesVisited?: number;
  citiesVisited?: number;
  placesVisited?: number;
};

const UserProfile = () => {
  const { user, logout } = useAuth() as { user: User | null; logout: () => void };
  const router = useRouter();

  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch profile from secure /me route
    fetch(`/api/user-profile/me`)
      .then((res) => res.json())
      .then((data) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profileData) return;
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!profileData) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/user-profile/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const updated = await res.json();
      setProfileData(updated);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    logout();
    router.push("/");
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500" />
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                {profileData?.profilePicture ? (
                  <Image
                    src={profileData.profilePicture}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full ring-4 ring-white object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full ring-4 ring-white bg-blue-700 flex items-center justify-center text-5xl font-semibold text-white">
                    {profileData?.fullName?.[0] || user?.name?.[0] || "U"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="pt-16 pb-8 px-8 space-y-6">
            {/* Editable Info */}
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                className="w-full mt-1 p-2 border rounded"
                name="fullName"
                value={profileData?.fullName || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                className="w-full mt-1 p-2 border rounded"
                name="email"
                value={profileData?.email || user?.email || ""}
                onChange={handleChange}
                disabled
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <input
                className="w-full mt-1 p-2 border rounded"
                name="phoneNumber"
                value={profileData?.phoneNumber || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">City</label>
              <input
                className="w-full mt-1 p-2 border rounded"
                name="city"
                value={profileData?.city || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Bio</label>
              <textarea
                rows={3}
                className="w-full mt-1 p-2 border rounded"
                name="bio"
                value={profileData?.bio || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            {/* Travel Stats */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-100 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {profileData?.countriesVisited ?? 0}
                </div>
                <div className="text-sm text-gray-500">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {profileData?.citiesVisited ?? 0}
                </div>
                <div className="text-sm text-gray-500">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {profileData?.placesVisited ?? 0}
                </div>
                <div className="text-sm text-gray-500">Places</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4">
              {editing ? (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;