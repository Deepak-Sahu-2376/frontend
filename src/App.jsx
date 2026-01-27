import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Initialize Query Client with global settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes (Data remains fresh for 5 mins)
      cacheTime: 1000 * 60 * 30, // 30 minutes (Unused data stays in memory)
      refetchOnWindowFocus: false, // Don't refetch just because user clicked window
      retry: 1, // Retry failed requests once
    },
  },
});

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Contexts (Critical - Keep Static)
import { UserProvider, useUser } from './contexts/UserContext';
import { AdminProvider } from './contexts/AdminContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { AgentProvider } from './contexts/AgentContext';
import { useSessionTimeout } from './hooks/useSessionTimeout';
import { toast } from 'sonner';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));

const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const SignInPage = lazy(() => import('./pages/SignInPage').then(module => ({ default: module.SignInPage })));
const SignUpPage = lazy(() => import('./pages/SignUpPage').then(module => ({ default: module.SignUpPage })));
const Properties = lazy(() => import('./pages/Properties'));
const ProfilePage = lazy(() => import('./pages/profile/UserProfile'));
const AllProjects = lazy(() => import('./pages/AllProjects'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const PhaseDetails = lazy(() => import('./pages/PhaseDetails'));
const PropertyDetailsPage = lazy(() => import('./pages/PropertyDetails')); // Renamed for clarity vs ProjectDetails

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProperties = lazy(() => import('./pages/admin/AdminProperties'));
const AdminCreateProperty = lazy(() => import('./pages/admin/AdminCreateProperty'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminAgents = lazy(() => import('./pages/admin/AdminAgents'));
const AdminAgentRequests = lazy(() => import('./pages/admin/AdminAgentRequests'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminCompanies = lazy(() => import('./pages/admin/AdminCompanies'));
const AdminCompanyRequests = lazy(() => import('./pages/admin/AdminCompanyRequests'));
const CreateProject = lazy(() => import('./pages/admin/CreateProject'));
const CreatePhase = lazy(() => import('./pages/admin/CreatePhase'));
const AdminPendingProjects = lazy(() => import('./pages/admin/AdminPendingProjects'));
const AdminPendingProperties = lazy(() => import('./pages/admin/AdminPendingProperties'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminVisitRequests = lazy(() => import('./pages/admin/AdminVisitRequests'));
const AdminInquiries = lazy(() => import('./pages/admin/AdminInquiries'));
const AgentInquiries = lazy(() => import('./pages/agent/AgentInquiries'));
const CompanyLayout = lazy(() => import('./pages/company/CompanyLayout'));
const AgentLayout = lazy(() => import('./pages/agent/AgentLayout'));
const BuyerCreateProperty = lazy(() => import('./pages/BuyerCreateProperty'));

// Company Pages
const CompanyDashboard = lazy(() => import('./pages/company/CompanyDashboard'));
const CompanyAgents = lazy(() => import('./pages/company/CompanyAgents'));
const CompanyAgentRequests = lazy(() => import('./pages/company/CompanyAgentRequests'));
const CompanyCreateProject = lazy(() => import('./pages/company/CompanyCreateProject'));
const CompanyCreateProperty = lazy(() => import('./pages/company/CompanyCreateProperty'));
const CompanyProjects = lazy(() => import('./pages/company/CompanyProjects'));
const CompanyVisitRequests = lazy(() => import('./pages/company/CompanyVisitRequests'));
const CompanyInquiries = lazy(() => import('./pages/company/CompanyInquiries'));
const CompanyCreatePhase = lazy(() => import('./pages/company/CompanyCreatePhase'));
const CompanyPendingProperties = lazy(() => import('./pages/company/CompanyPendingProperties'));
const CompanyProperties = lazy(() => import('./pages/company/CompanyProperties'));

// Agent Pages
const AgentDashboard = lazy(() => import('./pages/agent/AgentDashboard'));
const AgentProperties = lazy(() => import('./pages/agent/AgentProperties'));
const AgentCreateProperty = lazy(() => import('./pages/agent/AgentCreateProperty'));
const AgentVisitRequests = lazy(() => import('./pages/agent/AgentVisitRequests'));

// Components
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

// ... (existing helper functions)

{/* Company Routes with Shared Provider */ }
<Route element={
  <CompanyProvider>
    <Outlet />
  </CompanyProvider>
}>
  <Route path="/company" element={<CompanyDashboard />} />
  <Route path="/company/agents" element={<CompanyAgents />} />
  <Route path="/company/agents/requests" element={<CompanyAgentRequests />} />
  <Route path="/company/projects/create" element={<CompanyCreateProject />} />
  <Route path="/company/properties/create" element={<CompanyCreateProperty />} />
  <Route path="/company/projects" element={<CompanyProjects />} />
  <Route path="/company/properties" element={<CompanyProperties />} />
  <Route path="/company/visits" element={<CompanyVisitRequests />} />
  <Route path="/company/inquiries" element={<CompanyInquiries />} />
  <Route path="/company/profile" element={
    <CompanyLayout>
      <ProfilePage />
    </CompanyLayout>
  } />
  <Route path="/company/phases/create" element={<CompanyCreatePhase />} />
  <Route path="/company/properties/pending" element={<CompanyPendingProperties />} />
</Route>

{/* Agent Routes with Shared Provider */ }
<Route element={
  <AgentProvider>
    <Outlet />
  </AgentProvider>
}>
  <Route path="/agent" element={<AgentDashboard />} />
  <Route path="/agent/properties/create" element={<AgentCreateProperty />} />
  <Route path="/agent/properties" element={<AgentProperties />} />
  <Route path="/agent/visits" element={<AgentVisitRequests />} />
  <Route path="/agent/inquiries" element={<AgentInquiries />} />
  <Route path="/agent/profile" element={
    <AgentLayout>
      <ProfilePage />
    </AgentLayout>
  } />
</Route>
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const PublicLayout = () => (
  <div className="App flex flex-col min-h-screen">
    <Navbar />
    <Outlet />
    <Footer />
  </div>
);

// Session timeout wrapper component
function SessionTimeoutWrapper({ children }) {
  const { logout, isAuthenticated } = useUser();


  useSessionTimeout(() => {
    if (isAuthenticated) {
      logout();
      toast.error('Session expired due to inactivity. Please login again.');
    }
  });

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <UserProvider>
          <SessionTimeoutWrapper>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/projects" element={<AllProjects />} />
                  <Route path="/projects/:title/:city/:id" element={<ProjectDetails />} />
                  <Route path="/projects/:id/phases/:phaseId" element={<PhaseDetails />} />
                  <Route path="/property/:title/:city/:id" element={<PropertyDetailsPage />} />

                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/buyer/post-property" element={
                    <SessionTimeoutWrapper>
                      <BuyerCreateProperty />
                    </SessionTimeoutWrapper>
                  } />
                  <Route path="/sign-in" element={<SignInPage />} />
                  <Route path="/sign-up" element={<SignUpPage />} />
                  <Route path="/buyer/signup" element={<SignUpPage />} />
                  <Route path="/agent/signup" element={<SignUpPage />} />
                  <Route path="/company/signup" element={<SignUpPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                </Route>

                {/* Auth Routes */}
                <Route path="/admin/login" element={
                  <AdminProvider>
                    <AdminLogin />
                  </AdminProvider>
                } />
                <Route path="/company/login" element={<SignInPage />} />
                <Route path="/agent/login" element={<SignInPage />} />
                <Route path="/buyer/login" element={<SignInPage />} />

                {/* Protected Admin Routes with Shared Layout and Provider */}
                <Route element={
                  <AdminProvider>
                    <ProtectedAdminRoute />
                  </AdminProvider>
                }>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/properties" element={<AdminProperties />} />
                    <Route path="/admin/properties/create" element={<AdminCreateProperty />} />
                    <Route path="/admin/properties/edit/:id" element={<AdminCreateProperty />} />
                    <Route path="/admin/properties/pending" element={<AdminPendingProperties />} />
                    <Route path="/admin/projects" element={<AdminProjects />} />
                    <Route path="/admin/projects/pending-approval" element={<AdminPendingProjects />} />
                    <Route path="/admin/projects/create" element={<CreateProject />} />
                    <Route path="/admin/projects/edit/:id" element={<CreateProject />} />
                    <Route path="/admin/phases/create" element={<CreatePhase />} />
                    <Route path="/admin/agents" element={<AdminAgents />} />
                    <Route path="/admin/agents/requests" element={<AdminAgentRequests />} />
                    <Route path="/admin/companies" element={<AdminCompanies />} />
                    <Route path="/admin/companies/requests" element={<AdminCompanyRequests />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/admin/visits" element={<AdminVisitRequests />} />
                    <Route path="/admin/inquiries" element={<AdminInquiries />} />
                    <Route path="/admin/profile" element={<ProfilePage />} />
                  </Route>
                </Route>

                {/* Company Routes with Shared Provider */}
                <Route element={
                  <CompanyProvider>
                    <Outlet />
                  </CompanyProvider>
                }>
                  <Route path="/company" element={<CompanyDashboard />} />
                  <Route path="/company/agents" element={<CompanyAgents />} />
                  <Route path="/company/agents/requests" element={<CompanyAgentRequests />} />
                  <Route path="/company/projects/create" element={<CompanyCreateProject />} />
                  <Route path="/company/properties/create" element={<CompanyCreateProperty />} />
                  <Route path="/company/projects" element={<CompanyProjects />} />
                  <Route path="/company/properties" element={<CompanyProperties />} />
                  <Route path="/company/visits" element={<CompanyVisitRequests />} />
                  <Route path="/company/inquiries" element={<CompanyInquiries />} />
                  <Route path="/company/profile" element={
                    <CompanyLayout>
                      <ProfilePage />
                    </CompanyLayout>
                  } />
                  <Route path="/company/phases/create" element={<CompanyCreatePhase />} />
                  <Route path="/company/properties/pending" element={<CompanyPendingProperties />} />
                </Route>

                {/* Agent Routes with Shared Provider */}
                <Route element={
                  <AgentProvider>
                    <Outlet />
                  </AgentProvider>
                }>
                  <Route path="/agent" element={<AgentDashboard />} />
                  <Route path="/agent/properties/create" element={<AgentCreateProperty />} />
                  <Route path="/agent/properties" element={<AgentProperties />} />
                  <Route path="/agent/visits" element={<AgentVisitRequests />} />
                  <Route path="/agent/inquiries" element={<AgentInquiries />} />
                  <Route path="/agent/profile" element={
                    <AgentLayout>
                      <ProfilePage />
                    </AgentLayout>
                  } />
                </Route>

                {/* 404 Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster position="bottom-right" richColors />
          </SessionTimeoutWrapper>
        </UserProvider>

      </BrowserRouter>
    </QueryClientProvider >
  );
}

export default App;