import { LayoutGrid, List, Plus, Search } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function StatRow({
  stats,
}: {
  stats: { label: string; value: string; color?: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex flex-col justify-center border border-border border-l-4 ${stat.color ?? "border-primary"} bg-panel p-4`}
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{stat.label}</p>
          <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

export type BadgeTone = "default" | "success" | "warning" | "destructive" | "muted";

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: BadgeTone }) {
  const tones: Record<string, string> = {
    default: "bg-primary/70 text-primary-foreground",
    success: "bg-success text-white",
    warning: "bg-warning text-black",
    destructive: "bg-destructive text-white",
    muted: "bg-panel-2 text-muted-foreground",
  };
  return (
    <span className={`inline-block rounded-md px-3 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export type ViewMode = "table" | "grid";

export function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div className="flex items-center rounded-md border border-border bg-panel p-0.5">
      <button
        type="button"
        onClick={() => onChange("table")}
        aria-pressed={mode === "table"}
        className={`flex h-9 w-9 items-center justify-center rounded transition-colors ${
          mode === "table" ? "bg-panel-2 text-foreground" : "text-subtle hover:text-foreground"
        }`}
        aria-label="Table view"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-pressed={mode === "grid"}
        className={`flex h-9 w-9 items-center justify-center rounded transition-colors ${
          mode === "grid" ? "bg-panel-2 text-foreground" : "text-subtle hover:text-foreground"
        }`}
        aria-label="Card view"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters,
  viewMode,
  onViewModeChange,
  addLabel,
  onAdd,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: { label: string; value: string; options: { label: string; value: string }[]; onChange: (v: string) => void }[];
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  addLabel?: string;
  onAdd?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
            aria-label="Search"
          />
        </div>
        {filters?.map((filter) => (
          <Select
            key={filter.label}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="sm:w-44"
            aria-label={filter.label}
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {viewMode && onViewModeChange ? <ViewToggle mode={viewMode} onChange={onViewModeChange} /> : null}
        {onAdd ? (
          <Button onClick={onAdd} size="default">
            <Plus className="h-4 w-4" />
            {addLabel ?? "Add"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-panel py-16 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-panel">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border font-mono text-xs uppercase tracking-wider text-subtle">
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-medium">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm text-foreground">
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-border last:border-none">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-4">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
