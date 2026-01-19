import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Mail, Phone, Briefcase } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { API_BASE_URL } from '../../utils/apiClient';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { toast } from 'sonner';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const AdminAgentRequests = () => {
    const { pendingAgents, pendingCompanyAgents, approveAgent, rejectAgent } = useAdmin();
    const [documents, setDocuments] = useState([]);
    const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
    const [selectedAgentForDocs, setSelectedAgentForDocs] = useState(null);

    // Restore Rejection Modal State
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedAgentId, setSelectedAgentId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const openRejectModal = (agentId) => {
        setSelectedAgentId(agentId);
        setRejectionReason("");
        setIsRejectModalOpen(true);
    };

    const fetchDocuments = async (agent) => {
        setIsLoadingDocuments(true);
        setSelectedAgentForDocs(agent);
        setIsDocumentsOpen(true);
        try {
            const token = localStorage.getItem('adminAccessToken');
            // Use agent.id (profile ID) which is what our backend document route expects after my fix
            const response = await fetch(`${API_BASE_URL}/api/v1/documents/entity/AGENT/${agent.id || agent.agentId}?page=0&size=10&sortBy=createdAt&sortDir=DESC`, {
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

    const handleRejectConfirm = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        setIsProcessing(true);
        const success = await rejectAgent(selectedAgentId, rejectionReason, ["Admin rejected manually"]);
        setIsProcessing(false);

        if (success) {
            setIsRejectModalOpen(false);
            setSelectedAgentId(null);
            setRejectionReason("");
        }
    };

    const renderAgentCard = (agent) => (
        <div key={agent.id || agent.agentId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {agent.user?.firstName || agent.firstName} {agent.user?.lastName || agent.lastName}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {agent.verificationStatus}
                        </span>
                        {agent.companyName && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {agent.companyName}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-5">
                <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {agent.user?.email || agent.email}
                </div>
                {(agent.user?.phone || agent.phone) && (
                    <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {agent.user?.phone || agent.phone}
                    </div>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => fetchDocuments(agent)}
                >
                    <Briefcase className="h-4 w-4 mr-2" />
                    View Transmitted Documents
                </Button>
            </div>

            <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => approveAgent(agent.id || agent.agentId)}
                >
                    Approve
                </Button>
                <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => openRejectModal(agent.id || agent.agentId)}
                >
                    Reject
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Agent Registration Requests</h1>
            </div>

            <Tabs defaultValue="individual" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="individual">
                        Individual Agents
                        <span className="ml-2 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">
                            {pendingAgents.length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="company">
                        Company Agents
                        <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                            {pendingCompanyAgents.length}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="individual">
                    {pendingAgents.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                            No pending individual agent requests
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pendingAgents.map(renderAgentCard)}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="company">
                    {pendingCompanyAgents.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                            No pending company agent requests
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pendingCompanyAgents.map(renderAgentCard)}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Document Dialog */}
            <Dialog open={isDocumentsOpen} onOpenChange={setIsDocumentsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Agent Documents</DialogTitle>
                        <DialogDescription>
                            Review documents submitted by {selectedAgentForDocs?.user?.firstName || selectedAgentForDocs?.firstName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {isLoadingDocuments ? (
                            <div className="flex justify-center py-8">
                                <span className="animate-spin text-blue-600">Loading...</span>
                            </div>
                        ) : documents.length > 0 ? (
                            <div className="space-y-2">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-white rounded-md border border-gray-200">
                                                <Briefcase className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                                                <p className="text-xs text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={`${API_BASE_URL}${doc.fileUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-orange-600 hover:text-orange-700 text-xs font-medium"
                                        >
                                            View
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No documents found.
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Agent Registration</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this agent registration. This will be sent to the applicant.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Enter rejection reason..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectModalOpen(false)} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleRejectConfirm} disabled={isProcessing}>
                            {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminAgentRequests;
