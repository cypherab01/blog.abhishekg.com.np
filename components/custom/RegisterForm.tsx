"use client";

import { registerServerAction } from "@/actions/register";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, TRegisterSchema } from "@/lib/schema/register";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormLabelError from "./FormLabelError";
import { Typography } from "./Typography";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  //   https://primer.style/accessibility/toasts/ - toasts accessibility
  const [registerResult, setRegisterResult] = useState<{
    status: boolean;
    message: string;
  } | null>(null);

  const onSubmit = async (data: TRegisterSchema) => {
    const result = await registerServerAction(data);

    if (result.status) {
      toast.success(result.message);
      reset();
      setRegisterResult(result);
    } else {
      toast.error(result.message);
      setRegisterResult(result);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Register to your account</CardTitle>
            <CardDescription>
              Enter your username below to register to your account
            </CardDescription>
            <CardAction>
              <Button variant="link" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  {...register("name")}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                />
                {errors.name && errors.name.message !== undefined && (
                  <FormLabelError error={errors.name.message} />
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  {...register("username")}
                  id="username"
                  type="text"
                  placeholder="johndoe01"
                />
                {errors.username && errors.username.message !== undefined && (
                  <FormLabelError error={errors.username.message} />
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="!pa$$w0rd"
                />
                {errors.password && errors.password.message !== undefined && (
                  <FormLabelError error={errors.password.message} />
                )}
                {registerResult && (
                  <Typography
                    variant="small"
                    className={cn(
                      registerResult.status ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {registerResult.message}
                  </Typography>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
