import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, Filter, MapPin, Bed, Bath, Square,
  ArrowRight, Loader2, SlidersHorizontal, Check, X
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "../components/ui/sheet";
import { Checkbox } from "../components/ui/checkbox";
import { toast } from "sonner";
import { API_BASE_URL } from "../utils/apiClient";
import SEO from "../components/SEO";

const PROPERTY_TYPES = [
  "APARTMENT", "VILLA", "PLOT", "COMMERCIAL", "INDEPENDENT_FLOOR",
  "FARMHOUSE", "PENTHOUSE"
];

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: 1000000000 },
  { label: "Under ₹50 L", min: 0, max: 5000000 },
  { label: "₹50 L - ₹1 Cr", min: 5000000, max: 10000000 },
  { label: "₹1 Cr - ₹3 Cr", min: 10000000, max: 30000000 },
  { label: "₹3 Cr+", min: 30000000, max: 1000000000 },
];

const Properties = () => {
  // State for API Data
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000000]);
  const [selectedPriceLabel, setSelectedPriceLabel] = useState("Any Price");
  const [selectedBedrooms, setSelectedBedrooms] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9); // Initial visible count

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  // URL Query Params Handling
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const subTypeParam = searchParams.get('subtype'); // Check for subtype if needed
  const listingTypeParam = searchParams.get('listingType'); // For Buy/Sell/Rent filtering
  const cityParam = searchParams.get('city');

  // Listing type filter state

  // Listing type filter state
  const [selectedListingType, setSelectedListingType] = useState("");

  useEffect(() => {
    if (typeParam) {
      if (typeParam === 'RESIDENTIAL') {
        setSelectedPropertyTypes([
          'APARTMENT', 'VILLA', 'INDEPENDENT_FLOOR', 'PLOT', 'FARMHOUSE', 'PENTHOUSE',
          'SINGLE_FAMILY_HOME', 'DUPLEX', 'CO_LIVING', 'SERVICED_APARTMENT', 'STUDENT_HOUSING', 'SENIOR_LIVING'
        ]);
      } else if (typeParam === 'COMMERCIAL') {
        setSelectedPropertyTypes([
          'COMMERCIAL', 'OFFICE', 'CO_WORKING', 'BUSINESS_CENTER', 'SHOP',
          'SHOPPING_MALL', 'RESTAURANT', 'SUPERMARKET', 'RESORT', 'MIXED_USE',
          'TRAINING_CENTER', 'STUDIO'
        ]);
      } else if (typeParam === 'INDUSTRIAL') {
        setSelectedPropertyTypes([
          'INDUSTRIAL', 'COLD_STORAGE', 'DISTRIBUTION_CENTER', 'FACTORY', 'LOGISTICS',
          'INDUSTRIAL_LAND', 'DATA_CENTER', 'R_AND_D', 'SHOWROOM_STORAGE', 'WAREHOUSE'
        ]);
      } else if (subTypeParam) {
        setSelectedPropertyTypes([subTypeParam]);
      } else {
        // Direct type match (e.g., VILLA, COMMERCIAL) or fallback
        setSelectedPropertyTypes([typeParam]);
      }
    } else {
      setSelectedPropertyTypes([]);
    }
  }, [typeParam, subTypeParam]);

  // Handle listingType param from URL (for Buy/Sell/Rent filtering)
  useEffect(() => {
    if (listingTypeParam) {
      setSelectedListingType(listingTypeParam);
    } else {
      setSelectedListingType("");
    }

    if (cityParam) {
      setSearchQuery(cityParam);
    }
  }, [listingTypeParam, cityParam]);

  // Fetch Data
  const fetchProperties = async (page = 0) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page,
        size: 100, // Fetch more items since we are doing client-side filtering
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/public/properties?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch properties');

      const data = await response.json();
      setProperties(data.content || []);
      setPagination({
        pageNumber: data.pageable?.pageNumber || 0,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
        size: data.size || 10
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Client-side filtering
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        property.title?.toLowerCase().includes(searchLower) ||
        property.city?.toLowerCase().includes(searchLower) ||
        property.formattedAddress?.toLowerCase().includes(searchLower);

      const matchesType = selectedPropertyTypes.length === 0 || selectedPropertyTypes.includes(property.propertyType);
      const matchesPrice = (property.basePrice >= priceRange[0] && property.basePrice <= priceRange[1]);
      const matchesBedrooms = selectedBedrooms.length === 0 || selectedBedrooms.includes(String(property.bedrooms));
      const matchesListingType = !selectedListingType || property.listingType === selectedListingType;

      return matchesSearch && matchesType && matchesPrice && matchesBedrooms && matchesListingType;
    });
  }, [properties, searchQuery, selectedPropertyTypes, priceRange, selectedBedrooms, selectedListingType]);

  // Helpers
  const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const formatPrice = (price) => {
    if (!price) return "₹0";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handlePriceRangeSelect = (value) => {
    const range = PRICE_RANGES.find(r => r.label === value);
    if (range) {
      setPriceRange([range.min, range.max]);
      setSelectedPriceLabel(range.label);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchProperties(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Budget Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 50000000]}
            max={1000000000}
            step={500000}
            value={priceRange}
            onValueChange={(val) => {
              setPriceRange(val);
              setSelectedPriceLabel("Custom");
            }}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}+</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-3">Property Type</h3>
        <div className="grid grid-cols-2 gap-3">
          {PROPERTY_TYPES.map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`sheet-type-${type}`}
                checked={selectedPropertyTypes.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) setSelectedPropertyTypes([...selectedPropertyTypes, type]);
                  else setSelectedPropertyTypes(selectedPropertyTypes.filter(t => t !== type));
                }}
              />
              <label htmlFor={`sheet-type-${type}`} className="text-sm text-gray-700 capitalize cursor-pointer select-none">
                {type.toLowerCase().replace('_', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-3">Bedrooms</h3>
        <div className="flex flex-wrap gap-2">
          {["1", "2", "3", "4", "5+"].map(bed => (
            <Button
              key={bed}
              variant={selectedBedrooms.includes(bed) ? "default" : "outline"}
              size="sm"
              className={`h-9 w-12 ${selectedBedrooms.includes(bed) ? 'bg-gray-900 hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              onClick={() => {
                if (selectedBedrooms.includes(bed)) {
                  setSelectedBedrooms(selectedBedrooms.filter(b => b !== bed));
                } else {
                  setSelectedBedrooms([...selectedBedrooms, bed]);
                }
              }}
            >
              {bed} {selectedBedrooms.includes(bed) && <Check className="ml-1 h-3 w-3" />}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <SEO
        title="Properties"
        description="Browse our wide selection of properties. Find apartments, villas, plots, and commercial spaces suited to your needs."
      />
      {/* Sticky Filter Bar */}
      <div className="sticky top-[64px] z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
        <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center gap-4">

          {/* Active City Filter Badge */}
          {cityParam && (
            <div className="hidden md:flex items-center bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {cityParam}
              <Link to="/properties" className="ml-2 hover:bg-blue-100 rounded-full p-0.5">
                <X className="h-3 w-3" />
              </Link>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-100/50 border-transparent focus:bg-white transition-all rounded-full h-10"
            />
          </div>

          <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block" />

          {/* Filter: Type */}
          <Select
            value={selectedPropertyTypes[0] || "all"}
            onValueChange={(val) => val === "all" ? setSelectedPropertyTypes([]) : setSelectedPropertyTypes([val])}
          >
            <SelectTrigger className="w-[150px] border-gray-200 bg-white hover:bg-gray-50 rounded-full h-10 hidden md:flex">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>

              {PROPERTY_TYPES.map(t => (
                <SelectItem key={t} value={t}>{t.toLowerCase().replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter: Price */}
          <Select
            value={selectedPriceLabel}
            onValueChange={handlePriceRangeSelect}
          >
            <SelectTrigger className="w-[160px] border-gray-200 bg-white hover:bg-gray-50 rounded-full h-10 hidden md:flex">
              <SelectValue>{selectedPriceLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map(range => (
                <SelectItem key={range.label} value={range.label}>{range.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* More Filters Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="rounded-full h-10 border-gray-200 hover:bg-gray-50 gap-2 px-4">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden lg:inline">Filters</span>
                {(selectedBedrooms.length > 0) && (
                  <Badge variant="secondary" className="h-5 px-1.5 ml-1 bg-gray-200 text-gray-800 text-[10px] rounded-full">
                    {selectedBedrooms.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl">All Filters</SheetTitle>
                <SheetDescription>
                  Customize your search to find the perfect property.
                </SheetDescription>
              </SheetHeader>
              <FilterContent />
              <SheetFooter className="mt-8 pt-4 border-t gap-3 sm:gap-0">
                <SheetClose asChild>
                  <Button variant="outline" className="w-full sm:w-1/2 mr-2" onClick={() => {
                    setSelectedBedrooms([]);
                    setPriceRange([0, 100000000]);
                    setSelectedPropertyTypes([]);
                    setSelectedPriceLabel("Any Price");
                  }}>
                    Reset All
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button className="w-full sm:w-1/2 bg-gray-900 hover:bg-gray-800">Show Results</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <div className="flex-1 hidden md:block" />

          <div className="text-sm text-gray-500 font-medium whitespace-nowrap hidden lg:block">
            <span className="text-gray-900">{filteredProperties.length}</span> Results
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 max-w-7xl py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="h-12 w-12 text-gray-900 animate-spin mb-4" />
            <p className="text-gray-500 text-lg font-light animate-pulse">Curating properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              We couldn't find any matches for your current filters. Try adjusting your search criteria.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedPropertyTypes([]);
                setPriceRange([0, 100000000]);
                setSelectedBedrooms([]);
                setSelectedPriceLabel("Any Price");
              }}
              className="bg-gray-900 text-white rounded-full px-8"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.slice(0, visibleCount).map((property) => {
                const citySlug = property.city?.toLowerCase().replace(/\s+/g, '-') || 'city';
                const titleSlug = property.title?.toLowerCase().replace(/\s+/g, '-') || 'property';
                return (
                  <Link
                    to={`/property/${titleSlug}/${citySlug}/${property.id}`}
                    key={property.id}
                    className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                      <img
                        src={getFullUrl(property.primaryImageUrl || property.images?.[0]) || 'https://images.unsplash.com/photo-1600596542815-2a4d04774c71?auto=format&fit=crop&q=80'}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-white/95 backdrop-blur-md text-gray-900 border-0 shadow-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                          {property.propertyType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className={`${property.listingType === 'SALE' ? 'bg-emerald-500' : 'bg-blue-500'} text-white border-0 shadow-sm px-3 py-1 font-medium`}>
                          {property.listingType}
                        </Badge>
                      </div>

                      {/* Price Tag Overlay Container */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="text-white">
                          <p className="text-xl md:text-2xl font-bold drop-shadow-md">
                            {['RENT', 'PG', 'COMMERCIAL_RENT'].includes(property.listingType)
                              ? (property.monthlyRent ? `${formatPrice(property.monthlyRent)}/mo` : 'Price on Request')
                              : formatPrice(property.basePrice)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <p className="line-clamp-1">{property.formattedAddress || property.city}</p>
                        </div>
                      </div>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center group-hover:bg-blue-50/50 transition-colors">
                          <Bed className="h-5 w-5 text-gray-400 mb-1 group-hover:text-blue-500 transition-colors" />
                          <span className="text-sm font-semibold text-gray-900">{property.bedrooms}</span>
                          <span className="text-[10px] uppercase text-gray-400 font-medium tracking-wide">Beds</span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center group-hover:bg-blue-50/50 transition-colors">
                          <Bath className="h-5 w-5 text-gray-400 mb-1 group-hover:text-blue-500 transition-colors" />
                          <span className="text-sm font-semibold text-gray-900">{property.bathrooms}</span>
                          <span className="text-[10px] uppercase text-gray-400 font-medium tracking-wide">Baths</span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center group-hover:bg-blue-50/50 transition-colors">
                          <Square className="h-5 w-5 text-gray-400 mb-1 group-hover:text-blue-500 transition-colors" />
                          <span className="text-sm font-semibold text-gray-900">{property.carpetArea}</span>
                          <span className="text-[10px] uppercase text-gray-400 font-medium tracking-wide">Sqft</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-medium">{property.isVerified ? 'Verified Listing' : 'New Listing'}</span>
                        <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform cursor-pointer">
                          View Details <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* View More Button */}
            {visibleCount < filteredProperties.length && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={handleLoadMore}
                  className="bg-white border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                >
                  View More Properties
                </Button>
              </div>
            )}

            {/* Pagination (only shown if we are not at server-side end and we have shown all client-side items - simplified logic: keep pagination for next server batch, but View More is for client batch) */}
            {/* Actually, since we fetch 100 items per page, pagination is for the NEXT 100. View More is for the CURRENT 100. */}
            {visibleCount >= filteredProperties.length && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-16 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.pageNumber - 1)}
                  disabled={pagination.pageNumber === 0}
                  className="rounded-full border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                >
                  Previous Page
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.pageNumber + 1)}
                  disabled={pagination.pageNumber >= pagination.totalPages - 1}
                  className="rounded-full border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                >
                  Next Page
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;
