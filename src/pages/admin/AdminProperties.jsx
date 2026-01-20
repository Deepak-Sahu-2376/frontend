import { Button } from '../../components/ui/button';
import { Eye } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminProperties = () => {
    const navigate = useNavigate();
    const { properties, approveProperty, rejectProperty } = useAdmin();

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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Property Listings</h1>
                <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{properties.length} total</span> <span className="text-orange-600 font-medium">{properties.filter(p => (p.verificationStatus || p.status) === 'PENDING').length} pending</span>
                </div>
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
                            {properties.map((property) => (
                                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{property.title}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            {property.company && property.user
                                                ? `${property.company.companyName} by ${property.user.firstName} ${property.user.lastName}`
                                                : property.company
                                                    ? property.company.companyName
                                                    : property.user
                                                        ? `${property.user.firstName} ${property.user.lastName}`
                                                        : 'Unknown Agent'
                                            }
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-pre-line">{property.formattedAddress || property.city || property.location}</td>
                                    <td className="px-6 py-4 text-gray-600">{property.propertyType || property.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(property.verificationStatus || property.status)}`}>
                                            {property.verificationStatus || property.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">{formatPrice(property.basePrice || property.monthlyRent || property.price)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {(property.verificationStatus || property.status) === 'PENDING' ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 px-2 bg-green-50 text-green-600 hover:bg-green-100 border-green-200 text-xs"
                                                        onClick={() => approveProperty(property.id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 px-2 bg-red-50 text-red-600 hover:bg-red-100 border-red-200 text-xs"
                                                        onClick={() => rejectProperty(property.id)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            ) : null}
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {properties.map((property) => (
                        <div key={property.id} className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-gray-900">{property.title}</h3>
                                    <p className="text-xs text-gray-500">
                                        {property.company && property.user
                                            ? `${property.company.companyName} by ${property.user.firstName} ${property.user.lastName}`
                                            : property.company
                                                ? property.company.companyName
                                                : property.user
                                                    ? `${property.user.firstName} ${property.user.lastName}`
                                                    : 'Unknown Agent'
                                        }
                                    </p>
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
                                    <p className="font-medium text-gray-900">{formatPrice(property.basePrice || property.monthlyRent || property.price)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Type</p>
                                    <p>{property.propertyType || property.type}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                {(property.verificationStatus || property.status) === 'PENDING' ? (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 border-green-200 text-xs"
                                            onClick={() => approveProperty(property.id)}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 border-red-200 text-xs"
                                            onClick={() => rejectProperty(property.id)}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                ) : null}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 text-blue-600 hover:bg-blue-50 border-blue-200"
                                    onClick={() => navigate(`/property/${property.id}`)}
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminProperties;
