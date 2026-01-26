import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Share2, Heart, ArrowLeft, MapPin, CheckCircle2,
    Phone, Mail, Calendar, Ruler, Building2, Home,
    Maximize2, ShieldCheck, Trees, Car, Dumbbell,
    Gamepad2, Coffee, Wind, Shield, X, ChevronLeft,
    ChevronRight, PlayCircle, Waves, Users, Zap,
    Leaf, Train, GraduationCap, Stethoscope, ShoppingBag, Plane, Navigation,
    BedDouble, Bath, Square, Sofa,
    BookOpen, ArrowUpDown, Droplets, Recycle, Brush, Shirt, Camera, ShieldAlert,
    UserCheck, Sprout, CloudRain, Sun, Banknote, Briefcase, Projector, PawPrint,
    Armchair, Layers, Music, Mic2, Flame
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import MapComponent from '../components/MapComponent';
import ContactAgentForm from '../components/ContactAgentForm';
import ScheduleVisitForm from '../components/ScheduleVisitForm';
import { API_BASE_URL } from '../utils/apiClient';
import { getImageUrl } from '../utils/imageHelper';
import { toast } from 'sonner';
import { usePropertyDetails } from '../hooks/useProperties';

// Amenity icon mapping (Comprehensive)
const amenityIcons = {
    // Recreational
    'SWIMMING_POOL': Waves,
    'GYM_FITNESS_CENTER': Dumbbell,
    'PLAYGROUND': Gamepad2,
    'TENNIS_COURT': Dumbbell,
    'BASKETBALL_COURT': Dumbbell,
    'BADMINTON_COURT': Dumbbell,
    'JOGGING_TRACK': Dumbbell,
    'YOGA_MEDITATION_AREA': Leaf,

    // Community
    'CLUBHOUSE': Home,
    'COMMUNITY_HALL': Users,
    'PARTY_LAWN': Music,
    'BARBECUE_AREA': Flame,
    'AMPHITHEATRE': Mic2,
    'LIBRARY': BookOpen,

    // Convenience
    'PARKING': Car,
    'ELEVATOR': ArrowUpDown,
    'POWER_BACKUP': Zap,
    'WATER_SUPPLY': Droplets,
    'WASTE_MANAGEMENT': Recycle,
    'HOUSEKEEPING': Brush,
    'LAUNDRY_SERVICE': Shirt,

    // Security
    'SECURITY_GUARD': ShieldCheck,
    'CCTV_SURVEILLANCE': Camera,
    'FIRE_SAFETY': ShieldAlert,
    'INTERCOM_FACILITY': Phone,
    'VISITOR_MANAGEMENT': UserCheck,

    // Landscaping
    'GARDEN_LANDSCAPING': Trees,
    'WATER_FEATURES': Waves,
    'TREE_PLANTATION': Sprout,
    'ORGANIC_WASTE_CONVERTER': Recycle,
    'RAINWATER_HARVESTING': CloudRain,
    'SOLAR_PANELS': Sun,

    // Commercial
    'SHOPPING_COMPLEX': ShoppingBag,
    'ATM_FACILITY': Banknote,
    'BUSINESS_CENTER': Briefcase,
    'CONFERENCE_ROOM': Projector,

    // Misc
    'PET_AREA': PawPrint,
    'SENIOR_CITIZEN_AREA': Armchair,
    'KIDS_PLAY_AREA': Gamepad2,
    'MULTIPURPOSE_HALL': Layers,

    // Legacy/Fallbacks
    'GYM': Dumbbell,
    'CHILDREN_PLAY_AREA': Gamepad2,
    'CLUB_HOUSE': Home,
    'GARDEN': Trees,
    'SECURITY': Shield,
    'INDOOR_GAMES': Gamepad2,
    'SPORTS_FACILITY': Dumbbell,
    'LANDSCAPING': Leaf,
    'VENTILATION': Wind,
    'default': CheckCircle2
};

const getAmenityIcon = (name) => {
    if (!name) return amenityIcons['default'];
    const normalizedName = name.toUpperCase().replace(/\s+/g, '_');

    // 1. Try exact match
    if (amenityIcons[normalizedName]) return amenityIcons[normalizedName];

    // 2. Try partial match
    if (normalizedName.includes('POOL')) return amenityIcons['SWIMMING_POOL'];
    if (normalizedName.includes('GYM')) return amenityIcons['GYM_FITNESS_CENTER'];
    if (normalizedName.includes('PARK')) return amenityIcons['PARKING'];
    if (normalizedName.includes('GARDEN')) return amenityIcons['GARDEN_LANDSCAPING'];
    if (normalizedName.includes('SECURITY')) return amenityIcons['SECURITY_GUARD'];
    if (normalizedName.includes('PLAY')) return amenityIcons['PLAYGROUND'];
    if (normalizedName.includes('CLUB')) return amenityIcons['CLUBHOUSE'];

    return amenityIcons['default'];
};

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const formatPrice = (price) => {
        if (!price) return 'Price on Request';
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
        return `₹${price.toLocaleString()}`;
    };

    const [activeMediaIndex, setActiveMediaIndex] = useState(null);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
    // Use cached data hook
    const { data: rawData, isLoading: loading, error: queryError } = usePropertyDetails(id);
    const error = queryError ? (queryError.message || 'Failed to load property') : null;

    // Transform data when rawData changes
    const property = useMemo(() => {
        if (!rawData) return null;
        const data = rawData;

        // Normalize data for UI
        const media = (data.images || []).map((url, index) => ({
            type: 'image',
            url: getImageUrl(url),
            label: `Image ${index + 1}`
        })).filter(item => item.url);

        // Prepare amenities list
        const amenitiesList = (data.amenities || []).map(amenityStr => ({
            label: amenityStr,
            icon: getAmenityIcon(amenityStr)
        }));

        // Calculated Fields
        const daysSinceLastActivity = Math.floor((new Date() - new Date(data.updatedAt)) / (1000 * 60 * 60 * 24));

        return {
            ...data,
            media: media,
            amenitiesList: amenitiesList,
            formattedPrice: formatPrice(data.basePrice),
            videoUrl: getImageUrl(data.videoUrl || data.video),
            floorPlan: getImageUrl(data.floorPlan),

            // Derived for UI
            configurationDisplay: data.bedrooms ? `${data.bedrooms} BHK` : 'Studio',
            formattedArea: `${data.superBuiltUpArea || data.builtUpArea || data.carpetArea || 0} sq.ft`,
            furnishingStatusDisplay: data.furnishingStatus?.replace(/_/g, ' ').toLowerCase(),
            parkingSummary: `${data.coveredParkingSpots || 0} Covered`,
            daysSinceLastActivity: daysSinceLastActivity,
            pricePerSqft: data.basePrice && (data.superBuiltUpArea || data.builtUpArea || data.carpetArea)
                ? Math.round(data.basePrice / (data.superBuiltUpArea || data.builtUpArea || data.carpetArea))
                : null,
            viewTypes: data.tower ? `Tower ${data.tower}` : 'Standard View',
            isVerified: data.status === 'APPROVED'
        };
    }, [rawData]);

    // Reset preview index when property loads
    useEffect(() => {
        if (property) {
            setPreviewIndex(0);
        }
    }, [property?.id]);


    // Lightbox Handlers
    const openLightbox = (index) => setActiveMediaIndex(index);
    const closeLightbox = () => setActiveMediaIndex(null);

    const showNext = useCallback((e) => {
        e?.stopPropagation();
        if (property?.media) {
            setActiveMediaIndex((prev) => (prev + 1) % property.media.length);
        }
    }, [property]);

    const showPrev = useCallback((e) => {
        e?.stopPropagation();
        if (property?.media) {
            setActiveMediaIndex((prev) => (prev - 1 + property.media.length) % property.media.length);
        }
    }, [property]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activeMediaIndex === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeMediaIndex, showNext, showPrev]);



    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h3>
                    <p className="text-gray-600 mb-6">{error || "We couldn't find the property you're looking for."}</p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/properties')}
                    >
                        Back to Properties
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Floating Back Button */}
            <div className="sticky top-24 z-40 px-4 pointer-events-none">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="pointer-events-auto flex items-center bg-white/80 backdrop-blur-md shadow-sm border border-white/20 px-4 py-2 rounded-full text-gray-900 hover:text-orange-600 font-medium transition-all hover:bg-white"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-3">{property.title}</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-gray-500" /> {property.formattedAddress}
                                        </span>
                                        {property.isVerified && (
                                            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100 font-normal">
                                                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Property
                                            </Badge>
                                        )}
                                        <Badge variant="outline" className="text-gray-600 font-normal">
                                            {property.propertyType?.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-3xl font-bold text-orange-600">
                                        {property.formattedPrice}
                                    </p>
                                    {!['RENT', 'PG', 'PAYING_GUEST'].includes(property.listingType) && (
                                        <p className="text-sm text-gray-500">
                                            {property.pricePerSqft ? `₹${property.pricePerSqft}/sq.ft` : 'Price on Request'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Grid */}
                {/* Image Gallery - Main + Thumbnails */}
                <div className="flex flex-col gap-4 mb-12">
                    {/* Main Active Image */}
                    {/* Main Active Image Wrapper */}
                    <div className="relative group">
                        <div
                            className="active-image-container w-full h-[400px] md:h-[600px] bg-gray-100 rounded-2xl overflow-hidden cursor-pointer relative"
                            onClick={() => openLightbox(previewIndex.current || 0)}
                        >
                            <img
                                src={property.media[previewIndex || 0]?.url || 'https://placehold.co/800x600?text=No+Image'}
                                alt={property.media[previewIndex || 0]?.label}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />

                            <div className="absolute bottom-4 right-4 z-20">
                                <Button variant="secondary" className="bg-white/90 hover:bg-white text-gray-900 shadow-lg">
                                    <Maximize2 className="w-4 h-4 mr-2" /> View Fullscreen
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails Scrollbar */}
                    {property.media.length > 1 && (
                        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                            <div className="flex gap-4 min-w-max px-1">
                                {property.media.map((media, index) => (
                                    <div
                                        key={index}
                                        className={`relative w-32 h-24 md:w-40 md:h-28 flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${(previewIndex || 0) === index
                                            ? 'border-orange-600 shadow-md scale-105'
                                            : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreviewIndex(index);
                                        }}
                                    >
                                        <img
                                            src={media.url}
                                            alt={media.label}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Separator / Important Details */}
                <div className="mb-12 hidden md:block">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-between px-8 py-6 border-b-4 border-b-[#B2845A]">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated On:</span>
                            <span className="text-sm font-bold text-gray-900">{new Date(property.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="h-8 w-px bg-gray-200" />
                        <div className="flex flex-col items-center gap-2">
                            <BedDouble className="w-5 h-5 text-[#B2845A]" />
                            <span className="text-sm font-bold text-gray-900">{property.bedrooms} Bedrooms</span>
                        </div>
                        <div className="h-8 w-px bg-gray-200" />
                        <div className="flex flex-col items-center gap-2">
                            <Bath className="w-5 h-5 text-[#B2845A]" />
                            <span className="text-sm font-bold text-gray-900">{property.bathrooms} Bathrooms</span>
                        </div>
                        <div className="h-8 w-px bg-gray-200" />
                        <div className="flex flex-col items-center gap-2">
                            <Car className="w-5 h-5 text-[#B2845A]" />
                            <span className="text-sm font-bold text-gray-900">{property.coveredParkingSpots || 0} Parking</span>
                        </div>
                        <div className="h-8 w-px bg-gray-200" />
                        <div className="flex flex-col items-center gap-2">
                            <Ruler className="w-5 h-5 text-[#B2845A]" />
                            <span className="text-sm font-bold text-gray-900">{property.formattedArea}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">

                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Key Specs Strip */}
                        <div className="flex flex-wrap gap-8 py-6 border-y border-gray-100">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Listing Type</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-2 capitalize">
                                    <Briefcase className="w-4 h-4 text-orange-500" />
                                    {property.listingType?.toLowerCase()?.replace(/_/g, ' ')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Property Type</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-2 capitalize">
                                    <Home className="w-4 h-4 text-orange-500" />
                                    {property.propertyType?.toLowerCase()?.replace(/_/g, ' ')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Furnishing</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-2 capitalize">
                                    <Sofa className="w-4 h-4 text-orange-500" />
                                    {property.furnishingStatusDisplay || 'Unfurnished'}
                                </p>
                            </div>
                            {property.carpetArea && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Carpet Area</p>
                                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Square className="w-4 h-4 text-orange-500" />
                                        {property.carpetArea} sq.ft
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Floor</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-orange-500" />
                                    {property.floorNumber} (Total {property.totalFloors})
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Property</h2>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        {property.amenitiesList && property.amenitiesList.length > 0 && (
                            <div className="py-8 border-t border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {property.amenitiesList.map((amenity, index) => {
                                        const Icon = amenity.icon;
                                        return (
                                            <div key={index} className="flex items-center gap-3 text-gray-700 p-3 bg-gray-50 hover:bg-orange-50 rounded-xl transition-colors border border-transparent hover:border-orange-100">
                                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                                    <Icon className="w-5 h-5 text-orange-600 shrink-0" />
                                                </div>
                                                <span className="text-base font-medium capitalize">{amenity.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}



                        {/* Property Video */}
                        {property.videoUrl && (
                            <div className="py-8 border-t border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Video</h2>
                                <div className="rounded-2xl overflow-hidden bg-black aspect-video relative">
                                    <video
                                        src={property.videoUrl}
                                        controls
                                        className="w-full h-full object-contain"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        )}

                        {/* Location Map */}
                        <div className="py-8 border-t border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
                            <div className="bg-gray-100 h-[400px] rounded-2xl overflow-hidden mb-6 relative border border-gray-200">
                                {property.latitude && property.longitude ? (
                                    <MapComponent
                                        latitude={property.latitude}
                                        longitude={property.longitude}
                                        title={property.title}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center flex-col gap-2 bg-slate-50">
                                        <MapPin className="w-10 h-10 text-gray-300" />
                                        <p className="text-gray-500 font-medium">Map view unavailable for this address</p>
                                        <p className="text-sm text-gray-400">{property.formattedAddress}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sticky Contact Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* Price Card */}
                            <div className="bg-white rounded-2xl shadow-xl shadow-orange-900/5 border border-orange-100 p-6 sm:p-8">
                                <div className="mb-6">
                                    <p className="text-lg text-gray-500 font-medium">Asking Price</p>
                                    <p className="text-4xl font-bold text-gray-900 tracking-tight mt-1">
                                        {property.formattedPrice}
                                    </p>
                                    {property.priceNegotiable && (
                                        <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-100 border-none">
                                            Price Negotiable
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        className="w-full h-12 text-base font-semibold bg-gray-900 hover:bg-gray-800 text-white"
                                        onClick={() => setIsContactModalOpen(true)}
                                    >
                                        Enquire Now
                                    </Button>
                                </div>


                            </div>

                            {/* Additional Info / Agent Card Placeholder */}
                            <div>
                                <ScheduleVisitForm
                                    title={property?.title}
                                    propertyId={property?.id}
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Lightbox Modal */}
            {activeMediaIndex !== null && property.media.length > 0 && (
                <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center backdrop-blur-md">
                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-[70]"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <button
                        onClick={showPrev}
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors z-[70]"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>
                    <button
                        onClick={showNext}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors z-[70]"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>

                    <div className="w-full h-full p-4 flex flex-col items-center justify-center">
                        <img
                            src={property.media[activeMediaIndex].url}
                            alt={property.media[activeMediaIndex].label}
                            className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
                        />
                        <p className="mt-4 text-white/80 text-lg font-medium tracking-wide">
                            {activeMediaIndex + 1} / {property.media.length} • {property.media[activeMediaIndex].label}
                        </p>
                    </div>
                </div>
            )}

            {/* Contact Modal */}
            <ContactAgentForm
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                title={property?.title}
                propertyId={property?.id}
            />


        </div>
    );
};

export default PropertyDetails;
