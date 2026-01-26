'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ContactInfo {
  telefoon: string;
  email: string;
  adresStraat: string;
  adresNummer: string;
  adresPostcode: string;
  adresGemeente: string;
  latitude: number;
  longitude: number;
  openingstijden: Record<string, string>;
}

// For now, use hardcoded data (in future, fetch from API)
const contactInfo: ContactInfo = {
  telefoon: '+32 2 123 45 67',
  email: 'info@revabrain.be',
  adresStraat: 'Voorbeeldstraat',
  adresNummer: '1',
  adresPostcode: '1000',
  adresGemeente: 'Brussel',
  latitude: 50.8503,
  longitude: 4.3517,
  openingstijden: {
    Maandag: '09:00 - 17:00',
    Dinsdag: '09:00 - 17:00',
    Woensdag: '09:00 - 17:00',
    Donderdag: '09:00 - 17:00',
    Vrijdag: '09:00 - 16:00',
    Zaterdag: 'Gesloten',
    Zondag: 'Gesloten',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold" style={{ color: '#2879D8' }}>
            RevaBrain
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/contact" className="text-gray-900 font-medium" style={{ color: '#2879D8' }}>
              Contact
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Inloggen
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2879D8' }}>
            Contact
          </h1>
          <p className="text-lg text-gray-600">
            Neem contact met ons op voor een afspraak of meer informatie
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info Card */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2879D8' }}>
              Contactgegevens
            </h2>

            <div className="space-y-6">
              {/* Phone */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Telefoon
                </h3>
                <a
                  href={`tel:${contactInfo.telefoon}`}
                  className="text-lg hover:underline"
                  style={{ color: '#2879D8' }}
                >
                  {contactInfo.telefoon}
                </a>
              </div>

              {/* Email */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Email
                </h3>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-lg hover:underline"
                  style={{ color: '#2879D8' }}
                >
                  {contactInfo.email}
                </a>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Adres
                </h3>
                <address className="text-lg text-gray-900 not-italic">
                  {contactInfo.adresStraat} {contactInfo.adresNummer}<br />
                  {contactInfo.adresPostcode} {contactInfo.adresGemeente}
                </address>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${contactInfo.latitude}&mlon=${contactInfo.longitude}#map=15/${contactInfo.latitude}/${contactInfo.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm hover:underline"
                  style={{ color: '#2879D8' }}
                >
                  Open in kaart →
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours Card */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2879D8' }}>
              Openingstijden
            </h2>

            <div className="space-y-3">
              {Object.entries(contactInfo.openingstijden).map(([dag, uren]) => (
                <div key={dag} className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">{dag}</span>
                  <span className="text-gray-600">{uren}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Bel vooraf voor een afspraak. Consultaties gebeuren enkel op afspraak.
              </p>
            </div>
          </div>
        </div>

        {/* Map Section - Static link to OpenStreetMap (privacy-friendly) */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2879D8' }}>
            Locatie
          </h2>
          <p className="text-gray-600 mb-4">
            Onze praktijk bevindt zich in {contactInfo.adresGemeente}.
          </p>
          <a
            href={`https://www.openstreetmap.org/?mlat=${contactInfo.latitude}&mlon=${contactInfo.longitude}#map=15/${contactInfo.latitude}/${contactInfo.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 text-white rounded-md hover:opacity-90"
            style={{ backgroundColor: '#2879D8' }}
          >
            Bekijk op OpenStreetMap
          </a>
          <p className="text-sm text-gray-500 mt-4">
            We gebruiken geen tracking-diensten zoals Google Maps om uw privacy te respecteren.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} RevaBrain. Alle rechten voorbehouden.
          </p>
          <p className="text-gray-400 mt-2 text-sm">
            Neurologische revalidatiepraktijk
          </p>
        </div>
      </footer>
    </div>
  );
}
