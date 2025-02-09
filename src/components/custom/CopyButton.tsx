"use client";

import { CopyCheck, CopyIcon, CopyX } from "lucide-react";
import { useState } from "react";
import { Button, ButtonProps } from "../ui/button";

type Props = Omit<ButtonProps, "children" & "onClick"> & {
  textToCopy: string;
  isUrl?: boolean;
};

type CopyState = "idle" | "copied" | "error";

export default function CopyButton({ textToCopy, isUrl, ...props }: Props) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const handleCopy = () => {
    navigator.clipboard
      .writeText(isUrl ? `${location.origin}${textToCopy}` : textToCopy)
      .then(() => {
        setCopyState("copied");
        setTimeout(() => {
          setCopyState("idle");
        }, 2000);
      })

      .catch(() => {
        setCopyState("error");
        setTimeout(() => {
          setCopyState("idle");
        }, 2000);
      });
  };

  const renderCopyText = (copyState: CopyState) => {
    switch (copyState) {
      case "idle":
        return {
          text: "Copy",
          icon: <CopyIcon />,
        };
      case "copied":
        return {
          text: "Copied",
          icon: <CopyCheck />,
        };
      case "error":
        return {
          text: "Error",
          icon: <CopyX />,
        };
      default:
        return {
          text: "Copy",
          icon: <CopyIcon />,
        };
    }
  };

  return (
    <Button
      className="disabled:opacity-100 disabled:cursor-not-allowed"
      disabled={copyState === "copied"}
      icon={renderCopyText(copyState).icon}
      {...props}
      onClick={handleCopy}
    >
      {renderCopyText(copyState).text}
    </Button>
  );
}
