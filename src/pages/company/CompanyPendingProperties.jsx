import React, { useEffect, useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { MapPin, Building2, Calendar, CheckCircle, XCircle, Eye, User } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import CompanyLayout from './CompanyLayout';

const CompanyPendingProperties = () => {
    const { pendingProperties, fetchPendingPropertiesCompany, approveCompanyProperty, rejectCompanyProperty } = useCompany();
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingPropertiesCompany();
    }, []);

    const handleApprove = async (propertyId) => {
        await approveCompanyProperty(propertyId);
    };

    const handleRejectClick = (property) => {
        setSelectedProperty(property);
        setIsRejectDialogOpen(true);
        setRejectionReason('');
    };

    const handleRejectConfirm = async () => {
        if (!selectedProperty || !rejectionReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        const success = await rejectCompanyProperty(selectedProperty.id, rejectionReason);
        if (success) {
            setIsRejectDialogOpen(false);
            setRejectionReason('');
            setSelectedProperty(null);
        }
    };

    return (
        <CompanyLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Pending Agent Properties</h1>
                        <p className="text-gray-500 mt-1">Review and approve properties submitted by your agents</p>
                    </div>
                    <Button onClick={fetchPendingPropertiesCompany} variant="outline">
                        Refresh List
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Properties Awaiting Approval ({pendingProperties.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Property Name</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Type</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Location</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Agent</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Created At</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {!pendingProperties || pendingProperties.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-12 text-gray-500">
                                                No pending properties found
                                            </td>
                                        </tr>
                                    ) : (
                                        pendingProperties.map((property) => (
                                            <tr key={property.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-gray-900">{property.title}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{property.description}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                        {property.propertyType}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center text-gray-600">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {property.city}, {property.state}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-700">
                                                            {property.user ? `${property.user.firstName} ${property.user.lastName}` : `Agent (ID: ${property.userId || 'N/A'})`}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-500">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {format(new Date(property.createdAt), 'MMM d, yyyy')}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => navigate(`/property/${property.id}`)}
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleApprove(property.id)}
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 text-white"
                                                            disabled={property.status === 'APPROVED'}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleRejectClick(property)}
                                                            size="sm"
                                                            variant="destructive"
                                                            disabled={property.status === 'REJECTED'}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {!pendingProperties || pendingProperties.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No pending properties found
                                </div>
                            ) : (
                                pendingProperties.map((property) => (
                                    <div key={property.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{property.title}</h3>
                                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{property.description}</p>
                                            </div>
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                {property.propertyType}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span className="truncate">{property.city}, {property.state}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                <User className="w-3 h-3" />
                                                <span className="truncate">{property.user ? `${property.user.firstName} ${property.user.lastName}` : `ID: ${property.userId}`}</span>
                                            </div>
                                            <div className="flex items-center gap-1 col-span-2 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(property.createdAt), 'MMM d, yyyy')}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/property/${property.id}`)}
                                                className="flex-1"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </Button>
                                            <Button
                                                onClick={() => handleApprove(property.id)}
                                                size="sm"
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Approve
                                            </Button>
                                            <Button
                                                onClick={() => handleRejectClick(property)}
                                                size="sm"
                                                variant="destructive"
                                                className="flex-1"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject Property</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to reject this property? This action cannot be undone.
                                Please provide a reason for the rejection.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="reason">Rejection Reason</Label>
                                <Textarea
                                    id="reason"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="e.g., Incomplete details, poor image quality..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleRejectConfirm}>
                                Reject Property
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </CompanyLayout>
    );
};

export default CompanyPendingProperties;
