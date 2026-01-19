import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BarChart3,
    Building2,
    Users,
    LogOut,
    Bell,
    ChevronDown,
    ChevronUp,
    Calendar,
    MessageSquare
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from '../../components/ui/button';
import { useCompany } from '../../contexts/CompanyContext';

const CompanyLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useCompany();
    const [agentsDropdownOpen, setAgentsDropdownOpen] = useState(false);
    const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
    const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);

    // console.log("CompanyLayout User:", user); 
    // Commented out to reduce noise, but user type for Vikas Sahu should be 'company'

    const sidebarItems = [
        { name: 'Dashboard', path: '/company', icon: LayoutDashboard },
        { name: 'Visit Requests', path: '/company/visits', icon: Calendar },
        { name: 'Inquiries', path: '/company/inquiries', icon: MessageSquare },
        // { name: 'Analytics', path: '/company/analytics', icon: BarChart3 },
    ];

    const agentsSubItems = [
        { name: 'My Agents', path: '/company/agents' },
        { name: 'Requests', path: '/company/agents/requests' },
    ];

    const projectsSubItems = [
        { name: 'Create Project', path: '/company/projects/create' },
        { name: 'Create Phase', path: '/company/phases/create' },
        { name: 'All Projects', path: '/company/projects' },
    ];

    const propertiesSubItems = [
        { name: 'Create', path: '/company/properties/create' },
        { name: 'Requests', path: '/company/properties/pending' },
        { name: 'All Properties', path: '/company/properties' },
    ];

    const isActive = (path) => {
        if (path === '/company' && location.pathname === '/company') return true;
        if (path !== '/company' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const isAgentsActive = () => {
        return location.pathname.startsWith('/company/agents');
    };

    const isProjectsActive = () => {
        return location.pathname.startsWith('/company/projects');
    };

    const isPropertiesActive = () => {
        return location.pathname.startsWith('/company/properties');
    };

    const getPageTitle = () => {
        if (location.pathname.startsWith('/company/agents')) {
            const subItem = agentsSubItems.find(item => item.path === location.pathname);
            return subItem ? subItem.name : 'Agents';
        }
        if (location.pathname.startsWith('/company/projects')) {
            const subItem = projectsSubItems.find(item => item.path === location.pathname);
            return subItem ? subItem.name : 'Projects';
        }
        if (location.pathname.startsWith('/company/properties')) {
            const subItem = propertiesSubItems.find(item => item.path === location.pathname);
            return subItem ? subItem.name : 'Properties';
        }
        const current = sidebarItems.find(item => isActive(item.path));
        return current ? current.name : 'Dashboard';
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
                    <span className="text-2xl font-bold text-gray-900">Company</span>
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
                                {propertiesSubItems.filter(item => {
                                    if (item.path === '/company/properties/pending') {
                                        return ['COMPANY', 'company', 'COMPANY_ADMIN', 'company_admin'].includes(user?.userType);
                                    }
                                    return true;
                                }).map((subItem) => (
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

                    {/* Agents Dropdown - Strict Admin Only */}
                    {['COMPANY', 'company', 'COMPANY_ADMIN', 'company_admin'].includes(user?.userType) && (
                        <div>
                            <button
                                onClick={() => setAgentsDropdownOpen(!agentsDropdownOpen)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isAgentsActive()
                                    ? 'bg-orange-50 text-orange-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <Users className={`h-5 w-5 mr-3 ${isAgentsActive() ? 'text-orange-600' : 'text-gray-400'}`} />
                                    Agents
                                </div>
                                {agentsDropdownOpen ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </button>

                            {agentsDropdownOpen && (
                                <div className="mt-1 ml-4 space-y-1">
                                    {agentsSubItems.map((subItem) => (
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
                    )}

                    {/* Projects Dropdown */}
                    <div>
                        <button
                            onClick={() => setProjectsDropdownOpen(!projectsDropdownOpen)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isProjectsActive()
                                ? 'bg-orange-50 text-orange-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center">
                                <Building2 className={`h-5 w-5 mr-3 ${isProjectsActive() ? 'text-orange-600' : 'text-gray-400'}`} />
                                Projects
                            </div>
                            {projectsDropdownOpen ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </button>

                        {projectsDropdownOpen && (
                            <div className="mt-1 ml-4 space-y-1">
                                {projectsSubItems.map((subItem) => (
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center space-x-3 pl-4 border-l border-gray-200 outline-none">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-medium text-gray-900">{user?.name || 'Company User'}</p>
                                        <p className="text-xs text-gray-500">{user?.email || 'company@deshrock.in'}</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold hover:bg-orange-200 transition-colors overflow-hidden border border-orange-200">
                                        {(user?.profileImageUrl || user?.avatar) ? (
                                            <img src={user.profileImageUrl || user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                        ) : (
                                            user?.name ? user.name.substring(0, 2).toUpperCase() : 'CO'
                                        )}
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/company/profile" className="cursor-pointer w-full flex items-center">
                                        <Users className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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

export default CompanyLayout;
