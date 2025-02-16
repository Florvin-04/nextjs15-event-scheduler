import { Button } from "@/components/ui/button";

export default function GoogleSignInButton() {
  return (
    <>
      <Button asChild>
        <a href="/login/google">Sign In with Google</a>
      </Button>
    </>
  );
}
