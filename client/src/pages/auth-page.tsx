import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link as RouterLink } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, BarChart3, Shield, Zap, Home, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const loginSchema = insertUserSchema.pick({ username: true, password: true });
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;
type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function AuthPage() {
  const { user, login, register, isLoginLoading, isRegisterLoading, loginError, registerError } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Redirect if already authenticated
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  const onLogin = (data: LoginData) => {
    login(data);
  };

  const onRegister = (data: RegisterData) => {
    const { confirmPassword, ...userData } = data;
    register(userData);
  };

  const onForgotPassword = async (data: ForgotPasswordData) => {
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setForgotPasswordSent(true);
        toast({
          title: "Reset link sent",
          description: "Check your email for password reset instructions.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send reset email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <Link className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LinkVault</span>
            </div>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {forgotPasswordSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Check your email</h3>
                <p className="text-gray-600">
                  We've sent password reset instructions to your email address.
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordSent(false);
                    }}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Button>
                  <RouterLink href="/" className="flex-1">
                    <Button variant="ghost" className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Button>
                  </RouterLink>
                </div>
              </div>
            ) : (
              <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    {...forgotPasswordForm.register("email")}
                    placeholder="Enter your email address"
                  />
                  {forgotPasswordForm.formState.errors.email && (
                    <p className="text-sm text-red-600">{forgotPasswordForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-200">
                  Send Reset Link
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForgotPassword(false)}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <RouterLink href="/" className="flex-1">
                    <Button variant="ghost" className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Button>
                  </RouterLink>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Navigation Bar */}
      <div className="p-4 border-b bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Link className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LinkVault</span>
          </div>
          <RouterLink href="/">
            <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </RouterLink>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Column - Auth Forms */}
        <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <Link className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LinkVault</span>
            </div>
            <CardTitle>Welcome to LinkVault</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one to start shortening URLs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{loginError.message}</p>
                  </div>
                )}
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      {...loginForm.register("username")}
                      disabled={isLoginLoading}
                    />
                    {loginForm.formState.errors.username && (
                      <p className="text-sm text-red-600">{loginForm.formState.errors.username.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...loginForm.register("password")}
                      disabled={isLoginLoading}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <div className="text-right mb-4">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm p-0 h-auto text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-200"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                {registerError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{registerError.message}</p>
                  </div>
                )}
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Username</Label>
                    <Input
                      id="reg-username"
                      {...registerForm.register("username")}
                      disabled={isRegisterLoading}
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-red-600">{registerForm.formState.errors.username.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...registerForm.register("email")}
                      disabled={isRegisterLoading}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      {...registerForm.register("password")}
                      disabled={isRegisterLoading}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...registerForm.register("confirmPassword")}
                      disabled={isRegisterLoading}
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-200"
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            {/* Navigation buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex space-x-2">
                <RouterLink href="/" className="flex-1">
                  <Button variant="outline" className="w-full hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                    <Home className="h-4 w-4 mr-2" />
                    Continue as Guest
                  </Button>
                </RouterLink>
                <RouterLink href="/" className="flex-1">
                  <Button variant="ghost" className="w-full">
                    Cancel
                  </Button>
                </RouterLink>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                You can still shorten URLs without an account
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Hero Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Link className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Powerful URL Shortening Platform
          </h2>
          <p className="text-gray-600 mb-8">
            Create short, branded links with advanced analytics and premium features
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-gray-700">Advanced Analytics & Tracking</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-gray-700">Custom Aliases & Bulk Operations</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-gray-700">Secure & Reliable Platform</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
