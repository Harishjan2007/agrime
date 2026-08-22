"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isSignup = mode === "signup";

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setMessage("Unable to create account.");
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          name,
          email,
          phone: phone || null,
          role: "farmer",
          location: location || null,
        });

      if (profileError) {
        setMessage(profileError.message);
        setLoading(false);
        return;
      }

      setMessage(
        "Account created successfully. Please check your email if verification is required."
      );

      setLoading(false);

      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 1000);

      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);

    router.push("/");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {isSignup && (
        <>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your name"
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
              placeholder="Enter phone number"
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
        </>
      )}

      <div>
        <label className="text-sm font-medium text-gray-700">
          Email
        </label>

        <input
          type="email"
          required
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="Enter email"
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Password
        </label>

        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Enter password"
          className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
        />
      </div>

      {message && (
        <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:bg-gray-300"
      >
        {loading
          ? "Please wait..."
          : isSignup
            ? "Create Account"
            : "Sign In"}
      </button>
    </form>
  );
}