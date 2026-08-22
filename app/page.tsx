import Header from "./components/Header";
import Hero from "./components/Hero";
import CropPriceCard from "./components/CropPriceCard";
import PredictionCard from "./components/PredictionCard";
import QuickServices from "./components/QuickServices";
import Recommendations from "./components/Recommendations";
import { supabase } from "@/lib/supabase";

export default async function Home() {
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
        location
      )
    `)
    .order("recorded_at", { ascending: false });

  const paddyPrices =
    cropPrices?.filter((item: any) => item.crops?.name === "Paddy") || [];

  const groundnutPrices =
    cropPrices?.filter(
      (item: any) => item.crops?.name === "Groundnut"
    ) || [];

  const paddy = paddyPrices.reduce(
  (best: any, current: any) =>
    !best || current.price > best.price ? current : best,
  null
);

const groundnut = groundnutPrices.reduce(
  (best: any, current: any) =>
    !best || current.price > best.price ? current : best,
  null
);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <Hero />

      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div>
          <p className="text-sm font-medium text-green-700">
            Current Market Prices
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Today&apos;s Market
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current prices from available agricultural markets.
          </p>
        </div>

        {error ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            Unable to load crop prices.
          </div>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {paddy && (
              <CropPriceCard
                crop="Paddy"
                icon="🌾"
                price={`₹${paddy.price}`}
                market={paddy.markets?.name || "Market"}
                updated={new Date(
                  paddy.recorded_at
                ).toLocaleTimeString()}
                trend="Live"
              />
            )}

            {groundnut && (
              <CropPriceCard
                crop="Groundnut"
                icon="🥜"
                price={`₹${groundnut.price}`}
                market={groundnut.markets?.name || "Market"}
                updated={new Date(
                  groundnut.recorded_at
                ).toLocaleTimeString()}
                trend="Live"
              />
            )}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-8">
        <PredictionCard />
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <QuickServices />
        <Recommendations />
      </section>
    </main>
  );
}