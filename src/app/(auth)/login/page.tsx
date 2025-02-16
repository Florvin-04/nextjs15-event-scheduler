"use client";

import CustomFormFields from "@/components/custom/form/CustomFormFields";
import { Button } from "@/components/ui/button";
import { signInSchema, signInSchemaType } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { handleSignInAction } from "../action";
import { toast } from "sonner";
import GoogleSignInButton from "./GoogleSignInButton";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();

  const {
    control,

    handleSubmit,
    formState: { errors },
  } = useForm<signInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const handleSubmitForm = (values: signInSchemaType) => {
    startTransition(async () => {
      const { error } = await handleSignInAction(values);

      if (error) {
        toast.error("Something Went Wrong", {
          description: error,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
      }
    });
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <form className="space-y-3" onSubmit={handleSubmit(handleSubmitForm)}>
        <CustomFormFields
          placeholder="Email"
          type="text"
          name="email"
          control={control}
          error={errors.email?.message}
        />

        <CustomFormFields
          placeholder="Password"
          type="password"
          name="password"
          control={control}
          error={errors.password?.message}
        />
        <Button
          disabled={isPending}
          isLoading={isPending}
          className="w-full"
          type="submit"
        >
          Login
        </Button>
      </form>
      <GoogleSignInButton />
    </div>
  );
}
