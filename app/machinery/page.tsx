import { supabase } from "@/lib/supabase";
import MachineryPageClient from "@/app/components/MachineryPageClient";

export default async function MachineryPage() {
  const { data: machinery, error } = await supabase
    .from("machinery")
    .select(`
      id,
      name,
      type,
      description,
      price_per_hour,
      location,
      available
    `)
    .order("name", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">

          <h1 className="text-2xl font-bold text-red-600">
            Unable to load machinery
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error.message}
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-6xl">

        <div>
          <p className="text-sm font-semibold text-green-700">
            AGRIME SERVICES
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Agricultural Machinery
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Find tractors, harvesters and other agricultural
            machinery available for rental.
          </p>
        </div>

        <MachineryPageClient
          machinery={machinery || []}
        />

      </div>

    </main>
  );
}