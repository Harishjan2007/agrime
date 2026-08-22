"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Profile = {
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  location: string | null;
  created_at: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(`
          name,
          email,
          phone,
          role,
          location,
          created_at
        `)
        .eq("id", user.id)
        .single();

      if (error) {
        setErrorMessage(error.message);
      } else {
        setProfile(data);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <h1 className="text-2xl font-bold text-gray-900">
            Sign In Required
          </h1>

          <p className="mt-2 text-gray-500">
            Please sign in to view your profile.
          </p>

          {errorMessage && (
            <p className="mt-4 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

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

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-2xl">

        <div className="rounded-2xl bg-white p-8 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
              👤
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.name}
              </h1>

              <p className="mt-1 text-sm capitalize text-green-700">
                {profile.role.replace("_", " ")}
              </p>
            </div>

          </div>

          <div className="mt-8 space-y-5">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Email
              </p>

              <p className="mt-1 text-gray-800">
                {profile.email || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Phone
              </p>

              <p className="mt-1 text-gray-800">
                {profile.phone || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Location
              </p>

              <p className="mt-1 text-gray-800">
                {profile.location || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Account Type
              </p>

              <p className="mt-1 capitalize text-gray-800">
                {profile.role.replace("_", " ")}
              </p>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}