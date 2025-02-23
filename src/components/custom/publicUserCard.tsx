"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type Props = {
  user: {
    id: string;
    name: string;
  };
};

export default function PublicUserCard({ user }: Props) {
  return (
    <Link href={`/book/${user.id}`}>
      <Card className="cursor-pointer">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription className="hidden">
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
