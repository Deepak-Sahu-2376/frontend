import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    BarChart3,
    Building2,
    Users,
    Building,
    ChevronDown,
    ChevronUp,
    LogOut,
    Bell,
    Menu,
    Calendar,
    MessageSquare
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useAdmin } from '../../contexts/AdminContext';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, adminUser } = useAdmin();

    const [companiesDropdownOpen, setCompaniesDropdownOpen] = useState(false);
    const [agentsDropdownOpen, setAgentsDropdownOpen] = useState(false);
    const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);
    const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
    const [phasesDropdownOpen, setPhasesDropdownOpen] = useState(false);

    const sidebarItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Visit Requests', path: '/admin/visits', icon: Calendar },
        { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    ];

    const propertiesSubItems = [
        { name: 'Create', path: '/admin/properties/create' },
        { name: 'All Properties', path: '/admin/properties' },
        { name: 'Pending Verification', path: '/admin/properties/pending' },
    ];

    const agentsSubItems = [
        { name: 'Requests', path: '/admin/agents/requests' },
        { name: 'Agents', path: '/admin/agents' },
    ];

    const companiesSubItems = [
        { name: 'Requests', path: '/admin/companies/requests' },
        { name: 'Companies', path: '/admin/companies' },
    ];

    const projectsSubItems = [
        { name: 'Create', path: '/admin/projects/create' },
        { name: 'All Projects', path: '/admin/projects' },
        { name: 'Pending Approval', path: '/admin/projects/pending-approval' },
    ];

    const phasesSubItems = [
        { name: 'Create', path: '/admin/phases/create' },
    ];

    const isActive = (path) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const isAgentsActive = () => location.pathname.startsWith('/admin/agents');
    const isCompaniesActive = () => location.pathname.startsWith('/admin/companies');
    const isProjectsActive = () => location.pathname.startsWith('/admin/projects');
    const isPhasesActive = () => location.pathname.startsWith('/admin/phases');

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    // Reusable Sidebar Content
    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 flex items-center">
                <img src="/deshrock.svg" alt="DeshRock Admin" className="h-8 w-auto mr-2 animate-float hover:scale-110 transition-transform duration-300" />
                <span className="text-2xl font-bold text-gray-900">Admin</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
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

                {/* Agents Dropdown */}
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

                {/* Companies Dropdown */}
                <div>
                    <button
                        onClick={() => setCompaniesDropdownOpen(!companiesDropdownOpen)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isCompaniesActive()
                            ? 'bg-orange-50 text-orange-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <div className="flex items-center">
                            <Building className={`h-5 w-5 mr-3 ${isCompaniesActive() ? 'text-orange-600' : 'text-gray-400'}`} />
                            Companies
                        </div>
                        {companiesDropdownOpen ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </button>

                    {companiesDropdownOpen && (
                        <div className="mt-1 ml-4 space-y-1">
                            {companiesSubItems.map((subItem) => (
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

                {/* Properties Dropdown */}
                <div>
                    <button
                        onClick={() => setPropertiesDropdownOpen(!propertiesDropdownOpen)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname.startsWith('/admin/properties')
                            ? 'bg-orange-50 text-orange-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <div className="flex items-center">
                            <Building2 className={`h-5 w-5 mr-3 ${location.pathname.startsWith('/admin/properties') ? 'text-orange-600' : 'text-gray-400'}`} />
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

                {/* Phases Dropdown */}
                <div>
                    <button
                        onClick={() => setPhasesDropdownOpen(!phasesDropdownOpen)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isPhasesActive()
                            ? 'bg-orange-50 text-orange-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <div className="flex items-center">
                            <Building2 className={`h-5 w-5 mr-3 ${isPhasesActive() ? 'text-orange-600' : 'text-gray-400'}`} />
                            Phases
                        </div>
                        {phasesDropdownOpen ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </button>

                    {phasesDropdownOpen && (
                        <div className="mt-1 ml-4 space-y-1">
                            {phasesSubItems.map((subItem) => (
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
                    <div className="flex items-center justify-center"><LogOut className="h-5 w-5 mr-3" />
                        Logout</div>
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Desktop Sidebar (Hidden on mobile) */}
            <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col fixed h-full z-10">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">

                    {/* Mobile Menu Trigger */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="flex-1 flex justify-end items-center space-x-3 pl-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center space-x-3 outline-none">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-medium text-gray-900">{adminUser?.name || 'Admin User'}</p>
                                        <p className="text-xs text-gray-500">{adminUser?.email || 'admin@deshrock.in'}</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold hover:bg-orange-200 transition-colors overflow-hidden border border-orange-200">
                                        {(adminUser?.profileImageUrl || adminUser?.avatar) ? (
                                            <img
                                                src={(adminUser.profileImageUrl || adminUser.avatar).startsWith('http')
                                                    ? (adminUser.profileImageUrl || adminUser.avatar)
                                                    : `${import.meta.env.VITE_API_BASE_URL || ''}${adminUser.profileImageUrl || adminUser.avatar}`
                                                }
                                                alt={adminUser.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            adminUser?.initials || 'AU'
                                        )}
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{adminUser?.name || 'Admin User'}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {adminUser?.email || 'admin@deshrock.in'}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/admin/profile" className="cursor-pointer w-full flex items-center">
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
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
