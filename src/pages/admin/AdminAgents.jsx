import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { CheckCircle, FileText, Eye, Loader2, ExternalLink } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { API_BASE_URL } from '../../utils/apiClient';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../components/ui/dialog";

// ... (imports remain)
const AdminAgents = () => {
    const { agents } = useAdmin(); // rejectAgent removed as it is no longer used
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

    const approvedAgents = agents.filter(agent =>
        (agent.verificationStatus?.toLowerCase() === 'approved' || agent.status?.toLowerCase() === 'approved')
    );

    // Group agents by company
    const groupedAgents = approvedAgents.reduce((acc, agent) => {
        const companyName = agent.companyName || 'Independent Agents';
        if (!acc[companyName]) {
            acc[companyName] = [];
        }
        acc[companyName].push(agent);
        return acc;
    }, {});

    const fetchDocuments = async (agentId) => {
        setIsLoadingDocuments(true);
        try {
            const token = localStorage.getItem('adminAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/documents/entity/AGENT/${agentId}?page=0&size=10&sortBy=createdAt&sortDir=DESC`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const result = await response.json();
                // Handle nested structure: result.data.content
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">All Registered Agents</h2>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {approvedAgents.length} Active
                </span>
            </div>

            {Object.entries(groupedAgents).map(([companyName, companyAgents]) => (
                <div key={companyName} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                        {companyName}
                        <span className="text-sm font-normal text-gray-500 ml-2">({companyAgents.length} agents)</span>
                    </h3>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Name</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Contact</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Experience</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Status</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Documents</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {companyAgents.map((agent) => (
                                        <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{agent.user?.firstName || agent.firstName} {agent.user?.lastName || agent.lastName}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-600">{agent.user?.email || agent.email}</div>
                                                <div className="text-xs text-gray-500">{agent.user?.phone || agent.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{agent.experienceYears} years</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Approved
                                                </span>
                                            </td>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {companyAgents.map((agent) => (
                                <div key={agent.id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{agent.user?.firstName || agent.firstName} {agent.user?.lastName || agent.lastName}</h4>
                                            <p className="text-xs text-gray-500">{agent.user?.email || agent.email}</p>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Approved
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase">Phone</p>
                                            <p>{agent.user?.phone || agent.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase">Experience</p>
                                            <p>{agent.experienceYears} years</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 text-blue-600 hover:bg-blue-50 border-blue-200"
                                            onClick={() => handleViewDocuments(agent)}
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            Docs
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {approvedAgents.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No approved agents found.</p>
                </div>
            )}

            <Dialog open={isDocumentsOpen} onOpenChange={setIsDocumentsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Agent Documents</DialogTitle>
                        <DialogDescription>
                            Review the documents submitted by this agent.
                        </DialogDescription>
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
        </div>
    );
};

export default AdminAgents;
