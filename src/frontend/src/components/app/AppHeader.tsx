import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, MessageSquare, Home } from 'lucide-react';
import { useRoleRouting } from '../../hooks/useRoleRouting';

export default function AppHeader() {
  const { clear, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getRoleRoute } = useRoleRouting();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleGoHome = () => {
    if (userProfile?.role) {
      const route = getRoleRoute(userProfile.role);
      navigate({ to: route });
    }
  };

  const handleHealthChat = () => {
    navigate({ to: '/health-chat' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleGoHome}>
          <img 
            src="/assets/generated/smartcare-logo.dim_512x512.png" 
            alt="SmartCare Connect" 
            className="h-10 w-10"
          />
          <span className="text-xl font-bold text-foreground hidden sm:inline">SmartCare Connect</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHealthChat}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Health Q&A</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{userProfile?.name || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userProfile?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {userProfile?.role.__kind__ === 'patient' && 'Patient'}
                    {userProfile?.role.__kind__ === 'doctor' && 'Doctor'}
                    {userProfile?.role.__kind__ === 'familyMember' && 'Family Member'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleGoHome}>
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleHealthChat}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Health Q&A
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
