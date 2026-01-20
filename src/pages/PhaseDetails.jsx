import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Calendar, Ruler, Building2,
    Home, Shield, CheckCircle2, FileText, Maximize2, Eye, X, ExternalLink,
    Waves, Dumbbell, Gamepad2, Trees, Car, Zap, Leaf, Wind,
    BookOpen, ArrowUpDown, Droplets, Recycle, Brush, Shirt, Camera, ShieldAlert,
    UserCheck, Sprout, CloudRain, Sun, Banknote, Briefcase, Projector, PawPrint,
    Armchair, Layers, Music, Mic2, Flame, Users, ShoppingBag, ShieldCheck, Phone
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { API_BASE_URL } from '../utils/apiClient';
import { getImageUrl } from '../utils/imageHelper';
import { toast } from 'sonner';
import { useUser } from '../contexts/UserContext';
import ContactAgentForm from '../components/ContactAgentForm';

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


const PhaseDetails = () => {
    const { id, phaseId } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // Added hook for redirect
    const [project, setProject] = useState(null);
    const [phase, setPhase] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useUser();
    const [viewDoc, setViewDoc] = useState({ isOpen: false, url: '', title: '' });
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const handleViewDocument = (url, title) => {
        if (!isAuthenticated) {
            toast.error("Please login to view documents");
            // Navigate to login, preserving current location to redirect back
            navigate('/sign-in', { state: { from: location.pathname } });
            return;
        }

        // Append params to prevent simple downloading/printing in some viewers
        // Note: This is a weak protection, true IDM/download managers can still fetch it.
        const protectedUrl = `${url}#toolbar=0&navpanes=0&scrollbar=0`;
        setViewDoc({ isOpen: true, url: protectedUrl, title });
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // We fetch the project details which contains the phases
                const response = await fetch(`${API_BASE_URL}/api/v1/properties/projects/${id}`);
                const result = await response.json();

                if (result.success && result.data) {
                    setProject(result.data);

                    // Find the specific phase
                    const foundPhase = result.data.phases?.find(p => p.id === parseInt(phaseId) || p.phaseId === parseInt(phaseId));
                    if (foundPhase) {
                        setPhase(foundPhase);
                    } else {
                        toast.error("Phase not found");
                    }
                } else {
                    toast.error("Failed to load project details");
                }
            } catch (error) {
                console.error("Error fetching details:", error);
                toast.error("Error loading details");
            } finally {
                setLoading(false);
            }
        };

        if (id && phaseId) {
            fetchDetails();
        }
    }, [id, phaseId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!project || !phase) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Phase not found</h2>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Project
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xl">
                        {project.name} - Phase {phase.phaseNumber}
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg border bg-white flex items-center justify-center overflow-hidden shrink-0">
                                {phase.phaseLogoUrl ? (
                                    <img
                                        src={getImageUrl(phase.phaseLogoUrl)}
                                        alt="Phase Logo"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className="hidden w-full h-full items-center justify-center bg-gray-50" style={{ display: phase.phaseLogoUrl ? 'none' : 'flex' }}>
                                    <Building2 className="w-8 h-8 text-gray-300" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-3xl font-bold text-gray-900">{phase.phaseDisplayName || phase.name}</h2>
                                    <Badge variant={phase.status === 'COMPLETED' ? 'success' : 'default'}>
                                        {phase.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center text-gray-500">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {project.address}, {project.city}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Price Range</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {phase.priceList && phase.priceList.length > 0
                                    ? `Starting from ${phase.priceList[0].price}`
                                    : (phase.startingPrice ? `Starting from ₹${phase.startingPrice}` : 'Price on Request')}
                            </p>
                            <Button
                                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => setIsContactModalOpen(true)}
                            >
                                Contact Agent
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Phase Status</p>
                            <p className="font-semibold">{phase.constructionStatus || phase.status || 'TBD'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">RERA Number</p>
                            <p className="font-semibold">{phase.reraNumber || 'Pending'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Total Units</p>
                            <p className="font-semibold">{phase.totalUnits || 'TBD'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Booked Units</p>
                            <p className="font-semibold">{phase.bookedUnits || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Overview & Stats */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Phase Overview</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                                    {/* Launch Date (if parsed from string/date) - using created/updated as fallback or specific fields if available */}
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Calendar className="w-4 h-4" /> Launched At
                                        </p>
                                        <p className="font-medium">{phase.launchDate ? new Date(phase.launchDate).toLocaleDateString() : (phase.createdAt ? new Date(phase.createdAt).toLocaleDateString() : 'N/A')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Building2 className="w-4 h-4" /> Completion
                                        </p>
                                        <p className="font-medium">{phase.completionPercentage ? `${phase.completionPercentage}%` : '0%'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Ruler className="w-4 h-4" /> Total Area
                                        </p>
                                        <p className="font-medium">{phase.totalArea ? `${phase.totalArea} sq.ft` : (phase.carpetArea ? `${phase.carpetArea} sq.ft` : 'N/A')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Shield className="w-4 h-4" /> Possession
                                        </p>
                                        <p className="font-medium">{phase.possessionDate ? new Date(phase.possessionDate).toLocaleDateString() : 'TBD'}</p>
                                    </div>
                                </div>

                                {phase.description && (
                                    <div className="mt-6 pt-6 border-t">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {phase.description}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Specifications (Previously Features/Highlights - now parsed from specifications string) */}
                        {phase.specifications && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Specifications</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {String(phase.specifications).split(',').filter(Boolean).map((spec, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-gray-700">
                                                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                                <span className="text-sm">{spec.trim()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}


                        {/* Amenities (Using PROJECT Amenities) */}
                        {project.amenities && project.amenities.length > 0 && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Project Amenities</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {project.amenities.map((amenity, index) => {
                                            // Handle if amenity is an object {name: '...'} or just a string
                                            const amenityName = typeof amenity === 'string' ? amenity : amenity.name;
                                            const IconComponent = getAmenityIcon(amenityName);
                                            const label = amenityName?.replace(/_/g, ' ') || 'Unknown';

                                            return (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                                                    <IconComponent className="w-6 h-6 text-blue-500 mb-2" />
                                                    <span className="text-sm text-gray-700 capitalize">{label.toLowerCase()}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}


                        {/* Inventory & Units */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Inventory Status</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <div className="text-center p-2 border-r border-gray-200 last:border-0">
                                        <p className="text-2xl font-bold text-gray-900">{phase.totalUnits}</p>
                                        <p className="text-xs text-gray-500">Total Units</p>
                                    </div>
                                    <div className="text-center p-2 border-r border-gray-200 last:border-0">
                                        <p className="text-2xl font-bold text-green-600">{phase.availableUnits}</p>
                                        <p className="text-xs text-gray-500">Available</p>
                                    </div>
                                    <div className="text-center p-2 border-r border-gray-200 last:border-0">
                                        <p className="text-2xl font-bold text-blue-600">{phase.soldUnits}</p>
                                        <p className="text-xs text-gray-500">Sold</p>
                                    </div>
                                    <div className="text-center p-2">
                                        <p className="text-2xl font-bold text-orange-600">{phase.bookedUnits || 0}</p>
                                        <p className="text-xs text-gray-500">Booked</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (Files & Downloads) */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Documents & Downloads</h3>
                                <div className="space-y-3">
                                    {phase.phaseBrochureUrl && (
                                        <div
                                            onClick={() => handleViewDocument(getImageUrl(phase.phaseBrochureUrl), "Brochure")}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="bg-red-50 p-2 rounded text-red-600">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">Brochure</p>
                                                    <p className="text-xs text-gray-500">View Document</p>
                                                </div>
                                            </div>
                                            <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-50" />
                                        </div>
                                    )}
                                    {phase.masterPlanUrl && (
                                        <div
                                            onClick={() => handleViewDocument(getImageUrl(phase.masterPlanUrl), "Master Plan")}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-50 p-2 rounded text-blue-600">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">Master Plan</p>
                                                    <p className="text-xs text-gray-500">View Map</p>
                                                </div>
                                            </div>
                                            <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-50" />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Floor Plans</h3>
                                {phase.floorPlanUrls && phase.floorPlanUrls.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {phase.floorPlanUrls.map((url, idx) => {
                                            const fullUrl = getImageUrl(url);
                                            const isPdf = fullUrl?.toLowerCase().endsWith('.pdf');

                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => handleViewDocument(fullUrl, `Floor Plan ${idx + 1}`)}
                                                    className="block relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer border"
                                                >
                                                    {isPdf ? (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-white">
                                                            <FileText className="w-8 h-8 mb-2 text-red-500" />
                                                            <span className="text-xs font-medium">PDF Floor Plan</span>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={fullUrl}
                                                            alt={`Floor Plan ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://placehold.co/400?text=No+Preview';
                                                            }}
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                                                        <div className="bg-white/90 p-1.5 rounded-full shadow-sm opacity-0 hover:opacity-100 transition-opacity">
                                                            <Maximize2 className="w-4 h-4 text-gray-900" />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No floor plans available.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Document Viewer Logic */}
            {viewDoc.isOpen && (
                viewDoc.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || (viewDoc.url.includes('cloudinary') && !viewDoc.url.endsWith('.pdf')) ? (
                    // Custom Lightbox for Images
                    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm">
                        <button
                            onClick={() => setViewDoc({ ...viewDoc, isOpen: false })}
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="w-full h-full max-w-7xl max-h-[90vh] p-4 flex flex-col items-center justify-center">
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Transparent Overlay to block interactions */}
                                <div
                                    className="absolute inset-0 z-20"
                                    onContextMenu={(e) => e.preventDefault()}
                                    onDragStart={(e) => e.preventDefault()}
                                ></div>

                                {/* Image displayed as background to make 'Save Image As' harder */}
                                <div
                                    className="w-full h-full bg-contain bg-center bg-no-repeat"
                                    style={{
                                        backgroundImage: `url(${viewDoc.url.split('#')[0]})`,
                                        pointerEvents: 'none',
                                        userSelect: 'none',
                                        WebkitUserSelect: 'none'
                                    }}
                                    role="img"
                                    aria-label={viewDoc.title}
                                ></div>
                            </div>
                            <div className="mt-4 text-white text-center">
                                <p className="text-lg font-medium">{viewDoc.title}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Standard Dialog for PDFs/Other
                    <Dialog open={viewDoc.isOpen} onOpenChange={(open) => !open && setViewDoc(prev => ({ ...prev, isOpen: false }))}>
                        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 flex flex-col bg-white overflow-hidden">
                            <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between shrink-0">
                                <div>
                                    <DialogTitle className="text-xl">{viewDoc.title}</DialogTitle>
                                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                                        Document Preview
                                    </DialogDescription>
                                </div>
                                <div className="flex items-center gap-2 mr-8">
                                    <Button variant="outline" size="sm" onClick={() => window.open(viewDoc.url, '_blank')}>
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Open in New Tab
                                    </Button>
                                </div>
                            </DialogHeader>
                            <div className="flex-1 w-full bg-gray-50 relative">
                                <iframe
                                    src={viewDoc.url}
                                    className="w-full h-full border-0"
                                    title="Document Viewer"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            )}
            {/* Contact Modal */}
            <ContactAgentForm
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                title={phase ? `${project?.name} - Phase ${phase.phaseNumber}` : ''}
                phaseId={phase?.id}
                projectId={id}
            />
        </div>
    );
};

export default PhaseDetails;
