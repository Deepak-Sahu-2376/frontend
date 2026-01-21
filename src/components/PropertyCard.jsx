// src/components/PropertyCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder data structure for a single property
// This can be passed via props later.
const defaultProperty = {
  id: '123',
  title: 'Luxury 3BHK Apartment',
  price: '₹3.5 Cr',
  location: 'Bandra, Mumbai',
  image: '/path/to/property-image.jpg', // Replace with a default image path
  beds: 3,
  baths: 2,
  sqft: 1200,
  rating: 4.8,
  reviews: 18,
  tag: 'Premium Collection', // e.g., Featured, Ultra Exclusive, Premium
};

const PropertyCard = ({ property = defaultProperty }) => {
  return (
    // Card Container
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden w-full">

      {/* Property Image and Tags */}
      <div className="relative h-48">
        {/* Placeholder for the image */}
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {/* Tag (e.g., Premium Collection) */}
        {property.tag && (
          <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full text-white ${property.tag === 'Premium Collection' ? 'bg-blue-600' : 'bg-red-600'
            }`}>
            {property.tag}
          </span>
        )}

        {/* Favorite Icon */}
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-red-500 transition">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 010 6.364L12 20.364l7.682-7.682a4.5 4.5 0 01-6.364-6.364L12 7.636l-.318-.318a4.5 4.5 0 01-6.364 0z" /></svg>
        </button>
      </div>

      {/* Card Details */}
      <div className="p-4">

        {/* Price and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold  text-orange-600">
            {property.price}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <span className="text-yellow-500 mr-1">★</span>
            {property.rating} ({property.reviews})
          </div>
        </div>

        {/* Title and Location */}
        <h4 className="text-lg font-semibold text-gray-800 truncate mb-1">
          {property.title}
        </h4>
        <p className="text-sm text-gray-500 flex items-center mb-4">
          <span className="mr-1">📍</span> {property.location}
        </p>

        {/* Key Specifications (Beds, Baths, Sqft) */}
        <div className="flex justify-between border-t border-b border-gray-100 py-3 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <span className="font-semibold">{property.beds}</span>
            <span>Beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold">{property.baths}</span>
            <span>Baths</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold">{property.sqft.toLocaleString()}</span>
            <span>sq ft</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between space-x-2 mt-4">
          <Link
            to={`/properties/${property.id}`}
            className="flex-grow text-center py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md transition duration-200"
          >
            View Details
          </Link>
          <button className="flex-grow text-center py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-md transition duration-200">
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default PropertyCard;