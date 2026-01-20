import React from 'react';
import { Users, Building2, Star, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAdmin } from '../../contexts/AdminContext';

import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { stats, properties, approveProperty, rejectProperty, verifiedCompaniesCount, pendingCompaniesCount, pendingAgents } = useAdmin();
    const navigate = useNavigate();

    const dashboardStats = [
        { label: 'Total Properties', value: stats.totalProperties, icon: Building2, color: 'bg-blue-50 text-blue-600' },
        { label: 'Total Agents', value: stats.totalAgents, icon: Users, color: 'bg-purple-50 text-purple-600' },
        { label: 'Featured Properties', value: stats.featuredProperties, icon: Star, color: 'bg-yellow-50 text-yellow-600' },
        { label: 'Pending Agents', value: stats.pendingAgents, icon: Clock, color: 'bg-orange-50 text-orange-600' },
        { label: 'Total Companies', value: verifiedCompaniesCount, icon: Building2, color: 'bg-green-50 text-green-600' },
        { label: 'Pending Companies', value: pendingCompaniesCount, icon: Clock, color: 'bg-red-50 text-red-600' },
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
        <div className="space-y-8">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Pending Agents</h2>
                    {stats.pendingAgents > 3 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/admin/agents/requests')}
                        >
                            View All
                        </Button>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {pendingAgents.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {pendingAgents.slice(0, 3).map((agent) => (
                                <div key={agent.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-semibold">
                                            {agent.firstName ? agent.firstName[0] : 'A'}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                {agent.firstName} {agent.lastName}
                                            </h4>
                                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                                <span>{agent.email}</span>
                                                {agent.registrationDate && (
                                                    <>
                                                        <span className="text-gray-300">•</span>
                                                        <span>{new Date(agent.registrationDate).toLocaleDateString()}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => navigate('/admin/agents/requests')}
                                    >
                                        Review
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No pending agents
                        </div>
                    )}
                </div>
            </div>

            {/* Properties Table */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Properties</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">City</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Price</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {properties.slice(0, 5).map((property) => (
                                    <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{property.title}</td>
                                        <td className="px-6 py-4 text-gray-600">{property.city}</td>
                                        <td className="px-6 py-4 text-gray-600">{property.propertyType}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                                                {property.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">₹{property.basePrice || property.monthlyRent || '0'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                {property.status === 'PENDING' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                                            onClick={() => approveProperty(property.id)}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                                            onClick={() => rejectProperty(property.id)}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {properties.slice(0, 5).map((property) => (
                            <div key={property.id} className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{property.title}</h4>
                                        <p className="text-xs text-gray-500">{property.city}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                                        {property.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Price</p>
                                        <p className="font-medium text-gray-900">
                                            ₹{property.basePrice || property.monthlyRent || '0'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Type</p>
                                        <p>{property.propertyType}</p>
                                    </div>
                                </div>

                                {property.status === 'PENDING' && (
                                    <div className="flex items-center gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                            onClick={() => approveProperty(property.id)}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                            onClick={() => rejectProperty(property.id)}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
