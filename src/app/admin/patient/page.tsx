'use client';

import { useEffect, useState } from 'react';
import { Patient } from '@prisma/client';
import Link from 'next/link';
import { getRecentPatients } from '@/modules/patient/queries';
import { formatteerRR } from '@/shared/utils/rijksregisternummer';

export default function PatientOverzichtPage() {
  const [patienten, setPatienten] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentPatients(50)
      .then(setPatienten)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2879D8] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2879D8' }}>
            Patiënten
          </h1>
          <p className="text-gray-600 mt-1">{patienten.length} geregistreerde patiënten</p>
        </div>
        <Link
          href="/admin/patient/nieuw"
          className="px-4 py-2 bg-[#2879D8] text-white rounded-md hover:bg-[#1e60b0] font-medium"
        >
          + Nieuwe Patiënt
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Naam
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Geboortedatum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefoonnummer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gemeente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Geregistreerd
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patienten.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Nog geen patiënten geregistreerd
                </td>
              </tr>
            ) : (
              patienten.map((patient: Patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {patient.voornaam} {patient.achternaam}
                    </div>
                    <div className="text-sm text-gray-500">{formatteerRR(patient.rijksregisternummer)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(patient.geboortedatum).toLocaleDateString('nl-BE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.telefoonnummer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.gemeente || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(patient.aangemaakt).toLocaleDateString('nl-BE')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
