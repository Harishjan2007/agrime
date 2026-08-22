"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CropPriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCrop = searchParams.get("crop") || "all";

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const crop = event.target.value;

    if (crop === "all") {
      router.push("/crop-price");
    } else {
      router.push(`/crop-price?crop=${encodeURIComponent(crop)}`);
    }
  }

  return (
    <select
      value={selectedCrop}
      onChange={handleChange}
      className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600"
    >
      <option value="all">All Crops</option>
      <option value="Paddy">Paddy</option>
      <option value="Groundnut">Groundnut</option>
    </select>
  );
}