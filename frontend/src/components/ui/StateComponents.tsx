import { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({ title, description, icon }: { title: string; description?: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-400">
        {icon || <Inbox size={20} />}
      </div>
      <p className="font-medium text-gray-700 dark:text-gray-200">{title}</p>
      {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">{description}</p>}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  accentClass?: string;
  trend?: string;
}

export function StatCard({ label, value, icon, accentClass = "bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400", trend }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 font-mono">{value}</p>
          {trend && <p className="mt-1 text-xs text-gray-400">{trend}</p>}
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentClass}`}>{icon}</div>
      </div>
    </div>
  );
}
