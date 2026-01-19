import React, { useState } from 'react';
import CompanyLayout from './CompanyLayout';
import { Button } from '../../components/ui/button';
import { useCompany } from '../../contexts/CompanyContext';
import { FileText, Eye, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../utils/apiClient';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";

import { Textarea } from "../../components/ui/textarea";
import { toast } from 'sonner';

const CompanyAgentRequests = () => {
    const { pendingAgents, approveAgent, rejectAgent } = useCompany();
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

    // Rejection Modal State
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [agentToReject, setAgentToReject] = useState(null);

    const fetchDocuments = async (agentId) => {
        setIsLoadingDocuments(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/documents/entity/AGENT/${agentId}?page=0&size=10&sortBy=createdAt&sortDir=DESC`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const result = await response.json();
                const docs = result.data?.content || result.content || [];
                setDocuments(docs);
            } else {
                console.error('Failed to fetch documents');
                setDocuments([]);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            setDocuments([]);
        } finally {
            setIsLoadingDocuments(false);
        }
    };

    const handleViewDocuments = (agent) => {
        setSelectedAgent(agent);
        setIsDocumentsOpen(true);
        fetchDocuments(agent.id);
    };

    const openRejectModal = (agentId) => {
        setAgentToReject(agentId);
        setRejectionReason("");
        setIsRejectModalOpen(true);
    };

    const handleRejectConfirm = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        setIsProcessing(true);
        // Pass reason and a default detail for now
        const success = await rejectAgent(agentToReject, rejectionReason, ["Company Admin rejected manually"]);
        setIsProcessing(false);

        if (success) {
            setIsRejectModalOpen(false);
            setAgentToReject(null);
            setRejectionReason("");
        }
    };

    return (
        <CompanyLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Agent Requests</h2>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                        {pendingAgents.length} Pending
                    </span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-orange-50 border-b border-orange-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-orange-800">Name</th>
                                    <th className="px-6 py-4 font-semibold text-orange-800">Contact</th>
                                    <th className="px-6 py-4 font-semibold text-orange-800">Experience</th>
                                    <th className="px-6 py-4 font-semibold text-orange-800">Documents</th>
                                    <th className="px-6 py-4 font-semibold text-orange-800">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pendingAgents.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No pending requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    pendingAgents.map((agent) => (
                                        <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{agent.firstName} {agent.lastName}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-600">{agent.email}</div>
                                                <div className="text-xs text-gray-500">{agent.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{agent.experienceYears} years</td>
                                            <td className="px-6 py-4">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                                    onClick={() => handleViewDocuments(agent)}
                                                >
                                                    <FileText className="w-4 h-4 mr-1" />

                                                </Button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={() => approveAgent(agent.id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:bg-red-50 border-red-200"
                                                        onClick={() => openRejectModal(agent.id)}
                                                    >
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
                </div>

                <Dialog open={isDocumentsOpen} onOpenChange={setIsDocumentsOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Agent Documents</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            {isLoadingDocuments ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                </div>
                            ) : documents.length > 0 ? (
                                <div className="space-y-2">
                                    {documents.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-white rounded-md border border-gray-200">
                                                    <FileText className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{doc.fileName || doc.type}</p>
                                                    <p className="text-xs text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <a
                                                href={`${API_BASE_URL}${doc.fileUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                title="View Document"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No documents found for this agent.
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject Agent Request</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <Textarea
                                placeholder="Enter rejection reason..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)} disabled={isProcessing}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleRejectConfirm} disabled={isProcessing}>
                                {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </CompanyLayout>
    );
};

export default CompanyAgentRequests;
