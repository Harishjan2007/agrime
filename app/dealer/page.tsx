"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DealerProfileForm from "@/app/components/DealerProfileForm";
import DealerCropPrices from "@/app/components/DealerCropPrices";

type Dealer = {
  id: string;
  shop_name: string;
  address: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_hours: string | null;
};

type Crop = {
  id: string;
  name: string;
};

type DealerCropPrice = {
  id: string;
  crop_id: string;
  buying_price: number;
  unit: string;
  active: boolean;
  crops: {
    name: string;
  } | null;
};

export default function DealerDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [cropPrices, setCropPrices] = useState<DealerCropPrice[]>([]);
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
            id,
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

      if (!dealerData) {
        setLoading(false);
        return;
      }

      setDealer(dealerData);

      const { data: cropData, error: cropError } =
        await supabase
          .from("crops")
          .select("id, name")
          .order("name", { ascending: true });

      if (cropError) {
        setError(cropError.message);
        setLoading(false);
        return;
      }

      setCrops(cropData || []);

      const { data: priceData, error: priceError } =
        await supabase
          .from("dealer_crop_prices")
          .select(`
            id,
            crop_id,
            buying_price,
            unit,
            active,
            crops (
              name
            )
          `)
          .eq("dealer_id", dealerData.id)
          .order("created_at", { ascending: false });

      if (priceError) {
        setError(priceError.message);
        setLoading(false);
        return;
      }

      setCropPrices(priceData || []);
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
            Unable to load dealer dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

        </div>
      </main>
    );
  }

  if (!dealer) {
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
              Create your dealer profile to start listing the crops you buy.
            </p>
          </div>

          <div className="mt-8">
            <DealerProfileForm
              existingDealer={null}
            />
          </div>

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
            Manage your dealer profile and the crops you buy from farmers.
          </p>
        </div>

        <DealerProfileForm
          existingDealer={dealer}
        />

        <DealerCropPrices
          dealerId={dealer.id}
          crops={crops}
          initialPrices={cropPrices}
        />

        <div className="mt-6 text-center">

          <Link
            href="/dealer/products"
            className="inline-block rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
          >
            📦 Manage Products
          </Link>

        </div>

      </div>

    </main>
  );
}