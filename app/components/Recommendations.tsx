const recommendations = [
  {
    category: "Agricultural Product",
    title: "Quality Paddy Seeds",
    description: "Suitable varieties for the current season.",
    icon: "🌾",
  },
  {
    category: "Government Scheme",
    title: "Farmer Support Scheme",
    description: "Check eligibility and available benefits.",
    icon: "🏛️",
  },
  {
    category: "Farm Service",
    title: "Paddy Harvester",
    description: "Find available harvesters near your location.",
    icon: "🚜",
  },
];

export default function Recommendations() {
  return (
    <section className="mt-10 pb-12">
      <p className="text-sm font-medium text-green-700">Personalized</p>

      <h2 className="mt-1 text-2xl font-bold text-gray-900">
        Recommended for You
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {recommendations.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-50 text-2xl">
                {item.icon}
              </div>

              <div>
                <p className="text-xs font-medium text-green-700">
                  {item.category}
                </p>

                <h3 className="mt-1 font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}