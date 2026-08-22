"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type DealerProfileFormProps = {
  existingDealer?: {
    shop_name: string;
    address: string | null;
    phone: string | null;
    latitude: number | null;
    longitude: number | null;
    opening_hours: string | null;
  } | null;
};

export default function DealerProfileForm({
  existingDealer,
}: DealerProfileFormProps) {
  const [shopName, setShopName] = useState(
    existingDealer?.shop_name || ""
  );
  const [address, setAddress] = useState(
    existingDealer?.address || ""
  );
  const [phone, setPhone] = useState(
    existingDealer?.phone || ""
  );
  const [latitude, setLatitude] = useState(
    existingDealer?.latitude?.toString() || ""
  );
  const [longitude, setLongitude] = useState(
    existingDealer?.longitude?.toString() || ""
  );
  const [openingHours, setOpeningHours] = useState(
    existingDealer?.opening_hours || ""
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please sign in before creating a dealer profile.");
      setLoading(false);
      return;
    }

    const dealerData = {
      user_id: user.id,
      shop_name: shopName,
      address: address || null,
      phone: phone || null,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      opening_hours: openingHours || null,
    };

    const { error } = existingDealer
      ? await supabase
          .from("dealers")
          .update(dealerData)
          .eq("user_id", user.id)
      : await supabase
          .from("dealers")
          .insert(dealerData);

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setMessage(
      existingDealer
        ? "Dealer profile updated successfully!"
        : "Dealer profile created successfully!"
    );

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-900">
        {existingDealer
          ? "Update Dealer Profile"
          : "Create Dealer Profile"}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Add your shop information so farmers can find your business.
      </p>

      <div className="mt-6 space-y-5">

        <div>
          <label className="text-sm font-medium text-gray-700">
            Shop Name
          </label>

          <input
            type="text"
            required
            value={shopName}
            onChange={(event) =>
              setShopName(event.target.value)
            }
            placeholder="Example: Vellore Agro Centre"
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Address
          </label>

          <textarea
            value={address}
            onChange={(event) =>
              setAddress(event.target.value)
            }
            placeholder="Shop address"
            rows={3}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Phone
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            placeholder="Dealer phone number"
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Latitude
            </label>

            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(event) =>
                setLatitude(event.target.value)
              }
              placeholder="Example: 12.9165"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Longitude
            </label>

            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(event) =>
                setLongitude(event.target.value)
              }
              placeholder="Example: 79.1325"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Opening Hours
          </label>

          <input
            type="text"
            value={openingHours}
            onChange={(event) =>
              setOpeningHours(event.target.value)
            }
            placeholder="Example: Mon-Sat, 9 AM - 7 PM"
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

      </div>

      {message && (
        <div
          className={`mt-5 rounded-xl p-4 text-sm ${
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
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:bg-gray-300"
      >
        {loading
          ? "Saving..."
          : existingDealer
            ? "Update Dealer Profile"
            : "Create Dealer Profile"}
      </button>
    </form>
  );
}