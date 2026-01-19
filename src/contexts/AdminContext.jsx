import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../utils/apiClient';

const AdminContext = createContext(undefined);

export function AdminProvider({ children }) {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('admin_auth') === 'true' && !!localStorage.getItem('adminAccessToken');
    });

    // Admin User Details
    const [adminUser, setAdminUser] = useState(() => {
        const savedUser = localStorage.getItem('admin_user_data');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Properties State (Real Data)
    const [properties, setProperties] = useState([]);

    // Agents State
    const [agents, setAgents] = useState([]);

    // Pending Agents State (Real Data)
    const [pendingAgents, setPendingAgents] = useState([]);

    // Companies State (Real Data)
    const [companies, setCompanies] = useState([]);

    // Pending Companies State (Real Data)
    const [pendingCompanies, setPendingCompanies] = useState([]);

    // Pending Properties State (Real Data)
    const [pendingProperties, setPendingProperties] = useState([]);

    // Projects State
    const [projects, setProjects] = useState([]);
    const [pendingProjects, setPendingProjects] = useState([]);

    // Stats State
    const [verifiedCompaniesCount, setVerifiedCompaniesCount] = useState(0);
    const [pendingCompaniesCount, setPendingCompaniesCount] = useState(0);

    const login = async (identifier, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Check for Admin Role
                const userData = result.data.user || result.data;
                const isAdmin = userData.userType === 'ADMIN' || userData.roles?.includes('ADMIN');

                if (!isAdmin) {
                    console.error("Login rejected: User is not an admin", result.data);
                    toast.error("Access denied. Admin privileges required.");
                    return false;
                }

                // Store access token with a specific key for Admin to avoid conflict with user sessions
                if (result.data && result.data.accessToken) {
                    localStorage.setItem('adminAccessToken', result.data.accessToken);
                }

                // Store Admin User ID for approval/rejection actions
                if (userData.userId || userData.id) {
                    localStorage.setItem('adminUserId', userData.userId || userData.id);
                }

                // Save full admin user details
                const adminDetails = {
                    name: userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : (userData.name || 'Admin User'),
                    email: userData.email || identifier,
                    initials: (userData.firstName ? userData.firstName[0] : (userData.name ? userData.name[0] : 'A')) +
                        (userData.lastName ? userData.lastName[0] : (userData.name && userData.name.split(' ').length > 1 ? userData.name.split(' ')[1][0] : 'U'))
                };

                setAdminUser(adminDetails);
                localStorage.setItem('admin_user_data', JSON.stringify(adminDetails));

                setIsAuthenticated(true);
                localStorage.setItem('admin_auth', 'true');
                toast.success("Welcome back, Admin!");
                return true;
            } else {
                console.error('Login failed:', result);
                toast.error(result.message || "Invalid credentials");
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error("An error occurred during login");
            return false;
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (token) {
                await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            setIsAuthenticated(false);
            localStorage.removeItem('admin_auth');
            localStorage.removeItem('adminAccessToken');
            localStorage.removeItem('adminUserId');
            localStorage.removeItem('admin_user_data');
            setAdminUser(null);
            toast.info("Logged out successfully");
        }
    };

    const fetchPendingCompanies = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/v1/admin/dashboard/pending-approvals/companies?page=0&size=20`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok) {
                // Handle Spring Boot Page response (content) or List
                setPendingCompanies(result.content || result.data || result || []);
            } else {
                // Don't log 401 errors - token issues
                if (response.status !== 401) {
                    console.error('Failed to fetch pending companies:', result);
                }
                if (response.status === 401) {
                    // Only logout if we are currently authenticated to avoid loops
                    if (isAuthenticated) {
                        toast.error("Session expired. Please login again.");
                        logout();
                    }
                } else {
                    toast.error("Failed to load company requests");
                }
            }
        } catch (error) {
            // Don't log 401 errors
            if (error.status !== 401) {
                console.error('Error fetching pending companies:', error);
            }
        }
    };

    const fetchPendingAgents = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/v1/admin/agents/pending-approval/individual`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok) {
                setPendingAgents(result.content || result.data || result || []);
            } else if (response.status !== 401) {
                console.error('Failed to fetch pending agents:', result);
                toast.error("Failed to load agent requests");
            }
        } catch (error) {
            if (error.status !== 401) console.error('Error fetching pending agents:', error);
        }
    };

    const [pendingCompanyAgents, setPendingCompanyAgents] = useState([]);

    const fetchPendingCompanyAgents = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/v1/admin/agents/pending-approval/from-company?page=0&size=20`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok) {
                const agents = result.content || result.data || result || [];

                // Fetch documents for each agent
                const agentsWithDocs = await Promise.all(agents.map(async (agent) => {
                    try {
                        const docResponse = await fetch(`${API_BASE_URL}/api/v1/documents/entity/AGENT/${agent.agentId}?page=0&size=10&sortBy=createdAt&sortDir=DESC`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        if (docResponse.ok) {
                            const docResult = await docResponse.json();
                            // Handle nested content structure: result.data.content (as seen in Postman)
                            const documents = docResult.data?.content || docResult.content || docResult.data || docResult || [];
                            return { ...agent, uploadedDocuments: Array.isArray(documents) ? documents : [] };
                        }
                    } catch (err) {
                        console.error(`Error fetching docs for agent ${agent.agentId}`, err);
                    }
                    return { ...agent, uploadedDocuments: [] };
                }));

                setPendingCompanyAgents(agentsWithDocs);
            } else if (response.status !== 401) {
                console.error('Failed to fetch pending company agents:', result);
            }
        } catch (error) {
            if (error.status !== 401) console.error('Error fetching pending company agents:', error);
        }
    };

    const fetchAllAgents = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/v1/agents`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                // Handle potential different response structures (page vs list)
                setAgents(result.content || result.data || result || []);
            } else if (response.status !== 401) {
                console.error('Failed to fetch agents:', response.status);
                toast.error("Failed to load agents");
            }
        } catch (error) {
            if (error.status !== 401) console.error('Error fetching agents:', error);
        }
    };

    const fetchAllCompanies = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/v1/companies`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok) {
                // Handle Spring Boot Page response (content) or List
                setCompanies(result.content || result.data || result || []);
            } else if (response.status !== 401) {
                console.error('Failed to fetch companies:', result);
                toast.error("Failed to load companies");
            }
        } catch (error) {
            if (error.status !== 401) console.error('Error fetching companies:', error);
        }
    };

    const fetchAllProperties = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            // Fetch Approved (Public) Properties
            const publicResponse = await fetch(`${API_BASE_URL}/api/v1/public/properties?page=0&size=100&sort=createdAt,DESC`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // 'Content-Type': 'application/json', // GET usually doesn't need content-type but good practice if API expects
                },
            });
            const publicData = await publicResponse.json();
            const approvedProperties = publicData.content || publicData.data || [];

            // Fetch Pending Properties (Authenticated)
            const pendingResponse = await fetch(`${API_BASE_URL}/api/v1/properties/pending-verification?page=0&size=100&sort=createdAt,DESC`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const pendingData = await pendingResponse.json();
            const pendingPropertiesList = pendingData.content || pendingData.data || [];

            // Combine/Merge them (avoiding duplicates if any)
            // Note: Public properties are usually APPROVED. Pending are PENDING.
            // If there's an overlap or if we want a comprehensive list:
            const allProperties = [...pendingPropertiesList, ...approvedProperties];

            setProperties(allProperties);

        } catch (error) {
            console.error('Error fetching properties:', error);
            // toast.error("Failed to load properties"); // Reduce noise if one fails
        }
    };

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/v1/properties/projects/view?page=0&size=10`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok && result.success) {
                setProjects(result.data.projects || []);
            } else {
                console.error('Failed to fetch projects. Status:', response.status, 'Result:', result);
                toast.error(result.message || "Failed to load projects");
            }
        } catch (error) {
            if (error.status !== 401) {
                console.error('Error fetching projects:', error);
                if (error.response) {
                    const errorBody = await error.response.text();
                    console.error('Error response body:', errorBody);
                }
            }
        }
    };

    const fetchPendingProjectsAdmin = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/v1/properties/projects/pending?page=0&size=10`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok && result.success) {
                setPendingProjects(result.data.projects || []);
            } else {
                console.error('Failed to fetch pending projects:', result);
            }
        } catch (error) {
            console.error('Error fetching pending projects:', error);
        }
    };

    const fetchVerifiedCompaniesCount = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/v1/companies/statistics/verified`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                },
            });

            if (response.ok) {
                const result = await response.json();
                // API returns { "verified": 2 }
                setVerifiedCompaniesCount(result.verified || 0);
            } else if (response.status !== 401) {
                console.error('Failed to fetch verified companies count');
            }
        } catch (error) {
            if (error.status !== 401) console.error('Error fetching verified companies count:', error);
        }
    };

    const fetchPendingCompaniesCount = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/v1/companies/statistics/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                },
            });

            if (response.ok) {
                const result = await response.json();
                // Assuming API returns { "pending": count } or similar based on verified implementation
                setPendingCompaniesCount(result.pending !== undefined ? result.pending : (typeof result === 'number' ? result : 0));
            } else if (response.status !== 401) {
                console.error('Failed to fetch pending companies count');
            }
        } catch (error) {
            if (error.status !== 401) console.error('Error fetching pending companies count:', error);
        }
    };

    // Fetch on auth change
    useEffect(() => {
        if (isAuthenticated) {
            fetchPendingCompanies();
            fetchAllCompanies();
            fetchAllProperties();
            fetchVerifiedCompaniesCount();
            fetchPendingCompaniesCount();
            fetchPendingProperties();
            fetchPendingAgents();
            fetchPendingCompanyAgents();

            fetchAllAgents();
            fetchProjects();
            fetchPendingProjectsAdmin();
        }
    }, [isAuthenticated]);

    const fetchPendingProperties = async () => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/v1/properties/pending-verification?page=0&size=20&sort=createdAt,DESC`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (response.ok) {
                setPendingProperties(result.content || result.data || result || []);
            } else if (response.status !== 401) {
                console.error('Failed to fetch pending properties:', result);
                toast.error("Failed to load property requests");
            }
        } catch (error) {
            if (error.status !== 401) console.error('Error fetching pending properties:', error);
        }
    };

    const approveProperty = async (propertyId) => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) {
                toast.error("Authentication error. Please login again.");
                return false;
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/properties/${propertyId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.success("Property Approved Successfully");
                fetchPendingProperties(); // Refresh the list
                // If we also want to update the main properties list if it's currently loaded
                // fetchAllProperties(); 
                return true;
            } else {
                const result = await response.json();
                toast.error(result.message || "Failed to approve property");
                return false;
            }
        } catch (error) {
            console.error("Approve property error:", error);
            toast.error("An error occurred while approving property");
            return false;
        }
    };

    const rejectProperty = async (propertyId, reason) => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) {
                toast.error("Authentication error. Please login again.");
                return false;
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/properties/${propertyId}/reject?reason=${encodeURIComponent(reason)}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.success("Property Rejected");
                fetchPendingProperties(); // Refresh the list
                return true;
            } else {
                const result = await response.json();
                toast.error(result.message || "Failed to reject property");
                return false;
            }
        } catch (error) {
            console.error("Reject property error:", error);
            toast.error("An error occurred while rejecting property");
            return false;
        }
    };

    const deleteProperty = (id) => {
        setProperties(prev => prev.filter(p => p.id !== id));
        toast.info("Property Deleted");
    };


    const approveAgent = async (agentId, notes = "Approved by Admin") => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            const adminUserId = localStorage.getItem('adminUserId');

            if (!token || !adminUserId) {
                toast.error("Authentication error. Please login again.");
                return false;
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/admin/agents/${agentId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    approverId: adminUserId,
                    approvalNotes: notes
                })
            });

            if (response.ok) {
                toast.success("Agent Approved Successfully");
                fetchPendingAgents();
                fetchPendingCompanyAgents();
                fetchAllAgents();
                return true;
            } else {
                const result = await response.json();
                toast.error(result.message || "Failed to approve agent");
                return false;
            }
        } catch (error) {
            console.error("Approve agent error:", error);
            toast.error("An error occurred while approving agent");
            return false;
        }
    };

    const rejectAgent = async (agentId, reason = "Rejected by Admin", details = []) => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            const adminUserId = localStorage.getItem('adminUserId');

            if (!token || !adminUserId) {
                toast.error("Authentication error. Please login again.");
                return false;
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/admin/agents/${agentId}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rejectorId: adminUserId,
                    rejectionReason: reason,
                    rejectionDetails: details
                })
            });

            if (response.ok) {
                toast.success("Agent Rejected");
                fetchPendingAgents();
                fetchPendingCompanyAgents();
                return true;
            } else {
                const result = await response.json();
                toast.error(result.message || "Failed to reject agent");
                return false;
            }
        } catch (error) {
            console.error("Reject agent error:", error);
            toast.error("An error occurred while rejecting agent");
            return false;
        }
    };

    // Company Actions
    const approveCompany = async (companyId, notes = "") => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            const adminUserId = localStorage.getItem('adminUserId');

            if (!token || !adminUserId) {
                toast.error("Authentication error. Please login again.");
                return false;
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/companies/${companyId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    approverId: adminUserId,
                    approvalNotes: notes
                })
            });

            if (response.ok) {
                toast.success("Company Approved Successfully");
                // Refresh lists
                fetchPendingCompanies();
                fetchAllCompanies();
                return true;
            } else {
                const result = await response.json();
                toast.error(result.message || "Failed to approve company");
                return false;
            }
        } catch (error) {
            console.error("Approve company error:", error);
            toast.error("An error occurred while approving");
            return false;
        }
    };

    const rejectCompany = async (companyId, reason, details = []) => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            const adminUserId = localStorage.getItem('adminUserId');

            if (!token || !adminUserId) {
                toast.error("Authentication error. Please login again.");
                return false;
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/companies/${companyId}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rejectorId: adminUserId,
                    rejectionReason: reason,
                    rejectionDetails: details
                })
            });

            if (response.ok) {
                toast.success("Company Rejected");
                // Refresh lists
                fetchPendingCompanies();
                fetchAllCompanies();
                return true;
            } else {
                const result = await response.json();
                toast.error(result.message || "Failed to reject company");
                return false;
            }
        } catch (error) {
            console.error("Reject company error:", error);
            toast.error("An error occurred while rejecting");
            return false;
        }
    };

    // Project Actions
    const approveProject = async (projectId) => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) {
                toast.error("Authentication error. Please login again.");
                return false;
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/properties/projects/view/${projectId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.success("Project Approved Successfully");
                fetchProjects();
                fetchPendingProjectsAdmin();
                return true;
            } else {
                const result = await response.json();
                toast.error(result.message || "Failed to approve project");
                return false;
            }
        } catch (error) {
            console.error("Approve project error:", error);
            toast.error("An error occurred while approving project");
            return false;
        }
    };

    const rejectProject = async (projectId, reason) => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) {
                toast.error("Authentication error. Please login again.");
                return false;
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/properties/projects/view/${projectId}/reject?reason=${encodeURIComponent(reason)}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "query": "", "variables": {} })
            });

            if (response.ok) {
                toast.success("Project Rejected");
                fetchProjects();
                fetchPendingProjectsAdmin();
                return true;
            } else {
                const result = await response.json();
                toast.error(result.message || "Failed to reject project");
                return false;
            }
        } catch (error) {
            console.error("Reject project error:", error);
            toast.error("An error occurred while rejecting project");
            return false;
        }
    };

    const createPhase = async (projectId, formData) => {
        try {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) {
                toast.error("Authentication error. Please login again.");
                return false;
            }

            // 🔴 CORRECTED URL BELOW:
            // Old: ${API_BASE_URL}/api/v1/admin/properties/phases/projects/${projectId}/phases
            // New: ${API_BASE_URL}/api/v1/projects/${projectId}/phases
            const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}/phases`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Note: Do NOT manually set Content-Type here. 
                    // fetch() sets it automatically (with the boundary) when body is FormData.
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
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
    // Stats Calculation
    const stats = {
        totalProperties: properties.length,
        totalAgents: agents.filter(a => a.status?.toLowerCase() === 'approved').length,
        featuredProperties: 8,
        pendingAgents: agents.filter(a => a.status?.toLowerCase() === 'pending').length,
        totalCompanies: companies.filter(c => c.status?.toLowerCase() === 'approved').length,
        pendingCompanies: companies.filter(c => c.status?.toLowerCase() === 'pending').length,
    };

    return (
        <AdminContext.Provider value={{
            isAuthenticated,
            adminUser,
            login,
            logout,
            properties,
            agents,
            companies,
            projects,
            pendingProjects,
            pendingCompanies,
            pendingAgents,
            pendingCompanyAgents,
            verifiedCompaniesCount,
            pendingCompaniesCount,
            fetchPendingCompanies,
            fetchAllCompanies,
            fetchAllProperties,
            fetchVerifiedCompaniesCount,
            fetchPendingCompaniesCount,
            fetchPendingProperties,
            pendingProperties,
            fetchPendingAgents,
            fetchPendingCompanyAgents,
            fetchAllAgents,
            fetchProjects,
            stats,
            approveProperty,
            rejectProperty,
            deleteProperty,
            approveAgent,
            rejectAgent,
            approveCompany,
            rejectCompany,
            approveProject,
            rejectProject,
            createPhase,
            fetchPendingProjectsAdmin
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}
