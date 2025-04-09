import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Lock, User, Mail, CheckCircle } from "lucide-react";

// Define the form schema using zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    clearError();

    const success = await register(
      values.name,
      values.email,
      values.password
    );

    if (success) {
      // Redirect to login page after successful registration
      navigate("/login");
    }
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
            <h2 className="mb-2 text-3xl font-bold">Join Us Today</h2>
            <p className="mb-6 text-center text-white/80">
              Create an account to access our chat widget platform and start building your own AI assistants.
            </p>
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-white/20 p-1">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span>Customize your chat widget</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-white/20 p-1">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span>Create context-aware AI responses</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-white/20 p-1">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span>Embed on any website with ease</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Registration form */}
        <div className="w-full md:w-1/2 bg-card p-8">
          <Card className="w-full border-none shadow-none">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-foreground-color">
                Create an Account
              </CardTitle>
              <CardDescription className="text-center text-muted-color">
                Enter your details to register for ChatEmbed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              className="pl-10 input-theme"
                            />
                          </FormControl>
                          <div className="absolute left-3 top-3 text-muted-color">
                            <User size={16} />
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              {...field}
                              className="pl-10 input-theme"
                            />
                          </FormControl>
                          <div className="absolute left-3 top-3 text-muted-color">
                            <Mail size={16} />
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              className="pl-10 input-theme"
                            />
                          </FormControl>
                          <div className="absolute left-3 top-3 text-muted-color">
                            <Lock size={16} />
                          </div>
                        </div>
                        <FormDescription className="text-xs">
                          Must be at least 8 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              className="pl-10 input-theme"
                            />
                          </FormControl>
                          <div className="absolute left-3 top-3 text-muted-color">
                            <Lock size={16} />
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full button-primary-theme" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Register"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                By registering, you agree to our{" "}
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
