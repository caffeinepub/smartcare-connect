import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Users, Shield } from 'lucide-react';

export default function LandingLogin() {
  const { login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        queryClient.clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-background to-emerald-50 dark:from-gray-900 dark:via-background dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/generated/smartcare-logo.dim_512x512.png" 
                  alt="SmartCare Connect" 
                  className="h-16 w-16"
                />
                <h1 className="text-4xl font-bold text-foreground">SmartCare Connect</h1>
              </div>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your trusted partner in post-discharge care. Monitor vitals, manage medications, 
                and stay connected with your healthcare team—all in one place.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                  <Activity className="h-6 w-6 text-teal-600 dark:text-teal-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Real-time Monitoring</h3>
                    <p className="text-sm text-muted-foreground">Track vitals and health metrics seamlessly</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Care Team Access</h3>
                    <p className="text-sm text-muted-foreground">Connect with doctors and family members</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                  <Heart className="h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Smart Reminders</h3>
                    <p className="text-sm text-muted-foreground">Never miss medications or appointments</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                  <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Emergency Support</h3>
                    <p className="text-sm text-muted-foreground">Quick SOS alerts when you need help</p>
                  </div>
                </div>
              </div>

              <img 
                src="/assets/generated/smartcare-hero.dim_1600x900.png" 
                alt="SmartCare Connect Hero" 
                className="w-full rounded-2xl shadow-2xl border border-border"
              />
            </div>

            {/* Login Card */}
            <div className="flex items-center justify-center">
              <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center space-y-2">
                  <CardTitle className="text-3xl">Welcome</CardTitle>
                  <CardDescription className="text-base">
                    Sign in to access your SmartCare dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button 
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    size="lg"
                    className="w-full text-lg h-14 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                  >
                    {isLoggingIn ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      'Sign in with Internet Identity'
                    )}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground space-y-2">
                    <p>Secure authentication powered by Internet Computer</p>
                    <p className="text-xs">No passwords. No tracking. Complete privacy.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
