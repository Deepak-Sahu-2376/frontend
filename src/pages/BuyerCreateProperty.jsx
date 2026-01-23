import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Upload, X, Building2, MapPin, CheckSquare, Image as ImageIcon, Video, FileText } from 'lucide-react';
import EnhancedTagInput from '../components/ui/EnhancedTagInput';
import { Button } from '../components/ui/button';
import { useUser } from '../contexts/UserContext';
import Footer from '../components/Footer';

const PROPERTY_TYPES = [
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'VILLA', label: 'Villa' },
    { value: 'INDEPENDENT_HOUSE', label: 'Independent House' },
    { value: 'STUDIO', label: 'Studio' },
    { value: 'PENTHOUSE', label: 'Penthouse' },
    { value: 'FARMHOUSE', label: 'Farmhouse' },
];

const LISTING_TYPES = [
    { value: 'RENT', label: 'Rent' },
    { value: 'PG', label: 'PG' },
    { value: 'COMMERCIAL_RENT', label: 'Commercial Rent' },
];

const FURNISHING_STATUS = [
    { value: 'FULLY_FURNISHED', label: 'Fully Furnished' },
    { value: 'SEMI_FURNISHED', label: 'Semi Furnished' },
    { value: 'UNFURNISHED', label: 'Unfurnished' },
];

const AVAILABLE_AMENITIES = [
    { value: 'SWIMMING_POOL', label: 'Swimming Pool' },
    { value: 'GYM', label: 'Gym' },
    { value: 'PARKING', label: 'Parking' },
    { value: 'ELEVATOR', label: 'Elevator' },
    { value: 'SECURITY', label: '24/7 Security' },
    { value: 'CLUB_HOUSE', label: 'Club House' },
    { value: 'POWER_BACKUP', label: 'Power Backup' },
    { value: 'GARDEN', label: 'Garden' },
];

const BuyerCreateProperty = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [amenities, setAmenities] = useState([]);
    const [images, setImages] = useState([]);
    const [floorPlan, setFloorPlan] = useState(null);
    const [video, setVideo] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        propertyType: 'APARTMENT',
        listingType: 'RENT',
        bedrooms: '',
        bathrooms: '',
        balconies: '',
        carpetArea: '',
        builtUpArea: '',
        superBuiltUpArea: '',
        monthlyRent: '',
        securityDeposit: '',
        maintenanceCharges: '',
        latitude: '',
        longitude: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        address: '',
        floorNumber: '',
        totalFloors: '',
        unitNumber: '',
        tower: '',
        isCornerUnit: false,
        furnishingStatus: 'UNFURNISHED',
        coveredParkingSpots: '',
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            const submitFormData = new FormData();

            // Handle numeric fields converting string to numbers
            const propertyData = {
                ...formData,
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                balconies: Number(formData.balconies),
                carpetArea: Number(formData.carpetArea),
                builtUpArea: Number(formData.builtUpArea),
                superBuiltUpArea: Number(formData.superBuiltUpArea),
                monthlyRent: Number(formData.monthlyRent),
                securityDeposit: Number(formData.securityDeposit),
                maintenanceCharges: Number(formData.maintenanceCharges),
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude),
                floorNumber: Number(formData.floorNumber),
                totalFloors: Number(formData.totalFloors),
                coveredParkingSpots: Number(formData.coveredParkingSpots),
                amenities: amenities
            };

            submitFormData.append('property', JSON.stringify(propertyData));

            // Append files
            images.forEach(image => {
                submitFormData.append('images', image);
            });

            if (floorPlan) {
                submitFormData.append('floorPlan', floorPlan);
            }

            if (video) {
                submitFormData.append('video', video);
            }

            // Use relative URL to leverage Vite proxy and avoid CORS/Network issues
            const response = await fetch(`/api/v1/properties/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitFormData
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Property submitted successfully! It will be listed after admin approval.');
                navigate('/properties'); // Redirect to profile or my properties eventually
            } else {
                toast.error(data.message || 'Failed to create property');
                console.error('Create property error:', data);
            }
        } catch (error) {
            console.error('Error creating property:', error);
            toast.error('An error occurred while creating the property');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Post Property for Rent</h1>
                    <p className="text-gray-600 mt-2">Fill in the details below to list your property for rent.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-900 border-b pb-4">
                            <Building2 className="h-5 w-5 text-orange-600" />
                            Basic Information
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. Luxury 3 BHK Apartment in Mumbai"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                <textarea
                                    name="description"
                                    required
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Describe the property..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
                                <select
                                    name="propertyType"
                                    value={formData.propertyType}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                >
                                    {PROPERTY_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type *</label>
                                <select
                                    name="listingType"
                                    value={formData.listingType}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                >
                                    {LISTING_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing Status *</label>
                                <select
                                    name="furnishingStatus"
                                    value={formData.furnishingStatus}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                >
                                    {FURNISHING_STATUS.map(status => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-lg w-full hover:bg-gray-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="isCornerUnit"
                                        checked={formData.isCornerUnit}
                                        onChange={handleInputChange}
                                        className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                                    />
                                    <span className="text-gray-700 font-medium">Is Corner Unit?</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Location Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-900 border-b pb-4">
                            <MapPin className="h-5 w-5 text-orange-600" />
                            Location Details
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                <input
                                    type="text"
                                    name="state"
                                    required
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    required
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                                <input
                                    type="text"
                                    name="country"
                                    required
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                <input
                                    type="number"
                                    name="latitude"
                                    step="any"
                                    value={formData.latitude}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. 19.0760"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                <input
                                    type="number"
                                    name="longitude"
                                    step="any"
                                    value={formData.longitude}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. 72.8777"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-900 border-b pb-4">
                            <CheckSquare className="h-5 w-5 text-orange-600" />
                            Specifications
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms *</label>
                                <input
                                    type="number"
                                    name="bedrooms"
                                    required
                                    min="0"
                                    value={formData.bedrooms}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms *</label>
                                <input
                                    type="number"
                                    name="bathrooms"
                                    required
                                    min="0"
                                    value={formData.bathrooms}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Balconies</label>
                                <input
                                    type="number"
                                    name="balconies"
                                    min="0"
                                    value={formData.balconies}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Carpet Area (sq ft) *</label>
                                <input
                                    type="number"
                                    name="carpetArea"
                                    required
                                    min="0"
                                    value={formData.carpetArea}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Floors *</label>
                                <input
                                    type="number"
                                    name="totalFloors"
                                    required
                                    min="1"
                                    value={formData.totalFloors}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Floor No. *</label>
                                <input
                                    type="number"
                                    name="floorNumber"
                                    required
                                    value={formData.floorNumber}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing (Rent Specific) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-900 border-b pb-4">
                            <span className="text-xl">₹</span>
                            Pricing
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₹) *</label>
                                <input
                                    type="number"
                                    name="monthlyRent"
                                    required
                                    min="0"
                                    value={formData.monthlyRent}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)</label>
                                <input
                                    type="number"
                                    name="securityDeposit"
                                    min="0"
                                    value={formData.securityDeposit}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Charges (₹/month)</label>
                                <input
                                    type="number"
                                    name="maintenanceCharges"
                                    min="0"
                                    value={formData.maintenanceCharges}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <EnhancedTagInput
                            label="Amenities"
                            value={amenities}
                            onChange={setAmenities}
                            placeholder="Type to add custom (e.g., 'Gym')"
                            suggestions={AVAILABLE_AMENITIES.map(a => a.label)}
                        />
                    </div>

                    {/* Media Uploads */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-900 border-b pb-4">
                            <ImageIcon className="h-5 w-5 text-orange-600" />
                            Media Uploads
                        </div>

                        <div className="space-y-6">
                            {/* Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-500 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center">
                                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click to upload images</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG</span>
                                    </label>
                                </div>
                                {images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {images.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`preview ${index}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Video */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Property Video</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-500 transition-colors">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => setVideo(e.target.files[0])}
                                        className="hidden"
                                        id="video-upload"
                                    />
                                    <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center justify-center">
                                        <Video className="h-10 w-10 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click to upload video (Max 1)</span>
                                        <span className="text-xs text-gray-400 mt-1">MP4, WEBM, OGG</span>
                                    </label>
                                </div>
                                {video && (
                                    <div className="mt-4 relative group w-48">
                                        <div className="flex items-center p-2 bg-gray-50 border rounded-lg">
                                            <Video className="h-5 w-5 text-gray-500 mr-2" />
                                            <span className="text-sm text-gray-700 truncate">{video.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setVideo(null)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Post Property'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BuyerCreateProperty;
