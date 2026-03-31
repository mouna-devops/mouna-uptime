"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

export function SubmitButton({ 
  children, 
  className = "w-full" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  
  return (
    <Button className={className} type="submit" disabled={pending}>
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
