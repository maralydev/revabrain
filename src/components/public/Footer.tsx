"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  praktijk: [
    { name: "Over ons", href: "/team" },
    { name: "Disciplines", href: "/disciplines" },
    { name: "Behandelingen", href: "/treatments" },
    { name: "Tarieven", href: "/costs" },
  ],
  informatie: [
    { name: "Contact", href: "/contact" },
    { name: "Voor verwijzers", href: "/verwijzers" },
    { name: "Privacy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.svg"
                alt="RevaBrain"
                width={160}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-gray-400 max-w-sm leading-relaxed">
              Multidisciplinaire groepspraktijk gespecialiseerd in
              neurologische revalidatie. Samen werken we aan uw herstel.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="tel:+32000000000"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +32 (0)0 000 00 00
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Praktijk</h4>
            <ul className="space-y-3">
              {footerLinks.praktijk.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Informatie</h4>
            <ul className="space-y-3">
              {footerLinks.informatie.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} RevaBrain. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
