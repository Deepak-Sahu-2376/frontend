import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../utils/apiClient';
import { useAdmin } from '../../contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { MapPin, Building2, Calendar, Eye, Pencil, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const AdminProjects = () => {
    const navigate = useNavigate();
    // Local state for pagination
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const fetchProjects = async (pageNo) => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            if (pageNo === 0) setLoading(true);
            else setIsFetchingMore(true);

            const response = await fetch(`${API_BASE_URL}/api/v1/properties/projects/view?page=${pageNo}&size=15`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();

            if (response.ok && result.success) {
                const newProjects = result.data.projects || [];
                if (pageNo === 0) {
                    setProjects(newProjects);
                } else {
                    setProjects(prev => [...prev, ...newProjects]);
                }
                setHasMore(newProjects.length === 15);
            } else {
                console.error('Failed to fetch projects:', result);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        fetchProjects(0);
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProjects(nextPage);
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const initiateDelete = (project) => {
        setItemToDelete(project);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        const id = itemToDelete.id;

        try {
            const token = localStorage.getItem('adminAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/properties/projects/${id}`, { // Using property routes for project actions if standard REST
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Project deleted successfully');
                window.location.reload();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to delete project');
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('An error occurred while deleting');
            throw error;
        }
    };

    // Old handleDelete removed
    // const handleDelete = ...

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Projects</h1>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">Manage and view all listed projects</p>
                </div>
                <Button onClick={() => fetchProjects(0)} variant="outline" className="w-full md:w-auto">
                    Refresh List
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Projects List</CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Project Name</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Location</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Company</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Created At</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {projects.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-500">
                                            No projects found
                                        </td>
                                    </tr>
                                ) : (
                                    projects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50/50">
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-gray-900">{project.name}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-[200px]">{project.description}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                    {project.projectType}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {project.city}, {project.state}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge className="bg-green-100 text-green-700">
                                                    {project.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-700">{project.company?.companyName || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {new Date(project.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/projects/${project.id}`)}
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => initiateDelete(project)}
                                                    title="Delete"
                                                    className="text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {projects.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No projects found
                            </div>
                        ) : (
                            projects.map((project) => (
                                <div key={project.id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
                                            <p className="text-xs text-gray-500 truncate max-w-full">{project.description}</p>
                                        </div>
                                        <Badge className="bg-green-100 text-green-700">
                                            {project.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate">{project.city}, {project.state}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Building2 className="w-3 h-3" />
                                            <span className="truncate">{project.company?.companyName || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                {project.projectType}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full text-blue-700 border-blue-200 hover:bg-blue-50"
                                        size="sm"
                                        onClick={() => navigate(`/projects/${project.id}`)}
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Project
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full text-red-700 border-red-200 hover:bg-red-50 mt-2"
                                        size="sm"
                                        onClick={() => initiateDelete(project)}
                                    >
                                        <Trash className="w-4 h-4 mr-2" />
                                        Delete Project
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <DeleteConfirmationDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Project"
                itemName={itemToDelete?.name}
                description="Are you sure you want to delete this project? This action cannot be undone and will permanently delete the project listing and all associated media files."
            />

            {/* Load More Button */}
            {hasMore && !loading && (
                <div className="mt-6 text-center">
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
    );
};

export default AdminProjects;
