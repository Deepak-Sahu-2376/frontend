
import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from '../utils/apiClient';
// No TypeScript interfaces in JS — we simply use plain objects.

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("brickbroker_user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
      setFavorites(userData.favorites || []);
    }

    // Load favorites for non-logged users
    const savedFavorites = localStorage.getItem("brickbroker_favorites");
    if (savedFavorites && !savedUser) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

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
        const { data } = result;

        // Store token
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }

        let userData = data.user || {
          email: identifier,
          id: data.id || null
        };

        // Normalize name
        if (!userData.name && (userData.firstName || userData.lastName)) {
          userData.name = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
        }

        // Fallback name if still empty
        if (!userData.name) {
          userData.name = identifier.split('@')[0];
        }

        // Ensure favorites exists
        if (!userData.favorites) {
          userData.favorites = [];
        }

        setUser(userData);
        setIsAuthenticated(true);
        setFavorites(userData.favorites || []);
        localStorage.setItem("brickbroker_user", JSON.stringify(userData));
        return true;
      } else {
        console.error('Login failed:', result);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, message: result.message };
      } else {
        console.error('Registration failed:', result);
        return { success: false, message: result.message || result.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    }
  };

  const verifyRegistration = async (email, otpCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otpCode }),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, message: result.message };
      } else {
        console.error('Verification failed:', result);
        return { success: false, message: result.message || 'Verification failed' };
      }
    } catch (error) {
      console.error('Verification error:', error);
      return { success: false, message: 'An error occurred during verification' };
    }
  };

  const forgotPassword = async (identifier) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password?identifier=${encodeURIComponent(identifier)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, message: result.message || 'OTP sent to your email' };
      } else {
        console.error('Forgot password failed:', result);
        return { success: false, message: result.message || 'Failed to send OTP' };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'An error occurred' };
    }
  };

  const resetPassword = async (identifier, otpCode, newPassword, confirmPassword) => {
    try {

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, otpCode, newPassword, confirmPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, message: result.message || 'Password reset successful' };
      } else {
        console.error('Reset password failed:', result);
        // Show detailed validation errors if available
        if (result.data && result.data.errors) {
          console.error('Validation errors:', result.data.errors);
          const errorMessages = Object.values(result.data.errors).join(', ');
          return { success: false, message: errorMessages || result.error || 'Failed to reset password' };
        }
        return { success: false, message: result.error || result.message || 'Failed to reset password' };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'An error occurred' };
    }
  };

  const sendAgentOtp = async (agentData) => {
    try {
      // Construct query parameters
      const params = new URLSearchParams({
        email: agentData.email,
        firstName: agentData.firstName,
        phone: agentData.phone
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/agents/register/send-otp?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, message: result.message || 'OTP sent successfully' };
      } else {
        return { success: false, message: result.message || 'Failed to send OTP' };
      }
    } catch (error) {
      console.error('Send Agent OTP error:', error);
      return { success: false, message: 'An error occurred' };
    }
  };

  const verifyAgentRegistration = async (agentData, otpCode) => {
    try {
      const payload = {
        ...agentData,
        otpCode: otpCode
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/agents/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, message: result.message || 'Agent registered successfully' };
      } else {
        console.error("Agent registration failed. Status:", response.status, "Response:", result);
        let errorMessage = result.message || result.error || 'Registration failed';

        // customized error handling
        if (errorMessage.includes('TraceID')) {
          // Try to save useful info if it's an OTP error
          if (errorMessage.toLowerCase().includes('otp') || result.error?.toLowerCase().includes('otp')) {
            errorMessage = "Invalid or expired OTP. Please request a new one.";
          } else {
            errorMessage = "An unexpected error occurred. Please try again later or contact support.";
          }
        }

        // Handle specific error codes if available
        if (result.errorCode === 'RESOURCE_EXISTS') {
          if (result.error?.includes('email')) errorMessage = 'This email is already registered.';
          else if (result.error?.includes('phone')) errorMessage = 'This phone number is already registered.';
          else errorMessage = 'Account with these details already exists.';
        }

        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Agent registration error:', error);
      return { success: false, message: 'An error occurred' };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
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
      // Continue with local logout even if API call fails
    } finally {
      // Clear local state and storage
      setUser(null);
      setIsAuthenticated(false);
      setFavorites([]);
      localStorage.removeItem("brickbroker_user");
      localStorage.removeItem("brickbroker_favorites");
      localStorage.removeItem("accessToken");
    }
  };

  const deleteAccount = async () => {
    try {
      // In a real app, you would make an API call here to delete the user
      // await fetch(`${API_BASE_URL}/api/v1/auth/delete-account`, ...);

      // For now, we'll just mock it and do a cleanup similar to logout
    } catch (error) {
      console.error('Delete account error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setFavorites([]);
      localStorage.removeItem("brickbroker_user");
      localStorage.removeItem("brickbroker_favorites");
      localStorage.removeItem("accessToken");
    }
  };

  const uploadProfileImage = async (file) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return { success: false, message: 'Authentication required' };

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/v1/users/me/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Content-Type is set automatically for FormData
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        const responseData = result.data || result;

        // Handle different response structures
        // 1. If backend returns { user: {...}, ... }
        if (responseData.user) {
          const updatedUser = { ...user, ...responseData.user };
          // Ensure top-level link is also correct if present
          if (responseData.profileImageUrl) updatedUser.profileImageUrl = responseData.profileImageUrl;

          setUser(updatedUser);
          localStorage.setItem("brickbroker_user", JSON.stringify(updatedUser));
          return { success: true, message: result.message, data: responseData };
        }

        // 2. If backend returns just the file URL or partial updates
        if (responseData.profileImageUrl || responseData.imageUrl) {
          const newUrl = responseData.profileImageUrl || responseData.imageUrl;
          const updatedUser = { ...user, profileImageUrl: newUrl };
          setUser(updatedUser);
          localStorage.setItem("brickbroker_user", JSON.stringify(updatedUser));
          return { success: true, message: result.message, data: responseData };
        }

        // 3. Fallback: if it's the user object itself
        if (responseData.id || responseData.userId) {
          setUser(prev => ({ ...prev, ...responseData }));
          const currentStorage = JSON.parse(localStorage.getItem("brickbroker_user") || '{}');
          localStorage.setItem("brickbroker_user", JSON.stringify({ ...currentStorage, ...responseData }));
        }

        return { success: true, message: result.message || 'Image uploaded successfully', data: responseData };
      } else {
        return { success: false, message: result.message || 'Failed to upload image' };
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return { success: false, message: 'An error occurred during upload' };
    }
  };

  const deleteProfileImage = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return { success: false, message: 'Authentication required' };

      const response = await fetch(`${API_BASE_URL}/api/v1/users/me/avatar`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Update local state to remove image
        setUser(prev => {
          const updated = { ...prev, profileImageUrl: null };
          // Also update storage
          const currentStorage = JSON.parse(localStorage.getItem("brickbroker_user") || '{}');
          localStorage.setItem("brickbroker_user", JSON.stringify({ ...currentStorage, profileImageUrl: null }));
          return updated;
        });

        return { success: true, message: 'Profile image removed successfully' };
      } else {
        const result = await response.json();
        return { success: false, message: result.message || 'Failed to remove image' };
      }
    } catch (error) {
      console.error('Error removing profile image:', error);
      return { success: false, message: 'An error occurred' };
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*'
        }
      });

      if (response.ok) {
        const result = await response.json();
        const userData = result.data || result;

        // Update local state
        setUser(prev => ({ ...prev, ...userData }));

        // Update local storage
        const currentStorage = JSON.parse(localStorage.getItem("brickbroker_user") || '{}');
        localStorage.setItem("brickbroker_user", JSON.stringify({ ...currentStorage, ...userData }));

        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const updateProfile = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);

      if (updates.favorites !== undefined) {
        setFavorites(updates.favorites);
      }

      localStorage.setItem("brickbroker_user", JSON.stringify(updatedUser));
    }
  };

  const addToFavorites = (propertyId) => {
    if (!favorites.includes(propertyId)) {
      const newFavorites = [...favorites, propertyId];
      setFavorites(newFavorites);

      if (user) {
        const updatedUser = { ...user, favorites: newFavorites };
        setUser(updatedUser);
        localStorage.setItem("brickbroker_user", JSON.stringify(updatedUser));
      } else {
        localStorage.setItem(
          "brickbroker_favorites",
          JSON.stringify(newFavorites)
        );
      }
    }
  };

  const removeFromFavorites = (propertyId) => {
    const newFavorites = favorites.filter((id) => id !== propertyId);
    setFavorites(newFavorites);

    if (user) {
      const updatedUser = { ...user, favorites: newFavorites };
      setUser(updatedUser);
      localStorage.setItem("brickbroker_user", JSON.stringify(updatedUser));
    } else {
      localStorage.setItem(
        "brickbroker_favorites",
        JSON.stringify(newFavorites)
      );
    }
  };

  const toggleFavorite = (propertyId) => {
    const isFav = favorites.includes(propertyId);
    if (isFav) {
      removeFromFavorites(propertyId);
      return false;
    } else {
      addToFavorites(propertyId);
      return true;
    }
  };

  const isFavorite = (propertyId) => favorites.includes(propertyId);

  const fetchMyVisits = async (page = 0, size = 10) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return { success: false, message: "No token found" };

      const response = await fetch(`${API_BASE_URL}/api/v1/visits/myVisits?page=${page}&size=${size}&sort=createdAt,desc`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      }
      return { success: false, message: result.message || "Failed to fetch visits" };
    } catch (error) {
      console.error("Error fetching visits:", error);
      return { success: false, message: "Network error" };
    }
  };

  const cancelVisit = async (visitId, reason) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return { success: false, message: "No token found" };

      const response = await fetch(`${API_BASE_URL}/api/v1/visits/${visitId}/cancel-by-user`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      let result = null;
      try {
        result = await response.json();
      } catch (e) {
        // Ignore JSON parse error if body is empty
      }

      if (response.ok) {
        return { success: true, message: "Visit cancelled successfully" };
      }
      return { success: false, message: result?.message || "Failed to cancel visit" };
    } catch (error) {
      console.error("Error cancelling visit:", error);
      return { success: false, message: "Network error" };
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        favorites,
        login,
        register,
        verifyRegistration,
        forgotPassword,
        resetPassword,
        logout,
        updateProfile,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        sendAgentOtp,
        verifyAgentRegistration,
        deleteAccount,
        fetchUserProfile,
        uploadProfileImage,
        deleteProfileImage,
        fetchMyVisits,
        cancelVisit,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
