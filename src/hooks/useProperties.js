import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../utils/apiClient';
import { getImageUrl } from '../utils/imageHelper';

// Fetch Property Details
const fetchPropertyDetails = async (id) => {
    const token = localStorage.getItem('brickbroker_token');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/public/properties/${id}`, {
        headers
    });

    if (!response.ok) {
        throw new Error('Failed to fetch property details');
    }

    const json = await response.json();
    return json.data;
};

// Fetch Project Details
const fetchProjectDetails = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/properties/projects/${id}`);
    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || 'Failed to fetch project details');
    }

    return result.data;
};

export const usePropertyDetails = (id) => {
    return useQuery({
        queryKey: ['property', id],
        queryFn: () => fetchPropertyDetails(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

export const useProjectDetails = (id) => {
    return useQuery({
        queryKey: ['project', id],
        queryFn: () => fetchProjectDetails(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};
