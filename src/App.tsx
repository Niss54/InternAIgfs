import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Internships from "./pages/Internships";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import OTPPage from "./components/auth/OTPPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import SearchInternships from "./pages/dashboard/SearchInternships";
import AppliedInternships from "./pages/dashboard/AppliedInternships";
import Interviews from "./pages/dashboard/Interviews";
import Premium from "./pages/dashboard/Premium";
import AIAssistant from "./pages/dashboard/AIAssistant";
import NetworkingHub from "./pages/dashboard/NetworkingHub";
import ReferralDashboard from "./pages/dashboard/ReferralDashboard";
import Certifications from "./pages/dashboard/Certifications";
import FreelanceGigs from "./pages/dashboard/FreelanceGigs";
import GuaranteePacks from "./pages/dashboard/GuaranteePacks";
import UpsellServices from "./pages/dashboard/UpsellServices";
import ResumeGenerator from "./pages/ResumeGenerator";
import PremiumUpgrade from "./pages/PremiumUpgrade";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import Settings from "./pages/Settings";
import HelpSupport from "./pages/HelpSupport";
import ProfileSetup from "./pages/ProfileSetup";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/admin/AdminLayout";
import MakeAdminPage from "./pages/admin/MakeAdminPage";
import PortfolioBuilder from "./pages/PortfolioBuilder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/internships" element={<Internships />} />
          <Route 
            path="/resume-generator" 
            element={
              <AuthGuard>
                <ResumeGenerator />
              </AuthGuard>
            } 
          />
          <Route 
            path="/portfolio-builder" 
            element={
              <AuthGuard>
                <PortfolioBuilder />
              </AuthGuard>
            } 
          />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route 
            path="/help-support" 
            element={
              <AuthGuard>
                <HelpSupport />
              </AuthGuard>
            } 
          />
          <Route 
            path="/profile-setup" 
            element={
              <AuthGuard>
                <ProfileSetup />
              </AuthGuard>
            } 
          />
          <Route 
            path="/login" 
            element={
              <AuthGuard requireAuth={false}>
                <LoginPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AuthGuard requireAuth={false}>
                <SignupPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/otp" 
            element={
              <AuthGuard requireAuth={false}>
                <OTPPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <AuthGuard requireAuth={false}>
                <ForgotPasswordPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <AuthGuard>
                <DashboardLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="internships" element={<Internships />} />
            <Route path="search" element={<SearchInternships />} />
            <Route path="applied" element={<AppliedInternships />} />
            <Route path="interviews" element={<Interviews />} />
            <Route path="premium" element={<Premium />} />
            <Route path="premium-upgrade" element={<PremiumUpgrade />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="networking" element={<NetworkingHub />} />
            <Route path="referrals" element={<ReferralDashboard />} />
            <Route path="about" element={<About />} />
            <Route path="certifications" element={<Certifications />} />
            <Route path="freelance" element={<FreelanceGigs />} />
            <Route path="guarantee" element={<GuaranteePacks />} />
            <Route path="services" element={<UpsellServices />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/make-admin" element={<MakeAdminPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
