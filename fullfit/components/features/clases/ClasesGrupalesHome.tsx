'use client'

import React from 'react'
import Container from '@/components/layout/Container'
import { Clock, Users, CalendarDays } from 'lucide-react'
import type { ClaseConHorarios } from '@/lib/supabase/queries/clases.types'

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const formatHora = (hora: string) => {
  const [h, m] = hora.split(':').map(Number)
  const ampm = h < 12 ? 'am' : 'pm'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')}${ampm}`
}

function ClaseCard({ clase }: { clase: ClaseConHorarios }) {
  const horariosOrdenados = [...clase.horarios].sort((a, b) => a.dia_semana - b.dia_semana)

  return (
    <article className="relative border-2 border-white/10 bg-black/60 hover:border-white/30 transition-all duration-500 overflow-hidden group">
      {/* Barra de color */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: clase.color_hex || '#facc15' }}
      />

      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-arcade text-white text-sm md:text-base tracking-wider uppercase group-hover:text-gym-logo transition-colors duration-300">
              {clase.nombre}
            </h3>
            {clase.entrenador && (
              <p className="text-white/50 text-[10px] font-mono mt-1.5 tracking-wider">
                Prof: <span className="text-white/70">{clase.entrenador}</span>
              </p>
            )}
          </div>
          {clase.capacidad && (
            <div className="flex items-center gap-1.5 text-white/40">
              <Users className="size-3" />
              <span className="font-mono text-[9px] tracking-wider">{clase.capacidad}</span>
            </div>
          )}
        </div>

        {/* Descripción */}
        {clase.descripcion && (
          <p className="text-white/40 text-[10px] font-mono leading-relaxed mb-4 line-clamp-2">
            {clase.descripcion}
          </p>
        )}

        {/* Horarios */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="size-3 text-gym-logo" />
            <span className="font-arcade text-gym-logo text-[8px] uppercase tracking-widest">
              Horarios
            </span>
          </div>

          {horariosOrdenados.length > 0 ? (
            <div className="space-y-1.5">
              {horariosOrdenados.map((h) => (
                <div
                  key={h.id}
                  className="flex justify-between items-center text-[10px] py-1.5 px-2 bg-white/[0.03] border border-white/5 rounded"
                >
                  <span className="text-white/60 font-mono font-medium">
                    {DIAS_SEMANA[h.dia_semana]}
                  </span>
                  <span className="text-white/40 font-mono">
                    {formatHora(h.hora_inicio)} – {formatHora(h.hora_fin)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/20 text-[10px] font-mono italic">
              Próximamente
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

interface ClasesGrupalesHomeProps {
  clases: ClaseConHorarios[]
}

export default function ClasesGrupalesHome({ clases }: ClasesGrupalesHomeProps) {
  if (clases.length === 0) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <CalendarDays className="size-12 text-gym-logo/20 mx-auto mb-4" />
          <p className="font-arcade text-gym-logo text-xs uppercase tracking-widest mb-2">
            Próximamente
          </p>
          <p className="font-arcade text-white/40 text-xs uppercase tracking-wider">
            Estamos preparando nuestras clases para ti
          </p>
        </div>
      </Container>
    )
  }

  return (
    <section className="py-12 md:py-20">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          {clases.map((clase) => (
            <ClaseCard key={clase.id} clase={clase} />
          ))}
        </div>
      </Container>
    </section>
  )
}
