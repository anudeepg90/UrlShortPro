import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { SEOWrapper } from "@/components/seo-wrapper";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import NotFound from "@/pages/not-found";
import ShortUrlRedirect from "@/components/short-url-redirect";
import TermsPage from "@/pages/terms-page";
import PrivacyPage from "@/pages/privacy-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import FeaturesPage from "@/pages/features-page";
import HowItWorksPage from "@/pages/how-it-works-page";
import SitemapPage from "@/pages/sitemap-page";
import FAQPage from "@/pages/faq-page";
import DMCAPage from "@/pages/dmca-page";

function Router() {
  return (
    <SEOWrapper>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/dashboard" component={DashboardPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/features" component={FeaturesPage} />
        <Route path="/how-it-works" component={HowItWorksPage} />
        <Route path="/sitemap" component={SitemapPage} />
        <Route path="/faq" component={FAQPage} />
        <Route path="/dmca" component={DMCAPage} />
        <Route path="/:shortId" component={ShortUrlRedirect} />
        <Route component={NotFound} />
      </Switch>
    </SEOWrapper>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
