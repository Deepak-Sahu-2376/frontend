import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    LogOut,
    ChevronDown,
    ChevronUp,
    Calendar,
    MessageSquare
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAgent } from '../../contexts/AgentContext';

const AgentLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user, fetchUserProfile } = useAgent();
    const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const sidebarItems = [
        { name: 'Dashboard', path: '/agent', icon: LayoutDashboard },
        { name: 'Visit Requests', path: '/agent/visits', icon: Calendar },
        { name: 'Inquiries', path: '/agent/inquiries', icon: MessageSquare },
    ];

    const propertiesSubItems = [
        { name: 'Create', path: '/agent/properties/create' },
        { name: 'My Properties', path: '/agent/properties' },
    ];

    const isActive = (path) => {
        if (path === '/agent' && location.pathname === '/agent') return true;
        if (path !== '/agent' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const isPropertiesActive = () => {
        return location.pathname.startsWith('/agent/properties');
    };

    const handleLogout = () => {
        logout();
        navigate('/sign-in');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
                <div className="p-6 flex items-center">
                    <img src="/deshrock.svg" alt="DeshRock" className="h-8 w-auto mr-2" />
                    <span className="text-2xl font-bold text-gray-900">Agent</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-orange-50 text-orange-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className={`h-5 w-5 mr-3 ${isActive(item.path) ? 'text-orange-600' : 'text-gray-400'}`} />
                            {item.name}
                        </Link>
                    ))}

                    {/* Properties Dropdown */}
                    <div>
                        <button
                            onClick={() => setPropertiesDropdownOpen(!propertiesDropdownOpen)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isPropertiesActive()
                                ? 'bg-orange-50 text-orange-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center">
                                <Building2 className={`h-5 w-5 mr-3 ${isPropertiesActive() ? 'text-orange-600' : 'text-gray-400'}`} />
                                Properties
                            </div>
                            {propertiesDropdownOpen ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </button>

                        {propertiesDropdownOpen && (
                            <div className="mt-1 ml-4 space-y-1">
                                {propertiesSubItems.map((subItem) => (
                                    <Link
                                        key={subItem.name}
                                        to={subItem.path}
                                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname === subItem.path
                                            ? 'bg-orange-50 text-orange-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        {subItem.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogout}
                    >
                        <div className="flex items-center justify-center"><LogOut className="h-5 w-5 mr-3" />Logout</div>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-end px-8 sticky top-0 z-10">
                    <div className="flex items-center space-x-4">
                        <div
                            className="flex items-center space-x-3 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            onClick={() => navigate('/agent/profile')}
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{user?.name || 'Agent User'}</p>
                                <p className="text-xs text-gray-500">{user?.email || 'agent@deshrock.in'}</p>
                            </div>
                            {user?.profileImageUrl ? (
                                <img src={user.profileImageUrl} alt="Profile" className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AG'}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AgentLayout;
