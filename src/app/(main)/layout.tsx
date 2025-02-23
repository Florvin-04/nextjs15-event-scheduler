import Navlink from "@/components/custom/Navlink";
import { withAuth } from "@/components/custom/withAuth";
import { User } from "@/drizzle/schema";
import SessionProvider from "@/provider/Session";
import { CalendarRange, User as UserIcon } from "lucide-react";

async function MainLayout({
  children,
  user,
}: Readonly<{
  children: React.ReactNode;
  user: User;
}>) {
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
              <UserIcon />
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
        <div className="bg-red-500 mt-auto hidden">footer</div>
      </div>
    </SessionProvider>
  );
}

export default withAuth(MainLayout, "/login");
