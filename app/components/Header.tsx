"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setLoggedIn(!!user);
      setLoading(false);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoggedIn(!!session?.user);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold text-green-700">
              AgriME
            </h1>

            <p className="text-xs text-gray-500">
              Agri Made Easy
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-7 md:flex">

          <Link
            href="/"
            className="font-medium text-green-700"
          >
            Home
          </Link>

          <Link
            href="/crop-price"
            className="text-gray-700 hover:text-green-700"
          >
            Crop Prices
          </Link>

          <Link
            href="/prediction"
            className="text-gray-700 hover:text-green-700"
          >
            Prediction
          </Link>

          <Link
            href="/ecommerce"
            className="text-gray-700 hover:text-green-700"
          >
            E-Commerce
          </Link>

          <Link
            href="/dealers"
            className="text-gray-700 hover:text-green-700"
          >
            Dealers
          </Link>

          <Link
            href="/machinery"
            className="text-gray-700 hover:text-green-700"
          >
            Machinery
          </Link>

          <Link
            href="/schemes"
            className="text-gray-700 hover:text-green-700"
          >
            Schemes
          </Link>

        </nav>

        {/* Right side */}
        <div className="hidden items-center gap-4 md:flex">

          <button
            type="button"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
          >
            📍 Vellore, TN
          </button>

          <button
            type="button"
            className="text-lg"
          >
            🔔
          </button>

          {loading ? (
            <span className="text-sm text-gray-400">
              ...
            </span>
          ) : loggedIn ? (
            <div className="flex items-center gap-3">

              <Link
                href="/profile"
                className="text-sm font-medium text-gray-700 hover:text-green-700"
              >
                👤 Farmer
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-red-600"
              >
                Sign Out
              </button>

            </div>
          ) : (
            <div className="flex items-center gap-3">

              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-green-700"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
              >
                Sign Up
              </Link>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}