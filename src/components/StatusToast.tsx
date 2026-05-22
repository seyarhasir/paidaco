"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type StatusToastProps = {
  status: string | null;
  savedText: string;
  missingText: string;
};

export function StatusToast({ status, savedText, missingText }: StatusToastProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const message = status === "saved" ? savedText : status === "missing_name" ? missingText : null;

  useEffect(() => {
    if (!status) return;

    const params = new URLSearchParams(searchParams.toString());
    if (!params.has("status")) return;

    params.delete("status");
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }, [pathname, router, searchParams, status]);

  if (!message) return null;

  return (
    <div className={`toast ${status === "missing_name" ? "toast-error" : "toast-success"}`} role="status">
      {message}
    </div>
  );
}
