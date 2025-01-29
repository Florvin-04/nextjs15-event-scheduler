"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomFormFields from "@/components/custom/form/CustomFormFields";
import { Button } from "@/components/ui/button";
import { signUpSchema, signUpSchemaType } from "@/schema/resgiter";
import { startTransition } from "react";
import { handleSignUpAction } from "../action";
import { toast } from "sonner"

export default function RegisterPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",

    },
  });

  const handleSubmitForm = (values: signUpSchemaType) => {
    console.log({ values });

    startTransition(async () => {
      const { error } = await handleSignUpAction(values);

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
      <h1 className="text-2xl font-bold text-center">Register</h1>
      <form className="space-y-3" onSubmit={handleSubmit(handleSubmitForm)}>
        <CustomFormFields
          placeholder="Email"
          type="text"
          name="email"
          control={control}
          error={errors.email?.message}
        />
        <CustomFormFields
          placeholder="First Name"
          type="text"
          name="firstName"
          control={control}
          error={errors.firstName?.message}
        />
        <CustomFormFields
          placeholder="Last Name"
          type="text"
          name="lastName"
          control={control}
          error={errors.lastName?.message}
        />
        <CustomFormFields
          placeholder="Password"
          type="password"
          name="password"
          control={control}
          error={errors.password?.message}

        />
        <CustomFormFields
          placeholder="Confirm Password"
          type="password"
          name="confirmPassword"
          control={control}
          error={errors.confirmPassword?.message}
        />
        <Button className="w-full" type="submit">
          Register
        </Button>
      </form>
    </div>
  );
}
