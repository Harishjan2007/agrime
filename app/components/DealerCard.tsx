type DealerCropPrice = {
  id: string;
  crop_id: string;
  buying_price: number;
  unit: string;
  active: boolean;
  crops: {
    name: string;
  } | null;
};

type DealerCardProps = {
  shopName: string;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  cropPrices: DealerCropPrice[];
};

export default function DealerCard({
  shopName,
  address,
  phone,
  openingHours,
  cropPrices,
}: DealerCardProps) {
  const activePrices = cropPrices.filter(
    (price) => price.active
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-start gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-2xl">
          🏪
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {shopName}
          </h2>

          <p className="mt-1 text-sm text-green-700">
            Agricultural Crop Dealer
          </p>
        </div>

      </div>

      {address && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Address
          </p>

          <p className="mt-1 text-sm text-gray-700">
            📍 {address}
          </p>
        </div>
      )}

      {phone && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Phone
          </p>

          <a
            href={`tel:${phone}`}
            className="mt-1 inline-block text-sm font-medium text-green-700 hover:underline"
          >
            📞 {phone}
          </a>
        </div>
      )}

      {openingHours && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Opening Hours
          </p>

          <p className="mt-1 text-sm text-gray-700">
            🕐 {openingHours}
          </p>
        </div>
      )}

      {/* Crops Bought */}
      <div className="mt-6 border-t border-gray-100 pt-5">

        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
          Crops We Buy
        </h3>

        {activePrices.length === 0 ? (
          <div className="mt-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
            This dealer has not listed any crops yet.
          </div>
        ) : (
          <div className="mt-3 space-y-3">

            {activePrices.map((price) => (
              <div
                key={price.id}
                className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3"
              >

                <div className="flex items-center gap-3">

                  <div className="text-xl">
                    🌾
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {price.crops?.name || "Unknown Crop"}
                    </p>

                    <p className="text-xs text-gray-500">
                      Buying price
                    </p>
                  </div>

                </div>

                <div className="text-right">

                  <p className="font-bold text-green-700">
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
            ))}

          </div>
        )}

      </div>

      <div className="mt-5 border-t border-gray-100 pt-5">

        <button
          type="button"
          className="w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
        >
          View Dealer
        </button>

      </div>

    </div>
  );
}