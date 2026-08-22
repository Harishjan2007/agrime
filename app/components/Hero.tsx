export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-8">
      <div className="grid overflow-hidden rounded-2xl border border-gray-200 bg-white md:grid-cols-2">
        <div className="flex flex-col justify-center p-8 md:p-12">
          <p className="mb-3 text-sm font-semibold text-green-700">
            Welcome to AgriME
          </p>

          <h2 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            Smart decisions.
            <br />
            <span className="text-green-700">Better farming.</span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">
            Track crop prices, predict market trends, find agricultural
            products and access farm services in one place.
          </p>

          <div className="mt-7">
            <button className="rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800">
              Explore Markets →
            </button>
          </div>
        </div>

        <div className="min-h-[300px] bg-green-50">
          <img
            src="/hero-farm.jpg"
            alt="Agricultural field"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}