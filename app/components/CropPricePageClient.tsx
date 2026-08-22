"use client";

import { useMemo, useState } from "react";

type CropPrice = {
  id: string;
  price: number;
  unit: string;
  recorded_at: string;
  source: string;
  crops: {
    name: string;
  } | null;
  markets: {
    name: string;
    location: string;
    latitude: number;
    longitude: number;
  } | null;
};

type CropPricePageClientProps = {
  cropPrices: CropPrice[];
};

function calculateDistance(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
) {
  const earthRadius = 6371;

  const latitudeDifference =
    ((latitude2 - latitude1) * Math.PI) / 180;

  const longitudeDifference =
    ((longitude2 - longitude1) * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos((latitude1 * Math.PI) / 180) *
      Math.cos((latitude2 * Math.PI) / 180) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

export default function CropPricePageClient({
  cropPrices,
}: CropPricePageClientProps) {
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [distanceFilter, setDistanceFilter] = useState("all");

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [locationMessage, setLocationMessage] = useState("");

  function getUserLocation() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Location services are not supported by this browser."
      );
      return;
    }

    setLocationMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationMessage("Your location has been detected.");
      },
      () => {
        setLocationMessage(
          "Location permission was not granted. Showing all markets."
        );
      }
    );
  }

  const filteredPrices = useMemo(() => {
    return cropPrices
      .filter((item) => {
        if (selectedCrop === "all") {
          return true;
        }

        return item.crops?.name === selectedCrop;
      })
      .map((item) => {
        if (!userLocation || !item.markets) {
          return {
            ...item,
            distance: null,
          };
        }

        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          item.markets.latitude,
          item.markets.longitude
        );

        return {
          ...item,
          distance,
        };
      })
      .filter((item) => {
        if (distanceFilter === "all" || item.distance === null) {
          return true;
        }

        if (distanceFilter === "25") {
          return item.distance <= 25;
        }

        if (distanceFilter === "50") {
          return item.distance <= 50;
        }

        if (distanceFilter === "100") {
          return item.distance <= 100;
        }

        if (distanceFilter === "100+") {
          return item.distance > 100;
        }

        return true;
      })
      .sort((a, b) => b.price - a.price);
  }, [cropPrices, selectedCrop, distanceFilter, userLocation]);

  return (
    <>
      {/* Filters */}
      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4">

          <div>
            <h2 className="font-semibold text-gray-900">
              Market Prices
            </h2>

            <p className="text-sm text-gray-500">
              Compare crop prices based on crop and distance.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">

            <select
              value={selectedCrop}
              onChange={(event) =>
                setSelectedCrop(event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600"
            >
              <option value="all">All Crops</option>
              <option value="Paddy">Paddy</option>
              <option value="Groundnut">Groundnut</option>
            </select>

            <select
              value={distanceFilter}
              onChange={(event) =>
                setDistanceFilter(event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600"
            >
              <option value="all">All Distances</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
              <option value="100">Within 100 km</option>
              <option value="100+">Outside 100 km</option>
            </select>

            <button
              type="button"
              onClick={getUserLocation}
              className="rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              📍 Use My Location
            </button>

          </div>

          {locationMessage && (
            <p className="text-sm text-gray-500">
              {locationMessage}
            </p>
          )}

        </div>
      </div>

      {/* Results */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">

        {filteredPrices.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
          >

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Crop
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {item.crops?.name}
                </h2>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Current Price
                </p>

                <p className="mt-1 text-2xl font-bold text-green-700">
                  ₹{item.price}
                </p>

                <p className="text-xs text-gray-500">
                  / {item.unit}
                </p>
              </div>

            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">

              <p className="text-sm font-medium text-gray-800">
                {item.markets?.name}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                📍 {item.markets?.location}
              </p>

              {item.distance !== null && (
                <p className="mt-2 text-sm font-medium text-green-700">
                  {item.distance.toFixed(1)} km away
                </p>
              )}

              <p className="mt-3 text-xs text-gray-400">
                Source: {item.source}
              </p>

            </div>

          </div>
        ))}

      </div>

      {filteredPrices.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center text-gray-500">
          No markets found for the selected filters.
        </div>
      )}
    </>
  );
}