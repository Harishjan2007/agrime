"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type DealerProductFormProps = {
  onProductAdded?: () => void;
};

export default function DealerProductForm({
  onProductAdded,
}: DealerProductFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("seeds");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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
      setMessage("Please sign in before adding a product.");
      setLoading(false);
      return;
    }

    const { data: dealer, error: dealerError } = await supabase
      .from("dealers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (dealerError || !dealer) {
      setMessage(
        "Dealer profile not found. Please create your dealer profile first."
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("products").insert({
      dealer_id: dealer.id,
      name,
      category,
      description: description || null,
      price: Number(price),
      stock: Number(stock),
      image_url: imageUrl || null,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setName("");
    setCategory("seeds");
    setDescription("");
    setPrice("");
    setStock("");
    setImageUrl("");

    setSuccess(true);
    setMessage("Product added successfully!");

    setLoading(false);

    if (onProductAdded) {
      onProductAdded();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-900">
        Add Product
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Add seeds, fertilizers, pesticides or equipment to your store.
      </p>

      <div className="mt-6 space-y-5">

        <div>
          <label className="text-sm font-medium text-gray-700">
            Product Name
          </label>

          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Example: Paddy Seeds"
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Category
          </label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-600"
          >
            <option value="seeds">Seeds</option>
            <option value="fertilizer">Fertilizer</option>
            <option value="pesticide">Pesticide</option>
            <option value="equipment">Equipment</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the product"
            rows={4}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Price
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="₹ Price"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Stock
            </label>

            <input
              type="number"
              min="0"
              required
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              placeholder="Quantity"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Image URL
          </label>

          <input
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="Optional product image URL"
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
          />

          <p className="mt-1 text-xs text-gray-400">
            Leave empty for now if you don't have an image.
          </p>
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
        {loading ? "Adding Product..." : "Add Product"}
      </button>
    </form>
  );
}