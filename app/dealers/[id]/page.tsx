import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

type DealerDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DealerDetailPage({
  params,
}: DealerDetailPageProps) {
  const { id } = await params;

  const { data: dealer, error } = await supabase
    .from("dealers")
    .select(`
      id,
      shop_name,
      address,
      phone,
      opening_hours,
      dealer_crop_prices (
        id,
        buying_price,
        unit,
        active,
        crops (
          name
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error || !dealer) {
    notFound();
  }

  const activePrices =
    dealer.dealer_crop_prices?.filter(
      (price) => price.active
    ) || [];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-4xl">

        <Link
          href="/dealers"
          className="inline-flex items-center text-sm font-medium text-green-700 hover:underline"
        >
          ← Back to Dealers
        </Link>

        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-3xl">
              🏪
            </div>

            <div>
              <p className="text-sm font-semibold text-green-700">
                AGRIME DEALER
              </p>

              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                {dealer.shop_name}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Agricultural Crop Dealer
              </p>
            </div>

          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">

            {dealer.address && (
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Address
                </p>

                <p className="mt-2 text-sm text-gray-700">
                  📍 {dealer.address}
                </p>
              </div>
            )}

            {dealer.phone && (
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Phone
                </p>

                <a
                  href={`tel:${dealer.phone}`}
                  className="mt-2 inline-block text-sm font-medium text-green-700 hover:underline"
                >
                  📞 {dealer.phone}
                </a>
              </div>
            )}

            {dealer.opening_hours && (
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Opening Hours
                </p>

                <p className="mt-2 text-sm text-gray-700">
                  🕐 {dealer.opening_hours}
                </p>
              </div>
            )}

          </div>

          <div className="mt-8 border-t border-gray-100 pt-8">

            <h2 className="text-2xl font-bold text-gray-900">
              Crops We Buy
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current prices offered by this dealer to farmers.
            </p>

            {activePrices.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-gray-200 p-8 text-center">
                <div className="text-4xl">
                  🌾
                </div>

                <p className="mt-3 text-gray-500">
                  This dealer has not listed any crops yet.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                {activePrices.map((price) => (
                  <div
                    key={price.id}
                    className="rounded-2xl border border-gray-100 bg-green-50 p-5"
                  >

                    <div className="flex items-center justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl">
                          🌾
                        </div>

                        <div>
                          <h3 className="font-bold text-gray-900">
                            {price.crops?.name || "Unknown Crop"}
                          </h3>

                          <p className="mt-1 text-xs text-gray-500">
                            Dealer buying price
                          </p>
                        </div>

                      </div>

                      <div className="text-right">

                        <p className="text-xl font-bold text-green-700">
                          ₹
                          {Number(
                            price.buying_price
                          ).toLocaleString("en-IN")}
                        </p>

                        <p className="text-xs text-gray-500">
                          / {price.unit}
                        </p>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}