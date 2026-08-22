import { supabase } from "@/lib/supabase";

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
        location
      )
    `)
    .order("price", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold text-red-600">
            Unable to load crop prices
          </h1>
        </div>
      </main>
    );
  }

  return (
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

        {/* Filter Area */}
        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="font-semibold text-gray-900">
                Market Prices
              </h2>

              <p className="text-sm text-gray-500">
                Current development data from AgriME markets
              </p>
            </div>

            <select
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
              defaultValue="all"
            >
              <option value="all">All Crops</option>
              <option value="Paddy">Paddy</option>
              <option value="Groundnut">Groundnut</option>
            </select>

          </div>
        </div>

        {/* Price Cards */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">

          {cropPrices?.map((item: any) => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Crop
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    {item.crops?.name}
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Current Price
                  </p>

                  <p className="mt-1 text-2xl font-bold text-green-700">
                    ₹{item.price}
                  </p>

                  <p className="text-xs text-gray-500">
                    / {item.unit}
                  </p>
                </div>

              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">

                <p className="text-sm font-medium text-gray-800">
                  {item.markets?.name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  📍 {item.markets?.location}
                </p>

                <p className="mt-3 text-xs text-gray-400">
                  Source: {item.source}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}