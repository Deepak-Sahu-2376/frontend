import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Share2, Heart, ArrowLeft, MapPin, CheckCircle2,
    Phone, Mail, Calendar, Ruler, Building2, Home,
    Maximize2, ShieldCheck, Trees, Car, Dumbbell,
    Gamepad2, Coffee, Wind, Shield, X, ChevronLeft,
    ChevronRight, PlayCircle, Waves, Users, Zap,
    Leaf, Train, GraduationCap, Stethoscope, ShoppingBag, Plane, Navigation,
    BookOpen, ArrowUpDown, Droplets, Recycle, Brush, Shirt, Camera, ShieldAlert,
    UserCheck, Sprout, CloudRain, Sun, Banknote, Briefcase, Projector, PawPrint,
    Armchair, Layers, Music, Mic2, Flame
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import MapComponent from '../components/MapComponent';
import ContactAgentForm from '../components/ContactAgentForm';
import { API_BASE_URL } from '../utils/apiClient';
import { getImageUrl } from '../utils/imageHelper';
import { useProjectDetails } from '../hooks/useProperties';


// Amenity icon mapping (Comprehensive)
const amenityIcons = {
    // Recreational
    'SWIMMING_POOL': Waves,
    'GYM_FITNESS_CENTER': Dumbbell,
    'PLAYGROUND': Gamepad2,
    'TENNIS_COURT': Dumbbell, // Fallback
    'BASKETBALL_COURT': Dumbbell, // Fallback
    'BADMINTON_COURT': Dumbbell, // Fallback
    'JOGGING_TRACK': Dumbbell, // Fallback
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
    'CONFERENCE_ROOM': Projector, // Or Users

    // Misc
    'PET_AREA': PawPrint,
    'SENIOR_CITIZEN_AREA': Armchair, // Or Heart
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

    // 1. Try exact match
    const normalizedName = name.toUpperCase().replace(/\s+/g, '_');
    if (amenityIcons[normalizedName]) return amenityIcons[normalizedName];

    // 2. Try legacy mapping/partial matches if strict match failed
    if (normalizedName.includes('POOL')) return amenityIcons['SWIMMING_POOL'];
    if (normalizedName.includes('GYM')) return amenityIcons['GYM_FITNESS_CENTER'];
    if (normalizedName.includes('PARK')) return amenityIcons['PARKING'];
    if (normalizedName.includes('GARDEN')) return amenityIcons['GARDEN_LANDSCAPING'];
    if (normalizedName.includes('SECURITY')) return amenityIcons['SECURITY_GUARD'];
    if (normalizedName.includes('PLAY')) return amenityIcons['PLAYGROUND'];
    if (normalizedName.includes('CLUB')) return amenityIcons['CLUBHOUSE'];

    return amenityIcons['default'];
};

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeMediaIndex, setActiveMediaIndex] = useState(null);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    // Use cached data hook
    const { data: rawData, isLoading: loading, error: queryError } = useProjectDetails(id);
    const error = queryError ? (queryError.message || 'Failed to load project') : null;

    // Transform data when rawData changes
    const project = useMemo(() => {
        if (!rawData) return null;
        const data = rawData;

        // Parse location advantages if it's a string
        let highlights = [];
        try {
            if (typeof data.locationAdvantages === 'string') {
                const cleanString = data.locationAdvantages.replace(/^\[|\]$/g, '');
                highlights = cleanString.split(',').map(s => s.trim()).filter(Boolean);
            } else if (Array.isArray(data.locationAdvantages)) {
                highlights = data.locationAdvantages;
            }
        } catch (e) {
            console.error("Error parsing location advantages", e);
            highlights = [data.locationAdvantages];
        }

        // Map media files
        const media = data.mediaFiles
            ?.filter(file => ['IMAGE', 'VIDEO'].includes(file.type))
            .map(file => ({
                type: file.type === 'VIDEO' ? 'video' : 'image',
                url: getImageUrl(file.mediaUrl),
                thumbnail: file.type === 'VIDEO' ? getImageUrl(file.mediaUrl) : undefined,
                label: file.categoryLabel || file.category
            })) || [];

        // If no media, add a placeholder
        if (media.length === 0) {
            media.push({
                type: 'image',
                url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
                label: 'Cover Image'
            });
        }

        // Map amenities with icons
        const amenities = data.amenities?.map(amenity => ({
            icon: getAmenityIcon(typeof amenity === 'string' ? amenity : amenity.name),
            label: (typeof amenity === 'string' ? amenity : amenity.name || '').replace(/_/g, ' ')
        })) || [];

        // Process Phases Images
        let processedPhases = [];
        if (data.phases) {
            processedPhases = data.phases.map(p => ({
                ...p,
                phaseLogoUrl: getImageUrl(p.phaseLogoUrl)
            }));
        }

        // Derive unit configurations
        const unitTypes = data.phases?.flatMap(phase =>
            phase.specifications ? [{
                id: phase.id || phase.phaseId,
                type: `Phase ${phase.phaseNumber}`,
                area: phase.carpetArea + ' sq.ft',
                price: phase.formattedPriceRange
            }] : []
        ) || [];

        return {
            ...data,
            phases: processedPhases,
            developer: data.developerName || data.company?.companyName,
            address: data.formattedAddress || `${data.address}, ${data.city}, ${data.state}`,
            reraId: data.phases?.[0]?.reraNumber || (data.reraApproved ? "RERA Approved" : "Pending"),
            priceRange: data.formattedPriceRange,
            sizeRange: data.formattedArea,
            configurations: data.projectType,
            floors: data.totalFloors ? `G+${data.totalFloors}` : 'N/A',
            highlights: highlights,
            media: media,
            amenities: amenities,
            unitTypes: unitTypes,
            nearby: [],
            videoUrl: data.videoUrl || data.video || media.find(m => m.type === 'video')?.url
        };
    }, [rawData]);

    // Reset preview index when project loads
    useEffect(() => {
        if (project) {
            setPreviewIndex(0);
        }
    }, [project?.id]);



    // Lightbox Handlers
    const openLightbox = (index) => setActiveMediaIndex(index);
    const closeLightbox = () => setActiveMediaIndex(null);

    const showNext = useCallback((e) => {
        e?.stopPropagation();
        if (project?.media) {
            setActiveMediaIndex((prev) => (prev + 1) % project.media.length);
        }
    }, [project]);

    const showPrev = useCallback((e) => {
        e?.stopPropagation();
        if (project?.media) {
            setActiveMediaIndex((prev) => (prev - 1 + project.media.length) % project.media.length);
        }
    }, [project]);

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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
                    <p className="text-gray-600">{error || 'Project not found'}</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate('/projects')}
                    >
                        Back to Projects
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
                        className="pointer-events-auto flex items-center bg-white/80 backdrop-blur-md shadow-sm border border-white/20 px-4 py-2 rounded-full text-gray-900 hover:text-blue-600 font-medium transition-all hover:bg-white"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Projects
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-3">{project.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-gray-500" /> {project.address}
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                                <span className="text-blue-600 font-medium">By {project.developer}</span>
                                {project.reraApproved && (
                                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100 font-normal">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> RERA Approved
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="flex flex-col gap-4 mb-12">
                    {/* Main Active Image */}
                    <div
                        className="active-image-container w-full h-[400px] md:h-[600px] bg-gray-100 rounded-2xl overflow-hidden cursor-pointer relative group"
                        onClick={() => openLightbox(previewIndex || 0)}
                    >
                        {project.media[previewIndex || 0]?.type === 'video' ? (
                            <div className="w-full h-full relative">
                                <video
                                    src={project.media[previewIndex || 0].url}
                                    className="w-full h-full object-cover"
                                    muted loop playsInline
                                    onMouseOver={e => e.target.play()}
                                    onMouseOut={e => e.target.pause()}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
                                    <PlayCircle className="w-16 h-16 text-white/90" />
                                </div>
                            </div>
                        ) : (
                            <img
                                src={project.media[previewIndex || 0]?.url}
                                alt={project.media[previewIndex || 0]?.label}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                        <div className="absolute bottom-4 right-4">
                            <Button variant="secondary" className="bg-white/90 hover:bg-white text-gray-900 shadow-lg">
                                <Maximize2 className="w-4 h-4 mr-2" /> View Fullscreen
                            </Button>
                        </div>
                    </div>

                    {/* Thumbnails Scrollbar */}
                    {project.media.length > 1 && (
                        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                            <div className="flex gap-4 min-w-max px-1">
                                {project.media.map((media, index) => (
                                    <div
                                        key={index}
                                        className={`relative w-32 h-24 md:w-40 md:h-28 flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${(previewIndex || 0) === index
                                            ? 'border-blue-600 shadow-md scale-105'
                                            : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreviewIndex(index);
                                        }}
                                    >
                                        {media.type === 'video' ? (
                                            <video src={media.url} className="w-full h-full object-cover" muted loop playsInline />
                                        ) : (
                                            <img
                                                src={media.url}
                                                alt={media.label}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        {media.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <PlayCircle className="w-8 h-8 text-white/80" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">

                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Key Specs Strip */}
                        <div className="flex flex-wrap gap-8 py-6 border-y border-gray-100">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Configurations</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Home className="w-4 h-4 text-gray-400" />
                                    {project.configurations || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Possession</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {project.possessionDate || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Avg. Price</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-gray-400" />
                                    ₹{project.pricePerSqft || 'N/A'}/sq.ft
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Size Range</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Maximize2 className="w-4 h-4 text-gray-400" />
                                    {project.sizeRange}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {project.name}</h2>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                            </p>
                        </div>

                        {/* Project Phases */}
                        {project.phases && project.phases.length > 0 && (
                            <div className="py-8 border-t border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Phases</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {project.phases.map((phase) => (
                                        <Card
                                            key={phase.id}
                                            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden group"
                                            onClick={() => navigate(`/projects/${project.id}/phases/${phase.id}`)}
                                        >
                                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                                {phase.phaseLogoUrl ? (
                                                    <img
                                                        src={phase.phaseLogoUrl}
                                                        alt={phase.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center flex-col text-gray-400">
                                                        <Building2 className="w-10 h-10 mb-2" />
                                                        <span className="text-sm">No Image</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-3 right-3">
                                                    <Badge className={`${phase.status === 'COMPLETED' ? 'bg-green-500' :
                                                        phase.status === 'CONSTRUCTION' ? 'bg-blue-500' :
                                                            'bg-orange-500'
                                                        } hover:bg-opacity-90`}>
                                                        {phase.status?.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="text-xs font-semibold text-blue-600 mb-1">PHASE {phase.phaseNumber}</p>
                                                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {phase.name || phase.phaseDisplayName}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                                    {phase.description || 'No description available for this phase.'}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Starting Price</p>
                                                        <p className="font-semibold text-gray-900">
                                                            {phase.formattedPriceRange || `₹${phase.startingPrice}`}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">Units</p>
                                                        <p className="font-medium text-gray-900">
                                                            {phase.availableUnits} / {phase.totalUnits}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Amenities */}
                        {project.amenities.length > 0 && (
                            <div className="py-8 border-t border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {project.amenities.map((amenity, index) => {
                                        const Icon = amenity.icon;
                                        return (
                                            <div key={index} className="flex items-center gap-3 text-gray-700 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                <Icon className="w-5 h-5 text-green-600 shrink-0" />
                                                <span className="text-base capitalize">{amenity.label.toLowerCase()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Specifications Grid - Cleaner Look */}
                        <div className="py-8 border-t border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-12">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Area</p>
                                    <p className="font-medium text-gray-900">{project.totalArea || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Units</p>
                                    <p className="font-medium text-gray-900">{project.totalUnits} Units</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Towers</p>
                                    <p className="font-medium text-gray-900">{project.totalTowers} Towers</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Floors</p>
                                    <p className="font-medium text-gray-900">{project.floors}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">RERA ID</p>
                                    <p className="font-medium text-gray-900">{project.reraId}</p>
                                </div>
                            </div>
                        </div>

                        {/* Project Video */}
                        {project.videoUrl && (
                            <div className="py-8 border-t border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Video</h2>
                                <div className="rounded-2xl overflow-hidden bg-black aspect-video relative">
                                    <video
                                        src={project.videoUrl}
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
                            <div className="bg-gray-100 h-[400px] rounded-2xl overflow-hidden mb-6 relative">
                                {project.latitude && project.longitude ? (
                                    <MapComponent
                                        latitude={project.latitude}
                                        longitude={project.longitude}
                                        title={project.name}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center flex-col gap-2">
                                        <MapPin className="w-10 h-10 text-gray-400" />
                                        <p className="text-gray-500">Map unavailable</p>
                                    </div>
                                )}
                            </div>

                            {project.highlights.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">What's Nearby</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {project.highlights.map((highlight, index) => (
                                            <Badge key={index} variant="outline" className="text-gray-600 font-normal px-3 py-1 border-gray-200">
                                                {highlight}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Sticky Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900 tracking-tight">
                                            {project.priceRange || 'Price on Request'}
                                        </p>
                                        <p className="text-gray-500 mt-1">Starting price</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        className="w-full h-12 text-base font-semibold bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-900/10"
                                        onClick={() => setIsContactModalOpen(true)}
                                    >
                                        Enquire Now
                                    </Button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <ShieldCheck className="w-4 h-4 text-green-600" />
                                    <span>Verified Listing</span>
                                </div>
                            </div>

                            {/* Contact Agent Card */}
                            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-[#B2845A]" /> Contact Agent
                                </h3>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold text-lg">
                                        PS
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Priya Sharma</p>
                                        <p className="text-sm text-gray-500">Senior Real Estate Agent</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button className="w-full bg-[#B2845A] hover:bg-[#8a623e] text-white">
                                        <Phone className="w-4 h-4 mr-2" /> Call +91 98765 43210
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full border-[#B2845A] text-[#B2845A] hover:bg-[#B2845A]/10"
                                        onClick={() => setIsContactModalOpen(true)}
                                    >
                                        <Mail className="w-4 h-4 mr-2" /> Send Message
                                    </Button>
                                </div>
                            </div> */}

                            {/* Schedule Visit Card */}
                            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[#B2845A]" /> Schedule Visit
                                </h3>

                                <Button className="w-full bg-[#B2845A] hover:bg-[#8a623e] text-white">
                                    <Calendar className="w-4 h-4 mr-2" /> Book Viewing
                                </Button>
                            </div> */}
                        </div>
                    </div>

                </div>
            </div>

            {/* Lightbox Modal (unchanged relative to previous structure, minimal styling updates if any needed) */}
            {activeMediaIndex !== null && project.media.length > 0 && (
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
                        {project.media[activeMediaIndex].type === 'video' ? (
                            <video
                                controls autoPlay playsInline
                                className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
                                src={project.media[activeMediaIndex].url}
                            />
                        ) : (
                            <img
                                src={project.media[activeMediaIndex].url}
                                alt={project.media[activeMediaIndex].label}
                                className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
                            />
                        )}
                        <p className="mt-4 text-white/80 text-lg font-medium tracking-wide">
                            {activeMediaIndex + 1} / {project.media.length} • {project.media[activeMediaIndex].label}
                        </p>
                    </div>
                </div>
            )}
            {/* Contact Modal */}
            <ContactAgentForm
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                title={project?.name}
                projectId={project?.id}
            />
        </div>
    );
};

export default ProjectDetails;
