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

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useOutlets();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      // Mock signup: directly log the user in
      login(email, name);
      toast.success(`Account created successfully! Welcome, ${name}.`);
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-accent/10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="border border-border/40 shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-[Outfit] font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center text-xs">
                Sign up to get started with Magenta Insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Shreyas Gadave"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Field>
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
                    <Button type="submit" className="w-full font-semibold">Sign up</Button>
                    <Button variant="outline" type="button" className="w-full" onClick={() => {
                      login("demo@magenta.com", "Demo User");
                      toast.success("Signed in successfully with Demo Account!");
                      navigate("/dashboard");
                    }}>
                      Sign up with Demo Account
                    </Button>
                    <FieldDescription className="text-center text-xs mt-2">
                      Already have an account?{" "}
                      <Link to="/signin" className="text-primary hover:underline font-semibold">Sign in</Link>
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
