import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import Footer from "@/components/Footer";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({ title: "Passwords do not match", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/#/register-callback?type=standard`,
            }
        });
        setIsLoading(false);
        if (error) {
            toast({ title: "Registration failed", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Registration successful!", description: "Please check your email to confirm your account." });
            navigate("/login");
        }
    }

    return (
        <main className="flex flex-col min-h-screen items-center justify-center bg-muted">
            <div className="flex flex-col w-full max-w-md p-6 mx-auto">
                <Card>
                    <CardContent className="py-8">
                        <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>
                        <p className="mb-6 text-center text-muted-foreground text-sm">Sign up to start your journey!</p>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Registering..." : "Register"}
                            </Button>
                        </form>
                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Already have an account? </span>
                            <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold">Login here</Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </main>
    );
}
