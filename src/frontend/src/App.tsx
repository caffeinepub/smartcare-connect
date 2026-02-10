import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import LandingLogin from './pages/LandingLogin';
import OnboardingRole from './pages/OnboardingRole';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDetail from './pages/doctor/PatientDetail';
import FamilyDashboard from './pages/family/FamilyDashboard';
import FamilyPatientStatus from './pages/family/FamilyPatientStatus';
import HealthChat from './pages/HealthChat';
import AppHeader from './components/app/AppHeader';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} SmartCare Connect. Built with love using{' '}
          <a 
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

function RoleGate() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  if (!identity) {
    return <LandingLogin />;
  }

  if (isLoading || !isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return <OnboardingRole />;
  }

  return <Outlet />;
}

function RootComponent() {
  const { identity } = useInternetIdentity();
  
  if (!identity) {
    return <LandingLogin />;
  }
  
  return <RoleGate />;
}

const rootRoute = createRootRoute({
  component: RootComponent
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  component: AuthenticatedLayout
});

const patientRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/patient',
  component: PatientDashboard
});

const doctorRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/doctor',
  component: DoctorDashboard
});

const doctorPatientRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/doctor/patient/$patientId',
  component: PatientDetail
});

const familyRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/family',
  component: FamilyDashboard
});

const familyPatientRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/family/patient/$patientId',
  component: FamilyPatientStatus
});

const healthChatRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/health-chat',
  component: HealthChat
});

const routeTree = rootRoute.addChildren([
  authenticatedRoute.addChildren([
    patientRoute,
    doctorRoute,
    doctorPatientRoute,
    familyRoute,
    familyPatientRoute,
    healthChatRoute
  ])
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
