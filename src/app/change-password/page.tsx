'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { changePassword } from '@/modules/teamlid/actions';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [huidigWachtwoord, setHuidigWachtwoord] = useState('');
  const [nieuwWachtwoord, setNieuwWachtwoord] = useState('');
  const [bevestigWachtwoord, setBevestigWachtwoord] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Validatie
    if (!huidigWachtwoord || !nieuwWachtwoord || !bevestigWachtwoord) {
      setError('Alle velden zijn verplicht');
      return;
    }

    if (nieuwWachtwoord !== bevestigWachtwoord) {
      setError('Nieuwe wachtwoorden komen niet overeen');
      return;
    }

    if (nieuwWachtwoord.length < 8) {
      setError('Nieuw wachtwoord moet minimaal 8 karakters bevatten');
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword({
        huidigWachtwoord,
        nieuwWachtwoord,
      });

      if (result.success) {
        alert('Wachtwoord succesvol gewijzigd');
        router.push('/admin/agenda');
      } else {
        setError(result.error || 'Er is een fout opgetreden');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#2879D8' }}>
          Wachtwoord Wijzigen
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Je wachtwoord is gereset door een administrator. Kies een nieuw wachtwoord om door te gaan.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Huidig Wachtwoord *
            </label>
            <input
              type="password"
              value={huidigWachtwoord}
              onChange={(e) => setHuidigWachtwoord(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nieuw Wachtwoord * (min. 8 karakters)
            </label>
            <input
              type="password"
              value={nieuwWachtwoord}
              onChange={(e) => setNieuwWachtwoord(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Bevestig Nieuw Wachtwoord *
            </label>
            <input
              type="password"
              value={bevestigWachtwoord}
              onChange={(e) => setBevestigWachtwoord(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#2879D8] text-white rounded-md hover:bg-[#1e60b0] disabled:opacity-50"
          >
            {loading ? 'Wijzigen...' : 'Wachtwoord Wijzigen'}
          </button>
        </form>
      </div>
    </div>
  );
}
