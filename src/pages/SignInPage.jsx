import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Building2,
  Home,
  TrendingUp,
  Eye,
  EyeOff,
  Star,
  Lock as LockIcon,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import { ForgotPasswordModal } from "../components/ForgotPasswordModal";

export function SignInPage() {
  const [selectedRole, setSelectedRole] = useState(() => {
    const path = window.location.pathname;
    if (path.includes("agent/login")) return "agent";
    if (path.includes("company/login")) return "company";
    if (path.includes("buyer/login")) return "buyer";
    return "buyer";
  });

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    const newPath = `/${role}/login`;
    window.history.pushState(null, "", newPath);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes("agent/login")) setSelectedRole("agent");
      else if (path.includes("company/login")) setSelectedRole("company");
      else if (path.includes("buyer/login")) setSelectedRole("buyer");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const { login, logout } = useUser();
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const navigate = useNavigate();

  const roleConfig = {
    buyer: {
      title: "Find Your Dream Home",
      subtitle: "Welcome back to DeshRock",
      description: "Continue your property search journey with us",
      benefits: [
        "Save favorite properties",
        "Verified property listings",
        "Personalized recommendations",
      ],
      stats: [
        { number: "50K+", label: "Properties" },
        { number: "₹10Cr+", label: "Worth Listed" },
        { number: "95%", label: "Satisfaction" },
      ],
      buttonText: "Sign In to Browse Properties",
      icon: Home,
    },
    agent: {
      title: "Grow Your Real Estate Career",
      subtitle: "Welcome back to DeshRock",
      description: "Access premium tools and expand your client base",
      benefits: [
        "Advanced lead generation",
        "Client management tools",
        "Performance analytics",
      ],
      stats: [
        { number: "5K+", label: "Active Agents" },
        { number: "₹100Cr+", label: "Transactions" },
        { number: "40%", label: "Growth Rate" },
      ],
      buttonText: "Sign In as Agent",
      icon: TrendingUp,
    },
    company: {
      title: "Scale Your Real Estate Business",
      subtitle: "Welcome back to DeshRock",
      description: "Comprehensive platform for real estate companies",
      benefits: [
        "Multi-agent dashboard",
        "Bulk property management",
        "Enterprise analytics",
      ],
      stats: [
        { number: "500+", label: "Companies" },
        { number: "₹1000Cr+", label: "Portfolio" },
        { number: "98%", label: "Uptime" },
      ],
      buttonText: "Access Company Portal",
      icon: Building2,
    },
  };

  const currentConfig = roleConfig[selectedRole];
  const RoleIcon = currentConfig.icon;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(formData.identifier, formData.password);
      if (success) {
        const savedUser = localStorage.getItem("brickbroker_user");
        const userData = savedUser ? JSON.parse(savedUser) : null;

        // Normalize userType for comparison
        const userType = userData?.userType?.toLowerCase();

        // Common token setup
        const token = localStorage.getItem('accessToken');

        // Smart Redirection Logic
        if (['company', 'company_admin'].includes(userType)) {
          // Company User -> Company Panel
          localStorage.setItem('companyAccessToken', token);
          localStorage.setItem('company_user_data', savedUser);
          localStorage.setItem('company_auth', 'true');
          toast.success("Welcome to Company Portal!");
          navigate('/company');
        }
        else if (['agent'].includes(userType)) {
          // Agent -> Agent Panel
          localStorage.setItem('agentAccessToken', token);
          localStorage.setItem('agent_user_data', savedUser);
          localStorage.setItem('agent_auth', 'true');
          toast.success("Welcome to Agent Portal!");
          navigate('/agent');
        }
        else if (userType === 'company_agent') {
          // Company Agent -> content-aware redirection
          // If they explicitly chose "Company" tab, send them to Company (if they have dual access)
          // Otherwise default to Agent panel which is their primary workspace
          if (selectedRole === 'company') {
            localStorage.setItem('companyAccessToken', token);
            localStorage.setItem('company_user_data', savedUser);
            localStorage.setItem('company_auth', 'true');
            toast.success("Welcome to Company Portal!");
            navigate('/company');
          } else {
            localStorage.setItem('agentAccessToken', token);
            localStorage.setItem('agent_user_data', savedUser);
            localStorage.setItem('agent_auth', 'true');
            toast.success("Welcome to Agent Portal!");
            navigate('/agent');
          }
        }
        else if (userType === 'buyer') {
          // Buyer -> Home
          toast.success("Welcome back!");
          navigate('/');
        }
        else if (userType === 'admin') {
          // Admin -> Admin Panel (Just in case admin logs in here)
          toast.success("Welcome Admin!");
          navigate('/admin');
        }
        else {
          // Fallback for unknown roles or if userType is missing
          // If they are authenticated but role is weird, send to home
          toast.success("Welcome back!");
          navigate('/');
        }

      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mt-20 bg-gray-50">
      {/* Header Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="text-slate-700 hover:text-slate-800 bg-white shadow-sm border border-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex w-full max-w-7xl overflow-hidden rounded-[2rem] shadow-2xl bg-white min-h-[850px]">
        {/* Left Panel - Brown Theme */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#A17F5A] p-16 flex-col justify-center relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-lg mx-auto w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-8 w-fit">
              {selectedRole === "buyer" ? (
                <>🏠 <span>Buyer Portal</span></>
              ) : selectedRole === "agent" ? (
                <>📈 <span>Agent Portal</span></>
              ) : (
                <>🏢 <span>Company Portal</span></>
              )}
            </div>

            <h1 className="text-5xl font-medium text-white mb-4 leading-tight">
              {currentConfig.title}
            </h1>
            <p className="text-xl text-white/90 mb-12 font-light">
              {currentConfig.subtitle} - {currentConfig.description}
            </p>

            {/* Why Choose Us Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                Why {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}s Choose Us
              </h3>
              <div className="space-y-4">
                {currentConfig.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/90">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-white/60" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusive Access Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white/90 leading-relaxed">
                  Access exclusive property deals and get instant alerts for new listings in your area.
                </p>
              </div>
            </div>

            {/* Stats Footer */}
            <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-8">
              {currentConfig.stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-white/70 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 bg-white p-12 lg:p-24 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Role</h2>
              <p className="text-gray-500">Select how you'd like to access the platform</p>
            </div>

            {/* Role Switcher */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100 mb-8">
              {["buyer", "agent", "company"].map((role) => {
                const config = roleConfig[role];
                const Icon = config.icon;
                const isActive = selectedRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={cn(
                      "flex flex-col items-center justify-center py-4 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 mb-2", isActive ? "text-[#A17F5A]" : "text-gray-400")} />
                    <span className="capitalize">{role}</span>
                  </button>
                );
              })}
            </div>



            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-gray-900 font-medium">Email Address</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="buyer@example.com"
                  value={formData.identifier}
                  onChange={(e) => handleInputChange("identifier", e.target.value)}
                  className="h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(c) => handleInputChange("rememberMe", c)}
                    className="border-gray-300 data-[state=checked]:bg-[#A17F5A] data-[state=checked]:border-[#A17F5A]"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">Remember me</label>
                </div>
                <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm font-medium text-[#A17F5A] hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#A17F5A] hover:bg-[#8e6f4e] text-white text-base font-medium"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <RoleIcon className="h-4 w-4" />
                    {currentConfig.buttonText}
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button onClick={() => navigate(`/${selectedRole}/signup`)} className="font-medium text-[#A17F5A] hover:underline">
                Create an account
              </button>
            </div>

            {/* Bottom security/trust badge */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-start gap-3 justify-center text-gray-500 text-xs">
              <Home className="h-4 w-4 text-[#A17F5A] mt-0.5" />
              <p className="max-w-xs text-center leading-relaxed">
                Ready to find your dream home? Join thousands of satisfied homeowners.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        initialEmail={formData.identifier}
      />
    </div>
  );
}
