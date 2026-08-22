import Link from "next/link";
import AuthForm from "@/app/components/AuthForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-700">
            AgriME
          </h1>

          <p className="mt-2 text-gray-500">
            Agri Made Easy
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            Create Account
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create your farmer account to get started.
          </p>

          <div className="mt-6">
            <AuthForm mode="signup" />
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-green-700 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}