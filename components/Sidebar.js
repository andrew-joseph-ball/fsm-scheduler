"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (path) =>
    `block px-4 py-2 rounded ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 bg-gray-100 border-r sticky top-0 h-screen">
      <div className="p-4 font-bold text-lg border-b">MCS</div>

      <nav className="p-2 space-y-1">
        <Link href="/" className={linkClass("/")}>
          Dashboard
        </Link>

        <Link href="/service-calls" className={linkClass("/service-calls")}>
          Service Calls
        </Link>
      </nav>
    </aside>
  );
}
