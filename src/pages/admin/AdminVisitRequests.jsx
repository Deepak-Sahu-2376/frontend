import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Calendar, User, Phone, Mail, Clock, MapPin, Eye, CheckCircle, XCircle, Ban, CheckCheck } from 'lucide-react';
import { API_BASE_URL } from '../../utils/apiClient';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";

const AdminVisitRequests = () => {
    const navigate = useNavigate();

    // Pending Requests State
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Confirmed Requests State
    const [confirmedRequests, setConfirmedRequests] = useState([]);
    const [confirmedLoading, setConfirmedLoading] = useState(true);
    const [confirmedPage, setConfirmedPage] = useState(0);
    const [confirmedTotalPages, setConfirmedTotalPages] = useState(0);

    const [activeTab, setActiveTab] = useState("pending");

    // Action State
    const [actionLoading, setActionLoading] = useState(null);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedVisitId, setSelectedVisitId] = useState(null);
    const [cancelReason, setCancelReason] = useState("");

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) {
                toast.error("Authentication error. Please login again.");
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/visit/agent/pending?page=${page}&size=20`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.content) {
                setRequests(data.content);
                setTotalPages(data.totalPages);
            } else {
                setRequests([]);
            }
        } catch (error) {
            console.error('Error fetching visit requests:', error);
            toast.error('Failed to load visit requests');
        } finally {
            setLoading(false);
        }
    };

    const fetchConfirmedRequests = async () => {
        setConfirmedLoading(true);
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/v1/visit/agent/confirmed?page=${confirmedPage}&size=20&sort=preferredVisitTime,asc`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.content) {
                setConfirmedRequests(data.content);
                setConfirmedTotalPages(data.totalPages);
            } else {
                setConfirmedRequests([]);
            }
        } catch (error) {
            console.error('Error fetching confirmed requests:', error);
            toast.error('Failed to load confirmed requests');
        } finally {
            setConfirmedLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "pending") {
            fetchRequests();
        } else {
            fetchConfirmedRequests();
        }
    }, [page, confirmedPage, activeTab]);

    const handleStatusUpdate = async (visitId, action) => {
        setActionLoading(visitId);
        try {
            const token = localStorage.getItem('adminAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/visits/${visitId}/${action}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                toast.success(`Visit ${action}ed successfully`);
                if (activeTab === "pending") fetchRequests();
                else fetchConfirmedRequests();
            } else {
                const error = await response.json();
                toast.error(error.message || `Failed to ${action} visit`);
            }
        } catch (error) {
            console.error(`Error ${action}ing visit:`, error);
            toast.error(`An error occurred while ${action}ing visit`);
        } finally {
            setActionLoading(null);
        }
    };

    const openCancelModal = (visitId) => {
        setSelectedVisitId(visitId);
        setCancelReason("");
        setCancelModalOpen(true);
    };

    const handleCancelSubmit = async () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a cancellation reason");
            return;
        }

        setActionLoading(selectedVisitId);
        try {
            const token = localStorage.getItem('adminAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/visits/${selectedVisitId}/cancel`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason: cancelReason })
            });

            if (response.ok) {
                toast.success("Visit cancelled successfully");
                setCancelModalOpen(false);
                if (activeTab === "pending") fetchRequests();
                else fetchConfirmedRequests();
            } else {
                const error = await response.json();
                toast.error(error.message || "Failed to cancel visit");
            }
        } catch (error) {
            console.error("Error cancelling visit:", error);
            toast.error("An error occurred while cancelling visit");
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status) => {
        const normalizedStatus = status?.toUpperCase() || '';
        switch (normalizedStatus) {
            case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-200';
            case 'COMPLETED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            case 'REQUESTED':
            case 'PENDING':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const isPendingStatus = (status) => {
        const s = status?.toUpperCase() || '';
        return s === 'PENDING' || s === 'REQUESTED';
    };

    const VisitTable = ({ data, isLoading, isConfirmedTab }) => {
        if (isLoading) {
            return <div className="p-12 text-center text-gray-500">Loading requests...</div>;
        }

        if (data.length === 0) {
            return <div className="p-12 text-center text-gray-500">No {isConfirmedTab ? 'confirmed' : 'pending'} visit requests found.</div>;
        }

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs">User Details</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs">Property ID</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs">Preferred Time</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold">
                                            {request.fullName?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{request.fullName}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <Phone className="w-3 h-3" /> {request.phone}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> {request.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="outline" className="font-mono">
                                        #{request.propertyId}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(request.preferredVisitTime).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs">
                                            <Clock className="w-3 h-3" />
                                            {new Date(request.preferredVisitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge className={`${getStatusBadge(request.status)}`}>
                                        {request.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {isPendingStatus(request.status) && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="h-8 bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => handleStatusUpdate(request.id, 'confirm')}
                                                    disabled={actionLoading === request.id}
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Confirm
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-8"
                                                    onClick={() => openCancelModal(request.id)}
                                                    disabled={actionLoading === request.id}
                                                >
                                                    <XCircle className="w-3 h-3 mr-1" /> Cancel
                                                </Button>
                                            </>
                                        )}
                                        {request.status === 'CONFIRMED' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={() => handleStatusUpdate(request.id, 'complete')}
                                                    disabled={actionLoading === request.id}
                                                >
                                                    <CheckCheck className="w-3 h-3 mr-1" /> Complete
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-8"
                                                    onClick={() => openCancelModal(request.id)}
                                                    disabled={actionLoading === request.id}
                                                >
                                                    <XCircle className="w-3 h-3 mr-1" /> Cancel
                                                </Button>
                                            </>
                                        )}
                                        {request.status === 'COMPLETED' && (
                                            <span className="text-blue-600 font-medium text-sm self-center mr-2">Completed</span>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8"
                                            onClick={() => navigate(`/property/${encodeURIComponent(request.property?.title || 'property')}/${encodeURIComponent(request.property?.city || 'all')}/${request.propertyId}`)}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Visit Requests</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage pending and confirmed property visit requests.</p>
                </div>
            </div>

            <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                        <TabsTrigger value="confirmed">Confirmed Visits</TabsTrigger>
                    </TabsList>
                    <Button variant="outline" onClick={activeTab === 'pending' ? fetchRequests : fetchConfirmedRequests} disabled={loading || confirmedLoading}>
                        Refresh
                    </Button>
                </div>

                <TabsContent value="pending">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <VisitTable data={requests} isLoading={loading} isConfirmedTab={false} />
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
                            <span className="flex items-center px-4 text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
                            <Button variant="outline" disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>Next</Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="confirmed">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <VisitTable data={confirmedRequests} isLoading={confirmedLoading} isConfirmedTab={true} />
                    </div>
                    {confirmedTotalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            <Button variant="outline" disabled={confirmedPage === 0} onClick={() => setConfirmedPage(confirmedPage - 1)}>Previous</Button>
                            <span className="flex items-center px-4 text-sm text-gray-600">Page {confirmedPage + 1} of {confirmedTotalPages}</span>
                            <Button variant="outline" disabled={confirmedPage === confirmedTotalPages - 1} onClick={() => setConfirmedPage(confirmedPage + 1)}>Next</Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Visit Request</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for cancelling this visit request. This will be sent to the user.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Reason for cancellation..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelModalOpen(false)}>Back</Button>
                        <Button variant="destructive" onClick={handleCancelSubmit} disabled={!cancelReason.trim()}>
                            Cancel Visit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminVisitRequests;
