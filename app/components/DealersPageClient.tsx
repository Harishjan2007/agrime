"use client";

import { useMemo, useState } from "react";
import DealerCard from "./DealerCard";

type Dealer = {
  id: string;
  shop_name: string;
  address: string | null;
  phone: string | null;
  opening_hours: string | null;
};

type DealersPageClientProps = {
  dealers: Dealer[];
};

export default function DealersPageClient({
  dealers,
}: DealersPageClientProps) {
  const [search, setSearch] = useState("");

  const filteredDealers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return dealers;
    }

    return dealers.filter((dealer) => {
      return (
        dealer.shop_name?.toLowerCase().includes(query) ||
        dealer.address?.toLowerCase().includes(query) ||
        dealer.phone?.toLowerCase().includes(query)
      );
    });
  }, [dealers, search]);

  return (
    <>
      {/* Search */}
      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">

        <h2 className="font-semibold text-gray-900">
          Find Agricultural Dealers
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Find nearby dealers for seeds, fertilizers, pesticides,
          equipment and other farming needs.
        </p>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search dealer or location..."
          className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600"
        />

      </div>

      {/* Dealer Cards */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">

        {filteredDealers.map((dealer) => (
          <DealerCard
            key={dealer.id}
            shopName={dealer.shop_name}
            address={dealer.address}
            phone={dealer.phone}
            openingHours={dealer.opening_hours}
          />
        ))}

      </div>

      {filteredDealers.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center text-gray-500">
          No dealers found.
        </div>
      )}
    </>
  );
}