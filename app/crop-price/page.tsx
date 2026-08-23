import Header from "@/app/components/Header";
import { supabase } from "@/lib/supabase";
import CropPricePageClient from "@/app/components/CropPricePageClient";

export default async function CropPricePage() {
  const { data: cropPrices, error } = await supabase
    .from("crop_prices")
    .select(`
      id,
      price,
      unit,
      recorded_at,
      source,
      crops (
        name
      ),
      markets (
        name,
        location,
        latitude,
        longitude
      )
    `)
    .order("price", { ascending: false });

  if (error) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-gray-50 px-6 py-10">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold text-red-600">
              Unable to load crop prices
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

          {/* Page Header */}
          <div>
            <p className="text-sm font-semibold text-green-700">
              AGRIME MARKET
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Crop Prices
            </h1>

            <p className="mt-2 text-gray-500">
              Compare crop prices across agricultural markets.
            </p>
          </div>

          <CropPricePageClient
            cropPrices={cropPrices || []}
          />

        </div>
      </main>
    </>
  );
}