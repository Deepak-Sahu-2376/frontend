import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Users,
  Building2,
  Home,
  ShieldCheck,
  TrendingUp,
  Target,
  Eye,
  EyeOff,
  CheckCircle2,
  Crown,
  Award,
  Briefcase,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import { API_BASE_URL } from '../utils/apiClient';


export function SignUpPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(() => {
    const path = window.location.pathname;
    if (path.includes("agent/signup")) return "agent";
    if (path.includes("company/signup")) return "company";
    if (path.includes("buyer/signup")) return "buyer";
    return "buyer";
  });

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    const newPath = `/${role}/signup`;
    window.history.pushState(null, "", newPath);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({

    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: "",
    acceptTerms: false,
    receiveUpdates: false,

    firstName: "",
    lastName: "",
    dateOfBirth: "",
    profession: "",

    fullName: "",
    reraLicense: "",
    experienceYears: "",
    specialization: "",
    agencyName: "",
    bio: "",
    languages: [],
    licenseState: "",
    agentType: "INDIVIDUAL",
    profileVisibility: true,
    licenseNumber: "",
    licenseExpiryDate: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    serviceAreas: [],
    companyId: "",

    companyName: "",
    companyType: "",
    registrationNumber: "",
    establishmentYear: "",
    gstNumber: "",
    panNumber: "",
    website: "",
    employeeCount: "",
    description: "",

    contactPersonName: "",
    contactPersonDesignation: "",

    alternateEmail: "",
    address: "",
    state: "",
    country: "",
    pincode: "",

    licenseAuthority: "",
    specializations: [],

    acceptPrivacyPolicy: false,
    allowMarketingEmails: false,
    allowSmsNotifications: false,

    documentFile: null,
    documentType: "GST_CERTIFICATE",
    documentDescription: "",
  });

  const { register, verifyRegistration, login, resendOtp, sendAgentOtp, verifyAgentRegistration } = useUser();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [companyRegistrationStep, setCompanyRegistrationStep] = useState(1); // 1 = basic info, 2 = full form, 3 = document upload
  const [agentRegistrationStep, setAgentRegistrationStep] = useState(1); // 1 = basic info, 2 = full form, 3 = document upload
  const [companies, setCompanies] = useState([]);
  const [fetchingCompanies, setFetchingCompanies] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes("agent/signup")) setSelectedRole("agent");
      else if (path.includes("company/signup")) setSelectedRole("company");
      else if (path.includes("buyer/signup")) setSelectedRole("buyer");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (formData.agentType === 'COMPANY' && selectedRole === 'agent') {
      const fetchCompanies = async () => {
        console.warn("Fetching companies...");
        setFetchingCompanies(true);
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/companies/dropdown`);
          console.warn("Fetch companies response status:", response.status);
          if (response.ok) {
            const data = await response.json();
            console.warn("Fetch companies data:", data);
            const companiesList = Array.isArray(data) ? data : (data.data || []);
            console.warn("Processed companies list:", companiesList);
            setCompanies(companiesList);
          } else {
            console.error('Failed to fetch companies');
            toast.error('Failed to load companies');
          }
        } catch (error) {
          console.error('Error fetching companies:', error);
          toast.error('Error loading companies');
        } finally {
          setFetchingCompanies(false);
        }
      };

      fetchCompanies();
    }
  }, [formData.agentType, selectedRole]);

  const roleConfig = {
    buyer: {
      title: "Start Your Property Journey",
      subtitle: "Join thousands of happy homeowners",
      description: "Create your free account and find your dream property",
      specialOffer: {
        title: "🏠 Welcome Bonus",
        description: "First time buyers get priority support and exclusive property previews!",
      },
      benefits: [
        "Save unlimited properties",
        "Verified listings only",
        "AI-powered recommendations",
        "Exclusive buyer deals",
        "Expert consultation",
        "Property value insights",
      ],
      getStarted: [
        "Complete your profile and preferences",
        "Get personalized property recommendations",
        "Schedule visits and connect with agents",
        "Find your perfect home",
      ],
      stats: [
        { number: "50K+", label: "Happy Buyers" },
        { number: "₹500Cr+", label: "Properties Sold" },
        { number: "98%", label: "Satisfaction Rate" },
      ],
      buttonText: "Create Buyer Account",
      icon: Home,
    },
    agent: {
      title: "Grow Your Real Estate Career",
      subtitle: "Join the top 1% of real estate professionals",
      description: "Access premium tools and expand your client base",
      specialOffer: {
        title: "🚀 Agent Launch Package",
        description: "New agents get 30-day premium access and dedicated onboarding support!",
      },
      benefits: [
        "Advanced lead generation",
        "Client management CRM",
        "Instant buyer notifications",
        "Commission tracking",
      ],
      getStarted: [
        "Verify your RERA license",
        "Set up professional profile",
        "Start connecting with leads",
      ],
      stats: [
        { number: "5K+", label: "Active Agents" },
        { number: "₹1000Cr+", label: "Transactions" },
        { number: "40%", label: "Growth Rate" },
      ],
      buttonText: "Join as Real Estate Agent",
      icon: TrendingUp,
    },
    company: {
      title: "Scale Your Real Estate Business",
      subtitle: "Empower your organization with enterprise solutions",
      description: "Comprehensive platform for real estate companies and developers",
      specialOffer: {
        title: "🏢 Enterprise Benefits",
        description: "Get dedicated account management and custom integrations!",
      },
      benefits: [
        "Multi-agent dashboard",
        "Bulk property management",
        "Advanced analytics",
        "API integrations",
      ],
      getStarted: [
        "Complete company verification",
        "Add team members",
        "Launch property portfolio",
      ],
      stats: [
        { number: "500+", label: "Partner Companies" },
        { number: "₹2500Cr+", label: "Portfolio Value" },
        { number: "95%", label: "Retention" },
      ],
      buttonText: "Register Company",
      icon: Building2,
    },
  };

  const currentConfig = roleConfig[selectedRole];
  const RoleIcon = currentConfig.icon;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const sendCompanyOtp = async (companyData) => {
    try {
      const params = new URLSearchParams({
        email: companyData.email,
        companyName: companyData.companyName,
        contactPerson: companyData.contactPersonName,
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/companies/register/send-otp?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, message: result.message || 'OTP sent successfully!' };
      } else {
        return { success: false, message: result.message || 'Failed to send OTP' };
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, message: 'An error occurred while sending OTP' };
    }
  };

  const verifyCompanyRegistration = async (companyData, otpCode) => {
    try {
      const payload = {
        email: companyData.email,
        otpCode: otpCode,
        companyName: companyData.companyName,
        companyType: companyData.companyType,
        registrationNumber: companyData.registrationNumber,
        establishmentYear: parseInt(companyData.establishmentYear) || new Date().getFullYear(),
        contactPersonName: companyData.contactPersonName,
        contactPersonDesignation: companyData.contactPersonDesignation,
        phone: companyData.phone,
        alternateEmail: companyData.alternateEmail || null,
        address: companyData.address,
        city: companyData.city,
        state: companyData.state,
        country: companyData.country || "India",
        pincode: companyData.pincode,
        description: companyData.description || null,
        serviceAreas: typeof companyData.serviceAreas === 'string' ? companyData.serviceAreas.split(',').map(s => s.trim()).filter(Boolean) : [],
        specializations: typeof companyData.specializations === 'string' ? companyData.specializations.split(',').map(s => s.trim()).filter(Boolean) : [],
        password: companyData.password,
        confirmPassword: companyData.confirmPassword,
        gstNumber: companyData.gstNumber || null,
        panNumber: companyData.panNumber || null,
        licenseNumber: companyData.licenseNumber || null,
        licenseAuthority: companyData.licenseAuthority || null,
        licenseExpiryDate: companyData.licenseExpiryDate || null,
        website: companyData.website || null,
        employeeCount: parseInt(companyData.employeeCount) || 0,
        acceptTerms: companyData.acceptTerms,
        acceptPrivacyPolicy: companyData.acceptPrivacyPolicy || companyData.acceptTerms,
        allowMarketingEmails: companyData.allowMarketingEmails || false,
        allowSmsNotifications: companyData.allowSmsNotifications || false,
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/companies/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true, message: result.message || 'Company registered successfully!', data: result };
      } else {
        console.error('Registration failed response:', result);
        let errorMessage = result.message || 'Registration failed';

        if (result.errorCode === 'RESOURCE_EXISTS' || result.errorCode === 'DATA_INTEGRITY_ERROR') {
          if (result.error?.includes('phone')) {
            errorMessage = 'This phone number is already registered.';
          } else if (result.error?.includes('email')) {
            errorMessage = 'This email is already registered.';
          } else if (result.error?.toLowerCase().includes('registration number')) {
            errorMessage = 'This Registration Number is already registered.';
          } else {
            errorMessage = 'Account with these details already exists. Please check email, phone, or registration number.';
          }
        }

        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Company registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    }
  };

  const uploadDocument = async (token, file) => {
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('documentType', formData.documentType);
      uploadData.append('description', formData.documentDescription);

      const response = await fetch(`${API_BASE_URL}/api/v1/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadData,
        redirect: 'follow'
      });

      const result = await response.text();

      try {
        const jsonResult = JSON.parse(result);
        if (response.ok) {
          return { success: true, message: 'Document uploaded successfully!' };
        } else {
          if (response.status !== 401) {
            console.error('Document upload failed:', jsonResult);
          }
          return { success: false, message: jsonResult.message || 'Failed to upload document' };
        }
      } catch (e) {
        if (response.ok) {
          return { success: true, message: 'Document uploaded successfully!' };
        }
        if (response.status !== 401) {
          console.error('Document upload failed (text):', result);
        }
        return { success: false, message: 'Failed to upload document' };
      }

    } catch (error) {
      if (!error.message?.includes('401')) {
        console.error('Document upload error:', error);
      }
      return { success: false, message: 'An error occurred during document upload' };
    }
  };


  const handleResendOtp = async () => {
    try {
      const result = await resendOtp(formData.email);
      if (result.success) {
        toast.success(result.message || "OTP sent successfully!");
        setResendCooldown(90); // 90 second cooldown
      } else {
        toast.error(result.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("An error occurred while resending OTP");
    }
  };


  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedRole === "company") {
        const result = await verifyCompanyRegistration(formData, otpCode);
        if (result.success) {
          toast.success("Company registered successfully!");
          navigate('/sign-in');
        } else {
          toast.error(result.message || "Invalid OTP");
        }
        return;
      }

      const result = await verifyRegistration(formData.email, otpCode);
      if (result.success) {
        toast.success("Account verification successfully done");

        const loginSuccess = await login(formData.email, formData.password);
        if (loginSuccess) {
          navigate('/'); // Redirect to home
        } else {
          toast.error("Verification successful, but auto-login failed. Please sign in.");
          navigate('/sign-in');
        }
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (showOtpInput) {
      setShowOtpInput(false);
      return;
    }
    if (selectedRole === "company" && companyRegistrationStep > 1) {
      setCompanyRegistrationStep(prev => prev - 1);
    } else if (selectedRole === "agent" && agentRegistrationStep > 1) {
      setAgentRegistrationStep(prev => prev - 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {

      if (selectedRole === "company") {
        if (companyRegistrationStep === 1) {
          const step1RequiredFields = ["email", "companyName", "contactPersonName"];
          const missingStep1Fields = step1RequiredFields.filter((f) => !formData[f]);

          if (missingStep1Fields.length > 0) {
            toast.error("Please fill in all required fields");
            setLoading(false);
            return;
          }

          const result = await sendCompanyOtp(formData);

          if (result.success) {
            toast.success(result.message || "OTP sent to your email!");
            setCompanyRegistrationStep(2);
            setResendCooldown(90);
          } else {
            toast.error(result.message);
          }
          setLoading(false);
          return;
        }

        if (companyRegistrationStep === 2) {
          if (!otpCode || otpCode.length !== 6) {
            toast.error("Please enter the 6-digit OTP");
            setLoading(false);
            return;
          }

          if (!formData.password || !formData.phone) {
            toast.error("Please fill in all required fields");
            setLoading(false);
            return;
          }

          if (!formData.acceptTerms) {
            toast.error("Please accept the Terms and Conditions");
            setLoading(false);
            return;
          }

          if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
          }

          if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            setLoading(false);
            return;
          }

          const step2RequiredFields = [
            "companyType", "registrationNumber", "establishmentYear",
            "address", "city", "state", "country", "pincode"
          ];
          const missingStep2Fields = step2RequiredFields.filter((f) => !formData[f]);
          if (missingStep2Fields.length > 0) {
            toast.error("Please fill in all required fields");
            setLoading(false);
            return;
          }

          setCompanyRegistrationStep(3);
          setLoading(false);
          return;
        }

        if (companyRegistrationStep === 3) {
          if (!formData.documentFile) {
            toast.error("Please upload the required document");
            setLoading(false);
            return;
          }

          if (!formData.documentDescription) {
            toast.error("Please provide a description for the document");
            setLoading(false);
            return;
          }

          const result = await verifyCompanyRegistration(formData, otpCode);

          if (result.success) {
            toast.success("Company registered successfully!");

            const loginSuccess = await login(formData.email, formData.password);

            if (loginSuccess) {
              const token = localStorage.getItem("accessToken");
              if (token && formData.documentFile) {
                const uploadResult = await uploadDocument(token, formData.documentFile);
                if (uploadResult.success) {
                  toast.success("Document uploaded successfully!");
                } else {
                  toast.error("Company registered, but document upload failed: " + uploadResult.message);
                }
              }
            } else {
              console.error("Auto-login failed after registration");
              toast.error("Company registered, but could not log in to upload document. Please sign in manually.");
            }

            navigate('/sign-in');
          } else {
            toast.error(result.message || "Registration failed");
          }
          setLoading(false);
          return;
        }
      }

      if (selectedRole === "agent") {
        if (agentRegistrationStep === 1) {
          const step1RequiredFields = ["firstName", "email", "phone"];
          const missingStep1Fields = step1RequiredFields.filter((f) => !formData[f]);

          if (missingStep1Fields.length > 0) {
            toast.error("Please fill in all required fields");
            setLoading(false);
            return;
          }

          const result = await sendAgentOtp(formData);

          if (result.success) {
            toast.success(result.message || "OTP sent to your email!");
            setAgentRegistrationStep(2);
            setResendCooldown(90);
          } else {
            toast.error(result.message);
          }
          setLoading(false);
          return;
        }

        if (agentRegistrationStep === 2) {
          if (!otpCode || otpCode.length !== 6) {
            toast.error("Please enter the 6-digit OTP");
            setLoading(false);
            return;
          }

          if (!formData.password || !formData.confirmPassword) {
            toast.error("Please enter password");
            setLoading(false);
            return;
          }

          if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
          }

          if (!formData.acceptTerms) {
            toast.error("Please accept Terms and Conditions");
            setLoading(false);
            return;
          }

          const requiredFields = [
            "address", "city", "state", "country", "pincode",
            "specialization", "experienceYears", "bio",
            "dateOfBirth", "agentType"
          ];
          const missing = requiredFields.filter(f => !formData[f]);
          if (missing.length > 0) {
            toast.error("Please fill in all required fields");
            setLoading(false);
            return;
          }

          // Registration Logic (Moved from Step 3)
          const agentPayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            otpCode: otpCode,

            city: formData.city,
            state: formData.state,
            country: formData.country,
            address: formData.address,
            pincode: formData.pincode,

            specialization: formData.specialization,
            experienceYears: parseInt(formData.experienceYears) || 0,
            bio: formData.bio,

            serviceAreas: typeof formData.serviceAreas === 'string'
              ? formData.serviceAreas.split(',').map(s => s.trim()).filter(Boolean)
              : formData.serviceAreas,
            languages: typeof formData.languages === 'string'
              ? formData.languages.split(',').map(s => s.trim()).filter(Boolean)
              : formData.languages,

            dob: formData.dateOfBirth,

            agentType: formData.agentType === 'COMPANY' ? 'COMPANY_AGENT' : formData.agentType,

            allowMarketingEmails: formData.allowMarketingEmails || false,
            allowSmsNotifications: formData.allowSmsNotifications || true,
            profileVisibility: formData.profileVisibility !== undefined ? formData.profileVisibility : true,

            acceptTerms: formData.acceptTerms,
            acceptPrivacyPolicy: formData.acceptPrivacyPolicy || true
          };

          if (formData.agentType === 'COMPANY') {
            agentPayload.companyId = formData.companyId;
            agentPayload.companyName = formData.companyName;
          }

          const result = await verifyAgentRegistration(agentPayload, otpCode);

          if (result.success) {
            toast.success("Agent registered successfully!");

            const loginSuccess = await login(formData.email, formData.password);
            if (loginSuccess) {
              // Success - redirect handled by login or here
              toast.success("Welcome aboard!");
            } else {
              toast.error("Agent registered, but auto-login failed. Please sign in.");
            }
            navigate('/sign-in'); // Or home if auto-login
          } else {
            toast.error(result.message || "Registration failed");
          }
          setLoading(false);
          return;
        }

        // Step 3 removed for Agent

      }

      const requiredFields = ["email", "password", "phone"];
      if (selectedRole === "buyer") {
        requiredFields.push("firstName", "lastName");
      } else if (selectedRole === "agent") {
        requiredFields.push("fullName");
      }

      const missing = requiredFields.filter((f) => !formData[f]);
      if (missing.length > 0) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      if (!formData.acceptTerms) {
        toast.error("Please accept the Terms and Conditions");
        setLoading(false);
        return;
      }

      const userTypeMap = {
        buyer: "BUYER",
        agent: "AGENT",
        company: "COMPANY"
      };

      const payload = {
        ...formData,
        userType: userTypeMap[selectedRole],
        allowEmailNotifications: formData.receiveUpdates,
        allowSmsNotifications: true,
        allowPushNotifications: true,
        allowMarketingEmails: formData.receiveUpdates,
        acceptPrivacyPolicy: true,
        profileComplete: true,
        locationProvided: !!formData.city
      };

      Object.keys(payload).forEach(key => {
        if (payload[key] === "" || payload[key] === null) {
          delete payload[key];
        }
      });

      const result = await register(payload);


      if (result.success) {
        toast.success("Registration successful! Please verify your email.");
        setShowOtpInput(true);
        setResendCooldown(90);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData, selectedRole, register, sendCompanyOtp, companyRegistrationStep, otpCode, verifyCompanyRegistration, navigate]);

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case "buyer":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>
            </div>
          </>
        );
      case "agent":
        return (
          <>
            {agentRegistrationStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Step 1: Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {agentRegistrationStep === 2 && (
              <>
                <div className="space-y-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="text-sm font-semibold text-gray-700">Verify OTP</h3>
                  <div>
                    <Label htmlFor="otpCode">
                      Enter 6-Digit OTP <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="otpCode"
                      placeholder="123456"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      OTP sent to {formData.email}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Step 2: Professional Details</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="agentType">Agent Type</Label>
                      <Select
                        value={formData.agentType}
                        onValueChange={(value) => handleInputChange("agentType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Agent Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                          <SelectItem value="COMPANY">Company</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.agentType === 'COMPANY' && (
                      <div className="col-span-2">
                        <Label htmlFor="companyId">Select Company <span className="text-red-500">*</span></Label>
                        <Select
                          value={formData.companyId}
                          onValueChange={(value) => {
                            handleInputChange("companyId", value);
                            const selectedCompany = companies.find(c => c.id.toString() === value);
                            if (selectedCompany) {
                              handleInputChange("companyName", selectedCompany.companyName);
                            }
                          }}
                          disabled={fetchingCompanies}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={fetchingCompanies ? "Loading companies..." : "Select Company"} />
                          </SelectTrigger>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem key={company.id} value={company.id.toString()}>
                                {company.companyName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        placeholder="Residential"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange("specialization", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experienceYears">Experience (Years)</Label>
                      <Input
                        id="experienceYears"
                        type="number"
                        placeholder="5"
                        value={formData.experienceYears}
                        onChange={(e) => handleInputChange("experienceYears", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        placeholder="Experienced real estate agent..."
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        placeholder="New Delhi"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="Delhi"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pincode">
                        Pincode <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="pincode"
                        placeholder="110001"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="India"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serviceAreas">Service Areas (comma separated)</Label>
                      <Input
                        id="serviceAreas"
                        placeholder="Delhi, Gurgaon, Noida"
                        value={formData.serviceAreas}
                        onChange={(e) => handleInputChange("serviceAreas", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="languages">Languages (comma separated)</Label>
                      <Input
                        id="languages"
                        placeholder="English, Hindi"
                        value={formData.languages}
                        onChange={(e) => handleInputChange("languages", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 3 Removed for Agent */}
          </>
        );
      case "company":
        return (
          <>
            {companyRegistrationStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Step 1: Company Information</h3>
                <div>
                  <Label htmlFor="companyName">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="ABC Developers Ltd."
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPersonName">
                    Contact Person Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactPersonName"
                    placeholder="John Doe"
                    value={formData.contactPersonName}
                    onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                  />
                </div>
              </div>
            )}

            {companyRegistrationStep === 2 && (
              <>
                <div className="space-y-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="text-sm font-semibold text-gray-700">Verify OTP</h3>
                  <div>
                    <Label htmlFor="otpCode">
                      Enter 6-Digit OTP <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="otpCode"
                      placeholder="123456"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      OTP sent to {formData.email}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Step 2: Complete Registration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyType">
                        Company Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.companyType}
                        onValueChange={(value) => handleInputChange("companyType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BUILDER">Developer/Builder</SelectItem>

                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="registrationNumber">
                        Registration Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="registrationNumber"
                        placeholder="REG123456"
                        value={formData.registrationNumber}
                        onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="establishmentYear">
                        Establishment Year <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="establishmentYear"
                        type="number"
                        placeholder="2015"
                        value={formData.establishmentYear}
                        onChange={(e) => handleInputChange("establishmentYear", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="employeeCount">Employee Count</Label>
                      <Input
                        id="employeeCount"
                        type="number"
                        placeholder="50"
                        value={formData.employeeCount}
                        onChange={(e) => handleInputChange("employeeCount", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input
                        id="gstNumber"
                        placeholder="27AABCP1234F1Z5"
                        value={formData.gstNumber}
                        onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="panNumber">PAN Number</Label>
                      <Input
                        id="panNumber"
                        placeholder="ABCDE1234F"
                        value={formData.panNumber}
                        onChange={(e) => handleInputChange("panNumber", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.example.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                  </div>
                </div>

                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Contact Person</h3>
                  <div>
                    <Label htmlFor="contactPersonDesignation">Designation</Label>
                    <Input
                      id="contactPersonDesignation"
                      placeholder="CEO"
                      value={formData.contactPersonDesignation}
                      onChange={(e) => handleInputChange("contactPersonDesignation", e.target.value)}
                    />
                  </div>
                </div>

                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Contact Details</h3>
                  <div>
                    <Label htmlFor="alternateEmail">Alternate Email</Label>
                    <Input
                      id="alternateEmail"
                      type="email"
                      placeholder="alternate@example.com"
                      value={formData.alternateEmail}
                      onChange={(e) => handleInputChange("alternateEmail", e.target.value)}
                    />
                  </div>
                </div>

                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Address</h3>
                  <div>
                    <Label htmlFor="address">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        placeholder="Mumbai"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">
                        State <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="state"
                        placeholder="Maharashtra"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pincode">
                        Pincode <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="pincode"
                        placeholder="400001"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">
                        Country <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="country"
                        placeholder="India"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">License Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input
                        id="licenseNumber"
                        placeholder="LIC123456"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="licenseAuthority">License Authority</Label>
                      <Input
                        id="licenseAuthority"
                        placeholder="RERA"
                        value={formData.licenseAuthority}
                        onChange={(e) => handleInputChange("licenseAuthority", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
                    <Input
                      id="licenseExpiryDate"
                      type="date"
                      value={formData.licenseExpiryDate}
                      onChange={(e) => handleInputChange("licenseExpiryDate", e.target.value)}
                    />
                  </div>
                </div>

                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Business Details</h3>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of your company"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="serviceAreas">Service Areas (comma separated)</Label>
                    <Input
                      id="serviceAreas"
                      placeholder="e.g. Delhi, Gurgaon, Noida"
                      value={formData.serviceAreas}
                      onChange={(e) => handleInputChange("serviceAreas", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="specializations">Specializations (comma separated)</Label>
                    <Input
                      id="specializations"
                      placeholder="e.g. Residential, Commercial"
                      value={formData.specializations}
                      onChange={(e) => handleInputChange("specializations", e.target.value)}
                    />
                  </div>
                </div>

                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Preferences</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptPrivacyPolicy"
                      checked={formData.acceptPrivacyPolicy}
                      onCheckedChange={(checked) => handleInputChange("acceptPrivacyPolicy", checked)}
                    />
                    <Label htmlFor="acceptPrivacyPolicy" className="text-sm font-normal">
                      I accept the Privacy Policy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowMarketingEmails"
                      checked={formData.allowMarketingEmails}
                      onCheckedChange={(checked) => handleInputChange("allowMarketingEmails", checked)}
                    />
                    <Label htmlFor="allowMarketingEmails" className="text-sm font-normal">
                      I want to receive marketing emails
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowSmsNotifications"
                      checked={formData.allowSmsNotifications}
                      onCheckedChange={(checked) => handleInputChange("allowSmsNotifications", checked)}
                    />
                    <Label htmlFor="allowSmsNotifications" className="text-sm font-normal">
                      I want to receive SMS notifications
                    </Label>
                  </div>
                </div>
              </>
            )}

            {companyRegistrationStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Step 3: Document Upload</h3>
                <div>
                  <Label htmlFor="documentType">Document Type <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.documentType}
                    onValueChange={(value) => handleInputChange("documentType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GST_CERTIFICATE">GST Certificate</SelectItem>
                      <SelectItem value="PAN_CARD">PAN Card</SelectItem>
                      <SelectItem value="INCORPORATION_CERTIFICATE">Incorporation Certificate</SelectItem>
                      <SelectItem value="RERA_CERTIFICATE">RERA Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="documentDescription">Document Description <span className="text-red-500">*</span></Label>
                  <Input
                    id="documentDescription"
                    placeholder="e.g. GST Certificate for FY 2024-25"
                    value={formData.documentDescription}
                    onChange={(e) => handleInputChange("documentDescription", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="documentFile">Upload Document <span className="text-red-500">*</span></Label>
                  <Input
                    id="documentFile"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFormData(prev => ({ ...prev, documentFile: file }));
                    }}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, JPG, PNG</p>
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mt-20 bg-gray-50">
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if ((selectedRole === "company" && companyRegistrationStep > 1) ||
              (selectedRole === "agent" && agentRegistrationStep > 1)) {
              handleBack();
            } else {
              navigate('/');
            }
          }}
          className="text-slate-700 hover:text-slate-800 bg-white shadow-sm border border-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex w-full max-w-7xl overflow-hidden rounded-[2rem] shadow-2xl bg-white min-h-[900px]">
        <div className="hidden lg:flex lg:w-1/2 bg-[#A17F5A] p-16 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[80px]"></div>

          <div className="relative z-10 w-full space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white w-fit">
              {selectedRole === "buyer" ? (
                <>🏠 <span>Buyer Registration</span></>
              ) : selectedRole === "agent" ? (
                <>📈 <span>Agent Registration</span></>
              ) : (
                <>🏢 <span>Company Registration</span></>
              )}
            </div>

            <div>
              <h1 className="text-5xl font-medium text-white mb-2 leading-tight">
                {currentConfig.title}
              </h1>
              <p className="text-xl text-white/90 font-light">
                {currentConfig.subtitle}
              </p>
              <p className="text-sm text-white/70 mt-2">
                {currentConfig.description}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex gap-4 items-start">
              <div className="p-3 bg-white/20 rounded-xl rounded-tl-none">
                <Crown className="h-6 w-6 text-yellow-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{currentConfig.specialOffer.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {currentConfig.specialOffer.description}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white/60" />
                What you'll get:
              </h3>
              <ul className="space-y-2">
                {currentConfig.benefits.slice(0, 4).map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white/60" />
                Getting started is easy:
              </h3>
              <div className="space-y-3 pl-2">
                {currentConfig.getStarted.slice(0, 4).map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium border border-white/20">
                      {i + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-8 border-t border-white/10 pt-6 mt-4">
              {currentConfig.stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-xs text-white/60 uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center p-8 lg:p-20 scrollbar-hide">
          <div className="w-full max-w-lg mx-auto space-y-8">
            <div className="relative text-center">
              {(showOtpInput ||
                (selectedRole === 'company' && companyRegistrationStep > 1) ||
                (selectedRole === 'agent' && agentRegistrationStep > 1)) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Back
                  </Button>
                )}
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Role</h2>
              <p className="text-gray-500 text-sm mt-1">Select how you'd like to join the platform</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["buyer", "agent", "company"].map((role) => {
                const config = roleConfig[role];
                const Icon = config.icon;
                const isActive = selectedRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={cn(
                      "flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all duration-200 border",
                      isActive
                        ? "bg-white text-gray-900 shadow-sm border-gray-200 ring-1 ring-gray-900/5"
                        : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 mb-2", isActive ? "text-[#A17F5A]" : "text-gray-400")} />
                    <span className="capitalize text-sm font-medium">{role}</span>
                  </button>
                );
              })}
            </div>



            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-white text-gray-400">or sign up with email</span>
              </div>
            </div>

            {showOtpInput ? (
              <div className="space-y-6">
                <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-100">
                  <CheckCircle2 className="h-10 w-10 text-orange-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Verify your email</h3>
                  <p className="text-sm text-gray-500 mb-4">We've sent a code to {formData.email}</p>

                  <div className="max-w-[200px] mx-auto">
                    <Input
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="text-center text-2xl tracking-widest h-12 bg-white"
                      maxLength={6}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleOtpSubmit}
                  disabled={loading || otpCode.length !== 6}
                  className="w-full h-11 bg-[#A17F5A] hover:bg-[#8e6f4e] text-white"
                >
                  {loading ? "Verifying..." : "Verify & Complete Registration"}
                </Button>

                <div className="text-center">
                  {resendCooldown > 0 ? (
                    <p className="text-sm text-gray-400">Resend code in {resendCooldown}s</p>
                  ) : (
                    <button onClick={handleResendOtp} className="text-sm font-medium text-[#A17F5A] hover:underline">
                      Resend Code
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="buyer@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-gray-50 border-gray-100 focus:bg-white transition-colors h-10 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">Phone <span className="text-red-500">*</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-gray-50 border-gray-100 focus:bg-white transition-colors h-10 text-sm"
                    />
                  </div>
                </div>

                {renderRoleSpecificFields()}

                {selectedRole === 'buyer' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-semibold text-gray-700">City</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(val) => handleInputChange("city", val)}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-100 h-10 text-sm">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                        <SelectItem value="Noida">Noida</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Bangalore">Bangalore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(selectedRole === 'buyer' || ((selectedRole === 'agent' || selectedRole === 'company') && (agentRegistrationStep >= 2 || companyRegistrationStep >= 2))) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-xs font-semibold text-gray-700">Password <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 6 chars"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className="bg-gray-50 border-gray-100 focus:bg-white transition-colors h-10 text-sm pr-8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-700">Confirm Password <span className="text-red-500">*</span></Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="bg-gray-50 border-gray-100 focus:bg-white transition-colors h-10 text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(c) => handleInputChange("acceptTerms", c)}
                      className="mt-1 border-gray-300 data-[state=checked]:bg-[#A17F5A] data-[state=checked]:border-[#A17F5A]"
                    />
                    <Label htmlFor="acceptTerms" className="text-xs text-gray-500 font-normal leading-tight">
                      I agree to the <a href="#" className="underline text-gray-700">Terms and Conditions</a> and <a href="#" className="underline text-gray-700">Privacy Policy</a>
                    </Label>
                  </div>
                  {selectedRole === 'buyer' && (
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="receiveUpdates"
                        checked={formData.receiveUpdates}
                        onCheckedChange={(c) => handleInputChange("receiveUpdates", c)}
                        className="mt-1 border-gray-300 data-[state=checked]:bg-[#A17F5A] data-[state=checked]:border-[#A17F5A]"
                      />
                      <Label htmlFor="receiveUpdates" className="text-xs text-gray-500 font-normal leading-tight">
                        I'd like to receive property updates and special offers via email
                      </Label>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-11 bg-[#A17F5A] hover:bg-[#8e6f4e] text-white mt-4 font-medium shadow-md"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    currentConfig.buttonText
                  )}
                </Button>
              </div>
            )}

            <div className="text-center text-sm text-gray-500 mt-6">
              Already have an account? <button onClick={() => navigate(`/${selectedRole}/login`)} className="text-[#A17F5A] font-medium hover:underline">Sign In</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


