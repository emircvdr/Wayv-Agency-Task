"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LockIcon, AtSign, LogIn } from "lucide-react";
import { Login } from "@/app/api/auth";
import { useRouter } from "next/navigation";
interface Form {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState<Form>({
        email: "",
        password: "",
    });

    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            //Supabase Login auth function.
            const response = await Login(form);
            if (response) {
                router.push("/");
            }
        } catch (error) {
            console.log(error);
            setError("Invalid email or password");
        }

        // Simulate login delay
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
            <Card className="w-full max-w-[450px] border-0 shadow-xl bg-white/95 dark:bg-gray-950/90 backdrop-blur-sm">
                <CardHeader className='space-y-4 pb-6'>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full">
                        <LogIn className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-center text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription className="text-center text-sm">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="relative">
                            <AtSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={form.email}
                                onChange={handleChange}
                                className="pl-10 h-12 rounded-lg"
                                required
                            />
                        </div>

                        <div className="relative">
                            <LockIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                className="pl-10 h-12 rounded-lg"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-12 rounded-lg uppercase font-medium bg-[#034752] text-[#f9eef8] hover:bg-[#034752]/90 cursor-pointera"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>

                        {error && (
                            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
