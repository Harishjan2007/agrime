"use client";

import { useState } from "react";

const predictions = {
  Paddy: {
    current: "₹2,350",
    predicted: "₹2,400 – ₹2,480",
    trend: "Increasing",
  },
  Groundnut: {
    current: "₹6,200",
    predicted: "₹6,350 – ₹6,500",
    trend: "Increasing",
  },
};

export default function PredictionCard() {
  const [selectedCrop, setSelectedCrop] =
    useState<keyof typeof predictions>("Paddy");

  const data = predictions[selectedCrop];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-green-700">AI Powered</p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Crop Price Prediction
          </h2>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1">
          {(["Paddy", "Groundnut"] as const).map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                selectedCrop === crop
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {data.current}
          </p>
          <p className="text-sm text-gray-500">per quintal</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Predicted Range</p>
          <p className="mt-2 text-2xl font-bold text-green-700">
            {data.predicted}
          </p>
          <p className="text-sm text-gray-500">next 7 days</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Expected Trend</p>
          <p className="mt-2 text-2xl font-bold text-green-700">
            ↑ {data.trend}
          </p>
          <p className="text-sm text-gray-500">AI estimate</p>
        </div>
      </div>

      <div className="mt-7 rounded-lg bg-green-50 p-5">
        <div className="flex h-32 items-end gap-2">
          {[35, 48, 42, 60, 54, 72, 66, 82, 90].map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t bg-green-600"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>Past</span>
          <span>Today</span>
          <span>Predicted</span>
        </div>
      </div>

      <button className="mt-5 text-sm font-semibold text-green-700 hover:text-green-800">
        View detailed prediction →
      </button>
    </section>
  );
}