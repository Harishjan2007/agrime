import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function ProfilePage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <h1 className="text-2xl font-bold text-gray-900">
            Sign In Required
          </h1>

          <p className="mt-2 text-gray-500">
            Please sign in to view your profile.
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

  const { data: profile, error } = await supabase
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

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm">

          <h1 className="text-2xl font-bold text-gray-900">
            Profile
          </h1>

          <p className="mt-3 text-gray-500">
            Your profile information is not available yet.
          </p>

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

              <p className="mt-1 capitalize text-sm text-green-700">
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
                {profile.email || user.email}
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

          </div>

        </div>

      </div>

    </main>
  );
}