import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold text-green-700">
              AgriME
            </h1>
            <p className="text-xs text-gray-500">
              Agri Made Easy
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-7 md:flex">

          <Link
            href="/"
            className="font-medium text-green-700"
          >
            Home
          </Link>

          <Link
            href="/crop-price"
            className="text-gray-700 hover:text-green-700"
          >
            Crop Prices
          </Link>

          <Link
            href="/prediction"
            className="text-gray-700 hover:text-green-700"
          >
            Prediction
          </Link>

          <a
            href="#"
            className="text-gray-700 hover:text-green-700"
          >
            E-Commerce
          </a>

          <a
            href="#"
            className="text-gray-700 hover:text-green-700"
          >
            Dealers
          </a>

          <a
            href="#"
            className="text-gray-700 hover:text-green-700"
          >
            Machinery
          </a>

          <a
            href="/schemes"
            className="text-gray-700 hover:text-green-700"
          >
            Schemes
          </a>

        </nav>

        <div className="hidden items-center gap-4 md:flex">

          <button className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
            📍 Vellore, TN
          </button>

          <button className="text-lg">
            🔔
          </button>

          <button className="text-sm font-medium text-gray-700">
            👤 Farmer ▾
          </button>

        </div>

      </div>
    </header>
  );
}