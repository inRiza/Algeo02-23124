"use client";

import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 mb-6">
      <a
        href="/album"
        className={`px-6 py-2 rounded-full transition-colors ${
          pathname === "/album"
            ? "bg-white text-black"
            : "bg-[#282828] text-white hover:bg-opacity-80"
        }`}
      >
        Album
      </a>
      <a
        href="/music"
        className={`px-6 py-2 rounded-full transition-colors ${
          pathname === "/music"
            ? "bg-white text-black"
            : "bg-[#282828] text-white hover:bg-opacity-80"
        }`}
      >
        Music
      </a>
    </nav>
  );
}
