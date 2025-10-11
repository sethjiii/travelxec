// src/app/admin/link-packages-to-experiences/page.tsx
"use client";
import React, { useState, useEffect } from 'react';

interface Experience {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  linkedPackages: Array<{
    packageId: string;
    packageType: 'domestic' | 'international';
  }>;
}

interface PackagesData {
  domestic: Array<{
    _id: string;
    name: string;
    duration: number;
    basePrice: number;
  }>;
  international: Array<{
    _id: string;
    name: string;
    duration: number;
    basePrice: number;
  }>;
}

export default function LinkPackagesToExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [packagesData, setPackagesData] = useState<PackagesData>({ domestic: [], international: [] });
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'domestic' | 'international'>('domestic');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExperiences();
    fetchPackagesDropdown();
  }, []);

  const fetchExperiences = async () => {
    try {
      // Updated API path to match your structure
      const response = await fetch('/api/admin/experiences');
      const result = await response.json();
      console.log('Experiences response:', result);
      
      if (result.success) {
        setExperiences(result.data);
      } else {
        console.error('Failed to fetch experiences:', result.error);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  const fetchPackagesDropdown = async () => {
    try {
      // Updated API path to match your structure
      const response = await fetch('/api/admin/packages/dropdown');
      const result = await response.json();
      console.log('Packages response:', result);
      
      if (result.success) {
        setPackagesData(result.data);
      } else {
        console.error('Failed to fetch packages:', result.error);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleLinkPackage = async () => {
    if (!selectedExperience || !selectedPackage) {
      alert('Please select both experience and package');
      return;
    }

    setLoading(true);
    try {
      // Updated API path to match your structure
      const response = await fetch(`/api/admin/experiences/${selectedExperience}/link-package`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage,
          packageType: selectedType
        })
      });

      const result = await response.json();
      console.log('Link response:', result);
      
      if (result.success) {
        alert('Package linked successfully!');
        fetchExperiences(); // Refresh data
        setSelectedPackage('');
      } else {
        alert(result.error || 'Error linking package');
      }
    } catch (error) {
      console.error('Error linking package:', error);
      alert('Error linking package');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkPackage = async (experienceId: string, packageId: string) => {
    setLoading(true);
    try {
      // Updated API path to match your structure
      const response = await fetch(`/api/admin/experiences/${experienceId}/unlink-package`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId })
      });

      const result = await response.json();
      console.log('Unlink response:', result);
      
      if (result.success) {
        alert('Package unlinked successfully!');
        fetchExperiences();
      } else {
        alert(result.error || 'Error unlinking package');
      }
    } catch (error) {
      console.error('Error unlinking package:', error);
      alert('Error unlinking package');
    } finally {
      setLoading(false);
    }
  };

  const getPackageName = (packageId: string, packageType: 'domestic' | 'international') => {
    const packageList = packagesData[packageType] || [];
    const pkg = packageList.find(p => p._id === packageId);
    return pkg ? pkg.name : 'Unknown Package';
  };

  return (
    <div className="p-6 py-24 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Link Packages to Experiences</h1>
      
      {/* Linking Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">Create New Link</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Experience Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">Select Experience:</label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose experience...</option>
              {experiences.map(exp => (
                <option key={exp._id} value={exp._id}>
                  {exp.name} - ₹{exp.price}
                </option>
              ))}
            </select>
          </div>

          {/* Package Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">Package Type:</label>
            <div className="flex gap-2 p-3 border border-gray-300 rounded-lg">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="domestic"
                  checked={selectedType === 'domestic'}
                  onChange={(e) => {
                    setSelectedType(e.target.value as 'domestic' | 'international');
                    setSelectedPackage('');
                  }}
                  className="mr-2"
                />
                Domestic
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="international"
                  checked={selectedType === 'international'}
                  onChange={(e) => {
                    setSelectedType(e.target.value as 'domestic' | 'international');
                    setSelectedPackage('');
                  }}
                  className="mr-2"
                />
                International
              </label>
            </div>
          </div>

          {/* Package Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">Select Package:</label>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose {selectedType} package...</option>
              {packagesData[selectedType]?.map(pkg => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.name} - {pkg.duration} days (₹{pkg.basePrice})
                </option>
              ))}
            </select>
          </div>

          {/* Link Button */}
          <div className="flex items-end">
            <button
              onClick={handleLinkPackage}
              disabled={loading || !selectedExperience || !selectedPackage}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Linking...' : 'Link Package'}
            </button>
          </div>
        </div>
      </div>

      {/* Experiences List with Linked Packages */}
      <div className="bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold p-6 border-b text-gray-700">Experiences & Linked Packages</h2>
        
        {experiences.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No experiences found. Create some experiences first.
          </div>
        ) : (
          <div className="divide-y">
            {experiences.map(experience => (
              <div key={experience._id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{experience.name}</h3>
                    <p className="text-gray-600 mt-1">{experience.description}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>₹{experience.price}</span>
                      <span>{experience.duration} hours</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-gray-700">Linked Packages:</h4>
                  {experience.linkedPackages.length === 0 ? (
                    <p className="text-gray-400 text-sm bg-gray-50 p-3 rounded-lg">No packages linked</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {experience.linkedPackages.map((linkedPkg, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-800">
                              {getPackageName(linkedPkg.packageId, linkedPkg.packageType)}
                            </span>
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded-full">
                              {linkedPkg.packageType}
                            </span>
                          </div>
                          <button
                            onClick={() => handleUnlinkPackage(experience._id, linkedPkg.packageId)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                          >
                            Unlink
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
