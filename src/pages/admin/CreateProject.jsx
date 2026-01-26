import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { API_BASE_URL } from '../../utils/apiClient';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Upload, X, FileText, Image as ImageIcon, Video, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useAdmin } from '../../contexts/AdminContext';
import { AMENITIES_LIST, AMENITY_CATEGORIES } from '../../data/amenities';

const CreateProject = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const { companies } = useAdmin();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        projectType: '',
        companyId: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        totalArea: '',
        totalUnits: '',
        startingPrice: '',
        amenities: [],

        // New Fields
        totalPhases: '',
        availableUnits: '',
        totalFloors: '',
        totalTowers: '',
        avgPrice: '',
        priceRangeMax: '',
        pricePerSqft: '',
        possessionDate: '',
        latitude: '',
        longitude: '',
        locationAdvantages: '',
        reraApproved: false,
        reraValidityDate: '',
        developerName: '',
        architectName: '',
        launchDate: '',
        expectedCompletion: '',

        isFeatured: '',
        isActive: '',
    });

    const [mediaUploads, setMediaUploads] = useState([]);
    const [existingMedia, setExistingMedia] = useState([]);
    const [mediaToDelete, setMediaToDelete] = useState([]);

    useEffect(() => {
        if (isEditMode) {
            fetchProjectDetails();
        }
    }, [id]);

    const fetchProjectDetails = async () => {
        try {
            // Fetch project details. Assuming generic getProjectById endpoint works without auth header for public checks BUT likely need admin token for Admin view if restricted.
            // Using admin token to be safe if endpoint supports it or rely on public endpoint.
            // Route: GET /api/v1/properties/projects/:id (Line 82 propertyRoutes.js) -> getProjectById
            const token = localStorage.getItem('adminAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/properties/projects/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();

            if (response.ok && result.success) {
                const p = result.data;
                setFormData({
                    name: p.name || '',
                    description: p.description || '',
                    projectType: p.projectType || '',
                    companyId: p.companyId ? String(p.companyId) : '',
                    address: p.address || '',
                    city: p.city || '',
                    state: p.state || '',
                    pincode: p.pincode || '',
                    country: p.country || 'India',
                    totalArea: p.totalArea || '',
                    totalUnits: p.totalUnits || '',
                    startingPrice: p.startingPrice || '',
                    amenities: p.amenities || [],

                    totalPhases: p.totalPhases || '',
                    availableUnits: p.availableUnits || '',
                    totalFloors: p.totalFloors || '',
                    totalTowers: p.totalTowers || '',
                    avgPrice: p.avgPrice || '',
                    priceRangeMax: p.priceRangeMax || '',
                    pricePerSqft: p.pricePerSqft || '',
                    possessionDate: p.possessionDate ? p.possessionDate.split('T')[0] : '',
                    latitude: p.latitude || '',
                    longitude: p.longitude || '',
                    locationAdvantages: p.locationAdvantages ? p.locationAdvantages.join('\n') : '',
                    reraApproved: p.reraApproved || false,
                    reraValidityDate: p.reraValidityDate ? p.reraValidityDate.split('T')[0] : '',
                    developerName: p.developerName || '',
                    architectName: p.architectName || '',
                    launchDate: p.launchDate ? p.launchDate.split('T')[0] : '',
                    expectedCompletion: p.expectedCompletion ? p.expectedCompletion.split('T')[0] : '',
                    isFeatured: p.isFeatured || false,
                    isActive: p.isActive || false
                });
                // Media handling is complex (showing existing, allowing deletes). 
                // For now, let's allow adding NEW media. Existing media management needs separate UI block often.
                // We could show existing media in a separate block if needed.
                if (p.media) {
                    setExistingMedia(p.media);
                }
            } else {
                toast.error("Failed to fetch project details");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading project");
        }
    };

    // availableAmenities removed in favor of AMENITIES_LIST from data/amenities.js

    const projectTypes = [
        'APARTMENT', 'VILLA', 'PLOT', 'OFFICE', 'SHOP', 'WAREHOUSE', 'HOTEL', 'FARMHOUSE',
        'STUDIO', 'PENTHOUSE', 'INDEPENDENT_HOUSE', 'COMMERCIAL', 'LAND', 'RESIDENTIAL'
    ];

    const mediaCategories = [
        { value: 'EXTERIOR', label: 'Exterior' },
        { value: 'INTERIOR', label: 'Interior' },
        { value: 'FLOOR_PLAN', label: 'Floor Plan' },
        { value: 'VIDEO_TOUR', label: 'Video Tour' },
        { value: 'MARKETING', label: 'Marketing' },
        { value: 'OTHER', label: 'Other' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAmenityChange = (amenity) => {
        setFormData(prev => {
            const amenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities };
        });
    };

    const handleFileUpload = (e, mediaType) => {
        const files = Array.from(e.target.files);
        const newUploads = files.map(file => ({
            file,
            mediaType,
            title: '',
            category: mediaType === 'VIDEO' ? 'VIDEO_TOUR' : mediaType === 'IMAGE' ? 'EXTERIOR' : 'MARKETING',
            isPrimary: false,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        }));
        setMediaUploads(prev => [...prev, ...newUploads]);
    };

    const updateMediaUpload = (index, field, value) => {
        setMediaUploads(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const removeMediaUpload = (index) => {
        setMediaUploads(prev => prev.filter((_, i) => i !== index));
    };

    const setPrimaryMedia = (index) => {
        setMediaUploads(prev => prev.map((item, i) => ({
            ...item,
            isPrimary: i === index
        })));
    };

    const handleDeleteExistingMedia = (index) => {
        const item = existingMedia[index];
        setMediaToDelete(prev => [...prev, item.url]);
        setExistingMedia(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validation
            if (!formData.name || !formData.projectType || !formData.companyId) {
                const missing = [];
                if (!formData.name) missing.push('Project Name');
                if (!formData.projectType) missing.push('Project Type');
                if (!formData.companyId) missing.push('Company');
                toast.error(`Please fill all required fields: ${missing.join(', ')}`);
                setIsSubmitting(false);
                return;
            }

            if (!isEditMode && mediaUploads.length === 0) {
                toast.error('Please upload at least one image or video');
                setIsSubmitting(false);
                return;
            }

            // Get admin access token
            const adminToken = localStorage.getItem('adminAccessToken');
            if (!adminToken) {
                toast.error('Admin authentication required');
                setIsSubmitting(false);
                return;
            }

            // Prepare FormData matching exact curl structure
            const formDataToSend = new FormData();

            // Prepare projectDTO as JSON string (matching curl format)
            const projectDTO = {
                name: formData.name,
                description: formData.description,
                projectType: formData.projectType,
                companyId: formData.companyId,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                country: formData.country,

                // Numeric fields
                totalPhases: formData.totalPhases ? parseInt(formData.totalPhases) : undefined,
                availableUnits: formData.availableUnits ? parseInt(formData.availableUnits) : undefined,
                totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : undefined,
                totalTowers: formData.totalTowers ? parseInt(formData.totalTowers) : undefined,
                totalArea: formData.totalArea ? parseFloat(formData.totalArea) : undefined,
                totalUnits: formData.totalUnits ? parseInt(formData.totalUnits) : undefined,

                // Price fields
                avgPrice: formData.avgPrice ? parseFloat(formData.avgPrice) : undefined,
                priceRangeMax: formData.priceRangeMax ? parseFloat(formData.priceRangeMax) : undefined,
                pricePerSqft: formData.pricePerSqft ? parseFloat(formData.pricePerSqft) : undefined,
                startingPrice: formData.startingPrice ? parseFloat(formData.startingPrice) : undefined,

                // Dates
                possessionDate: formData.possessionDate || undefined,
                launchDate: formData.launchDate || undefined,
                expectedCompletion: formData.expectedCompletion || undefined,
                reraValidityDate: formData.reraValidityDate || undefined,

                // Location
                latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
                locationAdvantages: formData.locationAdvantages ? formData.locationAdvantages.split('\n').filter(s => s.trim()) : [],

                // Other
                reraApproved: formData.reraApproved,
                developerName: formData.developerName,
                architectName: formData.architectName,
                amenities: formData.amenities,
                isFeatured: formData.isFeatured,
                isActive: formData.isActive,
            };

            // Add projectDTO as JSON string
            formDataToSend.append('projectDTO', JSON.stringify(projectDTO));

            // Add media files and their metadata (matching curl structure)
            mediaUploads.forEach((upload) => {
                formDataToSend.append('mediaFiles', upload.file);
                formDataToSend.append('mediaTypes', upload.mediaType);
                formDataToSend.append('titles', upload.title || upload.file.name);
                formDataToSend.append('categories', upload.category);
                formDataToSend.append('isPrimaryFlags', upload.isPrimary.toString());
            });

            // Append deleted media URLs
            mediaToDelete.forEach(url => {
                formDataToSend.append('mediaToDelete', url);
            });

            // Make API call

            // Make API call
            // Make API call
            const url = isEditMode
                ? `${API_BASE_URL}/api/v1/properties/projects/${id}`
                : `${API_BASE_URL}/api/v1/properties/projects/create`;

            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                },
                body: formDataToSend,
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(isEditMode ? 'Project updated successfully!' : 'Project created successfully!');
                navigate('/admin/projects');
            } else {
                toast.error(result.message || (isEditMode ? 'Failed to update project' : 'Failed to create project'));
            }
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error('An error occurred while creating the project');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? 'Edit Project' : 'Create Project'}</h1>
                    <p className="text-muted-foreground mt-1">{isEditMode ? 'Update project details' : 'Add a new real estate project to your portfolio'}</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button
                        className="bg-black text-white hover:bg-gray-800"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Project' : 'Create Project')}
                    </Button>
                </div>
            </div>

            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Enter the core details of your project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., Skyline Heights Premium Residency"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="projectType">Project Type *</Label>
                            <Select
                                value={formData.projectType}
                                onValueChange={(value) => handleSelectChange('projectType', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select project type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projectTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="e.g., Luxurious apartments with modern amenities"
                            className="min-h-[100px]"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companyId">Company *</Label>
                        <Select
                            value={formData.companyId}
                            onValueChange={(value) => handleSelectChange('companyId', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select company" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies?.map(company => {
                                    const id = company.companyId || company.id;
                                    const name = company.companyName || company.name;
                                    if (!id) return null;
                                    return (
                                        <SelectItem key={id} value={String(id)}>
                                            {name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="developerName">Developer Name</Label>
                            <Input
                                id="developerName"
                                name="developerName"
                                placeholder="e.g., DLF Group"
                                value={formData.developerName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="architectName">Architect Name</Label>
                            <Input
                                id="architectName"
                                name="architectName"
                                placeholder="e.g., Hafeez Contractor"
                                value={formData.architectName}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onCheckedChange={(checked) => {
                                    setFormData(prev => ({ ...prev, isFeatured: !!checked }));
                                }}
                            />
                            <Label htmlFor="isFeatured">Is Featured</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => {
                                    setFormData(prev => ({ ...prev, isActive: !!checked }));
                                }}
                            />
                            <Label htmlFor="isActive">Is Active</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Project Details & Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                    <CardDescription>Specifications and units information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="totalArea">Total Area (sq.ft)</Label>
                            <Input
                                id="totalArea"
                                name="totalArea"
                                type="number"
                                placeholder="e.g., 50000"
                                value={formData.totalArea}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalUnits">Total Units</Label>
                            <Input
                                id="totalUnits"
                                name="totalUnits"
                                type="number"
                                placeholder="e.g., 150"
                                value={formData.totalUnits}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="availableUnits">Available Units</Label>
                            <Input
                                id="availableUnits"
                                name="availableUnits"
                                type="number"
                                placeholder="e.g., 45"
                                value={formData.availableUnits}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="totalPhases">Total Phases</Label>
                            <Input
                                id="totalPhases"
                                name="totalPhases"
                                type="number"
                                placeholder="e.g., 3"
                                value={formData.totalPhases}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalFloors">Total Floors</Label>
                            <Input
                                id="totalFloors"
                                name="totalFloors"
                                type="number"
                                placeholder="e.g., 25"
                                value={formData.totalFloors}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalTowers">Total Towers</Label>
                            <Input
                                id="totalTowers"
                                name="totalTowers"
                                type="number"
                                placeholder="e.g., 4"
                                value={formData.totalTowers}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                    <CardDescription>Price details and ranges</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="startingPrice">Starting Price (₹)</Label>
                            <Input
                                id="startingPrice"
                                name="startingPrice"
                                type="number"
                                placeholder="e.g., 4500000"
                                value={formData.startingPrice}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priceRangeMax">Maximum Price (₹)</Label>
                            <Input
                                id="priceRangeMax"
                                name="priceRangeMax"
                                type="number"
                                placeholder="e.g., 8500000"
                                value={formData.priceRangeMax}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="avgPrice">Average Price (₹)</Label>
                            <Input
                                id="avgPrice"
                                name="avgPrice"
                                type="number"
                                placeholder="e.g., 6500000"
                                value={formData.avgPrice}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pricePerSqft">Price per Sq.ft (₹)</Label>
                            <Input
                                id="pricePerSqft"
                                name="pricePerSqft"
                                type="number"
                                placeholder="e.g., 5500"
                                value={formData.pricePerSqft}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dates & Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                    <CardDescription>Important project dates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="launchDate">Launch Date</Label>
                            <Input
                                id="launchDate"
                                name="launchDate"
                                type="date"
                                value={formData.launchDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expectedCompletion">Expected Completion</Label>
                            <Input
                                id="expectedCompletion"
                                name="expectedCompletion"
                                type="date"
                                value={formData.expectedCompletion}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="possessionDate">Possession Date</Label>
                            <Input
                                id="possessionDate"
                                name="possessionDate"
                                type="date"
                                value={formData.possessionDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Location */}
            <Card>
                <CardHeader>
                    <CardTitle>Location</CardTitle>
                    <CardDescription>Provide project location details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            placeholder="e.g., Plot No. 45, Sector 12"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                name="city"
                                placeholder="e.g., Gurugram"
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                                id="state"
                                name="state"
                                placeholder="e.g., Haryana"
                                value={formData.state}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input
                                id="pincode"
                                name="pincode"
                                placeholder="e.g., 122001"
                                value={formData.pincode}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                placeholder="e.g., 28.4595"
                                value={formData.latitude}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                name="longitude"
                                type="number"
                                step="any"
                                placeholder="e.g., 77.0266"
                                value={formData.longitude}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="locationAdvantages">Location Advantages (one per line)</Label>
                        <Textarea
                            id="locationAdvantages"
                            name="locationAdvantages"
                            placeholder="e.g., Near Metro Station&#10;Close to Airport"
                            value={formData.locationAdvantages}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Compliance */}
            <Card>
                <CardHeader>
                    <CardTitle>Compliance</CardTitle>
                    <CardDescription>RERA and legal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="reraApproved"
                            checked={formData.reraApproved}
                            onCheckedChange={(checked) => {
                                setFormData(prev => ({ ...prev, reraApproved: !!checked }));
                            }}
                        />
                        <Label htmlFor="reraApproved">RERA Approved</Label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="reraValidityDate">RERA Validity Date</Label>
                            <Input
                                id="reraValidityDate"
                                name="reraValidityDate"
                                type="date"
                                value={formData.reraValidityDate}
                                onChange={handleInputChange}
                                disabled={!formData.reraApproved}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
                <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                    <CardDescription>Select available amenities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {AMENITY_CATEGORIES.map((category) => (
                            <div key={category} className="space-y-3">
                                <h4 className="font-semibold text-sm text-gray-700">{category}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {AMENITIES_LIST
                                        .filter((a) => a.category === category)
                                        .map((amenity) => (
                                            <div key={amenity.value} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={amenity.value}
                                                    checked={formData.amenities.includes(amenity.value)}
                                                    onCheckedChange={() => handleAmenityChange(amenity.value)}
                                                />
                                                <Label
                                                    htmlFor={amenity.value}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {amenity.label}
                                                </Label>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Media Uploads */}
            <Card>
                <CardHeader>
                    <CardTitle>Media Uploads</CardTitle>
                    <CardDescription>Upload images, videos, and documents for your project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Images</Label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                            <label className="flex flex-col items-center justify-center cursor-pointer">
                                <div className="p-3 bg-blue-50 rounded-full">
                                    <ImageIcon className="h-6 w-6 text-blue-500" />
                                </div>
                                <div className="text-sm mt-2">
                                    <span className="text-blue-600 font-medium">Click to upload images</span>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, 'IMAGE')}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Video Upload */}
                    <div className="space-y-2">
                        <Label>Videos</Label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                            <label className="flex flex-col items-center justify-center cursor-pointer">
                                <div className="p-3 bg-blue-50 rounded-full">
                                    <Video className="h-6 w-6 text-blue-500" />
                                </div>
                                <div className="text-sm mt-2">
                                    <span className="text-blue-600 font-medium">Click to upload videos</span>
                                </div>
                                <p className="text-xs text-gray-500">MP4, MOV</p>
                                <input
                                    type="file"
                                    multiple
                                    accept="video/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, 'VIDEO')}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Document Upload */}
                    <div className="space-y-2">
                        <Label>Documents</Label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                            <label className="flex flex-col items-center justify-center cursor-pointer">
                                <div className="p-3 bg-blue-50 rounded-full">
                                    <FileText className="h-6 w-6 text-blue-500" />
                                </div>
                                <div className="text-sm mt-2">
                                    <span className="text-blue-600 font-medium">Click to upload documents</span>
                                </div>
                                <p className="text-xs text-gray-500">PDF</p>
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, 'DOCUMENT')}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Uploaded Media List */}
                    {mediaUploads.length > 0 && (
                        <div className="space-y-4 mt-6">
                            <Label>Uploaded Media ({mediaUploads.length})</Label>
                            <div className="space-y-3">
                                {mediaUploads.map((upload, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                {upload.preview && (
                                                    <img src={upload.preview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                                                )}
                                                <div>
                                                    <p className="font-medium text-sm">{upload.file.name}</p>
                                                    <p className="text-xs text-gray-500">{upload.mediaType}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setPrimaryMedia(index)}
                                                    className={upload.isPrimary ? 'text-yellow-500' : ''}
                                                >
                                                    <Star className={`h-4 w-4 ${upload.isPrimary ? 'fill-yellow-500' : ''}`} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeMediaUpload(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Title</Label>
                                                <Input
                                                    placeholder="e.g., Building Exterior"
                                                    value={upload.title}
                                                    onChange={(e) => updateMediaUpload(index, 'title', e.target.value)}
                                                    className="h-8"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Category</Label>
                                                <Select
                                                    value={upload.category}
                                                    onValueChange={(value) => updateMediaUpload(index, 'category', value)}
                                                >
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {mediaCategories.map(cat => (
                                                            <SelectItem key={cat.value} value={cat.value}>
                                                                {cat.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div >
    );
};

export default CreateProject;
