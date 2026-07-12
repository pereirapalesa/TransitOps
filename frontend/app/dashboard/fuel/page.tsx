"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Badge,
  DataTable,
  EmptyState,
  PageHeader,
  StatRow,
  Toolbar,
  type BadgeTone,
} from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  createExpense,
  createFuelLog,
  fetchExpenses,
  fetchFuelLogs,
  fetchVehicles,
  ExpenseResponse,
  FuelLogResponse,
} from "@/lib/api/transitops";
import { useAuth } from "@/lib/auth/auth-context";

// ── Schemas ──────────────────────────────────────────────────────────────────

const fuelSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  fuel_quantity: z.string().min(1, "Quantity is required"),
  cost: z.string().min(1, "Cost is required"),
  odometer: z.string().min(1, "Odometer is required"),
  fill_date: z.string().min(1, "Date is required"),
});

const expenseSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().min(1, "Description is required"),
  expense_date: z.string().min(1, "Date is required"),
});

type FuelFormValues = z.infer<typeof fuelSchema>;
type ExpenseFormValues = z.infer<typeof expenseSchema>;

const expenseCategories = ["Fuel", "Toll", "Repair", "Maintenance", "Parking", "Other"];

// ── Sub-dialogs ───────────────────────────────────────────────────────────────

function FuelLogDialog({
  open, onClose, onSubmit,
}: { open: boolean; onClose: () => void; onSubmit: (v: FuelFormValues) => void }) {
  const { data: vehicles } = useQuery({ queryKey: ["vehicles"], queryFn: fetchVehicles, enabled: open });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FuelFormValues>({
    resolver: zodResolver(fuelSchema),
    defaultValues: { vehicle_id: "", fuel_quantity: "", cost: "", odometer: "", fill_date: "" },
  });
  const submit = handleSubmit((v) => { onSubmit(v); reset(); onClose(); });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader title="Log Fuel Fill" description="Record a fuel fill-up for a vehicle." onClose={onClose} />
      <form onSubmit={submit}>
        <DialogBody>
          <div className="space-y-1.5">
            <Label htmlFor="fuel_vehicle_id">Vehicle</Label>
            <Select id="fuel_vehicle_id" {...register("vehicle_id")} aria-invalid={!!errors.vehicle_id}>
              <option value="">Select vehicle…</option>
              {vehicles?.map((v) => <option key={v.id} value={v.id}>{v.model} ({v.registration_number})</option>)}
            </Select>
            {errors.vehicle_id && <p className="text-xs text-destructive">{errors.vehicle_id.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fuel_quantity">Fuel (L)</Label>
              <Input id="fuel_quantity" type="number" step="any" placeholder="e.g. 45" {...register("fuel_quantity")} />
              {errors.fuel_quantity && <p className="text-xs text-destructive">{errors.fuel_quantity.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fuel_cost">Cost (₹)</Label>
              <Input id="fuel_cost" type="number" step="any" placeholder="e.g. 4500" {...register("cost")} />
              {errors.cost && <p className="text-xs text-destructive">{errors.cost.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fuel_odometer">Odometer (km)</Label>
              <Input id="fuel_odometer" type="number" step="any" placeholder="e.g. 15000" {...register("odometer")} />
              {errors.odometer && <p className="text-xs text-destructive">{errors.odometer.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fill_date">Fill Date</Label>
              <Input id="fill_date" type="date" {...register("fill_date")} />
              {errors.fill_date && <p className="text-xs text-destructive">{errors.fill_date.message}</p>}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Log Fuel</Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

function ExpenseDialog({
  open, onClose, onSubmit,
}: { open: boolean; onClose: () => void; onSubmit: (v: ExpenseFormValues) => void }) {
  const { data: vehicles } = useQuery({ queryKey: ["vehicles"], queryFn: fetchVehicles, enabled: open });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { vehicle_id: "", category: "Fuel", amount: "", description: "", expense_date: "" },
  });
  const submit = handleSubmit((v) => { onSubmit(v); reset(); onClose(); });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader title="Log Expense" description="Record an operational expense for a vehicle." onClose={onClose} />
      <form onSubmit={submit}>
        <DialogBody>
          <div className="space-y-1.5">
            <Label htmlFor="exp_vehicle_id">Vehicle</Label>
            <Select id="exp_vehicle_id" {...register("vehicle_id")} aria-invalid={!!errors.vehicle_id}>
              <option value="">Select vehicle…</option>
              {vehicles?.map((v) => <option key={v.id} value={v.id}>{v.model} ({v.registration_number})</option>)}
            </Select>
            {errors.vehicle_id && <p className="text-xs text-destructive">{errors.vehicle_id.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="exp_category">Category</Label>
              <Select id="exp_category" {...register("category")}>
                {expenseCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="exp_amount">Amount (₹)</Label>
              <Input id="exp_amount" type="number" step="any" placeholder="e.g. 1200" {...register("amount")} />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="exp_description">Description</Label>
            <Input id="exp_description" placeholder="e.g. Highway toll, engine repair…" {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="exp_date">Expense Date</Label>
            <Input id="exp_date" type="date" {...register("expense_date")} />
            {errors.expense_date && <p className="text-xs text-destructive">{errors.expense_date.message}</p>}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Log Expense</Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type TabKey = "fuel" | "expenses";

export default function FuelExpensesPage() {
  const { user } = useAuth();
  const isFinancialOrFleet = user?.role?.name === "Fleet Manager" || user?.role?.name === "Financial Analyst";
  const qc = useQueryClient();

  const [tab, setTab] = useState<TabKey>("fuel");
  const [search, setSearch] = useState("");
  const [fuelOpen, setFuelOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);

  const { data: fuelLogs = [], isLoading: fuelLoading } = useQuery<FuelLogResponse[]>({
    queryKey: ["fuel-logs"],
    queryFn: fetchFuelLogs,
  });

  const { data: expenses = [], isLoading: expLoading } = useQuery<ExpenseResponse[]>({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });

  const fuelMutation = useMutation({
    mutationFn: createFuelLog,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["fuel-logs"] }); setFuelOpen(false); },
  });

  const expMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["expenses"] }); setExpenseOpen(false); },
  });

  const filteredFuel = useMemo(() =>
    fuelLogs.filter((l) => !search || String(l.vehicle_id).includes(search) || l.fill_date.includes(search)),
    [fuelLogs, search]);

  const filteredExp = useMemo(() =>
    expenses.filter((e) => !search || e.category.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase())),
    [expenses, search]);

  const totalFuelCost = useMemo(() => fuelLogs.reduce((s, l) => s + (l.cost ?? 0), 0), [fuelLogs]);
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + (e.amount ?? 0), 0), [expenses]);
  const totalFuelLitres = useMemo(() => fuelLogs.reduce((s, l) => s + (l.fuel_quantity ?? 0), 0), [fuelLogs]);

  const isLoading = fuelLoading || expLoading;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-8">
        <p className="animate-pulse font-mono text-sm text-muted-foreground">Loading fuel & expenses…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 font-sans">
      <PageHeader title="Fuel & Expenses" description="Fuel consumption, operational costs, and expense records." />

      <StatRow
        stats={[
          { label: "Total Fuel Cost", value: `₹${totalFuelCost.toLocaleString("en-IN")}`, color: "border-primary" },
          { label: "Total Fuel (L)", value: totalFuelLitres.toFixed(1), color: "border-primary" },
          { label: "Total Expenses", value: `₹${totalExpenses.toLocaleString("en-IN")}`, color: "border-primary" },
          { label: "Expense Entries", value: String(expenses.length).padStart(2, "0"), color: "border-primary" },
        ]}
      />

      {/* Tab toggle */}
      <div className="flex gap-2 border-b border-border">
        {(["fuel", "expenses"] as TabKey[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setSearch(""); }}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px capitalize ${
              tab === t
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "fuel" ? "Fuel Logs" : "Expenses"}
          </button>
        ))}
      </div>

      {tab === "fuel" && (
        <div className="space-y-4">
          <Toolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Filter by vehicle or date…"
            addLabel="Log Fuel Fill"
            onAdd={() => setFuelOpen(true)}
          />
          {filteredFuel.length === 0 ? (
            <EmptyState title="No fuel logs" description="Log the first fuel fill-up above." />
          ) : (
            <DataTable
              columns={["Vehicle ID", "Fuel (L)", "Cost (₹)", "Odometer (km)", "Date"]}
              rows={filteredFuel.map((l) => [
                l.vehicle_id,
                l.fuel_quantity,
                `₹${(l.cost ?? 0).toLocaleString("en-IN")}`,
                l.odometer,
                l.fill_date,
              ])}
            />
          )}
        </div>
      )}

      {tab === "expenses" && (
        <div className="space-y-4">
          <Toolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Filter by category or description…"
            addLabel="Log Expense"
            onAdd={() => setExpenseOpen(true)}
          />
          {filteredExp.length === 0 ? (
            <EmptyState title="No expenses" description="Log the first expense record above." />
          ) : (
            <DataTable
              columns={["Vehicle ID", "Category", "Amount", "Description", "Date"]}
              rows={filteredExp.map((e) => [
                e.vehicle_id,
                e.category,
                `₹${(e.amount ?? 0).toLocaleString("en-IN")}`,
                e.description,
                e.expense_date,
              ])}
            />
          )}
        </div>
      )}

      <FuelLogDialog
        open={fuelOpen}
        onClose={() => setFuelOpen(false)}
        onSubmit={(v) => fuelMutation.mutate({
          vehicle_id: Number(v.vehicle_id),
          fuel_quantity: parseFloat(v.fuel_quantity),
          cost: parseFloat(v.cost),
          odometer: parseFloat(v.odometer),
          fill_date: v.fill_date,
        })}
      />

      <ExpenseDialog
        open={expenseOpen}
        onClose={() => setExpenseOpen(false)}
        onSubmit={(v) => expMutation.mutate({
          vehicle_id: Number(v.vehicle_id),
          category: v.category,
          amount: parseFloat(v.amount),
          description: v.description,
          expense_date: v.expense_date,
        })}
      />
    </div>
  );
}
