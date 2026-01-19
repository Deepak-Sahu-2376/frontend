import React from 'react';
import CompanyLayout from './CompanyLayout';
import { Users, Building2, Star, Clock } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';

const CompanyDashboard = () => {
    const { stats, companyProjects } = useCompany();

    const dashboardStats = [
        { label: 'Total Projects', value: companyProjects.length || 0, icon: Building2, color: 'bg-blue-50 text-blue-600' },
        { label: 'Total Agents', value: stats.totalAgents, icon: Users, color: 'bg-purple-50 text-purple-600' },
        { label: 'Active Listings', value: stats.activeListings, icon: Star, color: 'bg-yellow-50 text-yellow-600' },
        { label: 'Pending Agents', value: stats.pendingAgents, icon: Clock, color: 'bg-orange-50 text-orange-600' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <CompanyLayout>
            <div className="space-y-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardStats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pending Agents Section */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Agents</h2>
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                        {stats.pendingAgents > 0 ? `${stats.pendingAgents} agents waiting for approval` : 'No pending agents'}
                    </div>
                </div>

                {/* Properties Table */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Projects</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Location</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Configuration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {companyProjects.slice(0, 5).map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{project.title}</td>
                                            <td className="px-6 py-4 text-gray-600">{project.address}</td>
                                            <td className="px-6 py-4 text-gray-600">{project.projectType}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status || project.approvalStatus)}`}>
                                                    {project.status || project.approvalStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{project.configuration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </CompanyLayout>
    );
};

export default CompanyDashboard;
