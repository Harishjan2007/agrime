"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type MachineryBookingFormProps = {
  machineryId: string;
  machineryName: string;
  pricePerHour: number;
  onClose: () => void;
};

export default function MachineryBookingForm({
  machineryId,
  machineryName,
  pricePerHour,
  onClose,
}: MachineryBookingFormProps) {
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const calculateHours = () => {
    if (!startTime || !endTime) {
      return 0;
    }

    const [startHour, startMinute] = startTime
      .split(":")
      .map(Number);

    const [endHour, endMinute] = endTime
      .split(":")
      .map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    return (end - start) / 60;
  };

  const hours = calculateHours();
  const totalAmount =
    hours > 0 ? hours * Number(pricePerHour) : 0;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    if (!bookingDate || !startTime || !endTime) {
      setMessage("Please fill in all booking details.");
      return;
    }

    if (endTime <= startTime) {
      setMessage("End time must be after start time.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Please sign in before booking machinery.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
      setMessage(
        "Your farmer profile could not be found."
      );
      setLoading(false);
      return;
    }

    const { error: bookingError } = await supabase
      .from("machinery_bookings")
      .insert({
        farmer_id: profile.id,
        machinery_id: machineryId,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        status: "pending",
        total_amount: totalAmount,
      });

    if (bookingError) {
      setMessage(bookingError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setMessage(
      "Booking request submitted successfully!"
    );

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Book Machinery
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {machineryName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>

        </div>

        <div className="mt-5 rounded-xl bg-green-50 p-4">

          <p className="text-sm text-gray-600">
            Rental price
          </p>

          <p className="mt-1 text-xl font-bold text-green-700">
            ₹{Number(pricePerHour).toLocaleString("en-IN")} / hour
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-4"
        >

          <div>
            <label className="text-sm font-medium text-gray-700">
              Booking Date
            </label>

            <input
              type="date"
              required
              value={bookingDate}
              onChange={(event) =>
                setBookingDate(event.target.value)
              }
              min={new Date().toISOString().split("T")[0]}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="text-sm font-medium text-gray-700">
                Start Time
              </label>

              <input
                type="time"
                required
                value={startTime}
                onChange={(event) =>
                  setStartTime(event.target.value)
                }
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                End Time
              </label>

              <input
                type="time"
                required
                value={endTime}
                onChange={(event) =>
                  setEndTime(event.target.value)
                }
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600"
              />
            </div>

          </div>

          {hours > 0 && (
            <div className="rounded-xl bg-gray-50 p-4">

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Duration
                </span>

                <span className="font-medium text-gray-800">
                  {hours} hour{hours !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-gray-500">
                  Total Amount
                </span>

                <span className="font-bold text-green-700">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>

            </div>
          )}

          {message && (
            <div
              className={`rounded-xl p-4 text-sm ${
                success
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {loading
              ? "Submitting..."
              : success
                ? "Booking Submitted"
                : "Request Booking"}
          </button>

        </form>

      </div>

    </div>
  );
}