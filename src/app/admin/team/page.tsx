'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllTeamleden } from '@/modules/teamlid/queries';
import { createTeamlid, updateTeamlid, resetPassword, type Rol, type Discipline } from '@/modules/teamlid/actions';
import type { Teamlid } from '@prisma/client';
import ImageUpload from '@/components/admin/ImageUpload';

export default function TeamManagementPage() {
  const router = useRouter();
  const [teamleden, setTeamleden] = useState<Teamlid[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [voornaam, setVoornaam] = useState('');
  const [achternaam, setAchternaam] = useState('');
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [rol, setRol] = useState<Rol>('ZORGVERLENER');
  const [discipline, setDiscipline] = useState<Discipline | ''>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [actief, setActief] = useState(true);
  const [bio, setBio] = useState('');
  const [foto, setFoto] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadTeamleden();
  }, []);

  async function loadTeamleden() {
    try {
      setLoading(true);
      const data = await getAllTeamleden();
      setTeamleden(data);
    } catch (err) {
      setError('Fout bij laden teamleden');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setVoornaam('');
    setAchternaam('');
    setEmail('');
    setWachtwoord('');
    setRol('ZORGVERLENER');
    setDiscipline('');
    setIsAdmin(false);
    setActief(true);
    setBio('');
    setFoto('');
    setError('');
    setSuccess('');
  }

  function handleEdit(teamlid: Teamlid) {
    setEditingId(teamlid.id);
    setVoornaam(teamlid.voornaam);
    setAchternaam(teamlid.achternaam);
    setEmail(teamlid.email);
    setRol(teamlid.rol as Rol);
    setDiscipline(teamlid.discipline as Discipline || '');
    setIsAdmin(teamlid.isAdmin);
    setActief(teamlid.actief);
    setBio(teamlid.bio || '');
    setFoto(teamlid.foto || '');
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (!voornaam || !achternaam || !email || !rol) {
        setError('Verplichte velden ontbreken');
        setSaving(false);
        return;
      }

      if (editingId) {
        // Update existing
        const result = await updateTeamlid({
          teamlidId: editingId,
          voornaam,
          achternaam,
          email,
          rol,
          discipline: discipline || undefined,
          isAdmin,
          actief,
          bio: bio || undefined,
          foto: foto || undefined,
        });

        if (result.success) {
          setSuccess('Teamlid bijgewerkt');
          setShowForm(false);
          resetForm();
          loadTeamleden();
        } else {
          setError(result.error || 'Fout bij wijzigen');
        }
      } else {
        // Create new
        if (!wachtwoord) {
          setError('Wachtwoord is verplicht voor nieuwe teamleden');
          setSaving(false);
          return;
        }

        const result = await createTeamlid({
          voornaam,
          achternaam,
          email,
          wachtwoord,
          rol,
          discipline: discipline || undefined,
          isAdmin,
          actief,
          bio: bio || undefined,
          foto: foto || undefined,
        });

        if (result.success) {
          setSuccess('Teamlid aangemaakt');
          setShowForm(false);
          resetForm();
          loadTeamleden();
        } else {
          setError(result.error || 'Fout bij aanmaken');
        }
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPassword(teamlidId: number, naam: string) {
    if (!confirm(`Weet je zeker dat je het wachtwoord van ${naam} wilt resetten?`)) {
      return;
    }

    try {
      const result = await resetPassword(teamlidId);

      if (result.success && result.tijdelijkWachtwoord) {
        alert(`Tijdelijk wachtwoord: ${result.tijdelijkWachtwoord}\n\nNoteer dit en geef het door aan het teamlid.`);
        setSuccess('Wachtwoord gereset');
      } else {
        setError(result.error || 'Fout bij resetten wachtwoord');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    }
  }

  const rolLabels: Record<Rol, string> = {
    ZORGVERLENER: 'Zorgverlener',
    SECRETARIAAT: 'Secretariaat',
  };

  const disciplineLabels: Record<Discipline, string> = {
    LOGOPEDIE: 'Logopedie',
    KINESITHERAPIE: 'Kinesitherapie',
    ERGOTHERAPIE: 'Ergotherapie',
    NEUROPSYCHOLOGIE: 'Neuropsychologie',
    DIETIEK: 'Diëtiek',
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#2879D8' }}>
          Team Beheren
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="px-4 py-2 bg-[#2879D8] text-white rounded-md hover:bg-[#1e60b0]"
          >
            {showForm ? 'Annuleren' : '+ Nieuw Teamlid'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Terug
          </button>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingId ? 'Teamlid Wijzigen' : 'Nieuw Teamlid'}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voornaam *
              </label>
              <input
                type="text"
                value={voornaam}
                onChange={(e) => setVoornaam(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Achternaam *
              </label>
              <input
                type="text"
                value={achternaam}
                onChange={(e) => setAchternaam(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {!editingId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wachtwoord *
              </label>
              <input
                type="password"
                value={wachtwoord}
                onChange={(e) => setWachtwoord(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol *
              </label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as Rol)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="ZORGVERLENER">Zorgverlener</option>
                <option value="SECRETARIAAT">Secretariaat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discipline
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as Discipline | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Geen</option>
                <option value="LOGOPEDIE">Logopedie</option>
                <option value="KINESITHERAPIE">Kinesitherapie</option>
                <option value="ERGOTHERAPIE">Ergotherapie</option>
                <option value="NEUROPSYCHOLOGIE">Neuropsychologie</option>
                <option value="DIETIEK">Diëtiek</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <ImageUpload
            value={foto}
            onChange={setFoto}
            folder="team"
            label="Profielfoto"
            helpText="Upload een profielfoto of voer een URL in"
            aspectRatio="square"
          />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4 text-[#2879D8] border-gray-300 rounded"
              />
              <label htmlFor="isAdmin" className="text-sm text-gray-700">
                Admin rechten
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="actief"
                checked={actief}
                onChange={(e) => setActief(e.target.checked)}
                className="w-4 h-4 text-[#2879D8] border-gray-300 rounded"
              />
              <label htmlFor="actief" className="text-sm text-gray-700">
                Actief
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 px-4 bg-[#2879D8] text-white rounded-md hover:bg-[#1e60b0] disabled:opacity-50"
          >
            {saving ? 'Opslaan...' : editingId ? 'Wijzigingen Opslaan' : 'Teamlid Aanmaken'}
          </button>
        </form>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-6 text-gray-600">Laden...</div>
        ) : teamleden.length === 0 ? (
          <div className="p-6 text-gray-500">Geen teamleden gevonden</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {teamleden.map((teamlid) => (
              <div key={teamlid.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        {teamlid.voornaam} {teamlid.achternaam}
                      </span>
                      {teamlid.isAdmin && (
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                          Admin
                        </span>
                      )}
                      {!teamlid.actief && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">
                          Inactief
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {teamlid.email} • {rolLabels[teamlid.rol as Rol]}
                      {teamlid.discipline && ` • ${disciplineLabels[teamlid.discipline as Discipline]}`}
                    </div>
                    {teamlid.bio && (
                      <div className="text-sm text-gray-500 mt-2">{teamlid.bio}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(teamlid)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1"
                    >
                      Bewerken
                    </button>
                    <button
                      onClick={() => handleResetPassword(teamlid.id, `${teamlid.voornaam} ${teamlid.achternaam}`)}
                      className="text-orange-600 hover:text-orange-800 px-3 py-1"
                    >
                      Reset PW
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
