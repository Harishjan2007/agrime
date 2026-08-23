import Header from "@/app/components/Header";
import { supabase } from "@/lib/supabase";
import DealersPageClient from "@/app/components/DealersPageClient";

export default async function DealersPage() {
  const { data: dealers, error } = await supabase
    .from("dealers")
    .select(`
      id,
      shop_name,
      address,
      phone,
      opening_hours,
      dealer_crop_prices (
        id,
        crop_id,
        buying_price,
        unit,
        active,
        crops (
          name
        )
      )
    `)
    .order("shop_name", { ascending: true });

  if (error) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-gray-50 px-6 py-10">
          <div className="mx-auto max-w-6xl">

            <h1 className="text-2xl font-bold text-red-600">
              Unable to load dealers
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {error.message}
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
              AGRIME SERVICES
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Agricultural Dealers
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500">
              Find agricultural dealers and see the crops they
              currently buy from farmers.
            </p>
          </div>

          <DealersPageClient
            dealers={dealers || []}
          />

        </div>

      </main>
    </>
  );
}