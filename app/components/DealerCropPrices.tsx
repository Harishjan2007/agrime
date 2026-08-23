"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Crop = {
  id: string;
  name: string;
};

type DealerCropPrice = {
  id: string;
  crop_id: string;
  buying_price: number;
  unit: string;
  active: boolean;
  crops: {
    name: string;
  } | null;
};

type DealerCropPricesProps = {
  dealerId: string;
  crops: Crop[];
  initialPrices: DealerCropPrice[];
};

export default function DealerCropPrices({
  dealerId,
  crops,
  initialPrices,
}: DealerCropPricesProps) {
  const [prices, setPrices] = useState(initialPrices);

  const [cropId, setCropId] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [unit, setUnit] = useState("quintal");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleAdd = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    if (!cropId) {
      setMessage("Please select a crop.");
      return;
    }

    if (!buyingPrice || Number(buyingPrice) < 0) {
      setMessage("Please enter a valid buying price.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("dealer_crop_prices")
      .upsert(
        {
          dealer_id: dealerId,
          crop_id: cropId,
          buying_price: Number(buyingPrice),
          unit,
          active: true,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "dealer_id,crop_id",
        }
      )
      .select(`
        id,
        crop_id,
        buying_price,
        unit,
        active,
        crops (
          name
        )
      `)
      .single();

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setPrices((current) => {
      const existing = current.find(
        (item) => item.crop_id === cropId
      );

      if (existing) {
        return current.map((item) =>
          item.crop_id === cropId ? data : item
        );
      }

      return [data, ...current];
    });

    setCropId("");
    setBuyingPrice("");
    setUnit("quintal");

    setSuccess(true);
    setMessage("Crop buying price saved successfully.");

    setLoading(false);
  };

  const handleRemove = async (priceId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this crop from your buying list?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("dealer_crop_prices")
      .delete()
      .eq("id", priceId);

    if (error) {
      setSuccess(false);
      setMessage(error.message);
      return;
    }

    setPrices((current) =>
      current.filter((item) => item.id !== priceId)
    );

    setSuccess(true);
    setMessage("Crop removed from your buying list.");
  };

  const availableCrops = crops.filter(
    (crop) =>
      !prices.some((price) => price.crop_id === crop.id)
  );

  return (
    <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

      <div>
        <p className="text-sm font-semibold text-green-700">
          CROP BUYING
        </p>

        <h2 className="mt-1 text-xl font-bold text-gray-900">
          Crops I Buy
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add the crops you purchase from farmers and the price
          you currently offer.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4"
      >
        <div className="grid gap-4 md:grid-cols-3">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Crop
            </label>

            <select
              value={cropId}
              onChange={(event) =>
                setCropId(event.target.value)
              }
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="">
                Select crop
              </option>

              {availableCrops.map((crop) => (
                <option
                  key={crop.id}
                  value={crop.id}
                >
                  {crop.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Buying Price
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={buyingPrice}
              onChange={(event) =>
                setBuyingPrice(event.target.value)
              }
              placeholder="Example: 2420"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Unit
            </label>

            <select
              value={unit}
              onChange={(event) =>
                setUnit(event.target.value)
              }
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="quintal">
                Quintal
              </option>

              <option value="kg">
                Kilogram
              </option>

              <option value="ton">
                Ton
              </option>
            </select>
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:bg-gray-300"
        >
          {loading
            ? "Saving..."
            : "Add / Update Crop"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 rounded-xl p-4 text-sm ${
            success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-6">

        <h3 className="font-semibold text-gray-900">
          Your Current Buying Prices
        </h3>

        {prices.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-6 text-center">
            <div className="text-3xl">
              🌾
            </div>

            <p className="mt-2 text-sm text-gray-500">
              You haven't added any crops yet.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">

            {prices.map((price) => (
              <div
                key={price.id}
                className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >

                <div>
                  <h4 className="font-bold text-gray-900">
                    {price.crops?.name || "Unknown Crop"}
                  </h4>

                  <p className="mt-1 text-sm text-green-700">
                    ₹
                    {Number(
                      price.buying_price
                    ).toLocaleString("en-IN")}
                    {" / "}
                    {price.unit}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleRemove(price.id)
                  }
                  className="self-start text-sm font-medium text-red-500 hover:text-red-700 sm:self-auto"
                >
                  Remove
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

    </section>
  );
}