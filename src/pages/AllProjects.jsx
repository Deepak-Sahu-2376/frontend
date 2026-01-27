import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { API_BASE_URL } from '../utils/apiClient';
import SEO from '../components/SEO';


const AllProjects = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const cityParam = searchParams.get('city');

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Filter & Sort State
    const [filterType, setFilterType] = useState('');
    const [sortOption, setSortOption] = useState('newest');

    const fetchProjects = async (pageNo, type = filterType, sort = sortOption) => {
        try {
            if (pageNo === 0) setLoading(true);
            else setIsFetchingMore(true);

            // Construct Query Params
            let queryParams = `page=${pageNo}&size=15`;

            // Sorting Logic
            let sortBy = 'createdAt';
            let sortDir = 'DESC';

            if (sort === 'oldest') {
                sortBy = 'createdAt';
                sortDir = 'ASC';
            } else if (sort === 'price_low') {
                sortBy = 'startingPrice';
                sortDir = 'ASC';
            } else if (sort === 'price_high') {
                sortBy = 'startingPrice';
                sortDir = 'DESC';
            }
            queryParams += `&sortBy=${sortBy}&sortDir=${sortDir}`;

            // Filter Logic
            if (type) {
                queryParams = queryParams.replace('size=15', 'size=100');
            }
            if (cityParam) {
                queryParams += `&city=${encodeURIComponent(cityParam)}`;
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/properties/projects?${queryParams}`);
            const result = await response.json();

            if (result.success) {
                let newProjects = result.data.projects;

                // Client-side Filtering Workaround
                if (type) {
                    newProjects = newProjects.filter(p =>
                        p.projectType && p.projectType.toUpperCase() === type.toUpperCase()
                    );
                }

                if (pageNo === 0) {
                    setProjects(newProjects);
                } else {
                    setProjects(prev => [...prev, ...newProjects]);
                }

                // Update hasMore based on filtered results vs total (approximation)
                // If we filtered client side, standard pagination check might be inaccurate, 
                // but for now with size=100 it covers most cases.
                setHasMore(result.data.projects.length === 100);
            } else {
                setError(result.message || 'Failed to fetch projects');
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('An error occurred while fetching projects');
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchProjects(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProjects(nextPage);
    };

    const handleFilterChange = (e) => {
        const newType = e.target.value;
        setFilterType(newType);
        setPage(0);
        fetchProjects(0, newType, sortOption);
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSortOption(newSort);
        setPage(0);
        fetchProjects(0, filterType, newSort);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
                    <p className="text-gray-600">{error}</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    const getFullUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <SEO
                title="Projects"
                description="Explore our portfolio of innovative residential and commercial projects across various sectors."
            />
            <div className="max-w-7xl mx-auto">


                {/* Filter Section */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Projects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Project Type</label>
                            <select
                                value={filterType}
                                onChange={handleFilterChange}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-gray-700"
                            >
                                <option value="">All Types</option>
                                <option value="RESIDENTIAL">Residential</option>
                                <option value="COMMERCIAL">Commercial</option>
                                <option value="MIXED">Mixed Use</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Sort By</label>
                            <select
                                value={sortOption}
                                onChange={handleSortChange}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-gray-700"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-8 text-gray-500 text-sm font-medium">
                    Showing {projects.length} projects
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => {
                        const primaryImage = getFullUrl(project.mediaFiles?.find(m => m.isPrimary)?.mediaUrl
                            || project.mediaFiles?.[0]?.mediaUrl)
                            || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60';

                        return (
                            <div
                                key={project.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col"
                                onClick={() => {
                                    const citySlug = project.city?.toLowerCase().replace(/\s+/g, '-') || 'city';
                                    const titleSlug = project.name?.toLowerCase().replace(/\s+/g, '-') || 'project';
                                    navigate(`/projects/${titleSlug}/${citySlug}/${project.id}`);
                                }}
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={primaryImage}
                                        alt={project.name}
                                        loading={index < 6 ? "eager" : "lazy"}
                                        fetchPriority={index < 3 ? "high" : "auto"}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Category Badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-800 shadow-sm">
                                        {project.projectType}
                                    </div>
                                    {/* Status Badge */}
                                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm">
                                        {project.status}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {project.name}
                                        </h3>
                                        {project.isFeatured && (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Featured</span>
                                        )}
                                    </div>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                        {project.description}
                                    </p>

                                    <div className="mt-auto space-y-3">
                                        {/* Meta Info */}
                                        <div className="flex flex-col gap-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="line-clamp-1">{project.city}, {project.state}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span>Completion: {project.expectedCompletion || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 font-semibold text-gray-700">
                                                <Tag className="w-4 h-4 text-gray-400" />
                                                <span>{project.formattedPriceRange || 'Price on Request'}</span>
                                            </div>
                                        </div>

                                        {/* Amenities/Tags */}
                                        <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                                            {project.amenities?.slice(0, 3).map((amenity, index) => (
                                                <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                                    {(typeof amenity === 'string' ? amenity : amenity.name).replace(/_/g, ' ')}
                                                </span>
                                            ))}
                                            {project.amenities?.length > 3 && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500">
                                                    +{project.amenities.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Load More Button */}
                {hasMore && !loading && (
                    <div className="mt-12 text-center">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleLoadMore}
                            disabled={isFetchingMore}
                            className="min-w-[200px]"
                        >
                            {isFetchingMore ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    Loading...
                                </div>
                            ) : (
                                'More'
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProjects;
