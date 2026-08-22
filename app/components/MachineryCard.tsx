type MachineryCardProps = {
  name: string;
  type: string;
  description: string | null;
  pricePerHour: number;
  location: string | null;
  available: boolean;
  onBook: () => void;
};

export default function MachineryCard({
  name,
  type,
  description,
  pricePerHour,
  location,
  available,
  onBook,
}: MachineryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
          🚜
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            available
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {available ? "Available" : "Unavailable"}
        </span>

      </div>

      <h2 className="mt-5 text-xl font-bold text-gray-900">
        {name}
      </h2>

      <p className="mt-1 text-sm capitalize text-green-700">
        {type.replace("_", " ")}
      </p>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        {description || "Agricultural machinery available for farmers."}
      </p>

      <div className="mt-5 rounded-xl bg-gray-50 p-4">

        <p className="text-xs text-gray-500">
          Rental Price
        </p>

        <p className="mt-1 text-2xl font-bold text-green-700">
          ₹{Number(pricePerHour).toLocaleString("en-IN")}
          <span className="text-sm font-normal text-gray-500">
            {" "} / hour
          </span>
        </p>

      </div>

      {location && (
        <p className="mt-4 text-sm text-gray-600">
          📍 {location}
        </p>
      )}

      <button
        type="button"
        onClick={onBook}
        disabled={!available}
        className="mt-5 w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {available ? "Book Machinery" : "Currently Unavailable"}
      </button>

    </div>
  );
}