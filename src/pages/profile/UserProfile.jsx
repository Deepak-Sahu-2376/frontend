import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Clock,
    Globe,
    Activity,
    CheckCircle2,
    XCircle,
    Smartphone,
    Bell,
    Camera,
    Trash2,
    AlertCircle,
    Building2
} from 'lucide-react';
import { api } from '../../utils/apiClient';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

const UserProfile = () => {
    const { user: contextUser, uploadProfileImage, deleteProfileImage, fetchMyVisits, fetchMyProperties, cancelVisit, fetchUserProfile } = useUser();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [visits, setVisits] = useState([]);
    const [loadingVisits, setLoadingVisits] = useState(false);

    // Cancellation state
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedVisitId, setSelectedVisitId] = useState(null);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelling, setCancelling] = useState(false);

    const [myProperties, setMyProperties] = useState([]);
    const [loadingProperties, setLoadingProperties] = useState(false);

    // New state for Received Visits and Inquiries (For Property Owners)
    const [receivedVisits, setReceivedVisits] = useState([]);
    const [loadingReceivedVisits, setLoadingReceivedVisits] = useState(false);
    const [receivedInquiries, setReceivedInquiries] = useState([]);
    const [loadingReceivedInquiries, setLoadingReceivedInquiries] = useState(false);

    useEffect(() => {
        if (contextUser?.userType === 'BUYER' || contextUser?.roles?.includes('BUYER')) {
            loadVisits();
            loadMyProperties();
            loadReceivedVisits();
            loadReceivedInquiries();
        }
    }, [contextUser]);

    const loadMyProperties = async () => {
        setLoadingProperties(true);
        const result = await fetchMyProperties();
        if (result.success && result.data) {
            setMyProperties(result.data.content || []);
        }
        setLoadingProperties(false);
    };

    const loadVisits = async () => {
        setLoadingVisits(true);
        const result = await fetchMyVisits();
        if (result.success && result.data) {
            // The structure is result (from UserContext) -> data (response body) -> data (pagination wrapper) -> content (array)
            const responseData = result.data;
            const visitsList = responseData.data?.content || responseData.content || (Array.isArray(responseData.data) ? responseData.data : []);
            setVisits(visitsList || []);
        }
        setLoadingVisits(false);
    };

    const openCancelDialog = (visitId) => {
        setSelectedVisitId(visitId);
        setCancelReason("");
        setCancelDialogOpen(true);
    };

    const handleSubmitCancellation = async () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a reason for cancellation");
            return;
        }

        setCancelling(true);
        const result = await cancelVisit(selectedVisitId, cancelReason);
        setCancelling(false);

        if (result.success) {
            toast.success("Visit cancelled successfully");
            setCancelDialogOpen(false);
            loadVisits(); // Refresh list
        } else {
            toast.error(result.message || "Failed to cancel visit");
        }
    };

    const loadReceivedVisits = async () => {
        setLoadingReceivedVisits(true);
        try {
            // Include full API path including version
            const response = await api.get('/api/v1/visits/received');
            if (response.success && response.data) {
                const list = response.data.content || response.data || [];
                setReceivedVisits(list); // Use list, not response.data directly if mapped
            }
        } catch (error) {
            console.error("Failed to load received visits:", error);
        } finally {
            setLoadingReceivedVisits(false);
        }
    };

    const loadReceivedInquiries = async () => {
        setLoadingReceivedInquiries(true);
        try {
            const response = await api.get('/api/v1/inquiries/received');
            if (response.success && response.data) {
                setReceivedInquiries(response.data || []);
            }
        } catch (error) {
            console.error("Failed to load received inquiries:", error);
        } finally {
            setLoadingReceivedInquiries(false);
        }
    };

    const location = useLocation();

    // Determine context based on path
    const isAdminProfile = location.pathname.startsWith('/admin');
    const isCompanyProfile = location.pathname.startsWith('/company');
    const isAgentProfile = location.pathname.startsWith('/agent');

    // Select token key
    let tokenKey = 'accessToken'; // Default (Buyer)
    if (isAdminProfile) tokenKey = 'adminAccessToken';
    else if (isCompanyProfile) tokenKey = 'companyAccessToken';
    else if (isAgentProfile) tokenKey = 'agentAccessToken';

    // ... (keep state) ...

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size too large (max 5MB)");
            return;
        }

        const toastId = toast.loading("Uploading...");

        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem(tokenKey);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/v1/users/me/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Profile picture updated!");
                fetchProfile(); // Refresh data
                // For non-admin, we might want to update context if possible, but context separation makes it hard to "reach out"
                // Users will see update on refresh.
            } else {
                toast.error(result.message || "Failed to upload");
            }
        } catch (err) {
            console.error(err);
            toast.error("Upload failed");
        } finally {
            toast.dismiss(toastId);
        }
    };

    const handleDeleteImage = async () => {
        if (!confirm("Are you sure you want to remove your profile picture?")) return;

        const toastId = toast.loading("Removing...");
        try {
            // api.delete handles JSON body/headers. It uses buildHeaders. 
            // We need to pass tokenKey or raw token if api helper doesn't support tokenKey arg yet (I assumed it did earlier but maybe not?)
            // Actually my earlier edit to api.delete might not have persisted if I didn't edit apiClient.
            // Safest is to use raw fetch or ensure api client supports it. 
            // Let's use raw fetch for safety here as I didn't edit apiClient.js.

            const token = localStorage.getItem(tokenKey);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/v1/users/me/avatar`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();

            if (response.ok) {
                toast.success("Profile picture removed");
                fetchProfile();
            } else {
                toast.error(result.message || "Failed to remove");
            }
        } catch (err) {
            toast.error("Removal failed");
        } finally {
            toast.dismiss(toastId);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [location.pathname]);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            // Manual fetch to ensure correct token usage (api client defaults to localStorage.getItem('accessToken'))
            const token = localStorage.getItem(tokenKey);

            // If no token for this specific role, redirect
            if (!token) {
                throw { status: 401, message: "No session found" };
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/v1/users/me?t=${Date.now()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                const userData = data.data?.user || data.data || data;
                setProfileData(userData);
            } else {
                if (response.status === 401) throw { status: 401 };
                setError(data.message || 'Failed to load profile data');
            }
        } catch (err) {
            console.error('Error fetching profile:', err);

            if (err.status === 401) {
                if (isAdminProfile) navigate('/admin/login');
                else if (isCompanyProfile) navigate('/company/login');
                else if (isAgentProfile) navigate('/agent/login');
                else navigate('/sign-in');
                return;
            }
            setError(err.message || 'Error loading profile information');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Profile</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button onClick={fetchProfile} className="w-full">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
                <Button onClick={fetchProfile}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header Section */}
                <Card className="border-none shadow-md overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                    <CardContent className="relative pt-0 px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-center">

                            <div className="flex flex-col items-center -mt-16 mb-4 sm:mb-0 sm:mr-6">
                                <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center text-4xl font-bold text-orange-600 overflow-hidden relative">
                                    {profileData.profileImageUrl ? (
                                        <img
                                            src={profileData.profileImageUrl.startsWith('http')
                                                ? profileData.profileImageUrl
                                                : `${import.meta.env.VITE_API_BASE_URL || ''}${profileData.profileImageUrl}`
                                            }
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        profileData.initials || <User className="h-16 w-16 text-gray-400" />
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 mt-3">
                                    <label
                                        htmlFor="profile-upload"
                                        className="cursor-pointer p-2 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
                                        title="Upload new photo"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </label>

                                    {profileData.profileImageUrl && (
                                        <button
                                            onClick={handleDeleteImage}
                                            className="p-2 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-gray-600"
                                            title="Remove photo"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    id="profile-upload"
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="text-center sm:text-left pt-2 flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{profileData.displayName || profileData.fullName}</h1>
                                        <p className="text-gray-500 font-medium">{profileData.email}</p>
                                    </div>
                                    <div className="mt-4 sm:mt-0 flex space-x-2">
                                        <Badge className={`${profileData.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'} border-transparent`}>
                                            {profileData.statusBadge}
                                        </Badge>
                                        <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                                            {profileData.verificationBadge?.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                        {profileData.locationString}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Shield className="h-4 w-4 mr-1 text-gray-400" />
                                        {profileData.rolesList}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                        Member for {profileData.accountAge}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* My Booked Visits Section - Only for Buyers */}
                {(contextUser?.userType === 'BUYER' || contextUser?.roles?.includes('BUYER')) && (
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-orange-600" />
                                My Booked Visits
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingVisits ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                                </div>
                            ) : visits.length > 0 ? (
                                <div className="space-y-4">
                                    {visits.map((visit) => (
                                        <div
                                            key={visit.id}
                                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => {
                                                if (visit.property) {
                                                    const title = encodeURIComponent(visit.property.title || 'property');
                                                    const city = encodeURIComponent(visit.property.city || 'all');
                                                    navigate(`/property/${title}/${city}/${visit.property.id}`);
                                                }
                                            }}
                                        >
                                            <div className="mb-2 sm:mb-0">
                                                <h4 className="font-semibold text-gray-900">{visit.property?.title || `Property #${visit.propertyId}`}</h4>
                                                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mt-1 gap-2 sm:gap-4">
                                                    <span className="flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {new Date(visit.preferredVisitTime).toLocaleDateString()} at {new Date(visit.preferredVisitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {visit.agent?.email && (
                                                        <span className="flex items-center">
                                                            <Mail className="w-3 h-3 mr-1" />
                                                            {visit.agent.userType === 'admin' ? 'Admin' :
                                                                visit.agent.userType === 'company' ? 'Company' : 'Agent'}: {visit.agent.email}
                                                        </span>
                                                    )}
                                                </div>
                                                {/* Cancel Button */}
                                                {!['COMPLETED', 'CANCELLED', 'REJECTED'].includes(visit.status) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="mt-2 h-auto p-0 text-red-600 hover:text-red-700 hover:bg-transparent font-normal flex items-center"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openCancelDialog(visit.id);
                                                        }}
                                                    >
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Cancel Visit
                                                    </Button>
                                                )}
                                            </div>
                                            <Badge className={
                                                visit.status === 'APPROVED' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' :
                                                    visit.status === 'REJECTED' ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' :
                                                        'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200'
                                            }>
                                                {visit.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500">No visits booked yet.</p>
                                    <Button variant="link" className="text-orange-600 mt-2" onClick={() => navigate('/properties')}>
                                        Browse Properties
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* My Listed Properties Section - For Buyers (and Agents/Owners viewing their profile) */}
                {(contextUser?.userType === 'BUYER' || contextUser?.userType === 'AGENT') && (
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-orange-600" />
                                My Listed Properties
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingProperties ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                                </div>
                            ) : myProperties.length > 0 ? (
                                <div className="space-y-4">
                                    {myProperties.map((property) => (
                                        <div
                                            key={property.id}
                                            className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => {
                                                const title = encodeURIComponent(property.title || 'property');
                                                const city = encodeURIComponent(property.city || 'all');
                                                navigate(`/property/${title}/${city}/${property.id}`);
                                            }}
                                        >
                                            <div className="flex items-center gap-4 mb-2 sm:mb-0 w-full sm:w-auto">
                                                <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                    {property.primaryImageUrl || property.images?.[0] ? (
                                                        <img
                                                            src={property.primaryImageUrl?.startsWith('http') ? property.primaryImageUrl : `${import.meta.env.VITE_API_BASE_URL}${property.primaryImageUrl || property.images?.[0]}`}
                                                            alt={property.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Building2 className="h-8 w-8 text-gray-400 m-auto mt-4" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h4>
                                                    <p className="text-sm text-gray-500">{property.formattedAddress || property.address}</p>
                                                    <p className="text-sm font-medium text-orange-600 mt-1">
                                                        {property.listingType === 'RENT'
                                                            ? `₹${property.monthlyRent?.toLocaleString() || 0}/mo`
                                                            : `₹${property.basePrice?.toLocaleString() || 0}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
                                                <Badge className={
                                                    property.status === 'APPROVED' || property.status === 'VERIFIED' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' :
                                                        property.status === 'REJECTED' ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' :
                                                            'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200'
                                                }>
                                                    {property.status || 'PENDING'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500">You haven't listed any properties yet.</p>
                                    <Button variant="link" className="text-orange-600 mt-2" onClick={() => navigate('/buyer/post-property')}>
                                        Post a Property
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Received Visits Section - For Owners */}
                {(contextUser?.userType === 'BUYER' || contextUser?.userType === 'AGENT') && (
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-orange-600" />
                                Visits on My Properties
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingReceivedVisits ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                                </div>
                            ) : receivedVisits.length > 0 ? (
                                <div className="space-y-4">
                                    {receivedVisits.map((visit) => (
                                        <div
                                            key={visit.id}
                                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => {
                                                if (visit.property) {
                                                    const title = encodeURIComponent(visit.property.title || 'property');
                                                    const city = encodeURIComponent(visit.property.city || 'all');
                                                    navigate(`/property/${title}/${city}/${visit.property.id}`);
                                                }
                                            }}
                                        >
                                            <div className="mb-2 sm:mb-0">
                                                <h4 className="font-semibold text-gray-900">{visit.property?.title || `Property #${visit.propertyId}`}</h4>
                                                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mt-1 gap-2 sm:gap-4">
                                                    <span className="flex items-center">
                                                        <User className="w-3 h-3 mr-1" />
                                                        Visitor: {visit.user?.firstName} {visit.user?.lastName} ({visit.user?.email})
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {new Date(visit.preferredVisitTime).toLocaleDateString()} at {new Date(visit.preferredVisitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge className={
                                                visit.status === 'CONFIRMED' || visit.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    visit.status === 'CANCELLED' || visit.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                            }>
                                                {visit.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500">No visits scheduled on your properties yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Received Inquiries Section - For Owners */}
                {(contextUser?.userType === 'BUYER' || contextUser?.userType === 'AGENT') && (
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Mail className="h-5 w-5 text-orange-600" />
                                Enquiries Received
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingReceivedInquiries ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                                </div>
                            ) : receivedInquiries.length > 0 ? (
                                <div className="space-y-4">
                                    {receivedInquiries.map((inquiry) => (
                                        <div
                                            key={inquiry.id}
                                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => {
                                                if (inquiry.property) {
                                                    const title = encodeURIComponent(inquiry.property.title || 'property');
                                                    const city = encodeURIComponent(inquiry.property.city || 'all');
                                                    navigate(`/property/${title}/${city}/${inquiry.property.id}`);
                                                }
                                            }}
                                        >
                                            <div className="mb-2 sm:mb-0">
                                                <h4 className="font-semibold text-gray-900">{inquiry.property?.title || "Property Inquiry"}</h4>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    <span className="font-medium">{inquiry.name}</span> ({inquiry.email}, {inquiry.phone})
                                                </div>
                                                <p className="text-sm text-gray-500 italic mt-1">"{inquiry.message}"</p>
                                                <p className="text-xs text-gray-400 mt-1">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = `mailto:${inquiry.email}`;
                                                }}
                                            >
                                                Reply
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <Mail className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500">No enquiries received yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Personal Info & Verification */}
                    <div className="space-y-6 md:col-span-2">
                        {/* Personal Information */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center">
                                    <User className="h-5 w-5 mr-2 text-orange-600" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium text-gray-500 uppercase">Full Name</span>
                                        <p className="text-sm font-medium text-gray-900">{profileData.fullName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium text-gray-500 uppercase">Mobile Number</span>
                                        <p className="text-sm font-medium text-gray-900 flex items-center">
                                            {profileData.phone || 'Not provided'}
                                            {profileData.isPhoneVerified && <CheckCircle2 className="h-3 w-3 ml-2 text-green-500" />}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium text-gray-500 uppercase">Timezone</span>
                                        <div className="flex items-center text-sm font-medium text-gray-900">
                                            <Globe className="h-3 w-3 mr-1 text-gray-400" />
                                            {profileData.timezone}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-medium text-gray-500 uppercase">Language</span>
                                        <p className="text-sm font-medium text-gray-900 uppercase">{profileData.language}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Statistics */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center">
                                    <Activity className="h-5 w-5 mr-2 text-orange-600" />
                                    Account Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-500 mb-1">Logins</p>
                                        <p className="text-xl font-bold text-gray-900">{profileData.loginCount}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                                        <p className="text-xs text-gray-500 mb-1">Completion</p>
                                        <p className="text-xl font-bold text-gray-900">{profileData.profileCompletionPercentage}%</p>
                                    </div>
                                    <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Last Login</p>
                                        <p className="text-sm font-medium text-gray-900">{profileData.lastLoginAt}</p>
                                        <p className="text-xs text-gray-400 mt-1">Created: {profileData.createdAt}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Verification & Settings */}
                    <div className="space-y-6">

                        {/* Verification Status */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center">
                                    <Shield className="h-5 w-5 mr-2 text-orange-600" />
                                    Verification
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Mail className="h-4 w-4 mr-3 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Email</span>
                                    </div>
                                    {profileData.isEmailVerified ?
                                        <CheckCircle2 className="h-5 w-5 text-green-500" /> :
                                        <XCircle className="h-5 w-5 text-red-400" />
                                    }
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Smartphone className="h-4 w-4 mr-3 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Phone</span>
                                    </div>
                                    {profileData.isPhoneVerified ?
                                        <CheckCircle2 className="h-5 w-5 text-green-500" /> :
                                        <Button variant="link" className="h-auto p-0 text-xs text-orange-600 underline">Verify</Button>
                                    }
                                </div>
                                <div className="pt-2">
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <span className="text-gray-500">Level</span>
                                        <span className="font-semibold text-gray-900">{profileData.verificationLevel}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-orange-500 h-2 rounded-full"
                                            style={{ width: profileData.isVerified ? '100%' : '30%' }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notifications */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center">
                                    <Bell className="h-5 w-5 mr-2 text-orange-600" />
                                    Notifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Email Updates</span>
                                    <span className={`h-2 w-2 rounded-full ${profileData.allowEmailNotifications ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">SMS Alerts</span>
                                    <span className={`h-2 w-2 rounded-full ${profileData.allowSmsNotifications ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Push Notifications</span>
                                    <span className={`h-2 w-2 rounded-full ${profileData.allowPushNotifications ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Marketing</span>
                                    <span className={`h-2 w-2 rounded-full ${profileData.allowMarketingEmails ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
                {/* Cancel Visit Dialog */}
                <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cancel Visit</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to cancel this visit? Please provide a reason.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason for Cancellation</Label>
                                <Textarea
                                    id="reason"
                                    placeholder="E.g., Plans changed, found another property..."
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setCancelDialogOpen(false)} disabled={cancelling}>
                                Keep Visit
                            </Button>
                            <Button variant="destructive" onClick={handleSubmitCancellation} disabled={cancelling || !cancelReason.trim()}>
                                {cancelling ? "Cancelling..." : "Confirm Cancellation"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default UserProfile;
