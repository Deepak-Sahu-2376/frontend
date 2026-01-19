import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAdmin } from '../../contexts/AdminContext';

const EnhancedTagInput = ({ label, value = [], onChange, placeholder, suggestions = [] }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(inputValue);
        }
    };

    const addTag = (tag) => {
        const trimmed = tag?.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };

    const toggleSuggestion = (suggestion) => {
        if (value.includes(suggestion)) {
            removeTag(suggestion);
        } else {
            addTag(suggestion);
        }
    };

    return (
        <div className="space-y-3 border rounded-lg p-4 bg-card/50">
            <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">{label}</Label>
                <span className="text-xs text-muted-foreground">{value.length} selected</span>
            </div>

            <div className="border rounded-xl p-3 bg-background focus-within:ring-2 focus-within:ring-ring ring-offset-background transition-all">
                <div className="flex flex-wrap gap-2 mb-2">
                    {value.map((tag, index) => (
                        <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive focus:outline-none transition-colors">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-none focus:outline-none text-sm placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground mt-2">Tip: Press <kbd className="px-1 py-0.5 rounded bg-muted border font-mono text-[10px]">Enter</kbd> to add a custom tag.</p>
            </div>

            {suggestions.length > 0 && (
                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        <span>Popular Suggestions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map(suggestion => {
                            const isSelected = value.includes(suggestion);
                            return (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => toggleSuggestion(suggestion)}
                                    className={`
                                        px-4 py-2 rounded-full text-sm border transition-all duration-200 flex items-center gap-2
                                        ${isSelected
                                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                            : 'bg-background hover:bg-muted/50 border-input text-foreground hover:border-primary/50'
                                        }
                                    `}
                                >
                                    {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                    {suggestion}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const DynamicList = ({ label, items = [], onChange, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const addItem = () => {
        if (inputValue.trim()) {
            onChange([...items, inputValue.trim()]);
            setInputValue('');
        }
    };

    const removeItem = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                />
                <Button type="button" onClick={addItem} variant="outline">Add</Button>
            </div>
            <ul className="space-y-2 mt-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md text-sm">
                        <span>{item}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const StructuredList = ({ label, items = [], onChange, fields }) => {
    const [newItem, setNewItem] = useState(fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}));

    const handleInputChange = (key, value) => {
        setNewItem(prev => ({ ...prev, [key]: value }));
    };

    const addItem = () => {
        if (Object.values(newItem).some(val => val.trim())) {
            onChange([...items, newItem]);
            setNewItem(fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}));
        }
    };

    const removeItem = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-2 items-end">
                {fields.map(field => (
                    <div key={field.key} className="flex-1">
                        <Input
                            placeholder={field.placeholder}
                            value={newItem[field.key]}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                        />
                    </div>
                ))}
                <Button type="button" onClick={addItem} variant="outline">Add</Button>
            </div>
            <div className="space-y-2 mt-2">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md text-sm">
                        <div className="flex gap-4">
                            {fields.map(field => (
                                <span key={field.key} className="font-medium">
                                    {field.label}: {item[field.key]}
                                </span>
                            ))}
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CreatePhase = () => {
    const navigate = useNavigate();
    const { projects, fetchProjects, createPhase } = useAdmin();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        phaseNumber: '',
        description: '',
        status: 'PLANNING',
        totalUnits: '',
        availableUnits: '',
        soldUnits: '0',
        blockedUnits: '0',
        startingPrice: '',
        maxPrice: '',
        carpetArea: '',
        builtUpArea: '',
        totalArea: '',
        bhkConfigurations: [],
        launchDate: '',
        expectedCompletionDate: '',
        possessionDate: '',
        reraNumber: '',
        floorCount: '',
        towerCount: '',
        parkingType: [],
        phaseAmenities: [],
        constructionStatus: '',
        completionPercentage: '0',
        estimatedCost: '',
        actualCost: '0',
        features: [],
        highlights: [],
        nearbyPlaces: [],
        specifications: [],
        unitTypes: [],
        priceList: [],
        isActive: true,
        isFeatured: false
    });

    const [files, setFiles] = useState({
        logoFile: null,
        brochureFile: null,
        masterPlanFile: null,
        floorPlanFiles: []
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, fieldName) => {
        if (fieldName === 'floorPlanFiles') {
            setFiles(prev => ({ ...prev, [fieldName]: Array.from(e.target.files) }));
        } else {
            setFiles(prev => ({ ...prev, [fieldName]: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!selectedProjectId) {
                toast.error('Please select a project');
                setIsSubmitting(false);
                return;
            }

            const payload = new FormData();

            // Prepare phase JSON
            // Prepare phase JSON
            const phaseData = {
                ...formData,
                phaseNumber: formData.phaseNumber ? parseInt(formData.phaseNumber) : null,
                totalUnits: formData.totalUnits ? parseInt(formData.totalUnits) : 0,
                availableUnits: formData.availableUnits ? parseInt(formData.availableUnits) : 0,
                soldUnits: formData.soldUnits ? parseInt(formData.soldUnits) : 0,
                blockedUnits: formData.blockedUnits ? parseInt(formData.blockedUnits) : 0,
                startingPrice: formData.startingPrice ? parseFloat(formData.startingPrice) : 0,
                maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : 0,
                carpetArea: formData.carpetArea ? parseFloat(formData.carpetArea) : 0,
                builtUpArea: formData.builtUpArea ? parseFloat(formData.builtUpArea) : 0,
                totalArea: formData.totalArea ? parseFloat(formData.totalArea) : 0,
                floorCount: formData.floorCount ? parseInt(formData.floorCount) : 0,
                towerCount: formData.towerCount ? parseInt(formData.towerCount) : 0,
                completionPercentage: formData.completionPercentage ? parseFloat(formData.completionPercentage) : 0,
                estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : 0,
                actualCost: formData.actualCost ? parseFloat(formData.actualCost) : 0,

                // Handle Dates - send null if empty string
                launchDate: formData.launchDate || null,
                expectedCompletionDate: formData.expectedCompletionDate || null,
                possessionDate: formData.possessionDate || null,

                // Join arrays to strings for API - ensuring they are arrays before joining
                bhkConfigurations: Array.isArray(formData.bhkConfigurations) ? formData.bhkConfigurations.join(',') : '',
                parkingType: Array.isArray(formData.parkingType) ? formData.parkingType.join(',') : '',
                phaseAmenities: Array.isArray(formData.phaseAmenities) ? formData.phaseAmenities.join(',') : '',
                features: Array.isArray(formData.features) ? formData.features.join('\n') : '',
                highlights: Array.isArray(formData.highlights) ? formData.highlights.join('\n') : '',
                nearbyPlaces: Array.isArray(formData.nearbyPlaces) ? formData.nearbyPlaces.join('\n') : '',
                specifications: Array.isArray(formData.specifications) ? formData.specifications.join('\n') : '',
                unitTypes: Array.isArray(formData.unitTypes) ? formData.unitTypes.map(u => `${u.type}: ${u.size}`).join('|') : '',
                priceList: Array.isArray(formData.priceList) ? formData.priceList.map(p => `${p.type}: ${p.price}`).join('|') : '',
            };

            payload.append('phase', JSON.stringify(phaseData));

            if (files.logoFile) payload.append('logoFile', files.logoFile);
            if (files.brochureFile) payload.append('brochureFile', files.brochureFile);
            if (files.masterPlanFile) payload.append('masterPlanFile', files.masterPlanFile);

            files.floorPlanFiles.forEach(file => {
                payload.append('floorPlanFiles', file);
            });

            const success = await createPhase(selectedProjectId, payload);

            if (success) {
                toast.success('Phase created successfully!');
                navigate('/admin/projects');
            }
        } catch (error) {
            console.error('Error creating phase:', error);
            toast.error('Failed to create phase');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Phase</h1>
                    <p className="text-muted-foreground mt-1">Add a new phase to an existing project</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button
                        className="bg-black text-white hover:bg-gray-800"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Phase'}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Project Selection</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label>Select Project *</Label>
                        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map(project => (
                                    <SelectItem key={project.id} value={String(project.id)}>
                                        {project.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Phase Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Phase Name *</Label>
                            <Input name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Phase Number *</Label>
                            <Input name="phaseNumber" type="number" value={formData.phaseNumber} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select name="status" value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PLANNING">Planning</SelectItem>
                                    <SelectItem value="CONSTRUCTION">Construction</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>RERA Number</Label>
                            <Input name="reraNumber" value={formData.reraNumber} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea name="description" value={formData.description} onChange={handleInputChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Total Units</Label>
                            <Input name="totalUnits" type="number" value={formData.totalUnits} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Available Units</Label>
                            <Input name="availableUnits" type="number" value={formData.availableUnits} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Sold Units</Label>
                            <Input name="soldUnits" type="number" value={formData.soldUnits} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Starting Price</Label>
                            <Input name="startingPrice" type="number" value={formData.startingPrice} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Max Price</Label>
                            <Input name="maxPrice" type="number" value={formData.maxPrice} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Carpet Area</Label>
                            <Input name="carpetArea" type="number" value={formData.carpetArea} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Built-up Area</Label>
                            <Input name="builtUpArea" type="number" value={formData.builtUpArea} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Area</Label>
                            <Input name="totalArea" type="number" value={formData.totalArea} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Launch Date</Label>
                            <Input name="launchDate" type="date" value={formData.launchDate} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Expected Completion</Label>
                            <Input name="expectedCompletionDate" type="date" value={formData.expectedCompletionDate} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Possession Date</Label>
                            <Input name="possessionDate" type="date" value={formData.possessionDate} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Floor Count</Label>
                            <Input name="floorCount" type="number" value={formData.floorCount} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Tower Count</Label>
                            <Input name="towerCount" type="number" value={formData.towerCount} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Estimated Cost</Label>
                            <Input name="estimatedCost" type="number" value={formData.estimatedCost} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Actual Cost</Label>
                            <Input name="actualCost" type="number" value={formData.actualCost} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Construction Status</Label>
                        <Input name="constructionStatus" value={formData.constructionStatus} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                        <Label>Completion Percentage</Label>
                        <Input name="completionPercentage" type="number" value={formData.completionPercentage} onChange={handleInputChange} />
                    </div>

                    <EnhancedTagInput
                        label="BHK Configurations"
                        value={formData.bhkConfigurations}
                        onChange={(val) => handleSelectChange('bhkConfigurations', val)}
                        placeholder="Type to add custom (e.g., '2BHK')"
                        suggestions={['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', 'Penthouse', 'Villa']}
                    />

                    <EnhancedTagInput
                        label="Parking Type"
                        value={formData.parkingType}
                        onChange={(val) => handleSelectChange('parkingType', val)}
                        placeholder="Type to add custom (e.g., 'Covered')"
                        suggestions={['Covered', 'Open', 'Basement', 'Stilt', 'Podium', 'Mechanized']}
                    />

                    <EnhancedTagInput
                        label="Phase Amenities"
                        value={formData.phaseAmenities}
                        onChange={(val) => handleSelectChange('phaseAmenities', val)}
                        placeholder="Type to add custom (e.g., 'Gym')"
                        suggestions={['Gym', 'Swimming Pool', 'Clubhouse', 'Park', 'Security', 'Power Backup', 'Lift', 'CCTV', 'Jogging Track', 'Kids Play Area']}
                    />

                    <DynamicList
                        label="Features"
                        items={formData.features}
                        onChange={(val) => handleSelectChange('features', val)}
                        placeholder="Add a feature..."
                    />

                    <DynamicList
                        label="Highlights"
                        items={formData.highlights}
                        onChange={(val) => handleSelectChange('highlights', val)}
                        placeholder="Add a highlight..."
                    />

                    <DynamicList
                        label="Nearby Places"
                        items={formData.nearbyPlaces}
                        onChange={(val) => handleSelectChange('nearbyPlaces', val)}
                        placeholder="Add a nearby place..."
                    />

                    <DynamicList
                        label="Specifications"
                        items={formData.specifications}
                        onChange={(val) => handleSelectChange('specifications', val)}
                        placeholder="Add a specification..."
                    />

                    <StructuredList
                        label="Unit Types"
                        items={formData.unitTypes}
                        onChange={(val) => handleSelectChange('unitTypes', val)}
                        fields={[
                            { key: 'type', label: 'Type', placeholder: 'e.g., 2BHK' },
                            { key: 'size', label: 'Size', placeholder: 'e.g., 1200 sq ft' }
                        ]}
                    />

                    <StructuredList
                        label="Price List"
                        items={formData.priceList}
                        onChange={(val) => handleSelectChange('priceList', val)}
                        fields={[
                            { key: 'type', label: 'Type', placeholder: 'e.g., 2BHK' },
                            { key: 'price', label: 'Price', placeholder: 'e.g., ₹45 Lakhs' }
                        ]}
                    />

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))} />
                            <Label htmlFor="isActive">Is Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="isFeatured" checked={formData.isFeatured} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))} />
                            <Label htmlFor="isFeatured">Is Featured</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Files</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Logo File</Label>
                        <Input type="file" onChange={(e) => handleFileChange(e, 'logoFile')} />
                    </div>
                    <div className="space-y-2">
                        <Label>Brochure File</Label>
                        <Input type="file" onChange={(e) => handleFileChange(e, 'brochureFile')} />
                    </div>
                    <div className="space-y-2">
                        <Label>Master Plan File</Label>
                        <Input type="file" onChange={(e) => handleFileChange(e, 'masterPlanFile')} />
                    </div>
                    <div className="space-y-2">
                        <Label>Floor Plan Files (Multiple)</Label>
                        <Input type="file" multiple onChange={(e) => handleFileChange(e, 'floorPlanFiles')} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreatePhase;
