import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Phone, Calendar, User, MessageSquare, MapPin } from 'lucide-react';
import AgentLayout from './AgentLayout';
import { API_BASE_URL } from '../../utils/apiClient';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";

const AgentInquiries = () => {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Message Dialog State
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [messageDialogOpen, setMessageDialogOpen] = useState(false);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error("Authentication error. Please login again.");
                setLoading(false);
                return;
            }

            // Using the new endpoint
            const response = await fetch(`${API_BASE_URL}/api/v1/inquiries/agent`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                setInquiries(data.data);
                // setTotalPages(data.totalPages); // Backend currently returns all, pagination to be added later if needed
            } else {
                setInquiries([]);
            }
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            toast.error('Failed to load inquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, [page]);

    const handleViewMessage = (message) => {
        setSelectedMessage(message);
        setMessageDialogOpen(true);
    };

    return (
        <AgentLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
                        <p className="text-gray-500 text-sm mt-1">View and manage customer inquiries.</p>
                    </div>
                    <Button variant="outline" onClick={fetchInquiries} disabled={loading}>
                        Refresh
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading inquiries...</div>
                    ) : inquiries.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No inquiries found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs">User Details</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs">Property ID</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs">Message</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs">Date</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {inquiries.map((inquiry) => (
                                        <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold">
                                                        {inquiry.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{inquiry.name || 'Unknown User'}</div>
                                                        {inquiry.phone && (
                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                <Phone className="w-3 h-3" /> {inquiry.phone}
                                                            </div>
                                                        )}
                                                        {inquiry.email && (
                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                <Mail className="w-3 h-3" /> {inquiry.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 text-sm">{inquiry.property?.title || 'Unknown Property'}</span>
                                                    <Badge variant="outline" className="font-mono w-max mt-1 text-xs">
                                                        #{inquiry.propertyId?.slice(0, 8)}...
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs truncate text-gray-600" title={inquiry.message}>
                                                    {inquiry.message || "No message provided"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Calendar className="w-3 h-3" />
                                                    {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8"
                                                        onClick={() => handleViewMessage(inquiry.message)}
                                                    >
                                                        <MessageSquare className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8"
                                                        onClick={() => navigate(`/property/${inquiry.propertyId}`)}
                                                    >
                                                        View Property
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
                        <span className="flex items-center px-4 text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
                        <Button variant="outline" disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>Next</Button>
                    </div>
                )}

                <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Inquiry Message</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage || "No message content."}</p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AgentLayout>
    );
};

export default AgentInquiries;
