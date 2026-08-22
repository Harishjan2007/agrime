"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  dealers: {
    shop_name: string;
  } | null;
};

type EcommercePageClientProps = {
  products: Product[];
};

export default function EcommercePageClient({
  products,
}: EcommercePageClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = [
    "seeds",
    "fertilizer",
    "pesticide",
    "equipment",
  ];

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesCategory =
        category === "all" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <>
      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">

        <h2 className="font-semibold text-gray-900">
          Agricultural Products
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Find seeds, fertilizers, pesticides and equipment from
          available dealers.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600"
          >
            <option value="all">
              All Categories
            </option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>

        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            category={product.category}
            stock={product.stock}
            imageUrl={product.image_url}
            dealerName={product.dealers?.shop_name || null}
          />
        ))}

      </div>

      {filteredProducts.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center text-gray-500">
          No products found.
        </div>
      )}
    </>
  );
}