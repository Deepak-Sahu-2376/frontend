import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, Mail, Trash2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";

const ProfilePage = () => {
    const { user, updateProfile, deleteAccount, logout } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        jobTitle: '',
        email: '',
    });

    // Initialize form data when user data is available
    React.useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.name || '',
                jobTitle: user.jobTitle || 'Real Estate Agent', // Default if missing
                email: user.email || '',
            });
        }
    }, [user]);

    const handleSave = () => {
        updateProfile({
            name: formData.fullName,
            jobTitle: formData.jobTitle
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Revert to original user data
        if (user) {
            setFormData({
                fullName: user.name || '',
                jobTitle: user.jobTitle || '',
                email: user.email || '',
            });
        }
        setIsEditing(false);
    };

    const handleDeleteAccount = async () => {
        await deleteAccount();
        // Redirect or handling calls are done in deleteAccount (which clears state)
        // Usually, the app router handles the redirect when user becomes null
    };



    return (
        <div className="min-h-screen bg-white pt-20 px-4 sm:px-6 lg:px-8 font-sans text-slate-700">
            <div className="max-w-6xl mx-auto">

                <div className="space-y-12">

                    {/* Profile Picture Section */}
                    <section>
                        <h2 className="text-xl font-normal text-slate-800 mb-6">Profile Picture</h2>
                        <div className="flex items-center space-x-6">
                            <div className="h-24 w-24 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                                <img
                                    src=""
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="space-y-3">
                                <p className="text-slate-500 text-sm">We only support PNG or JPG pictures.</p>
                                <div className="flex items-center space-x-4">
                                    <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-normal h-10 px-4">
                                        Upload Your Photo
                                    </Button>
                                    <button className="text-slate-400 hover:text-slate-600 text-sm">
                                        Delete Image
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-dotted border-slate-200"></div>

                    {/* Basic Information Section */}
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-normal text-slate-800">Basic Information</h2>
                            {!isEditing ? (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    variant="outline"
                                    className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                >
                                    Edit Information
                                </Button>
                            ) : (
                                <div className="flex space-x-3">
                                    <Button
                                        onClick={handleCancel}
                                        variant="ghost"
                                        className="text-slate-600 hover:bg-slate-100"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">

                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-slate-600 font-medium">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    readOnly={!isEditing}
                                    className={`bg-white border-slate-200 h-11 text-slate-700 ${!isEditing ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`}
                                />
                            </div>

                            {/* Job Title */}
                            <div className="space-y-2">
                                <Label htmlFor="jobTitle" className="text-slate-600 font-medium">Job Title</Label>
                                <Input
                                    id="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    readOnly={!isEditing}
                                    className={`bg-white border-slate-200 h-11 text-slate-700 ${!isEditing ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`}
                                />
                            </div>

                            {/* Email Address */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="email" className="text-slate-600 font-medium">Email Address</Label>
                                    <span className="text-slate-400 text-sm">(Change Email)</span>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        value={formData.email}
                                        readOnly
                                        className="bg-slate-50 border-slate-200 h-11 text-slate-700 pr-24"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-slate-500 text-sm">
                                        <Mail className="w-4 h-4 mr-1" />
                                        Pending...
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-600 font-medium">Password</Label>
                                <div>
                                    <Button variant="outline" className="w-full justify-start bg-slate-50 border-slate-200 text-slate-600 font-normal h-11 hover:bg-slate-100">
                                        Change Password
                                    </Button>
                                </div>
                            </div>

                        </div>

                        {/* Team Role */}
                        <div className="mt-8 space-y-2">
                            <Label className="text-slate-600 font-medium">Team Role</Label>
                            <div className="flex items-center space-x-2 text-slate-700">
                                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded">OWNER</span>
                                <span>in <span className="font-semibold">Everhour</span></span>
                                <span className="text-slate-400 text-sm ml-2">(Transfer Ownership)</span>
                            </div>
                        </div>

                    </section>

                    <div className="border-t border-dotted border-slate-200"></div>

                    {/* Delete Account Section */}
                    <section className="pt-6 pb-20">
                        <h2 className="text-xl font-normal text-red-600 mb-4">Danger Zone</h2>
                        <div className="bg-red-50 border border-red-100 rounded-lg p-6">
                            <h3 className="text-sm font-medium text-red-800 mb-2">Delete Account</h3>
                            <p className="text-sm text-red-600 mb-6">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>

                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Delete Account</DialogTitle>
                                        <DialogDescription>
                                            Are you absolutely sure? This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="mt-4">
                                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                                            Confirm Delete
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
