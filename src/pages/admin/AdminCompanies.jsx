import React from 'react';
import { Button } from '../../components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

// ... (imports remain)

const AdminCompanies = () => {
    const { companies } = useAdmin(); // rejectCompany removed as it's no longer used

    // Filter for verified companies
    const verifiedCompanies = companies.filter(company =>
        company.verificationStatus?.toLowerCase() === 'verified' ||
        company.status?.toLowerCase() === 'verified' ||
        company.status?.toLowerCase() === 'approved'
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Verified Companies</h2>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {verifiedCompanies.length} Active
                </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Company Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Contact</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Type</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Established</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">GST Number</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {verifiedCompanies.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No verified companies found.
                                    </td>
                                </tr>
                            ) : (
                                verifiedCompanies.map((company) => (
                                    <tr key={company.companyId || company.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{company.companyName || company.name}</div>
                                            <div className="text-xs text-gray-500">{company.companyType}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600">{company.email}</div>
                                            <div className="text-xs text-gray-500">{company.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{company.companyType}</td>
                                        <td className="px-6 py-4 text-gray-600">{company.establishmentYear || company.establishedYear || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">{company.gstNumber || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Verified
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-100">
                    {verifiedCompanies.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No verified companies found.
                        </div>
                    ) : (
                        verifiedCompanies.map((company) => (
                            <div key={company.companyId || company.id} className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{company.companyName || company.name}</h4>
                                        <p className="text-xs text-gray-500">{company.companyType}</p>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Verified
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Contact</p>
                                        <p className="truncate">{company.email}</p>
                                        <p className="text-xs">{company.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Established</p>
                                        <p>{company.establishmentYear || company.establishedYear || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-400 uppercase">GST</p>
                                        <p className="font-mono text-xs">{company.gstNumber || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>);
};

export default AdminCompanies;
