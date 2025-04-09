import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Lock, User, ShieldCheck } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithRole, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate("/admin/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen dashboard-content">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
        {/* Left side - Image and welcome message */}
        <div className="hidden md:block md:w-1/2 bg-primary/90">
          <div className="flex h-full flex-col items-center justify-center p-12 text-white">
            <div className="mb-6 rounded-full bg-white/10 p-6">
              <MessageSquare className="h-12 w-12" />
            </div>
            <h2 className="mb-2 text-3xl font-bold">Welcome Back</h2>
            <p className="mb-6 text-center text-white/80">
              Access your dashboard to manage your chat widget, context rules, and more.
            </p>
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-white/20 p-1">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span>Manage context rules and templates</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-white/20 p-1">
                  <User className="h-4 w-4" />
                </div>
                <span>Configure widget appearance</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-white/20 p-1">
                  <Lock className="h-4 w-4" />
                </div>
                <span>Secure admin access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 bg-card p-8">
          <Card className="w-full border-none shadow-none">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-foreground-color">
                Admin Login
              </CardTitle>
              <CardDescription className="text-center text-muted-color">
                Enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => {
                        clearError();
                        setEmail(e.target.value);
                      }}
                      required
                      className="pl-10 input-theme"
                    />
                    <div className="absolute left-3 top-3 text-muted-color">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        clearError();
                        setPassword(e.target.value);
                      }}
                      required
                      className="pl-10 input-theme"
                    />
                    <div className="absolute left-3 top-3 text-muted-color">
                      <Lock size={16} />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full button-primary-theme" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or login with mock accounts
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={async () => {
                      const success = await loginWithRole("admin");
                      if (success) navigate("/admin/dashboard");
                    }}
                    className="flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={async () => {
                      const success = await loginWithRole("user");
                      if (success) navigate("/admin/dashboard");
                    }}
                    className="flex items-center justify-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    User
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 text-center">
              <p className="text-sm text-gray-500">
                <strong>Admin:</strong> admin@example.com / admin123
              </p>
              <p className="text-sm text-gray-500">
                <strong>User:</strong> user@example.com / user123
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
