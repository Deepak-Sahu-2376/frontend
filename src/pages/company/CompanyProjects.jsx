import React, { useState } from 'react';
import { toast } from 'sonner';
import CompanyLayout from './CompanyLayout';
import { useCompany } from '../../contexts/CompanyContext';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { MapPin, Building2, Calendar, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompanyProjects = () => {
    const { companyProjects, fetchCompanyProjects } = useCompany();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('APPROVED');

    // Filter projects based on approvalStatus
    const isApproved = (project) => project.approvalStatus === 'APPROVED';
    const isPending = (project) => project.approvalStatus === 'PENDING' || !project.approvalStatus; // Default to pending if missing

    // Filter projects based on status
    const approvedProjects = companyProjects.filter(p => isApproved(p));
    const pendingProjects = companyProjects.filter(p => isPending(p));

    const displayedProjects = activeTab === 'APPROVED' ? approvedProjects : pendingProjects;

    return (
        <CompanyLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">All Projects</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage all your company's projects</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchCompanyProjects()}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'APPROVED'
                            ? 'border-orange-600 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('APPROVED')}
                    >
                        Approved ({approvedProjects.length})
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'PENDING'
                            ? 'border-orange-600 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('PENDING')}
                    >
                        Pending Approval ({pendingProjects.length})
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Project Name</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Type</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Location</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Created At</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {displayedProjects.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            No {activeTab.toLowerCase()} projects found.
                                        </td>
                                    </tr>
                                ) : (
                                    displayedProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{project.name}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-[200px]">{project.description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                    {project.projectType}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-gray-600">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {project.city}, {project.state}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${isApproved(project)
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                    }`}>
                                                    {project.approvalStatus || 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                <div className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {new Date(project.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`text-blue-600 hover:text-blue-700 hover:bg-blue-50 ${!isApproved(project) ? 'cursor-not-allowed opacity-50' : ''}`}
                                                    onClick={() => {
                                                        if (isApproved(project)) {
                                                            navigate(`/projects/${encodeURIComponent(project.name)}/${encodeURIComponent(project.city || 'all')}/${project.id}`);
                                                        } else {
                                                            toast.error("Project is not Approved");
                                                        }
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </CompanyLayout>
    );
};

export default CompanyProjects;
