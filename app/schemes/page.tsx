import Header from "@/app/components/Header";
import { supabase } from "@/lib/supabase";
import SchemesPageClient from "@/app/components/SchemesPageClient";

export default async function SchemesPage() {
  const { data: schemes, error } = await supabase
    .from("schemes")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-gray-50 px-6 py-10">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold text-red-600">
              Unable to load schemes
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Please try again later.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">

          {/* Page Header */}
          <div>
            <p className="text-sm font-semibold text-green-700">
              AGRIME SUPPORT
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Government Schemes
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500">
              Discover government schemes and support programs available
              for farmers.
            </p>
          </div>

          <SchemesPageClient
            schemes={schemes || []}
          />

        </div>
      </main>
    </>
  );
}