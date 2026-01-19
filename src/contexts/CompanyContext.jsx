import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { toast } from 'sonner';
import { api } from '../utils/apiClient';
import { getStorageItem } from '../utils/storage';
import { API_BASE_URL } from '../utils/apiClient';
const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
    // Independent Company State
    const [user, setCompanyUser] = useState(() => {
        const saved = localStorage.getItem('company_user_data');
        return saved ? JSON.parse(saved) : null;
    });

    // Start with whatever is in storage, but we rely on companyAccessToken mainly
    const token = localStorage.getItem('companyAccessToken');

    const [pendingAgents, setPendingAgents] = useState([]);
    const [companyProjects, setCompanyProjects] = useState([]);
    const [companyProperties, setCompanyProperties] = useState([]);
    const [pendingProperties, setPendingProperties] = useState([]);

    // Initial stats
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalAgents: 0,
        activeListings: 0,
        pendingAgents: 0,
        totalViews: 0,
        totalLeads: 0
    });

    const [agents, setAgents] = useState([]);

    const logout = () => {
        localStorage.removeItem('companyAccessToken');
        localStorage.removeItem('company_user_data');
        localStorage.removeItem('company_auth');
        setCompanyUser(null);
        // Optionally redirect
        window.location.href = '/sign-in';
    };

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('companyAccessToken');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const userData = data.data?.user || data.data || data;
                setCompanyUser(userData);
                localStorage.setItem('company_user_data', JSON.stringify(userData));
            }
        } catch (error) {
            console.error('Error fetching company profile:', error);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('companyAccessToken');
            if (!token) return;
            const response = await fetch(`${API_BASE_URL}/api/v1/companies/statistics/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (response.ok) {
                setStats(result.data);
            } else {
                console.error("Failed to fetch dashboard stats:", result);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const fetchActiveAgents = async () => {
        try {
            const token = localStorage.getItem('companyAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/companies/agents`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (response.ok) {
                setAgents(result.data || []);
            } else {
                console.error("Failed to fetch active agents:", result);
            }
        } catch (error) {
            console.error('Error fetching active agents:', error);
        }
    };

    const fetchCompanyProjects = async (page = 0, size = 10) => {
        try {
            const token = localStorage.getItem('companyAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/properties/projects/view/my-company?page=${page}&size=${size}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();

            if (response.ok && result.success) {
                // Adjust based on actual API response structure if needed, assumig result.data.content or result.data 
                // based on previous AdminProjects fetching which used result.data.projects.
                // The CURL response wasn't fully shown but Admin uses result.data.projects.
                // Let's assume standard pagination structure or similar to Admin.
                // Wait, AdminProjects used result.data.projects. Let's check the curl again.
                // converting to result.data for safety or strictly following common pattern.
                setCompanyProjects(result.data?.projects || result.data || []);
            } else {
                console.error("Failed to fetch company projects", result);
            }
        } catch (error) {
            console.error("Error fetching company projects:", error);
        }
    };

    const fetchPendingAgents = async () => {
        try {
            const token = localStorage.getItem('companyAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/companies/agent-requests`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (response.ok) {
                setPendingAgents(result.data || []);
            } else {
                console.error("Failed to fetch pending agents:", result);
            }
        } catch (error) {
            console.error('Error fetching pending agents:', error);
        }
    };



    const fetchPendingPropertiesCompany = async () => {
        try {
            const token = localStorage.getItem('companyAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/properties/company/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (response.ok) {
                // Assuming result.data.content based on propertyController
                setPendingProperties(result.data?.content || []);
            } else {
                console.error("Failed to fetch pending company properties:", result);
            }
        } catch (error) {
            console.error('Error fetching pending company properties:', error);
        }
    };

    const fetchCompanyProperties = async (page = 0, size = 10, status = '') => {
        try {
            const token = localStorage.getItem('companyAccessToken');
            let url = `${API_BASE_URL}/api/v1/properties/company/all?page=${page}&size=${size}`;
            if (status) url += `&status=${status}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (response.ok) {
                setCompanyProperties(result.data?.content || []);
            } else {
                console.error("Failed to fetch company properties:", result);
            }
        } catch (error) {
            console.error('Error fetching company properties:', error);
        }
    };


    const approveCompanyProperty = async (propertyId) => {
        try {
            const token = localStorage.getItem('companyAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/properties/${propertyId}/company-approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Property Approved Successfully");
                fetchPendingPropertiesCompany();
                return true;
            } else {
                toast.error(result.message || "Failed to approve property");
                return false;
            }
        } catch (error) {
            console.error("Approve property error:", error);
            toast.error("An error occurred while approving property");
            return false;
        }
    };

    const rejectCompanyProperty = async (propertyId, reason) => {
        try {
            const token = localStorage.getItem('companyAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/properties/${propertyId}/company-reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason })
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Property Rejected");
                fetchPendingPropertiesCompany();
                return true;
            } else {
                toast.error(result.message || "Failed to reject property");
                return false;
            }
        } catch (error) {
            console.error("Reject property error:", error);
            toast.error("An error occurred while rejecting property");
            return false;
        }
    };

    useEffect(() => {
        if (user) {
            // Shared fetches for companies and agents
            if (user.companyId || ['COMPANY', 'company', 'COMPANY_ADMIN', 'company_admin', 'company_agent'].includes(user.userType)) {
                fetchCompanyProjects();
            }

            // Fetches strictly for Company Admin
            if (['COMPANY', 'company', 'COMPANY_ADMIN', 'company_admin', 'COMPANY_AGENT', 'company_agent'].includes(user.userType)) {
                fetchPendingAgents();
                fetchActiveAgents();
                fetchPendingPropertiesCompany();
                fetchDashboardStats(); // Fetch stats
            }
        }
    }, [user]);

    const approveAgent = async (agentId) => {
        try {
            const token = localStorage.getItem('companyAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/companies/agent-requests/${agentId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Agent Approved Successfully");
                fetchPendingAgents();
                // fetchActiveAgents();
                return true;
            } else {
                toast.error(result.message || "Failed to approve agent");
                return false;
            }
        } catch (error) {
            console.error("Approve agent error:", error);
            toast.error("An error occurred while approving agent");
            return false;
        }
    };

    const rejectAgent = async (agentId, reason) => {
        try {
            const token = localStorage.getItem('companyAccessToken');
            const response = await fetch(`${API_BASE_URL}/api/v1/companies/agent-requests/${agentId}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason })
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Agent Rejected");
                fetchPendingAgents();
                return true;
            } else {
                toast.error(result.message || "Failed to reject agent");
                return false;
            }
        } catch (error) {
            console.error("Reject agent error:", error);
            toast.error("An error occurred while rejecting agent");
            return false;
        }
    };

    const createPhase = async (projectId, formData) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.error("Authentication error. Please login again.");
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}/phases`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Phase created successfully!");
                fetchCompanyProjects();
                return true;
            } else {
                toast.error(result.message || "Failed to create phase");
                return false;
            }
        } catch (error) {
            console.error("Create phase error:", error);
            toast.error("An error occurred while creating phase");
            return false;
        }
    };

    return (
        <CompanyContext.Provider value={{
            stats,
            agents,
            pendingAgents,

            companyProjects,
            approveAgent,
            rejectAgent,
            fetchPendingAgents,
            fetchActiveAgents,
            fetchCompanyProjects,
            createPhase,
            pendingProperties,
            fetchPendingPropertiesCompany,
            approveCompanyProperty,
            rejectCompanyProperty,
            companyProperties,
            fetchCompanyProperties,
            fetchUserProfile, // Expose for layout compatibility
            logout,
            user
        }}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = () => {
    const context = useContext(CompanyContext);
    if (!context) {
        throw new Error('useCompany must be used within a CompanyProvider');
    }
    return context;
};
