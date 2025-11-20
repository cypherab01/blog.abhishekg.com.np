"use client";

import { loginServerAction } from "@/actions/login";
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
import { loginSchema, TLoginSchema } from "@/lib/schema/login";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormLabelError from "./FormLabelError";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: TLoginSchema) => {
    const result = await loginServerAction(data);

    if (result.status) {
      toast.success(result.message);
      reset();
      router.push("/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your username below to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link" asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
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
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
