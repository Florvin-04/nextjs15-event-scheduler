"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function AuthLogin<T extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<T>
) {
  return function AuthComponent(props: T) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInput, setUserInput] = useState("");

    if (!isAuthenticated) {
      return (
        <form>
          <Input
            type="password"
            placeholder="Enter Admin Credentials"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
          />
          <Button
            className="mt-2"
            onClick={(e) => {
              e.preventDefault();
              if (userInput === process.env.NEXT_PUBLIC_ADMINPASS) {
                setIsAuthenticated(true);
                toast.dismiss();
                return;
              }
              setUserInput("");
              //   toast.error("Invalid Credentials", {
              //     action: {
              //       label: "Undo",
              //       onClick: () => {
              //         // toast.dismiss();
              //         // window.location.href = "/book";
              //       },
              //       children: <div>asd</div>,
              //     },
              //   });

              toast.custom(
                () => (
                  <div className="w-full bg-red-500 shadow-lg p-2 rounded-lg flex items-center justify-between border border-red-200">
                    <span className="text-white font-semibold flex-1">
                      Something went wrong!
                    </span>
                    <Button asChild>
                      <Link
                        href="/book"
                        className="underline text-sm"
                        onClick={() => toast.dismiss()}
                      >
                        Go to Book Page
                      </Link>
                    </Button>
                  </div>
                ),
                {
                  duration: Infinity, // Adjust timing as needed
                  //   position: "top-right", // Change position
                  className: "w-full",
                }
              );
            }}
          >
            Submit
          </Button>
        </form>
      );
    }

    return <WrappedComponent {...(props as T)} />;
  };
}
