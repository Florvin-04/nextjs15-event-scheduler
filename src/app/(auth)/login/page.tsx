"use client";

import CustomFormFields from "@/components/custom/form/CustomFormFields";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "required field"),
  password: z
    .string()
    .trim()
    .min(1, "required field")
    .superRefine((val, ctx) => {
      if (!/[A-Z]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one uppercase letter",
        });
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one special character",
        });
      }
    }),
});

export type FormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",

      username: "",
    },
  });

  const handleSubmitForm = (values: FormValues) => {
    console.log({ values });

    // startTransition(async () => {
    //   const { error } = await handleLoginAction(values);

    //   if (error) {
    //     toast.error("Something Went Wrong", {
    //       description: error,
    //       action: {
    //         label: "Undo",
    //         onClick: () => console.log("Undo"),
    //       },
    //     });
    //   }
    // });
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <form className="space-y-3" onSubmit={handleSubmit(handleSubmitForm)}>
        <CustomFormFields
          placeholder="Username"
          type="text"
          name="username"
          control={control}
          error={errors.username?.message}
        />
        <CustomFormFields
          placeholder="Password"
          type="password"
          name="password"
          control={control}
          error={errors.password?.message}
        />
        <Button className="w-full" type="submit">
          Login

        </Button>
      </form>
    </div>
  );
}
