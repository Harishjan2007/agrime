import Header from "@/app/components/Header";
import { supabase } from "@/lib/supabase";
import PredictionPageClient from "@/app/components/PredictionPageClient";

export default async function PredictionPage() {
  const { data: predictions, error } = await supabase
    .from("crop_predictions")
    .select(`
      id,
      current_price,
      predicted_min,
      predicted_max,
      trend,
      prediction_date,
      prediction_period,
      crops (
        name
      ),
      markets (
        name,
        location
      )
    `)
    .order("prediction_date", { ascending: false });

  if (error) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-gray-50 px-6 py-10">
          <div className="mx-auto max-w-6xl">

            <h1 className="text-2xl font-bold text-red-600">
              Unable to load predictions
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Please try again later.
            </p>

          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">

          <div>
            <p className="text-sm font-semibold text-green-700">
              AGRIME INSIGHTS
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Crop Price Prediction
            </h1>

            <p className="mt-2 text-gray-500">
              View estimated future crop prices to help plan your
              selling decisions.
            </p>
          </div>

          <PredictionPageClient
            predictions={predictions || []}
          />

        </div>
      </main>
    </>
  );
}