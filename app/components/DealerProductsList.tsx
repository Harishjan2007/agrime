"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
};

type DealerProductsListProps = {
  products: Product[];
};

export default function DealerProductsList({
  products: initialProducts,
}: DealerProductsListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteProduct = async (productId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(productId);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (!error) {
      setProducts((current) =>
        current.filter((product) => product.id !== productId)
      );
    }

    setDeletingId(null);
  };

  if (products.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="text-4xl">📦</div>

        <h3 className="mt-4 text-lg font-bold text-gray-900">
          No products yet
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Add your first product using the form.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-2xl bg-white p-5 shadow-sm"
        >

          <div className="flex gap-4">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-green-50 text-3xl">

              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                "📦"
              )}

            </div>

            <div className="min-w-0 flex-1">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h3 className="font-bold text-gray-900">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-xs capitalize text-green-700">
                    {product.category}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteProduct(product.id)}
                  disabled={deletingId === product.id}
                  className="text-sm font-medium text-red-500 hover:text-red-700 disabled:text-gray-300"
                >
                  {deletingId === product.id
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>

              {product.description && (
                <p className="mt-2 text-sm text-gray-500">
                  {product.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-4 text-sm">

                <span className="font-bold text-green-700">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>

                <span className="text-gray-500">
                  Stock: {product.stock}
                </span>

              </div>

            </div>

          </div>

        </div>
      ))}

    </div>
  );
}