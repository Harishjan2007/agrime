"use client";

import { useState } from "react";

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
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!bookingDate || !startTime || !endTime) {
      setMessage("Please fill in all booking details.");
      return;
    }

    if (endTime <= startTime) {
      setMessage("End time must be after start time.");
      return;
    }

    setMessage(
      `Booking request prepared for ${machineryName}.`
    );

    /*
      Actual Supabase booking insertion will be connected
      after authentication is implemented.
    */
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
                value={endTime}
                onChange={(event) =>
                  setEndTime(event.target.value)
                }
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600"
              />
            </div>

          </div>

          {message && (
            <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            Request Booking
          </button>

        </form>

        <p className="mt-4 text-xs leading-5 text-gray-400">
          You will need to sign in before the booking can be
          saved to your account.
        </p>

      </div>
    </div>
  );
}