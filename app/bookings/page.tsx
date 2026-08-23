"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import { supabase } from "@/lib/supabase";

type Booking = {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total_amount: number | null;
  machinery: {
    name: string;
    type: string;
    location: string | null;
  } | null;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadBookings() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Please sign in to view your bookings.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("machinery_bookings")
        .select(`
          id,
          booking_date,
          start_time,
          end_time,
          status,
          total_amount,
          machinery (
            name,
            type,
            location
          )
        `)
        .eq("farmer_id", user.id)
        .order("booking_date", { ascending: false });

      if (error) {
        setMessage(error.message);
      } else {
        setBookings(
          (data as unknown as Booking[]) || []
        );
      }

      setLoading(false);
    }

    loadBookings();
  }, []);

  function getStatusStyle(status: string) {
    switch (status) {
      case "accepted":
        return "bg-green-50 text-green-700";

      case "rejected":
        return "bg-red-50 text-red-600";

      case "completed":
        return "bg-blue-50 text-blue-700";

      case "cancelled":
        return "bg-red-50 text-red-600";

      default:
        return "bg-yellow-50 text-yellow-700";
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "accepted":
        return "Accepted";

      case "rejected":
        return "Rejected";

      case "completed":
        return "Completed";

      case "cancelled":
        return "Cancelled";

      case "pending":
        return "Pending";

      default:
        return status;
    }
  }

  function formatTime(time: string) {
    const [hour, minute] = time
      .split(":")
      .map(Number);

    const date = new Date();

    date.setHours(hour);
    date.setMinutes(minute);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-gray-50 px-6 py-10">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-gray-500">
              Loading your bookings...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (message) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-gray-50 px-6 py-10">
          <div className="mx-auto max-w-md">

            <Link
              href="/machinery"
              className="text-sm font-medium text-green-700 hover:underline"
            >
              ← Back to Machinery
            </Link>

            <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">

              <h1 className="text-2xl font-bold text-gray-900">
                My Bookings
              </h1>

              <p className="mt-3 text-gray-500">
                {message}
              </p>

              <Link
                href="/login"
                className="mt-6 inline-block rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
              >
                Sign In
              </Link>

            </div>

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

          {/* Back to Machinery */}

          <Link
            href="/machinery"
            className="inline-block text-sm font-medium text-green-700 hover:underline"
          >
            ← Back to Machinery
          </Link>

          <div className="mt-6">

            <p className="text-sm font-semibold text-green-700">
              AGRIME
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              My Bookings
            </h1>

            <p className="mt-2 text-gray-500">
              View and track your agricultural machinery bookings.
            </p>

          </div>

          {bookings.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">

              <div className="text-5xl">
                🚜
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                No bookings yet
              </h2>

              <p className="mt-2 text-gray-500">
                You haven't booked any agricultural machinery yet.
              </p>

              <Link
                href="/machinery"
                className="mt-6 inline-block rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
              >
                Browse Machinery
              </Link>

            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">

              {bookings.map((booking) => (

                <div
                  key={booking.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
                        🚜
                      </div>

                      <div>
                        <h2 className="font-bold text-gray-900">
                          {booking.machinery?.name ||
                            "Machinery"}
                        </h2>

                        <p className="mt-1 text-sm capitalize text-green-700">
                          {booking.machinery?.type?.replace(
                            "_",
                            " "
                          )}
                        </p>
                      </div>

                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>

                  </div>

                  <div className="mt-6 space-y-4">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Booking Date
                      </p>

                      <p className="mt-1 text-gray-800">
                        {new Date(
                          `${booking.booking_date}T00:00:00`
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Time
                      </p>

                      <p className="mt-1 text-gray-800">
                        {formatTime(booking.start_time)}
                        {" – "}
                        {formatTime(booking.end_time)}
                      </p>
                    </div>

                    {booking.machinery?.location && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Location
                        </p>

                        <p className="mt-1 text-gray-800">
                          📍 {booking.machinery.location}
                        </p>
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-4">

                      <div className="flex items-center justify-between">

                        <span className="text-sm text-gray-500">
                          Total Amount
                        </span>

                        <span className="text-xl font-bold text-green-700">
                          ₹
                          {Number(
                            booking.total_amount || 0
                          ).toLocaleString("en-IN")}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </main>
    </>
  );
}