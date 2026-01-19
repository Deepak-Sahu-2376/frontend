import React from 'react';
import { Button } from '../../components/ui/button';
import { Eye, Plus } from 'lucide-react';
import { useAgent } from '../../contexts/AgentContext';
import { useNavigate } from 'react-router-dom';
import AgentLayout from './AgentLayout';

const AgentProperties = () => {
    const navigate = useNavigate();
    const { agentProperties, loading } = useAgent();

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatPrice = (price) => {
        if (!price) return "₹0";
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
        return `₹${price.toLocaleString('en-IN')}`;
    };

    return (
        <AgentLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
                    <Button onClick={() => navigate('/agent/properties/create')}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Property
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Title</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Location</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Type</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Price</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {agentProperties.length > 0 ? (
                                    agentProperties.map((property) => (
                                        <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{property.title}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{new Date(property.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 whitespace-pre-line">{property.formattedAddress || property.city || property.location}</td>
                                            <td className="px-6 py-4 text-gray-600">{property.propertyType || property.type}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(property.verificationStatus || property.status)}`}>
                                                    {property.verificationStatus || property.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 font-medium">{formatPrice(property.basePrice || property.price)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50"
                                                        onClick={() => navigate(`/property/${property.id}`)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            {loading ? "Loading properties..." : "No properties found. Create your first listing!"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {agentProperties.length > 0 ? (
                            agentProperties.map((property) => (
                                <div key={property.id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{property.title}</h3>
                                            <p className="text-xs text-gray-500">{new Date(property.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(property.verificationStatus || property.status)}`}>
                                            {property.verificationStatus || property.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase">Location</p>
                                            <p className="truncate">{property.city || property.location || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase">Price</p>
                                            <p className="font-medium text-gray-900">{formatPrice(property.basePrice || property.price)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full text-blue-600 hover:bg-blue-50 border-blue-200"
                                            onClick={() => navigate(`/property/${property.id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                {loading ? "Loading..." : "No properties found"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AgentLayout>
    );
};

export default AgentProperties;
