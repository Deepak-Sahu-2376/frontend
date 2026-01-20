import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../utils/apiClient";
import { getImageUrl } from "../utils/imageHelper";
import { toast } from 'sonner';

const TopPicksSection = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // Will initialize after fetch
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const autoPlayRef = useRef();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);



  // Fetch Data
  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        // Fetch Projects instead of Properties
        const response = await fetch(`${API_BASE_URL}/api/v1/properties/projects?page=0&size=10&sortBy=createdAt&sortDir=DESC`);

        if (response.ok) {
          const data = await response.json();
          // The structure is data.data.projects based on user snippet
          const fetchedProjects = data.data?.projects || [];

          // Map API data to UI format
          const mappedProps = fetchedProjects.map(p => ({
            id: p.id,
            title: p.name,
            price: p.formattedPriceRange || formatPrice(p.startingPrice),
            location: p.city || p.formattedAddress,
            beds: '3-4 BHK', // Hardcoded per user description implication, or could use p.description parsing if needed. 
            // Ideally backend provides this. For now, we'll use a generic placeholder or hide it? 
            // Let's use "Residential" if generic, or try to infer. 
            // actually, let's just show "Project" related info.
            baths: p.totalUnits + " Units",
            sqft: p.formattedArea || (p.totalArea + " sq.ft"),
            tag: p.projectType || 'Project',
            amenities: p.amenities?.map(a => (typeof a === 'string' ? a : a.name || '').replace(/_/g, ' ')).slice(0, 3) || [],
            image: getImageUrl(p.mediaFiles?.find(m => m.category === 'EXTERIOR' || m.isPrimary)?.mediaUrl || p.mediaFiles?.[0]?.mediaUrl)
          }));

          setProperties(mappedProps);
          setCurrentIndex(mappedProps.length); // Start at logical index for infinite loop
        }
      } catch (error) {
        console.error("Failed to fetch top picks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPicks();
  }, []);

  const formatPrice = (price) => {
    if (!price) return "Price on Request";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ------------------------------------------
        INFINITE LOOP LOGIC
  ------------------------------------------- */
  // Only create extended data if we have properties
  const extendedData = properties.length > 0 ? [...properties, ...properties, ...properties] : [];

  const nextSlide = () => {
    if (properties.length === 0) return;
    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (properties.length === 0) return;
    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (properties.length === 0) return;
    if (currentIndex >= 2 * properties.length) {
      setTransitionEnabled(false);
      setCurrentIndex(currentIndex - properties.length);
    } else if (currentIndex < properties.length) {
      setTransitionEnabled(false);
      setCurrentIndex(currentIndex + properties.length);
    }
  };

  /* -----------------------------
     AUTO PLAY (DESKTOP ONLY)
     ----------------------------- */
  useEffect(() => {
    if (!isMobile && properties.length > 0) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }

    return () => clearInterval(autoPlayRef.current);
  }, [currentIndex, isMobile, properties.length]);

  const pauseAutoPlay = () => clearInterval(autoPlayRef.current);
  const resumeAutoPlay = () => {
    if (!isMobile && properties.length > 0) {
      autoPlayRef.current = setInterval(nextSlide, 4000);
    }
  };

  /* -----------------------------
     TOUCH SWIPE (MOBILE)
     ----------------------------- */
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
      <section className="py-24 bg-[#f7f7f7] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </section>
    );
  }

  if (properties.length === 0) return null; // Don't show section if no data

  return (
    <section className="py-24 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADING */}
        <div className="text-center mb-12 relative">
          <h2 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <span className="text-2xl text-[#B2845A]">⭐</span> Our Top Picks
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            Handpicked by our experts - these exceptional projects represent
            the finest in luxury living.
          </p>
        </div>

        {/* SLIDER WRAPPER */}
        <div
          className="relative flex justify-center items-center"
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
        >

          {/* LEFT BUTTON */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-0 z-20 bg-white h-10 w-10 items-center justify-center rounded-full shadow hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>

          {/* SLIDER CONTENT */}
          <div
            className="overflow-hidden w-full max-w-5xl rounded-2xl shadow-lg"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`flex ${transitionEnabled ? 'transition-transform duration-500 ease-carousel' : ''}`}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedData.map((property, index) => (
                <div key={`${property.id}-${index}`} className="min-w-full flex flex-col md:flex-row bg-white">

                  {/* LEFT DETAILS */}
                  <div className="w-full md:w-1/2 p-6 md:p-10 bg-white order-2 md:order-1 flex flex-col justify-center">
                    <div>
                      <span className="inline-block bg-[#D8C0A7] text-[#5A3E2B] px-3 py-1 rounded-md text-xs font-semibold mb-4">
                        ⭐ Editor’s Choice
                      </span>

                      <div className="text-2xl md:text-3xl font-bold text-[#B2845A] mb-2">
                        {property.price}
                      </div>

                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
                        {property.title}
                      </h3>

                      <p className="text-sm text-gray-500 mb-4 flex items-center gap-1 line-clamp-1">
                        📍 {property.location}
                      </p>

                      <div className="flex gap-4 md:gap-6 bg-gray-100 py-3 px-4 rounded-xl text-gray-700 text-sm mb-6 overflow-x-auto no-scrollbar">
                        {/* Adapted labels for Project context */}
                        <div className="whitespace-nowrap">🏢 {property.tag}</div>
                        <div className="whitespace-nowrap">🏠 {property.baths}</div>
                        <div className="whitespace-nowrap">📐 {property.sqft}</div>
                      </div>

                      {property.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {property.amenities.map((a, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs whitespace-nowrap lowercase capitalize"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => navigate(`/projects/${property.id}`)}
                        className="w-full md:w-auto bg-[#A1734A] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#8a623e] transition-colors"
                      >
                        View Project Details
                      </button>
                    </div>
                  </div>

                  {/* RIGHT MEDIA SIDE */}
                  <div className="w-full md:w-1/2 h-64 md:h-auto bg-[#e8e8e8] relative flex items-center justify-center order-1 md:order-2 overflow-hidden">
                    <img
                      src={property.image || 'https://via.placeholder.com/800x600?text=No+Image'}
                      alt={property.title}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                    <span className="absolute top-4 right-4 bg-[#E2ECFF] text-[#2854C5] px-3 py-1 text-xs rounded-md font-semibold z-10">
                      {property.tag}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* RIGHT BUTTON */}
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-0 z-20 bg-white h-10 w-10 items-center justify-center rounded-full shadow hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* DOTS */}
        <div className="flex justify-center gap-3 mt-10">
          {properties.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (properties.length === 0) return;
                setTransitionEnabled(true);
                setCurrentIndex(properties.length + index);
              }}
              className={`w-3 h-3 rounded-full transition-all ${currentIndex % properties.length === index ? "bg-[#B2845A] scale-125" : "bg-gray-300"
                }`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate('/projects')}
            className="px-8 py-3 border border-[#B2845A] text-[#B2845A] font-semibold rounded-md hover:bg-[#B2845A] hover:text-white transition-colors"
          >
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopPicksSection;
