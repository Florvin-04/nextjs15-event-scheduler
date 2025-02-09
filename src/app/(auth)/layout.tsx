import { validateUserSession } from "@/auth";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, redirect } = await validateUserSession();

  if (user) {
    return redirect("/");
  }

  return (
    <div className="flex justify-center items-center h-screen">{children}</div>
  );
}
