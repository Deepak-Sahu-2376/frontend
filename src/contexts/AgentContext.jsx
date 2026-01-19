import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { API_BASE_URL } from '../utils/apiClient';

const AgentContext = createContext();

export const AgentProvider = ({ children }) => {
    // Independent Agent State
    const [user, setAgentUser] = useState(() => {
        const saved = localStorage.getItem('agent_user_data');
        return saved ? JSON.parse(saved) : null;
    });

    const [todayVisits, setTodayVisits] = useState([]);
    const [upcomingVisits, setUpcomingVisits] = useState([]);
    const [loading, setLoading] = useState(false);

    const [agentProperties, setAgentProperties] = useState([]);

    const logout = () => {
        localStorage.removeItem('agentAccessToken');
        localStorage.removeItem('agent_user_data');
        localStorage.removeItem('agent_auth');
        setAgentUser(null);
        window.location.href = '/sign-in';
    };

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('agentAccessToken');
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
                setAgentUser(userData);
                localStorage.setItem('agent_user_data', JSON.stringify(userData));
            }
        } catch (error) {
            console.error('Error fetching agent profile:', error);
            // Optional: logout if 401?
        }
    };

    const fetchTodayVisits = async () => {
        try {
            const token = localStorage.getItem('agentAccessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/v1/visit/agent/visits/today?page=0&size=20&sort=preferredVisitTime,asc`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTodayVisits(data.content || []);
            }
        } catch (error) {
            console.error('Error fetching today visits:', error);
        }
    };

    const fetchUpcomingVisits = async () => {
        try {
            const token = localStorage.getItem('agentAccessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/v1/visit/agent/visits/upcoming?page=0&size=20&sort=preferredVisitTime,asc`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUpcomingVisits(data.content || []);
            }
        } catch (error) {
            console.error('Error fetching upcoming visits:', error);
        }
    };

    const fetchAgentProperties = async () => {
        try {
            const agentId = user?.userId || user?.id;
            if (!agentId) return;
            const token = localStorage.getItem('agentAccessToken');
            if (!token) return;

            console.log(`AgentContext: Fetching properties for agentId: ${agentId}`);
            const response = await fetch(`${API_BASE_URL}/api/v1/properties/agent/${agentId}?page=0&size=20`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            console.log('AgentContext: fetchAgentProperties status:', response.status);

            if (response.ok) {
                const data = await response.json();

                // Handle various response structures:
                // 1. Direct Page object: { content: [...] }
                // 2. Wrapped Page object: { data: { content: [...] } }
                // 3. Wrapped Array: { data: [...] }
                // 4. Direct Array: [...]

                let properties = [];
                if (data.content && Array.isArray(data.content)) {
                    properties = data.content;
                } else if (data.data && data.data.content && Array.isArray(data.data.content)) {
                    properties = data.data.content;
                } else if (data.data && Array.isArray(data.data)) {
                    properties = data.data;
                } else if (Array.isArray(data)) {
                    properties = data;
                }

                setAgentProperties(properties);
            }
        } catch (error) {
            console.error('Error fetching agent properties:', error);
        }
    };

    const refreshVisits = async () => {
        setLoading(true);
        await Promise.all([fetchTodayVisits(), fetchUpcomingVisits(), fetchAgentProperties()]);
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            console.log('AgentContext: User detected:', user.userType, user.id);
            // Check for valid agent types (case insensitive)
            const type = user.userType ? user.userType.toLowerCase() : '';
            if (type === 'agent' || type === 'company_agent') {
                console.log('AgentContext: Fetching data for agent...');
                refreshVisits();
            }
        }
    }, [user]);

    return (
        <AgentContext.Provider value={{
            todayVisits,
            upcomingVisits,
            agentProperties,
            loading,
            refreshVisits,
            fetchAgentProperties,
            fetchUserProfile, // Added for compatibility with AgentLayout
            logout,
            user
        }}>
            {children}
        </AgentContext.Provider>
    );
};

export const useAgent = () => {
    const context = useContext(AgentContext);
    if (!context) {
        throw new Error('useAgent must be used within an AgentProvider');
    }
    return context;
};
