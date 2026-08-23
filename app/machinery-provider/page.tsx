"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Machinery = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  price_per_hour: number;
  location: string | null;
  available: boolean;
};

type Booking = {
  id: string;
  farmer_id: string;
  machinery_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total_amount: number;
  machinery_name: string;
  farmer_name: string;
  farmer_email: string | null;
};

export default function MachineryProviderDashboard() {
  const [user, setUser] = useState<any>(null);
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState("tractor");
  const [description, setDescription] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [location, setLocation] = useState("");

  async function loadMachinery(providerId: string) {
    const { data, error } = await supabase
      .from("machinery")
      .select(`
        id,
        name,
        type,
        description,
        price_per_hour,
        location,
        available
      `)
      .eq("provider_id", providerId)
      .order("name", { ascending: true });

    if (error) {
      setError(error.message);
      return [];
    }

    const machineryData = data || [];

    setMachinery(machineryData);

    return machineryData;
  }

  async function loadBookings(
    providerMachinery: Machinery[]
  ) {
    if (!providerMachinery.length) {
      setBookings([]);
      return;
    }

    const machineryIds = providerMachinery.map(
      (item) => item.id
    );

    const { data: bookingData, error: bookingError } =
      await supabase
        .from("machinery_bookings")
        .select(`
          id,
          farmer_id,
          machinery_id,
          booking_date,
          start_time,
          end_time,
          status,
          total_amount
        `)
        .in("machinery_id", machineryIds)
        .order("booking_date", {
          ascending: false,
        });

    if (bookingError) {
      setError(bookingError.message);
      return;
    }

    if (!bookingData || bookingData.length === 0) {
      setBookings([]);
      return;
    }

    const farmerIds = [
      ...new Set(
        bookingData.map((booking) => booking.farmer_id)
      ),
    ];

    const { data: farmers } = await supabase
      .from("profiles")
      .select("id, name, email")
      .in("id", farmerIds);

    const formattedBookings: Booking[] =
      bookingData.map((booking) => {
        const machineryItem = providerMachinery.find(
          (item) => item.id === booking.machinery_id
        );

        const farmer = farmers?.find(
          (profile) => profile.id === booking.farmer_id
        );

        return {
          id: booking.id,
          farmer_id: booking.farmer_id,
          machinery_id: booking.machinery_id,
          booking_date: booking.booking_date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          status: booking.status,
          total_amount: Number(booking.total_amount),
          machinery_name:
            machineryItem?.name || "Unknown Machinery",
          farmer_name:
            farmer?.name || "Farmer",
          farmer_email:
            farmer?.email || null,
        };
      });

    setBookings(formattedBookings);
  }

  useEffect(() => {
    async function loadProvider() {
      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } =
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

      if (profile.role !== "machinery_provider") {
        setError(
          "This account is not registered as a machinery provider."
        );
        setLoading(false);
        return;
      }

      setUser(user);

      const providerMachinery =
        await loadMachinery(user.id);

      await loadBookings(providerMachinery);

      setLoading(false);
    }

    loadProvider();
  }, []);

  async function handleAddMachinery(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!user) {
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const price = Number(pricePerHour);

    if (!name.trim()) {
      setError("Please enter the machinery name.");
      setSaving(false);
      return;
    }

    if (!price || price <= 0) {
      setError("Please enter a valid hourly price.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("machinery")
      .insert({
        provider_id: user.id,
        name: name.trim(),
        type,
        description: description.trim() || null,
        price_per_hour: price,
        location: location.trim() || null,
        available: true,
      });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setName("");
    setType("tractor");
    setDescription("");
    setPricePerHour("");
    setLocation("");

    const providerMachinery =
      await loadMachinery(user.id);

    await loadBookings(providerMachinery);

    setMessage("Machinery added successfully.");
    setSaving(false);
  }

  async function toggleAvailability(
    item: Machinery
  ) {
    setError("");
    setMessage("");

    const { error } = await supabase
      .from("machinery")
      .update({
        available: !item.available,
      })
      .eq("id", item.id)
      .eq("provider_id", user.id);

    if (error) {
      setError(error.message);
      return;
    }

    if (user) {
      const providerMachinery =
        await loadMachinery(user.id);

      await loadBookings(providerMachinery);
    }

    setMessage(
      `${item.name} is now ${
        !item.available
          ? "available"
          : "unavailable"
      }.`
    );
  }

  async function updateBookingStatus(
    bookingId: string,
    status: "accepted" | "rejected"
  ) {
    setError("");
    setMessage("");

    const { error } = await supabase
      .from("machinery_bookings")
      .update({
        status,
      })
      .eq("id", bookingId);

    if (error) {
      setError(error.message);
      return;
    }

    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status,
            }
          : booking
      )
    );

    setMessage(
      `Booking ${
        status === "accepted"
          ? "accepted"
          : "rejected"
      } successfully.`
    );
  }

  function formatDate(date: string) {
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

  function calculateHours(
    startTime: string,
    endTime: string
  ) {
    const [startHour, startMinute] =
      startTime.split(":").map(Number);

    const [endHour, endMinute] =
      endTime.split(":").map(Number);

    const start =
      startHour * 60 + startMinute;

    const end =
      endHour * 60 + endMinute;

    return (end - start) / 60;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-gray-500">
            Loading machinery provider dashboard...
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
            Machinery Provider
          </h1>

          <p className="mt-2 text-gray-500">
            Please sign in to manage your machinery.
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

  if (error && machinery.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <div className="text-4xl">
            🚜
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Provider Access Required
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error}
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

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-6xl">

        <div>
          <p className="text-sm font-semibold text-green-700">
            AGRIME MACHINERY
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Machinery Provider Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Add and manage the agricultural machinery
            you provide to farmers.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* Booking Requests */}

        <div className="mt-8">

          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Booking Requests
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review booking requests from farmers for your machinery.
              </p>
            </div>

            {pendingBookings.length > 0 && (
              <span className="w-fit rounded-full bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-700">
                {pendingBookings.length} Pending
              </span>
            )}

          </div>

          {bookings.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-white p-8 text-center shadow-sm">

              <div className="text-4xl">
                📅
              </div>

              <h3 className="mt-3 font-semibold text-gray-900">
                No booking requests
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Booking requests from farmers will appear here.
              </p>

            </div>
          ) : (
            <div className="mt-5 space-y-4">

              {bookings.map((booking) => (

                <div
                  key={booking.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >

                  <div className="flex flex-col justify-between gap-4 lg:flex-row">

                    <div>

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
                          🚜
                        </div>

                        <div>
                          <h3 className="font-bold text-gray-900">
                            {booking.machinery_name}
                          </h3>

                          <p className="text-sm text-green-700">
                            Farmer: {booking.farmer_name}
                          </p>
                        </div>

                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">

                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Booking Date
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            📅 {formatDate(booking.booking_date)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Time
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            🕐 {formatTime(booking.start_time)}
                            {" – "}
                            {formatTime(booking.end_time)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Duration
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {calculateHours(
                              booking.start_time,
                              booking.end_time
                            )}{" "}
                            hour
                            {calculateHours(
                              booking.start_time,
                              booking.end_time
                            ) !== 1
                              ? "s"
                              : ""}
                          </p>
                        </div>

                        <div className="rounded-xl bg-green-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Total Amount
                          </p>

                          <p className="mt-1 text-sm font-bold text-green-700">
                            ₹
                            {Number(
                              booking.total_amount
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>

                      </div>

                      {booking.farmer_email && (
                        <p className="mt-4 text-sm text-gray-500">
                          📧 {booking.farmer_email}
                        </p>
                      )}

                    </div>

                    <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">

                      <span
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          booking.status === "pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : booking.status === "accepted"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                        }`}
                      >
                        {booking.status === "pending"
                          ? "Pending"
                          : booking.status === "accepted"
                            ? "Accepted"
                            : "Rejected"}
                      </span>

                      {booking.status === "pending" && (
                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              updateBookingStatus(
                                booking.id,
                                "accepted"
                              )
                            }
                            className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                          >
                            Accept
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateBookingStatus(
                                booking.id,
                                "rejected"
                              )
                            }
                            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            Reject
                          </button>

                        </div>
                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* Main Provider Area */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[400px_1fr]">

          {/* Add Machinery */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              Add Machinery
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add machinery that farmers can rent.
            </p>

            <form
              onSubmit={handleAddMachinery}
              className="mt-6 space-y-4"
            >

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Machinery Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Example: John Deere Tractor"
                  required
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Type
                </label>

                <select
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value)
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-600"
                >
                  <option value="tractor">
                    Tractor
                  </option>

                  <option value="paddy_harvester">
                    Paddy Harvester
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Price per Hour
                </label>

                <input
                  type="number"
                  min="1"
                  value={pricePerHour}
                  onChange={(event) =>
                    setPricePerHour(event.target.value)
                  }
                  placeholder="₹500"
                  required
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Location
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="Example: Vellore, Tamil Nadu"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe the machinery..."
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:bg-gray-300"
              >
                {saving
                  ? "Adding..."
                  : "Add Machinery"}
              </button>

            </form>

          </div>

          {/* My Machinery */}

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              My Machinery
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Machinery currently registered under your account.
            </p>

            {machinery.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">

                <div className="text-4xl">
                  🚜
                </div>

                <p className="mt-3 text-gray-500">
                  You haven't added any machinery yet.
                </p>

              </div>
            ) : (
              <div className="mt-6 space-y-4">

                {machinery.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                      <div>

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
                            🚜
                          </div>

                          <div>
                            <h3 className="font-bold text-gray-900">
                              {item.name}
                            </h3>

                            <p className="text-sm capitalize text-green-700">
                              {item.type.replace("_", " ")}
                            </p>
                          </div>

                        </div>

                        {item.description && (
                          <p className="mt-4 text-sm text-gray-500">
                            {item.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-3 text-sm">

                          <span className="rounded-lg bg-gray-50 px-3 py-2">
                            ₹
                            {Number(
                              item.price_per_hour
                            ).toLocaleString("en-IN")}
                            /hour
                          </span>

                          {item.location && (
                            <span className="rounded-lg bg-gray-50 px-3 py-2">
                              📍 {item.location}
                            </span>
                          )}

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          toggleAvailability(item)
                        }
                        className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                          item.available
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {item.available
                          ? "● Available"
                          : "○ Unavailable"}
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}