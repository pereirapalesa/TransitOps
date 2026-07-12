import { IdCard, Pencil, Route, Trash2, Truck } from "lucide-react";

import { Badge, type BadgeTone } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface Driver {
  name: string;
  license: string;
  vehicle: string;
  trips: number;
  status: "On Duty" | "Off Duty" | "Suspended";
}

const toneMap: Record<Driver["status"], BadgeTone> = {
  "On Duty": "success",
  "Off Duty": "muted",
  Suspended: "destructive",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function DriverCard({
  driver,
  onEdit,
  onDelete,
}: {
  driver: Driver;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Card className="flex flex-col gap-4 p-5 shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
            {initials(driver.name)}
          </div>
          <div>
            <p className="font-medium text-foreground">{driver.name}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <IdCard className="h-3.5 w-3.5" />
              {driver.license}
            </p>
          </div>
        </div>
        <Badge tone={toneMap[driver.status]}>{driver.status}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
        <div>
          <p className="mb-1 flex items-center gap-1 text-[11px] uppercase tracking-wide text-subtle">
            <Truck className="h-3.5 w-3.5" /> Vehicle
          </p>
          <p className="font-medium text-foreground">{driver.vehicle}</p>
        </div>
        <div>
          <p className="mb-1 flex items-center gap-1 text-[11px] uppercase tracking-wide text-subtle">
            <Route className="h-3.5 w-3.5" /> Trips
          </p>
          <p className="font-medium text-foreground">{driver.trips}</p>
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex items-center gap-2 border-t border-border pt-4">
          {onEdit && (
            <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
