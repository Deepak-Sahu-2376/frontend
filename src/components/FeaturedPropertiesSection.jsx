import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../utils/apiClient";
import { getImageUrl } from "../utils/imageHelper";

const FeaturedPropertiesSection = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------
        STATE + REFERENCES
  ------------------------------------------- */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);


  const sliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileCardWidth, setMobileCardWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && sliderRef.current) {
        setMobileCardWidth(sliderRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardWidth = isMobile ? mobileCardWidth : 330; // Mobile: container width, Desktop: 300+30

  // Fetch Data
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        // Fetch properties (featured endpoint)
        const response = await fetch(`${API_BASE_URL}/api/v1/public/properties/featured?page=0&size=10&sort=createdAt,desc`);

        if (response.ok) {
          const data = await response.json();
          const fetchedProps = data.content || [];

          const mappedProps = fetchedProps.map(p => ({
            id: p.id,
            title: p.title,
            city: p.city || 'all',
            price: formatPrice((p.listingType === 'RENT' ? p.monthlyRent : p.basePrice) || p.price), location: p.formattedAddress || p.city, // Prefer formatted address
            featureTag: p.isFeatured ? "Featured" : (p.isVerified ? "Verified" : "New"),
            premiumTag: p.listingType === 'SALE' ? "For Sale" : "For Rent",
            image: getImageUrl(p.primaryImageUrl || p.images?.[0])
              || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
            highlight: p.propertyType?.replace('_', ' '),
            rating: 4.8, // Placeholder
            reviews: Math.floor(Math.random() * 50) + 10, // Placeholder
            beds: p.bedrooms,
            baths: p.bathrooms,
            sqft: p.carpetArea || p.builtUpArea || 0,
          }));

          setProperties(mappedProps);

          const isMobileCheck = window.innerWidth < 768;
          const visibleCheck = isMobileCheck ? 1 : 4;
          // Require at least 2 full screens of content for infinite scroll to feel natural
          const isInfiniteCheck = mappedProps.length >= visibleCheck * 2;

          setCurrentIndex(isInfiniteCheck ? mappedProps.length : 0);
        }
      } catch (error) {
        console.error("Failed to fetch featured properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const formatPrice = (price) => {
    if (!price) return "Price on Request";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  /* ------------------------------------------
        INFINITE LOOP LOGIC
  ------------------------------------------- */
  const visibleCards = isMobile ? 1 : 4;
  const isInfinite = properties.length >= visibleCards * 2;
  const extendedProperties = isInfinite ? [...properties, ...properties, ...properties] : properties;

  const nextSlide = () => {
    if (properties.length === 0) return;

    if (!isInfinite) {
      if (currentIndex < properties.length - visibleCards) {
        setTransitionEnabled(true);
        setCurrentIndex(prev => prev + 1);
      }
      return;
    }

    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (properties.length === 0) return;

    if (!isInfinite) {
      if (currentIndex > 0) {
        setTransitionEnabled(true);
        setCurrentIndex(prev => prev - 1);
      }
      return;
    }

    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (!isInfinite || properties.length === 0) return;

    if (currentIndex >= 2 * properties.length) {
      setTransitionEnabled(false);
      setCurrentIndex(currentIndex - properties.length);
    } else if (currentIndex < properties.length) {
      setTransitionEnabled(false);
      setCurrentIndex(currentIndex + properties.length);
    }
  };

  /* ------------------------------------------
        TOUCH SWIPE (Mobile)
  ------------------------------------------- */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) nextSlide();
    if (touchEndX.current - touchStartX.current > 50) prevSlide();
  };

  if (loading) {
    return (
      <section className="py-20 bg-[#f7f7f7] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </section>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  // Calculate max slides for dots
  const finiteDotCount = Math.max(0, properties.length - visibleCards + 1);

  return (
    <section className="py-20 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Featured Properties</h2>
          <p className="text-gray-600 text-lg mt-2">
            Discover our handpicked selection of premium properties in the most
            desirable locations.
          </p>
        </div>

        {/* Slider container */}
        <div
          className="relative flex items-center"
        >
          {/* Prev */}
          <button
            onClick={prevSlide}
            disabled={!isInfinite && currentIndex === 0}
            className={`hidden md:flex absolute left-0 md:-left-12 z-20 bg-white/90 md:bg-white shadow-md h-8 w-8 md:h-12 md:w-12 rounded-full justify-center items-center transition-colors backdrop-blur-sm md:backdrop-blur-none ${(!isInfinite && currentIndex === 0) ? 'opacity-50 cursor-not-allowed text-gray-300' : 'hover:bg-gray-50 text-gray-600'}`}
          >
            <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
          </button>

          {/* Slider */}
          <div
            className="overflow-hidden w-full"
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`flex ${transitionEnabled ? 'transition-transform duration-500 ease-carousel' : ''} ${isMobile ? 'gap-0' : 'gap-[30px]'}`}
              style={{
                transform: `translateX(-${currentIndex * cardWidth}px)`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedProperties.map((p, index) => (
                <div
                  key={`${p.id}-${index}`}
                  className={`bg-white rounded-2xl shadow-md flex-shrink-0 overflow-hidden hover:shadow-xl ${isMobile ? 'w-full' : 'w-[300px]'}`}
                >
                  {/* Image */}
                  <div className="relative h-48 w-full">
                    <img
                      src={p.image}
                      className="h-full w-full object-cover"
                      alt={p.title}
                    />

                    {/* Tags */}
                    {p.featureTag && (
                      <span className="absolute top-3 left-3 bg-[#c9a27e] text-white text-xs px-3 py-1 rounded-md shadow">
                        {p.featureTag}
                      </span>
                    )}

                    {p.premiumTag && (
                      <span className="absolute top-3 right-3 bg-[#3b82f6] text-white text-xs px-3 py-1 rounded-md shadow">
                        {p.premiumTag}
                      </span>
                    )}


                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="text-2xl font-bold text-[#a87a4c] mb-1">
                      {p.price}
                    </div>

                    <div className="text-lg font-semibold line-clamp-1">{p.title}</div>

                    <p className="text-sm text-gray-500 flex items-center gap-1 line-clamp-1">
                      📍 {p.location}
                    </p>

                    <p className="text-sm text-[#c69059] mt-2 flex items-center gap-1">
                      ✨ {p.highlight}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-3">
                      ⭐ {p.rating}
                      <span className="text-gray-500 text-sm">
                        ({p.reviews})
                      </span>
                    </div>

                    {/* Specs */}
                    <div className="flex items-center justify-between mt-3 text-gray-600 text-sm">
                      <span>🛏 {p.beds}</span>
                      <span>🛁 {p.baths}</span>
                      <span>📐 {p.sqft}</span>
                    </div>

                    {/* Buttons */}
                    <div className="mt-5 flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/property/${encodeURIComponent(p.title)}/${encodeURIComponent(p.city)}/${p.id}`)}
                        className="bg-[#a87a4c] hover:bg-[#906636] text-white px-4 py-2 rounded-md w-full transition-colors"
                      >
                        View Details
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={nextSlide}
            disabled={!isInfinite && currentIndex >= properties.length - visibleCards}
            className={`hidden md:flex absolute right-0 md:-right-12 z-20 bg-white/90 md:bg-white shadow-md h-8 w-8 md:h-12 md:w-12 rounded-full justify-center items-center transition-colors backdrop-blur-sm md:backdrop-blur-none ${(!isInfinite && currentIndex >= properties.length - visibleCards) ? 'opacity-50 cursor-not-allowed text-gray-300' : 'hover:bg-gray-50 text-gray-600'}`}
          >
            <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-10 gap-3">
          {(!isInfinite ? Array.from({ length: finiteDotCount }) : properties).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (properties.length === 0) return;
                setTransitionEnabled(true);
                if (!isInfinite) {
                  setCurrentIndex(index);
                } else {
                  setCurrentIndex(properties.length + index);
                }
              }}
              className={`h-3 w-3 rounded-full transition-all ${(!isInfinite ? currentIndex : currentIndex % properties.length) === index ? "bg-[#a87a4c] scale-125" : "bg-gray-300"
                }`}
            ></button>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate('/properties')}
            className="px-8 py-3 border border-[#a87a4c] text-[#a87a4c] font-semibold rounded-md hover:bg-[#a87a4c] hover:text-white transition-colors"
          >
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection;
