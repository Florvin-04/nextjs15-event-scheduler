import { cn } from "@/lib/utils";

type Props = {
  message: string;
  isError?: boolean;
};

export default function FormMessage({ message, isError }: Props) {
  return <p className={cn("text-sm", isError && "text-red-500")}>{message}</p>;
}
