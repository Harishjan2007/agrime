"use client";

import { useMemo, useState } from "react";
import MachineryCard from "./MachineryCard";
import MachineryBookingForm from "./MachineryBookingForm";

type Machinery = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  price_per_hour: number;
  location: string | null;
  available: boolean;
};

type MachineryPageClientProps = {
  machinery: Machinery[];
};

export default function MachineryPageClient({
  machinery,
}: MachineryPageClientProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const [selectedMachinery, setSelectedMachinery] =
    useState<Machinery | null>(null);

  const filteredMachinery = useMemo(() => {
    const query = search.toLowerCase().trim();

    return machinery.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query);

      const matchesType =
        type === "all" || item.type === type;

      return matchesSearch && matchesType;
    });
  }, [machinery, search, type]);

  return (
    <>
      {/* Search and filter */}

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">

        <h2 className="font-semibold text-gray-900">
          Find Agricultural Machinery
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Find tractors, harvesters and other machinery available
          for rental.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search machinery or location..."
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600"
          />

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600"
          >
            <option value="all">
              All Machinery
            </option>

            <option value="tractor">
              Tractor
            </option>

            <option value="paddy_harvester">
              Paddy Harvester
            </option>

            <option value="other">
              Other
            </option>
          </select>

        </div>

      </div>

      {/* Machinery cards */}

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {filteredMachinery.map((item) => (
          <MachineryCard
            key={item.id}
            name={item.name}
            type={item.type}
            description={item.description}
            pricePerHour={item.price_per_hour}
            location={item.location}
            available={item.available}
            onBook={() => setSelectedMachinery(item)}
          />
        ))}

      </div>

      {filteredMachinery.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center text-gray-500">
          No machinery found.
        </div>
      )}

      {/* Booking modal */}

      {selectedMachinery && (
        <MachineryBookingForm
          machineryId={selectedMachinery.id}
          machineryName={selectedMachinery.name}
          pricePerHour={selectedMachinery.price_per_hour}
          onClose={() => setSelectedMachinery(null)}
        />
      )}

    </>
  );
}