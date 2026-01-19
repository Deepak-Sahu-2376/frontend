import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { MapPin, Building2, Calendar, CheckCircle, XCircle } from 'lucide-react';

const AdminPendingProjects = () => {
    const { pendingProjects, fetchPendingProjectsAdmin, approveProject, rejectProject } = useAdmin();
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchPendingProjectsAdmin();
    }, []);

    const handleApprove = async (projectId) => {
        await approveProject(projectId);
    };

    const handleRejectClick = (project) => {
        setSelectedProject(project);
        setIsRejectDialogOpen(true);
        setRejectionReason('');
    };

    const handleRejectConfirm = async () => {
        if (!rejectionReason.trim()) {
            return;
        }

        const success = await rejectProject(selectedProject.id, rejectionReason);
        if (success) {
            setIsRejectDialogOpen(false);
            setSelectedProject(null);
            setRejectionReason('');
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pending Approval Projects</h1>
                    <p className="text-gray-500 mt-1">Review and approve or reject pending projects</p>
                </div>
                <Button onClick={fetchPendingProjectsAdmin} variant="outline">
                    Refresh List
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Projects Awaiting Approval ({pendingProjects.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Project Name</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Location</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Company</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Created At</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {pendingProjects.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500">
                                            No pending projects found
                                        </td>
                                    </tr>
                                ) : (
                                    pendingProjects.map((project) => (
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
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        onClick={() => handleApprove(project.id)}
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        <div className='flex items-center'> <CheckCircle className="w-4 h-4 mr-1" />
                                                            Approve</div>
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleRejectClick(project)}
                                                        size="sm"
                                                        variant="destructive"
                                                    >
                                                        <div className='flex items-center'> <XCircle className="w-4 h-4 mr-1" />
                                                            Reject</div>
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
                        {pendingProjects.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No pending projects found
                            </div>
                        ) : (
                            pendingProjects.map((project) => (
                                <div key={project.id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{project.name}</h3>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{project.description}</p>
                                        </div>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                            {project.projectType}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate">{project.city}, {project.state}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Building2 className="w-3 h-3" />
                                            <span className="truncate">{project.company?.companyName || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 col-span-2 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <Button
                                            onClick={() => handleApprove(project.id)}
                                            size="sm"
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleRejectClick(project)}
                                            size="sm"
                                            variant="destructive"
                                            className="flex-1"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Reject Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Project</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting "{selectedProject?.name}"
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Rejection Reason *</Label>
                            <Input
                                id="reason"
                                placeholder="e.g., Incomplete documentation, Invalid RERA details"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRejectDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectConfirm}
                            disabled={!rejectionReason.trim()}
                        >
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPendingProjects;
