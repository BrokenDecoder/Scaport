"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Mail } from "lucide-react";

interface CopyEmailButtonProps {
  email: string;
  className?: string;
}

export function CopyEmailButton({ email, className }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(email);
        setCopied(true);
      }
    } catch {
      // Fallback for older browsers or restricted permissions
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
      className={className ?? "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-none bg-white px-5 text-sm font-semibold text-zinc-950 active:scale-95 transition-all hover:bg-zinc-200 cursor-pointer"}
    >
      {copied ? (
        <>
          <Check className="size-4 text-emerald-600" />
          <span>Copied Address!</span>
        </>
      ) : (
        <>
          <Mail className="size-4" />
          <span>Copy Email Address</span>
          <Copy className="size-3.5 text-zinc-500 ml-1" />
        </>
      )}
    </button>
  );
}
