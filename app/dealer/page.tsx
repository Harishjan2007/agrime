"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DealerProfileForm from "@/app/components/DealerProfileForm";

type Dealer = {
  shop_name: string;
  address: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_hours: string | null;
};

export default function DealerDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDealer() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select("name, role")
          .eq("id", user.id)
          .single();

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      if (profileData.role !== "dealer") {
        setLoading(false);
        return;
      }

      const { data: dealerData, error: dealerError } =
        await supabase
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

      if (dealerError) {
        setError(dealerError.message);
        setLoading(false);
        return;
      }

      setDealer(dealerData);
      setLoading(false);
    }

    loadDealer();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-gray-500">
            Loading dealer dashboard...
          </p>
        </div>
      </main>
    );
  }

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
            This area is for registered dealers.
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

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-3xl">

          <h1 className="text-2xl font-bold text-red-600">
            Unable to load dealer profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error}
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

        {dealer && (
          <div className="mt-6 text-center">

            <Link
              href="/dealer/products"
              className="inline-block rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
            >
              📦 Manage Products
            </Link>

          </div>
        )}

      </div>

    </main>
  );
}