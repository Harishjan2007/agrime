"use client";

import { useMemo, useState } from "react";

type Scheme = {
  id: string;
  name: string;
  description: string | null;
  eligibility: string | null;
  benefits: string | null;
  application_url: string | null;
};

type SchemesPageClientProps = {
  schemes: Scheme[];
};

export default function SchemesPageClient({
  schemes,
}: SchemesPageClientProps) {
  const [search, setSearch] = useState("");

  const filteredSchemes = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return schemes;
    }

    return schemes.filter((scheme) => {
      return (
        scheme.name?.toLowerCase().includes(query) ||
        scheme.description?.toLowerCase().includes(query) ||
        scheme.eligibility?.toLowerCase().includes(query) ||
        scheme.benefits?.toLowerCase().includes(query)
      );
    });
  }, [schemes, search]);

  return (
    <>
      {/* Search */}
      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900">
            Find Government Schemes
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Search schemes based on your needs and eligibility.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search schemes..."
          className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600"
        />
      </div>

      {/* Scheme Cards */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-2xl">
                🌱
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {scheme.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {scheme.description || "Information about this government scheme."}
                </p>
              </div>
            </div>

            {/* Eligibility */}
            {scheme.eligibility && (
              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Eligibility
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {scheme.eligibility}
                </p>
              </div>
            )}

            {/* Benefits */}
            {scheme.benefits && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-900">
                  Benefits
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  {scheme.benefits}
                </p>
              </div>
            )}

            {/* Application */}
            {scheme.application_url && (
              <div className="mt-5">
                <a
                  href={scheme.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                >
                  Apply / Learn More →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center text-gray-500">
          No schemes found.
        </div>
      )}
    </>
  );
}
