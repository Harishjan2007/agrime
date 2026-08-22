import Header from "./components/Header";
import Hero from "./components/Hero";
import CropPriceCard from "./components/CropPriceCard";
import PredictionCard from "./components/PredictionCard";
import QuickServices from "./components/QuickServices";
import Recommendations from "./components/Recommendations";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <Hero />

      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div>
          <p className="text-sm font-medium text-green-700">
            Vellore • Updated today
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Today&apos;s Market
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current prices for important seasonal crops.
          </p>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <CropPriceCard
            crop="Paddy"
            icon="🌾"
            price="₹2,350"
            market="Vellore"
            updated="10 mins ago"
            trend="↑ 2.4%"
          />

          <CropPriceCard
            crop="Groundnut"
            icon="🥜"
            price="₹6,200"
            market="Vellore"
            updated="15 mins ago"
            trend="↑ 1.8%"
          />
        </div>
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