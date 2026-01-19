import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Mail, Phone, Briefcase, Building, FileText, Eye } from 'lucide-react';
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

const AdminCompanyRequests = () => {
    const { pendingCompanies, approveCompany, rejectCompany } = useAdmin();
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
    const [selectedCompanyForDocs, setSelectedCompanyForDocs] = useState(null);

    // Restore Rejection Modal State
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApprove = async (companyId) => {
        if (window.confirm("Are you sure you want to approve this company?")) {
            await approveCompany(companyId);
        }
    };

    const openRejectModal = (companyId) => {
        setSelectedCompanyId(companyId);
        setRejectionReason("");
        setIsRejectModalOpen(true);
    };

    const fetchDocuments = async (company) => {
        setIsLoadingDocuments(true);
        setSelectedCompanyForDocs(company);
        setIsDocumentsOpen(true);
        try {
            const token = localStorage.getItem('adminAccessToken');
            // Use company.id (profile ID)
            const response = await fetch(`${API_BASE_URL}/api/v1/documents/entity/COMPANY/${company.id || company.companyId}?page=0&size=10&sortBy=createdAt&sortDir=DESC`, {
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
        const success = await rejectCompany(selectedCompanyId, rejectionReason);
        setIsProcessing(false);

        if (success) {
            setIsRejectModalOpen(false);
            setSelectedCompanyId(null);
            setRejectionReason("");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Company Registration Requests</h1>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                    {pendingCompanies.length} Pending
                </span>
            </div>

            {pendingCompanies.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                    No pending company requests
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingCompanies.map((company) => (
                        <div key={company.companyId || company.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{company.companyName || company.name}</h3>
                                    <span className="inline-block bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-md text-xs font-medium">
                                        {company.companyType || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 mb-5">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                    {company.user?.email || company.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                    {company.user?.phone || company.phone}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                                    Established: {company.establishmentYear || company.establishedYear || 'N/A'}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <FileText className="h-4 w-4 mr-2 text-gray-400" />
                                    GST: {company.gstNumber || 'N/A'}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-2"
                                    onClick={() => fetchDocuments(company)}
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Documents
                                </Button>
                            </div>

                            <div className="flex space-x-3 pt-4 border-t border-gray-100">
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleApprove(company.companyId || company.id)}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() => openRejectModal(company.companyId || company.id)}
                                >
                                    Reject
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={isDocumentsOpen} onOpenChange={setIsDocumentsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Company Documents</DialogTitle>
                        <DialogDescription>
                            Review documents submitted by {selectedCompanyForDocs?.companyName}.
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
                                                <FileText className="w-4 h-4 text-blue-600" />
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
                        <DialogTitle>Reject Company Registration</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this company registration. This will be sent to the applicant.
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
        </div>);
};

export default AdminCompanyRequests;
