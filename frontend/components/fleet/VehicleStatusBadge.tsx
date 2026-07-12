import { VehicleStatus } from "@/types/vehicle";

const config: Record<VehicleStatus, { label: string; classes: string }> = {
  active: {
    label: "Active",
    classes: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  inactive: {
    label: "Inactive",
    classes: "bg-gray-100 text-gray-600 border border-gray-200",
  },
  maintenance: {
    label: "In Maintenance",
    classes: "bg-amber-100 text-amber-700 border border-amber-200",
  },
};

interface Props {
  status: VehicleStatus;
}

export default function VehicleStatusBadge({ status }: Props) {
  const { label, classes } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}