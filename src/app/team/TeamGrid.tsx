'use client'

import { useState } from 'react'
import { PublicTeamlid } from '@/modules/teamlid/queries'

interface TeamGridProps {
  teamleden: PublicTeamlid[]
  activeDisciplines: string[]
  disciplineLabels: Record<string, string>
  rolLabels: Record<string, string>
}

export default function TeamGrid({
  teamleden,
  activeDisciplines,
  disciplineLabels,
  rolLabels,
}: TeamGridProps) {
  const [activeTab, setActiveTab] = useState('all')

  const filteredMembers = activeTab === 'all'
    ? teamleden
    : teamleden.filter(m => m.discipline === activeTab)

  return (
    <>
      {/* Discipline Filter Tabs */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setActiveTab('all')}
              className={`
                px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300
                ${activeTab === 'all'
                  ? 'bg-[var(--rb-primary)] text-white shadow-lg shadow-[var(--rb-primary)]/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }
              `}
            >
              Iedereen
            </button>
            {activeDisciplines.map((discCode) => (
              <button
                key={discCode}
                onClick={() => setActiveTab(discCode)}
                className={`
                  px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300
                  ${activeTab === discCode
                    ? 'bg-[var(--rb-primary)] text-white shadow-lg shadow-[var(--rb-primary)]/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                {disciplineLabels[discCode] || discCode}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-200 flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Nog geen teamleden</h3>
              <p className="text-slate-500">
                {activeTab === 'all' ? 'Er zijn nog geen teamleden toegevoegd.' : 'Nog geen teamleden in deze discipline.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMembers.map((member) => (
                <div
                  key={`${member.voornaam}-${member.achternaam}`}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-[var(--rb-primary)]/20 hover:shadow-lg hover:shadow-[var(--rb-primary)]/5 transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <div className="aspect-[4/3] bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-primary-light)]">
                      {member.foto ? (
                        <img
                          src={member.foto}
                          alt={`${member.voornaam} ${member.achternaam}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white/60">
                              {member.voornaam[0]}{member.achternaam[0]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {member.discipline && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/95 text-[var(--rb-primary)] shadow-lg">
                          {disciplineLabels[member.discipline] || member.discipline}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {member.voornaam} {member.achternaam}
                    </h3>
                    <p className="text-[var(--rb-primary)] font-medium mb-4">
                      {member.discipline ? disciplineLabels[member.discipline] : rolLabels[member.rol] || member.rol}
                    </p>
                    {member.bio && (
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">{member.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
