"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DealerProductForm from "@/app/components/DealerProductForm";
import DealerProductsList from "@/app/components/DealerProductsList";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
};

export default function DealerProductsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dealer, setDealer] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUser(null);
      setLoading(false);
      return;
    }

    setUser(user);

    const { data: profileData, error: profileError } =
      await supabase
        .from("profiles")
        .select("role")
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
        .select("id, shop_name")
        .eq("user_id", user.id)
        .single();

    if (dealerError || !dealerData) {
      setError(
        "Dealer profile not found. Please create your dealer profile first."
      );
      setLoading(false);
      return;
    }

    setDealer(dealerData);

    const { data: productData, error: productError } =
      await supabase
        .from("products")
        .select(`
          id,
          name,
          category,
          description,
          price,
          stock,
          image_url
        `)
        .eq("dealer_id", dealerData.id)
        .order("created_at", { ascending: false });

    if (productError) {
      setError(productError.message);
      setLoading(false);
      return;
    }

    setProducts(productData || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-gray-500">
            Loading products...
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
            Dealer Products
          </h1>

          <p className="mt-2 text-gray-500">
            Please sign in to manage your products.
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
            Only dealer accounts can manage products.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700"
          >
            Back to Home
          </Link>

        </div>
      </main>
    );
  }

  if (!dealer) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <h1 className="text-2xl font-bold text-gray-900">
            Dealer Profile Required
          </h1>

          <p className="mt-2 text-gray-500">
            Create your dealer profile before adding products.
          </p>

          <Link
            href="/dealer"
            className="mt-6 inline-block rounded-xl bg-green-700 px-6 py-3 font-semibold text-white"
          >
            Create Dealer Profile
          </Link>

        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">

          <h1 className="text-2xl font-bold text-red-600">
            Unable to load products
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

      <div className="mx-auto max-w-6xl">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="text-sm font-semibold text-green-700">
              {dealer.shop_name}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Manage Products
            </h1>

            <p className="mt-2 text-gray-500">
              Add and manage the products available in your store.
            </p>
          </div>

          <Link
            href="/dealer"
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:border-green-600 hover:text-green-700"
          >
            ← Dealer Dashboard
          </Link>

        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[400px_1fr]">

          <DealerProductForm
            onProductAdded={loadProducts}
          />

          <div>

            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Your Products
            </h2>

            <DealerProductsList
              products={products}
            />

          </div>

        </div>

      </div>

    </main>
  );
}