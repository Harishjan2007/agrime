import { supabase } from "@/lib/supabase";
import EcommercePageClient from "@/app/components/EcommercePageClient";

export default async function EcommercePage() {
  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      category,
      description,
      price,
      stock,
      image_url,
      dealers (
        shop_name
      )
    `)
    .order("name", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">

          <h1 className="text-2xl font-bold text-red-600">
            Unable to load products
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
            AGRIME MARKETPLACE
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            E-Commerce
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Find agricultural products and supplies from available
            dealers.
          </p>
        </div>

        <EcommercePageClient
          products={products || []}
        />

      </div>

    </main>
  );
}