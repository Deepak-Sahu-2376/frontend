import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { useUser } from '../contexts/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null); // Track open mobile submenu
  const { user, isAuthenticated, logout } = useUser();

  const toggleSubMenu = (name) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    {
      name: 'Properties',
      path: '/properties',
      subItems: [
        {
          name: 'Residential',
          path: '/properties?type=RESIDENTIAL',
          subItems: [
            { name: 'Villas', path: '/properties?type=VILLA' },
            { name: 'Apartments / Flats', path: '/properties?type=APARTMENT' },
            { name: 'Duplex / Triplex units', path: '/properties?type=DUPLEX' },
            { name: 'Penthouses', path: '/properties?type=PENTHOUSE' },
            { name: 'Co-living spaces', path: '/properties?type=CO_LIVING' },
            { name: 'Serviced apartments', path: '/properties?type=SERVICED_APARTMENT' },
            { name: 'Student housing', path: '/properties?type=STUDENT_HOUSING' },
            { name: 'Senior / Assisted living', path: '/properties?type=SENIOR_LIVING' },
          ]
        },
        {
          name: 'Commercial',
          path: '/properties?type=COMMERCIAL',
          subItems: [
            { name: 'Traditional offices', path: '/properties?type=OFFICE' },
            { name: 'Co-working spaces', path: '/properties?type=CO_WORKING' },
            { name: 'Business centers', path: '/properties?type=BUSINESS_CENTER' },
            { name: 'Shops / Showrooms', path: '/properties?type=SHOP' },
            { name: 'Shopping malls', path: '/properties?type=SHOPPING_MALL' },
            { name: 'Restaurants & Cafés', path: '/properties?type=RESTAURANT' },
            { name: 'Supermarkets', path: '/properties?type=SUPERMARKET' },
            { name: 'Resorts', path: '/properties?type=RESORT' },
            { name: 'Mixed-use developments', path: '/properties?type=MIXED_USE' },
            { name: 'Training centers', path: '/properties?type=TRAINING_CENTER' },
          ]
        },
        {
          name: 'Industrial',
          path: '/properties?type=INDUSTRIAL',
          subItems: [
            { name: 'Warehouse', path: '/properties?type=WAREHOUSE' },
            { name: 'Cold storage', path: '/properties?type=COLD_STORAGE' },
            { name: 'Distribution centers', path: '/properties?type=DISTRIBUTION_CENTER' },
            { name: 'Factories / Manufacturing plants', path: '/properties?type=FACTORY' },
            { name: 'Logistics facilities', path: '/properties?type=LOGISTICS' },
            { name: 'Industrial land', path: '/properties?type=INDUSTRIAL_LAND' },
            { name: 'Data centers', path: '/properties?type=DATA_CENTER' },
            { name: 'Research & development (R&D) facilities', path: '/properties?type=R_AND_D' },
            { name: 'Showrooms with storage (flex spaces)', path: '/properties?type=SHOWROOM_STORAGE' },
          ]
        },
        { name: 'Free Zone', path: '/properties?type=FREE_ZONE' }
      ]
    },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${isScrolled
        ? 'top-3 w-[95%] md:w-[90%] max-w-7xl bg-white/95 backdrop-blur-md rounded-full shadow-2xl border border-gray-100 py-1'
        : 'top-0 w-full bg-white shadow-md py-0'
        }`}
    >
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${isScrolled ? '' : 'max-w-7xl'}`}>
        <div className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-14' : 'h-16'}`}>

          {/* Logo/Brand */}
          <div className={`flex-shrink-0 flex items-center transition-all duration-500 ease-in-out ${isScrolled ? 'pl-6' : 'pl-0'}`}>
            <Link to="/" className="flex items-center gap-0">
              <img src="/deshrock.svg" alt="DeshRock" className="h-10 w-auto transition-all duration-500" />
              <span className={`text-2xl font-bold transition-all duration-500 ease-in-out ${isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`} style={{ color: 'rgb(173, 139, 68)' }}>
                eshRock
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 h-full items-center">
            {navItems.map((item) => (
              item.subItems ? (
                <div key={item.name} className="relative group h-full flex items-center">
                  <Link
                    to={item.path}
                    className="flex items-center gap-1 text-gray-600 hover:text-orange-600 px-3 py-2 text-sm font-medium transition duration-150"
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  </Link>

                  {/* Level 1 Dropdown */}
                  <div className="absolute top-[calc(100%-10px)] left-0 w-64 pt-4 z-50 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
                    <div className="bg-white shadow-xl border border-gray-100 rounded-xl overflow-visible ring-1 ring-black ring-opacity-5 relative">
                      {item.subItems.map(subItem => (
                        <div key={subItem.name} className="relative group/sub">
                          <Link
                            to={subItem.path}
                            className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-50 last:border-0"
                          >
                            {subItem.name}
                            {subItem.subItems && <ChevronDown className="h-3 w-3 -rotate-90 text-gray-400 group-hover/sub:text-orange-600" />}
                          </Link>

                          {/* Level 2 Dropdown (Right Side) */}
                          {subItem.subItems && (
                            <div className="absolute top-0 left-full w-56 pl-2 opacity-0 invisible -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-x-0 transition-all duration-300 ease-out z-50">
                              <div className="bg-white shadow-xl border border-gray-100 rounded-xl overflow-y-auto max-h-96 ring-1 ring-black ring-opacity-5">
                                {subItem.subItems.map(nestedItem => (
                                  <Link
                                    key={nestedItem.name}
                                    to={nestedItem.path}
                                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-50 last:border-0"
                                  >
                                    {nestedItem.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-600 hover:text-orange-600 px-3 py-2 text-sm font-medium transition duration-150"
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {(user?.userType === 'AGENT' || user?.userType === 'company_agent') && (
              <Link
                to="/agent/properties/create"
                className={`px-4 py-2 bg-white border border-[#A17F5A] hover:bg-[#A17F5A] text-[#A17F5A] hover:text-white text-sm font-medium transition-all duration-500 ease-in-out ${isScrolled ? 'rounded-full' : 'rounded-md'}`}
              >
                + Post Property
              </Link>
            )}

            {user?.userType === 'BUYER' && (
              <Link
                to="/buyer/post-property"
                className={`px-4 py-2 bg-white border border-[#A17F5A] hover:bg-[#A17F5A] text-[#A17F5A] hover:text-white text-sm font-medium transition-all duration-500 ease-in-out ${isScrolled ? 'rounded-full' : 'rounded-md'}`}
              >
                + Post Property
              </Link>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 transition-colors cursor-pointer overflow-hidden border border-orange-200">
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl.startsWith('http')
                          ? user.profileImageUrl
                          : `${import.meta.env.VITE_API_BASE_URL || ''}${user.profileImageUrl}`
                        }
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || <User className="h-5 w-5" />
                    )}
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
                    <Link to="/profile" className="cursor-pointer w-full flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className={`px-4 py-2 text-gray-800 hover:text-[#A17F5A] text-sm font-medium border border-gray-300 hover:border-[#A17F5A] transition-all duration-500 ease-in-out ${isScrolled ? 'rounded-full' : 'rounded-md'}`}
                >
                  Sign In
                </Link>

                <Link
                  to="/sign-up"
                  className={`px-4 py-2 bg-[#A17F5A] hover:bg-[#8e6f4e] text-white text-sm font-medium transition-all duration-500 ease-in-out ${isScrolled ? 'rounded-full' : 'rounded-md'}`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-600">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <img src="/deshrock.svg" alt="DeshRock" className="h-8 w-auto animate-float" />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <div key={item.name}>
                      {item.subItems ? (
                        <>
                          <button
                            onClick={() => toggleSubMenu(item.name)}
                            className="flex items-center justify-between w-full text-lg font-medium text-gray-600 hover:text-orange-600 transition-colors"
                          >
                            {item.name}
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openSubMenu === item.name ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Submenu Accordion */}
                          <div className={`overflow-hidden transition-all duration-300 ${openSubMenu === item.name ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-4 space-y-3 border-l-2 border-gray-100 ml-1">
                              {item.subItems.map((subItem) => (
                                <div key={subItem.name}>
                                  <Link
                                    to={subItem.path}
                                    className="block text-base text-gray-500 hover:text-orange-600 transition-colors"
                                  >
                                    {subItem.name}
                                  </Link>
                                  {subItem.subItems && (
                                    <div className="pl-3 mt-2 space-y-2 border-l border-gray-100">
                                      {subItem.subItems.map((nested) => (
                                        <Link
                                          key={nested.name}
                                          to={nested.path}
                                          className="block text-sm text-gray-400 hover:text-orange-600"
                                        >
                                          {nested.name}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <Link
                          to={item.path}
                          className="block text-lg font-medium text-gray-600 hover:text-orange-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}

                  <div className="h-px bg-gray-200 my-4" />

                  {(user?.userType === 'AGENT' || user?.userType === 'company_agent') && (
                    <Link
                      to="/agent/properties/create"
                      className="text-lg font-medium text-gray-600 hover:text-orange-600"
                    >
                      + Post Property
                    </Link>
                  )}

                  {user?.userType === 'BUYER' && (
                    <Link
                      to="/buyer/post-property"
                      className="text-lg font-medium text-gray-600 hover:text-orange-600"
                    >
                      + Post Property
                    </Link>
                  )}

                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      className="justify-start text-lg font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-0"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Log out
                    </Button>
                  ) : (
                    <>
                      <Link
                        to="/sign-in"
                        className="text-lg font-medium text-gray-600 hover:text-orange-600"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/sign-up"
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-center text-sm font-medium rounded-md transition duration-150"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;