import { Vehicle } from "@/types/vehicle";

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 1,  vehicle_number: "TR-001", plate_number: "MH-04-AB-1234", type: "Bus",   driver_name: "Rajan Mehta",    status: "active",      last_trip_date: "2026-07-11", mileage: 42500 },
  { id: 2,  vehicle_number: "TR-002", plate_number: "MH-04-CD-5678", type: "Truck", driver_name: "Suresh Patil",   status: "active",      last_trip_date: "2026-07-10", mileage: 88200 },
  { id: 3,  vehicle_number: "TR-003", plate_number: "MH-04-EF-9012", type: "Van",   driver_name: null,             status: "inactive",    last_trip_date: "2026-06-28", mileage: 31000 },
  { id: 4,  vehicle_number: "TR-004", plate_number: "MH-04-GH-3456", type: "Bus",   driver_name: "Amit Sharma",    status: "maintenance", last_trip_date: "2026-07-05", mileage: 67800 },
  { id: 5,  vehicle_number: "TR-005", plate_number: "MH-04-IJ-7890", type: "Truck", driver_name: "Priya Nair",     status: "active",      last_trip_date: "2026-07-12", mileage: 54300 },
  { id: 6,  vehicle_number: "TR-006", plate_number: "MH-04-KL-2345", type: "Bus",   driver_name: "Vikram Desai",   status: "active",      last_trip_date: "2026-07-09", mileage: 29100 },
  { id: 7,  vehicle_number: "TR-007", plate_number: "MH-04-MN-6789", type: "Van",   driver_name: "Kavitha Rao",    status: "inactive",    last_trip_date: "2026-07-01", mileage: 15600 },
  { id: 8,  vehicle_number: "TR-008", plate_number: "MH-04-OP-0123", type: "Truck", driver_name: null,             status: "maintenance", last_trip_date: "2026-06-20", mileage: 102400 },
  { id: 9,  vehicle_number: "TR-009", plate_number: "MH-04-QR-4567", type: "Bus",   driver_name: "Deepak Joshi",   status: "active",      last_trip_date: "2026-07-11", mileage: 73900 },
  { id: 10, vehicle_number: "TR-010", plate_number: "MH-04-ST-8901", type: "Van",   driver_name: "Sneha Kulkarni", status: "active",      last_trip_date: "2026-07-08", mileage: 41200 },
  { id: 11, vehicle_number: "TR-011", plate_number: "MH-04-UV-2346", type: "Bus",   driver_name: "Rahul Verma",    status: "maintenance", last_trip_date: "2026-07-03", mileage: 58700 },
  { id: 12, vehicle_number: "TR-012", plate_number: "MH-04-WX-6780", type: "Truck", driver_name: "Anjali Singh",   status: "active",      last_trip_date: "2026-07-12", mileage: 91500 },
];