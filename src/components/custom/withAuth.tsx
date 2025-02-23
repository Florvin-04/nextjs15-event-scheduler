import { validateUserSession } from "@/auth";
import { User } from "@/drizzle/schema";

type Props = {
  user: User;
};

export function withAuth<T extends Props>(
  WrappedComponent: React.ComponentType<T>,
  redirectUrl: string = "/login"
) {
  return async function AuthComponent(props: Omit<T, keyof Props>) {
    const { user, redirect } = await validateUserSession();
    if (!user) {
      redirect(redirectUrl);
    }
    return <WrappedComponent {...(props as T)} user={user} />;
  };
}
