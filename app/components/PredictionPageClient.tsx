"use client";

import { useMemo, useState } from "react";

type Prediction = {
  id: string;
  current_price: number;
  predicted_min: number | null;
  predicted_max: number | null;
  trend: "increasing" | "decreasing" | "stable";
  prediction_date: string;
  prediction_period: number;
  crops: {
    name: string;
  } | null;
  markets: {
    name: string;
    location: string;
  } | null;
};

type PredictionPageClientProps = {
  predictions: Prediction[];
};

export default function PredictionPageClient({
  predictions,
}: PredictionPageClientProps) {
  const [selectedCrop, setSelectedCrop] = useState("all");

  const filteredPredictions = useMemo(() => {
    if (selectedCrop === "all") {
      return predictions;
    }

    return predictions.filter(
      (item) => item.crops?.name === selectedCrop
    );
  }, [predictions, selectedCrop]);

  return (
    <>
      {/* Filter */}
      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="font-semibold text-gray-900">
              Price Predictions
            </h2>

            <p className="text-sm text-gray-500">
              Estimated crop price trends for upcoming days.
            </p>
          </div>

          <select
            value={selectedCrop}
            onChange={(event) =>
              setSelectedCrop(event.target.value)
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600"
          >
            <option value="all">All Crops</option>
            <option value="Paddy">Paddy</option>
            <option value="Groundnut">Groundnut</option>
          </select>

        </div>
      </div>

      {/* Prediction Cards */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">

        {filteredPredictions.map((prediction) => (
          <div
            key={prediction.id}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >

            {/* Crop and Trend */}
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Crop
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {prediction.crops?.name}
                </h2>
              </div>

              <div
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  prediction.trend === "increasing"
                    ? "bg-green-50 text-green-700"
                    : prediction.trend === "decreasing"
                    ? "bg-red-50 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {prediction.trend === "increasing"
                  ? "↗ Increasing"
                  : prediction.trend === "decreasing"
                  ? "↘ Decreasing"
                  : "→ Stable"}
              </div>

            </div>

            {/* Current Price */}
            <div className="mt-6 rounded-xl bg-gray-50 p-5">

              <p className="text-sm text-gray-500">
                Current Price
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                ₹{prediction.current_price}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                per quintal
              </p>

            </div>

            {/* Predicted Range */}
            <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-5">

              <p className="text-sm text-gray-600">
                Predicted Price Range
              </p>

              <p className="mt-1 text-2xl font-bold text-green-700">
                {prediction.predicted_min !== null
                  ? `₹${prediction.predicted_min}`
                  : "—"}
                {" – "}
                {prediction.predicted_max !== null
                  ? `₹${prediction.predicted_max}`
                  : "—"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Expected range
              </p>

            </div>

            {/* Details */}
            <div className="mt-5 border-t border-gray-100 pt-5">

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Market
                </span>

                <span className="text-sm font-medium text-gray-800">
                  {prediction.markets?.name || "—"}
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-sm text-gray-500">
                  Location
                </span>

                <span className="text-sm font-medium text-gray-800">
                  {prediction.markets?.location || "—"}
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-sm text-gray-500">
                  Prediction Period
                </span>

                <span className="text-sm font-medium text-gray-800">
                  {prediction.prediction_period} days
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-sm text-gray-500">
                  Prediction Date
                </span>

                <span className="text-sm font-medium text-gray-800">
                  {new Date(
                    prediction.prediction_date
                  ).toLocaleDateString()}
                </span>
              </div>

            </div>

          </div>
        ))}

      </div>

      {filteredPredictions.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center text-gray-500">
          No predictions available for the selected crop.
        </div>
      )}
    </>
  );
}