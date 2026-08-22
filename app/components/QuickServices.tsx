const services = [
  {
    icon: "🛒",
    title: "E-Commerce",
    description: "Buy seeds, fertilizers and pesticides",
  },
  {
    icon: "🚜",
    title: "Machinery",
    description: "Book tractors and paddy harvesters",
  },
  {
    icon: "🏪",
    title: "Dealers",
    description: "Find nearby agricultural dealers",
  },
  {
    icon: "🏛️",
    title: "Government Schemes",
    description: "Discover schemes relevant to your farm",
  },
];

export default function QuickServices() {
  return (
    <section className="mt-10">
      <div>
        <p className="text-sm font-medium text-green-700">Services</p>

        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          Quick Services
        </h2>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <button
            key={service.title}
            className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-2xl">
              {service.icon}
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              {service.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {service.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}