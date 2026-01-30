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

  const disciplineColors: Record<Discipline, string> = {
    LOGOPEDIE: '#2879D8',
    KINESITHERAPIE: '#59ECB7',
    ERGOTHERAPIE: '#9C27B0',
    NEUROPSYCHOLOGIE: '#FFC107',
    DIETIEK: '#4CAF50',
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Team Beheren
            </h1>
            <p className="text-slate-500 mt-1">
              {teamleden.length} teamleden
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="
              flex items-center gap-2 px-6 py-3
              bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)]
              text-white font-semibold rounded-xl
              shadow-lg shadow-[var(--rb-primary)]/25
              hover:shadow-xl hover:shadow-[var(--rb-primary)]/30 hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-200
            "
          >
            {showForm ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuleren
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nieuw Teamlid
              </>
            )}
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Form - Modern Card */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-accent)] p-6">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Teamlid Wijzigen' : 'Nieuw Teamlid Toevoegen'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Voornaam <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={voornaam}
                    onChange={(e) => setVoornaam(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                    placeholder="Jan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Achternaam <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={achternaam}
                    onChange={(e) => setAchternaam(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                    placeholder="Jansen"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  placeholder="jan.jansen@revabrain.be"
                />
              </div>

              {/* Password (only for new) */}
              {!editingId && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Wachtwoord <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={wachtwoord}
                    onChange={(e) => setWachtwoord(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {/* Role & Discipline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rol <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value as Rol)}
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  >
                    <option value="ZORGVERLENER">Zorgverlener</option>
                    <option value="SECRETARIAAT">Secretariaat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Discipline
                  </label>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value as Discipline | '')}
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
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

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 resize-none"
                  placeholder="Korte omschrijving..."
                />
              </div>

              {/* Photo Upload */}
              <ImageUpload
                value={foto}
                onChange={setFoto}
                folder="team"
                label="Profielfoto"
                helpText="Upload een profielfoto of voer een URL in"
                aspectRatio="square"
              />

              {/* Checkboxes - Modern Toggle Style */}
              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-purple-500 transition-colors" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Admin rechten</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={actief}
                      onChange={(e) => setActief(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Actief</span>
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="
                  w-full py-4 px-6
                  bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)]
                  text-white font-semibold rounded-xl
                  shadow-lg shadow-[var(--rb-primary)]/25
                  hover:shadow-xl hover:shadow-[var(--rb-primary)]/30
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  flex items-center justify-center gap-2
                "
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Opslaan...
                  </>
                ) : editingId ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Wijzigingen Opslaan
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Teamlid Aanmaken
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Team Grid - Modern Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : teamleden.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">Geen teamleden gevonden</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamleden.map((teamlid, index) => (
              <div
                key={teamlid.id}
                className="
                  bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100
                  hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200
                  transition-all duration-300 overflow-hidden group
                "
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Card Header with Color */}
                <div
                  className="h-2"
                  style={{ backgroundColor: teamlid.discipline ? disciplineColors[teamlid.discipline as Discipline] : '#94a3b8' }}
                />

                <div className="p-5">
                  {/* Avatar & Name */}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0"
                      style={{ backgroundColor: teamlid.discipline ? disciplineColors[teamlid.discipline as Discipline] : '#64748b' }}
                    >
                      {teamlid.voornaam.charAt(0)}{teamlid.achternaam.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">
                        {teamlid.voornaam} {teamlid.achternaam}
                      </h3>
                      <p className="text-sm text-slate-500 truncate">
                        {rolLabels[teamlid.rol as Rol]}
                        {teamlid.discipline && ` • ${disciplineLabels[teamlid.discipline as Discipline]}`}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <p className="text-sm text-slate-500 mt-3 truncate">{teamlid.email}</p>

                  {/* Bio */}
                  {teamlid.bio && (
                    <p className="text-sm text-slate-400 mt-2 line-clamp-2">{teamlid.bio}</p>
                  )}

                  {/* Tags */}
                  <div className="flex items-center gap-2 mt-4">
                    {teamlid.isAdmin && (
                      <span className="text-xs px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        Admin
                      </span>
                    )}
                    {!teamlid.actief && (
                      <span className="text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                        Inactief
                      </span>
                    )}
                    {teamlid.actief && !teamlid.isAdmin && (
                      <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                        Actief
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleEdit(teamlid)}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-[var(--rb-primary)] bg-[var(--rb-primary)]/10 rounded-xl hover:bg-[var(--rb-primary)]/20 transition-all duration-200"
                    >
                      Bewerken
                    </button>
                    <button
                      onClick={() => handleResetPassword(teamlid.id, `${teamlid.voornaam} ${teamlid.achternaam}`)}
                      className="px-4 py-2.5 text-sm font-medium text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all duration-200"
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
