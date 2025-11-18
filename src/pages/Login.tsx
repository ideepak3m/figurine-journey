// src/pages/Login.tsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui/modal";

const Login = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [isResetting, setIsResetting] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                if (error.message.includes("Email not confirmed")) {
                    toast({
                        title: "Email not confirmed",
                        description: "Please check your email and confirm your account before logging in.",
                        variant: "destructive",
                    });
                } else if (error.message.includes("Invalid login credentials")) {
                    toast({
                        title: "Invalid credentials",
                        description: "The email or password you entered is incorrect.",
                        variant: "destructive",
                    });
                } else {
                    toast({
                        title: "Login failed",
                        description: error.message,
                        variant: "destructive",
                    });
                }
                setIsLoading(false);
                return;
            }

            if (data.user) {
                toast({
                    title: "Login successful",
                    description: "Welcome back!",
                });

                // Redirect to home or dashboard
                navigate("/");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            toast({
                title: "Unexpected error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsResetting(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                toast({
                    title: "Password reset failed",
                    description: error.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Password reset email sent",
                    description: "Please check your email for the password reset link.",
                });
                setShowForgotPassword(false);
                setResetEmail("");
            }
        } catch (error: any) {
            console.error("Password reset error:", error);
            toast({
                title: "Unexpected error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 py-12 flex items-center justify-center">
                <div className="container mx-auto px-4 max-w-md">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-3xl font-bold text-center">Login</CardTitle>
                            <CardDescription className="text-center">
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm">
                                <span className="text-muted-foreground">Don't have an account? </span>
                                <Link to="/custom-orders" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold">
                                    Create one here
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />

            {/* Forgot Password Modal */}
            <Modal open={showForgotPassword} onOpenChange={setShowForgotPassword}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="resetEmail">Email</Label>
                            <Input
                                id="resetEmail"
                                type="email"
                                placeholder="your@email.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setResetEmail("");
                                }}
                                disabled={isResetting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1" disabled={isResetting}>
                                {isResetting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Login;