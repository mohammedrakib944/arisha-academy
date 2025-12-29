"use client";

import { signup, login } from "@/features/auth/actions/auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signupSchema,
  loginSchema,
  type SignupFormData,
  type LoginFormData,
} from "@/features/auth/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LoginPage() {
  const router = useRouter();

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  async function onSignupSubmit(data: SignupFormData) {
    try {
      const result = await signup(data);
      if (result.success) {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
        router.push("/profile");
        router.refresh();
      } else {
        // Handle validation errors - set field-specific errors
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((err: { field: string; message: string }) => {
            signupForm.setError(err.field as any, {
              type: "manual",
              message: err.message,
            });
          });
          toast.error(result.message || "Please fix the errors in the form");
        } else {
          toast.error(result.error || "Signup failed");
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }

  async function onLoginSubmit(data: LoginFormData) {
    try {
      const result = await login(data);
      if (result.success) {
        toast.success("সফলভাবে লগইন হয়েছে!");
        router.push("/profile");
        router.refresh();
      } else {
        // Handle validation errors - set field-specific errors
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((err: { field: string; message: string }) => {
            loginForm.setError(err.field as any, {
              type: "manual",
              message: err.message,
            });
          });
          toast.error(result.message || "Please fix the errors in the form");
        } else {
          toast.error(result.error || "Login failed");
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">
                আরিশা একাডেমিতে স্বাগতম
              </CardTitle>
              <CardDescription className="text-center">
                একটি নতুন অ্যাকাউন্ট তৈরি করুন বা চালিয়ে যেতে লগইন করুন
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">লগইন</TabsTrigger>
                  <TabsTrigger value="signup">সাইন আপ</TabsTrigger>
                </TabsList>

                <TabsContent value="signup">
                  <Form {...signupForm}>
                    <form
                      onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={signupForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>নামের প্রথম অংশ</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>নামের শেষ অংশ</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={signupForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ফোন নম্বর</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                {...field}
                                placeholder="+880 বা 01XXXXXXXXX"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>পাসওয়ার্ড</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>পাসওয়ার্ড নিশ্চিত করুন</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={signupForm.formState.isSubmitting}
                      >
                        {signupForm.formState.isSubmitting
                          ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                          : "সাইন আপ"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={loginForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ফোন নম্বর</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                {...field}
                                placeholder="+880 বা 01XXXXXXXXX"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>পাসওয়ার্ড</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loginForm.formState.isSubmitting}
                      >
                        {loginForm.formState.isSubmitting
                          ? "লগইন করা হচ্ছে..."
                          : "লগইন"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
