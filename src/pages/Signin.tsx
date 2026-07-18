import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useOutlets } from "@/context/OutletContext";
import { toast } from "sonner";

export default function Signin() {
  const navigate = useNavigate();
  const { login } = useOutlets();
  const [email, setEmail] = useState("shreyasgadave777@gmail.com");
  const [password, setPassword] = useState("password123");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Mock login using the provided email
      const name = email.split("@")[0];
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      login(email, formattedName || "Shreyas Gadave");
      toast.success(`Welcome, ${formattedName || "Shreyas Gadave"}! Signed in successfully.`);
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-accent/10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="border border-border/40 shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-[Outfit] font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center text-xs">
                Sign in to your account to continue using Magenta Insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="shreyasgadave777@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        to="#"
                        className="ml-auto inline-block text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-primary"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </Field>
                  <Field className="pt-2">
                    <Button type="submit" className="w-full font-semibold">
                      Sign in
                    </Button>
                    <Button variant="outline" type="button" className="w-full" onClick={() => {
                      login("demo@magenta.com", "Demo User");
                      toast.success("Signed in successfully with Demo Account!");
                      navigate("/dashboard");
                    }}>
                      Sign in with Demo Account
                    </Button>
                    <FieldDescription className="text-center text-xs mt-2">
                      Don&apos;t have an account?{" "}
                      <Link to="/signup" className="text-primary hover:underline font-semibold">Sign up</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
