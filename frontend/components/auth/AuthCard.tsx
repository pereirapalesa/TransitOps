import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md border-border/80 bg-card/95 backdrop-blur-sm">
      <CardHeader>
        <div className="mb-1 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M3 12h4l2-6h6l2 6h4M6 16h12M8 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM16 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">TransitOps</span>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer ? <div className="border-t border-border px-8 py-5">{footer}</div> : null}
    </Card>
  );
}
