type ProductCardProps = {
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  imageUrl: string | null;
  dealerName: string | null;
};

export default function ProductCard({
  name,
  description,
  price,
  category,
  stock,
  imageUrl,
  dealerName,
}: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-green-50 text-5xl">
          🛒
        </div>
      )}

      <div className="p-6">

        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            {name}
          </h2>

          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium capitalize text-green-700">
            {category}
          </span>
        </div>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {description || "Agricultural product for farming needs."}
        </p>

        <div className="mt-5 rounded-xl bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            Price
          </p>

          <p className="mt-1 text-2xl font-bold text-green-700">
            ₹{Number(price).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="mt-4 flex justify-between text-sm">
          <span className="text-gray-500">
            Stock
          </span>

          <span
            className={
              stock > 0
                ? "font-medium text-green-700"
                : "font-medium text-red-600"
            }
          >
            {stock > 0 ? `${stock} available` : "Out of stock"}
          </span>
        </div>

        {dealerName && (
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-gray-500">
              Dealer
            </span>

            <span className="font-medium text-gray-800">
              {dealerName}
            </span>
          </div>
        )}

        <button
          type="button"
          disabled={stock <= 0}
          className="mt-5 w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {stock > 0 ? "View Product" : "Out of Stock"}
        </button>

      </div>
    </div>
  );
}