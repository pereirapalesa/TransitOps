import { Gauge, MapPin, Pencil, Trash2, Truck } from "lucide-react";

import { Badge, type BadgeTone } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface Vehicle {
  id: string;
  type: string;
  region: string;
  odometer: string;
  status: "On Trip" | "Available" | "Dispatched" | "In Shop" | "Retired";
}

const toneMap: Record<Vehicle["status"], BadgeTone> = {
  "On Trip": "default",
  Available: "success",
  Dispatched: "default",
  "In Shop": "warning",
  Retired: "destructive",
};

export function VehicleCard({
  vehicle,
  onEdit,
  onDelete,
}: {
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="flex flex-col gap-4 p-5 shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-foreground">{vehicle.id}</p>
            <p className="text-xs text-muted-foreground">{vehicle.type}</p>
          </div>
        </div>
        <Badge tone={toneMap[vehicle.status]}>{vehicle.status}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
        <div>
          <p className="mb-1 flex items-center gap-1 text-[11px] uppercase tracking-wide text-subtle">
            <MapPin className="h-3.5 w-3.5" /> Region
          </p>
          <p className="font-medium text-foreground">{vehicle.region}</p>
        </div>
        <div>
          <p className="mb-1 flex items-center gap-1 text-[11px] uppercase tracking-wide text-subtle">
            <Gauge className="h-3.5 w-3.5" /> Odometer
          </p>
          <p className="font-medium text-foreground">{vehicle.odometer}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-4">
        <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}
