import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DealerProfileForm from "@/app/components/DealerProfileForm";

export default async function DealerDashboard() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <h1 className="text-2xl font-bold text-gray-900">
            Dealer Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Please sign in to manage your dealer profile.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-block rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
          >
            Sign In
          </Link>

        </div>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "dealer") {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <div className="text-4xl">
            👨‍🌾
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Dealer Access Required
          </h1>

          <p className="mt-2 text-gray-500">
            This area is for registered dealers. Your current
            account is a {profile?.role || "farmer"} account.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:border-green-600 hover:text-green-700"
          >
            Back to Home
          </Link>

        </div>
      </main>
    );
  }

  const { data: dealer, error } = await supabase
    .from("dealers")
    .select(`
      shop_name,
      address,
      phone,
      latitude,
      longitude,
      opening_hours
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">

          <h1 className="text-2xl font-bold text-red-600">
            Unable to load dealer profile
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

      <div className="mx-auto max-w-3xl">

        <div>
          <p className="text-sm font-semibold text-green-700">
            AGRIME BUSINESS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Dealer Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your agricultural dealer profile.
          </p>
        </div>

        <DealerProfileForm
          existingDealer={dealer}
        />

      </div>

    </main>
  );
}