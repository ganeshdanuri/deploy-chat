import type { ReactNode, ElementType } from "react";

interface EmptyCardProps {
  icon: ElementType;
  title: string;
  message: string;
  action?: ReactNode;
}

export function EmptyCard({ icon: Icon, title, message, action }: EmptyCardProps) {
  return (
    <div className="dash-card bg-background border border-dashed border-border py-14 flex flex-col items-center text-center px-6">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <div className="text-[15px] font-semibold text-foreground">{title}</div>
      <div className="text-[13px] text-muted-foreground mt-1 max-w-xs">{message}</div>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
