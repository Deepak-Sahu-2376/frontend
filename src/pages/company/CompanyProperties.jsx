import React, { useEffect, useState } from 'react';
import CompanyLayout from './CompanyLayout';
import { useCompany } from '../../contexts/CompanyContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { MapPin, Building2, Calendar, Eye, RefreshCw, User, Home, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const CompanyProperties = () => {
    const { companyProperties, fetchCompanyProperties } = useCompany();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('ALL');

    useEffect(() => {
        // Fetch properties when component mounts
        fetchCompanyProperties();
    }, []);

    const filteredProperties = activeTab === 'ALL'
        ? companyProperties
        : companyProperties.filter(p => {
            if (activeTab === 'APPROVED') return p.status === 'APPROVED';
            if (activeTab === 'PENDING') return p.status === 'PENDING' || p.status === 'PENDING_COMPANY';
            if (activeTab === 'REJECTED') return p.status === 'REJECTED';
            return true;
        });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Active</Badge>;
            case 'PENDING':
            case 'PENDING_COMPANY':
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200">Pending</Badge>;
            case 'REJECTED':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <CompanyLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">All Properties</h1>
                        <p className="text-gray-500 mt-1">Manage and view all properties posted by your company and agents</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="default"
                            onClick={() => navigate('/company/properties/create')}
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Post New Property
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => fetchCompanyProperties()}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ALL'
                            ? 'border-orange-600 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('ALL')}
                    >
                        All Properties
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'APPROVED'
                            ? 'border-orange-600 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('APPROVED')}
                    >
                        Active
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'PENDING'
                            ? 'border-orange-600 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('PENDING')}
                    >
                        Pending
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'REJECTED'
                            ? 'border-orange-600 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('REJECTED')}
                    >
                        Rejected
                    </button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-medium">Property Listings ({filteredProperties.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Property</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Location</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Type</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Agent</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700">Date</th>
                                        <th className="py-3 px-4 font-semibold text-gray-700 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {!filteredProperties || filteredProperties.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-12 text-gray-500">
                                                No properties found matching the filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProperties.map((property) => (
                                            <tr key={property.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 px-4 max-w-[250px]">
                                                    <div className="font-medium text-gray-900 truncate" title={property.title}>{property.title}</div>
                                                    <div className="text-xs text-gray-500 truncate">{property.price ? `₹${property.price.toLocaleString()}` : 'Price on Request'}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center text-gray-600">
                                                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                                        <span className="truncate max-w-[150px]" title={`${property.city}, ${property.state}`}>{property.city}, {property.state}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap">
                                                        {property.propertyType}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getStatusBadge(property.status)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-3 h-3 text-gray-400" />
                                                        <span className="text-gray-600 text-xs">
                                                            {property.user ? `${property.user.firstName} ${property.user.lastName}` : 'Self'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {format(new Date(property.createdAt), 'MMM d, yyyy')}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => navigate(`/property/${encodeURIComponent(property.title)}/${encodeURIComponent(property.city || 'all')}/${property.id}`)}
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4 text-blue-600" />
                                                            <span className="sr-only">View</span>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {!filteredProperties || filteredProperties.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No properties found.
                                </div>
                            ) : (
                                filteredProperties.map((property) => (
                                    <div key={property.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900 line-clamp-1">{property.title}</h3>
                                                <p className="text-sm font-semibold text-gray-700">{property.price ? `₹${property.price.toLocaleString()}` : 'Price on Request'}</p>
                                            </div>
                                            {getStatusBadge(property.status)}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span className="truncate">{property.city}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Badge variant="outline" className="text-xs px-1 h-5">{property.propertyType}</Badge>
                                            </div>
                                            <div className="flex items-center gap-1 col-span-2 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(property.createdAt), 'MMM d, yyyy')} • By {property.user ? `${property.user.firstName} ${property.user.lastName}` : 'Self'}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/property/${encodeURIComponent(property.title)}/${encodeURIComponent(property.city || 'all')}/${property.id}`)}
                                                className="w-full"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </CompanyLayout>
    );
};

export default CompanyProperties;
