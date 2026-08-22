"use client";

import Link from "next/link";

export default function PredictionCard() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>
          <p className="text-sm font-medium text-green-700">
            Crop Insights
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Crop Price Prediction
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Check predicted crop price ranges and market trends
            to help plan your selling decisions.
          </p>
        </div>

        <Link
          href="/prediction"
          className="inline-flex items-center justify-center rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          View Predictions →
        </Link>

      </div>
    </section>
  );
}