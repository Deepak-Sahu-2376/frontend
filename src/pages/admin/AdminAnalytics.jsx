import React, { useEffect, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { Building2, Users, Star, Clock } from 'lucide-react';

import { useAdmin } from '../../contexts/AdminContext';

const AdminAnalytics = () => {
    const {
        stats: contextStats,
        properties,
        fetchAllProperties,
        fetchAllAgents,
        fetchAllCompanies,
        fetchPendingAgents,
        fetchVerifiedCompaniesCount
    } = useAdmin();

    useEffect(() => {
        fetchAllProperties();
        fetchAllAgents();
        fetchAllCompanies();
        fetchPendingAgents();
        fetchVerifiedCompaniesCount();
    }, []);

    const stats = [
        { label: 'Total Properties', value: contextStats?.totalProperties || 0, change: '', icon: Building2, color: 'bg-blue-50 text-blue-600' },
        { label: 'Total Companies', value: contextStats?.totalCompanies || 0, change: '', icon: Building2, color: 'bg-green-50 text-green-600' },
        { label: 'Total Agents', value: contextStats?.totalAgents || 0, change: '', icon: Users, color: 'bg-purple-50 text-purple-600' },
        { label: 'Pending Agents', value: contextStats?.pendingAgents || 0, change: '', icon: Clock, color: 'bg-orange-50 text-orange-600' },
    ];

    const monthlyData = useMemo(() => {
        if (!properties.length) return [];

        const monthCounts = properties.reduce((acc, prop) => {
            const date = new Date(prop.createdAt);
            const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        return Object.entries(monthCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => monthsOrder.indexOf(a.name) - monthsOrder.indexOf(b.name));
    }, [properties]);

    const typeData = useMemo(() => {
        if (!properties.length) return [];

        const typeCounts = properties.reduce((acc, prop) => {
            const type = (prop.propertyType || 'Unknown').toUpperCase();
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

        return Object.entries(typeCounts).map(([name, value], index) => ({
            name,
            value,
            color: COLORS[index % COLORS.length]
        }));
    }, [properties]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                                {stat.change && (
                                    <p className={`text-xs font-medium mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.change}
                                    </p>
                                )}
                            </div>
                            <div className={`p-2 rounded-lg ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Properties by Month</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f3f4f6' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="Properties" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Properties by Type</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Performing Agents Placeholder */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[200px] flex flex-col justify-center items-center text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4 w-full text-left">Top Performing Agents</h3>
                <Users className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500">No agent data available</p>
            </div>

        </div>);
};

export default AdminAnalytics;
