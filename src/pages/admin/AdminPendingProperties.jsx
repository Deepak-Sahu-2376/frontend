import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../utils/apiClient';
import { Loader2, Building2, MapPin, BedDouble, Bath, Ruler, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from '../../components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";

const AdminPendingProperties = () => {
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState([]);

    // Rejection Modal State
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchPendingProperties = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/properties/pending-verification?page=0&size=20&sort=createdAt%2CDESC`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                setProperties(data.content || []);
            } else {
                console.error("Failed to fetch pending properties:", data);
                toast.error("Failed to load pending properties");
            }
        } catch (error) {
            console.error("Error fetching pending properties:", error);
            toast.error("Network error while loading properties");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingProperties();
    }, []);

    const handleApprove = async (id) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('adminAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/properties/${id}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                toast.success("Property approved successfully");
                setProperties(prev => prev.filter(p => p.id !== id));
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to approve property");
            }
        } catch (error) {
            console.error("Approve error:", error);
            toast.error("Error approving property");
        } finally {
            setActionLoading(false);
        }
    };

    const openRejectDialog = (id) => {
        setSelectedPropertyId(id);
        setRejectionReason('');
        setIsRejectDialogOpen(true);
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }

        setActionLoading(true);
        try {
            const token = localStorage.getItem('adminAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/properties/${selectedPropertyId}/reject?reason=${encodeURIComponent(rejectionReason)}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                toast.success("Property rejected successfully");
                setProperties(prev => prev.filter(p => p.id !== selectedPropertyId));
                setIsRejectDialogOpen(false);
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to reject property");
            }
        } catch (error) {
            console.error("Reject error:", error);
            toast.error("Error rejecting property");
        } finally {
            setActionLoading(false);
        }
    };

    const getFullUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pending Properties</h1>
                    <p className="text-gray-500 mt-1">Review and approve property listings awaiting verification.</p>
                </div>
            </div>

            {properties.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                    No pending properties found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                    {properties.map((property) => (
                        <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full border-gray-200 group">
                            {/* Image Section - Fixed Height */}
                            <div className="relative h-48 w-full bg-gray-100 shrink-0">
                                {property.primaryImageUrl || property.images?.length > 0 ? (
                                    <img
                                        src={getFullUrl(property.primaryImageUrl || property.images?.[0])}
                                        alt={property.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                                        <Building2 className="h-12 w-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <Badge className="bg-white/95 text-gray-900 backdrop-blur-md shadow-sm hover:bg-white font-medium px-2.5 py-0.5">
                                        {property.propertyType}
                                    </Badge>
                                </div>
                            </div>

                            {/* Card Content - Grows to fill space */}
                            <div className="flex flex-col flex-1">
                                <CardHeader className="p-4 pb-2 space-y-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <CardTitle className="text-base font-semibold line-clamp-1" title={property.title}>
                                            {property.title}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate">{property.formattedAddress}</span>
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="p-4 pt-2 space-y-4 flex-1">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-bold text-orange-600">
                                            ₹{property.basePrice?.toLocaleString()}
                                        </span>
                                        {property.listingType === 'RENT' && <span className="text-sm text-gray-500">/mo</span>}
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 py-3 border-y border-gray-100">
                                        <div className="flex flex-col items-center gap-1">
                                            <BedDouble className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">{property.bedrooms} Beds</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 border-l border-gray-100">
                                            <Bath className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">{property.bathrooms} Baths</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 border-l border-gray-100">
                                            <Ruler className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">{property.formattedArea}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] px-2">
                                            {property.verificationStatus}
                                        </Badge>
                                        <span className="text-gray-400 text-[10px] uppercase tracking-wider font-medium">
                                            ID: {property.id}
                                        </span>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-4 pt-0 mt-auto grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={() => handleApprove(property.id)}
                                        disabled={actionLoading}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm shadow-green-200"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() => openRejectDialog(property.id)}
                                        variant="outline"
                                        disabled={actionLoading}
                                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                    </Button>
                                </CardFooter>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Property</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this property listing. This will be sent to the agent.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Enter rejection reason..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={actionLoading || !rejectionReason.trim()}
                        >
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Confirm Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPendingProperties;
