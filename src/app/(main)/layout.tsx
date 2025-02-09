import { redirect } from "next/navigation";
import { validateUserSession } from "@/auth";
import { CalendarRange, User } from "lucide-react";
import Navlink from "@/components/custom/Navlink";
import SessionProvider from "@/provider/Session";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateUserSession();

  if (!user) {
    return redirect("/register");
  }

  return (
    <SessionProvider value={{ user }}>
      <div className="h-full flex flex-col flex-1">
        <header className="py-4 border-b bg-card sticky top-0">
          <nav className="container flex w-full">
            <div className="mr-auto flex items-center gap-2">
              <CalendarRange />
              <span className="sr-only md:not-sr-only">Calendar</span>
            </div>

            <div className="flex items-center gap-2">
              <Navlink href="/events">Events</Navlink>
              <Navlink href="/asd">asd</Navlink>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <User />
              <span className="sr-only md:not-sr-only">User</span>
            </div>
          </nav>
        </header>

        {children}

        {/* <div className="h-full flex flex-1">
          <div className="h-full flex flex-col">
            

            {children}
          </div>
        </div> */}
        <div className="bg-red-500 mt-auto">footer</div>
      </div>
    </SessionProvider>
  );
}
