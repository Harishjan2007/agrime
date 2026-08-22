type CropPriceCardProps = {
  crop: string;
  icon: string;
  price: string;
  market: string;
  updated: string;
  trend: string;
};

export default function CropPriceCard({
  crop,
  icon,
  price,
  market,
  updated,
  trend,
}: CropPriceCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-2xl">
            {icon}
          </div>

          <div>
            <h3 className="font-bold text-gray-900">{crop}</h3>
            <p className="text-sm text-gray-500">{market}</p>
          </div>
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          {trend}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-3xl font-bold text-gray-900">{price}</p>
        <p className="mt-1 text-sm text-gray-500">per quintal</p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
        <span>📍 {market}</span>
        <span>Updated {updated}</span>
      </div>
    </div>
  );
}