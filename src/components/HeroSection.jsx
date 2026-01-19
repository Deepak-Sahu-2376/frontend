import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { icon: '🏠', value: '10K+', label: 'Properties' },
  { icon: '$', value: '₹25K Cr+', label: 'Value Sold' },
  { icon: '🗺️', value: '50+', label: 'Cities' },
];

const PROPERTY_TYPES = [
  "APARTMENT", "VILLA", "PLOT", "COMMERCIAL", "INDEPENDENT_FLOOR",
  "FARMHOUSE", "PENTHOUSE", "STUDIO", "SHOP", "OFFICE",
  "SINGLE_FAMILY_HOME", "DUPLEX", "CO_LIVING", "SERVICED_APARTMENT",
  "STUDENT_HOUSING", "SENIOR_LIVING",
  "CO_WORKING", "BUSINESS_CENTER", "SHOPPING_MALL", "RESTAURANT", "SUPERMARKET",
  "RESORT", "MIXED_USE", "TRAINING_CENTER",
  "INDUSTRIAL", "FREE_ZONE",
  "COLD_STORAGE", "DISTRIBUTION_CENTER", "FACTORY", "LOGISTICS", "INDUSTRIAL_LAND",
  "DATA_CENTER", "R_AND_D", "SHOWROOM_STORAGE", "WAREHOUSE"
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedType) params.append('type', selectedType);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    // Background container
    <div className="relative w-full min-h-[500px] md:h-[600px] flex flex-col items-center justify-center md:justify-start pt-20 md:pt-32 px-4 overflow-hidden">

      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/assets/video/heroSection.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Main Content (Title, Search Bar) */}
      <div className="relative z-10 text-center w-full max-w-5xl mx-auto">

        {/* Title and Description */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
          Find Your Perfect Home
        </h1>
        <p className="text-white text-base md:text-lg mb-8 md:mb-10 drop-shadow-sm">
          Discover exceptional properties with India's trusted real estate platform
        </p>

        {/* Search Bar Container - White background, centered */}
        <div className="bg-white p-3 rounded-lg shadow-2xl flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3 w-full max-w-4xl mx-auto">

          {/* Location Input (Custom style with icon) */}
          <div className="flex items-center bg-white border border-gray-300 rounded-md p-2 w-full md:flex-grow">
            <span className="text-gray-500 mr-2">📍</span>
            <input
              type="text"
              placeholder="City, area, pincode"
              className="w-full text-gray-700 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Property Type Dropdown */}
          <div className="w-full md:flex-grow">
            <select
              className="p-2 w-full border border-gray-300 rounded-md focus:outline-none text-gray-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Property Type</option>
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type}>
                  {type.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Dropdown (Static for now as simple redirect logic needs complexity for ranges) */}
          <div className="w-full md:flex-grow">
            <select className="p-2 w-full border border-gray-300 rounded-md focus:outline-none text-gray-500">
              <option value="">Price Range</option>
              <option value="0-5000000">Under ₹50 L</option>
              <option value="5000000-10000000">₹50 L - ₹1 Cr</option>
              <option value="10000000-30000000">₹1 Cr - ₹3 Cr</option>
              <option value="30000000-1000000000">₹3 Cr+</option>
            </select>
          </div>

          {/* Search Button - Uses the bronze/brown color from the image */}
          <button
            onClick={handleSearch}
            className="w-full md:w-auto px-8 py-3 bg-amber-800/80 hover:bg-amber-800 text-white font-semibold rounded-md transition duration-200 flex items-center justify-center cursor-pointer"
          >
            <span className="mr-2">🔎</span> Search
          </button>
        </div>

        {/* Statistics Bar - Directly below the search, slightly lifted */}
        <div className="mt-8 md:mt-10 pt-8 md:pt-16 w-full flex justify-center">
          <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-4xl">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl md:text-3xl text-white">{stat.icon}</span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs md:text-sm text-white opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;