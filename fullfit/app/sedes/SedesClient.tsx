'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import { MapPin, Phone, Clock, Dumbbell, ChevronDown, MessageCircle } from 'lucide-react'

type Sede = {
  id: number
  nombre: string
  direccion: string
  telefono: string
  email: string
  imagen_url: string | null
  latitud: number | null
  longitud: number | null
  apertura_lv: string
  cierre_lv: string
  apertura_sab: string
  cierre_sab: string
  estado: 'activa' | 'inactiva'
  creado_en: string
  actualizado_en: string
}

interface SedesClientProps {
  sedes: Sede[]
}

const formatHora = (hora: string) => {
  const [h, m] = hora.split(':').map(Number)
  const ampm = h < 12 ? 'am' : 'pm'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
}

const SedeCard = ({
  sede,
  isExpanded,
  onToggle,
}: {
  sede: Sede
  isExpanded: boolean
  onToggle: () => void
}) => {
  const mapsUrl =
    sede.latitud && sede.longitud
      ? `https://www.google.com/maps?q=${sede.latitud},${sede.longitud}`
      : null

  const horarioLV = `${formatHora(sede.apertura_lv)} – ${formatHora(sede.cierre_lv)}`
  const horarioSab = `${formatHora(sede.apertura_sab)} – ${formatHora(sede.cierre_sab)}`

  return (
    <article className="relative border-2 border-white/10 bg-black/60 hover:border-white/30 transition-all duration-500 overflow-hidden">

      {/* Imagen */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-zinc-900">
        {sede.imagen_url ? (
          <Image
            src={sede.imagen_url}
            alt={sede.nombre}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Dumbbell className="w-16 h-16 text-gym-logo/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="p-4 md:p-6">
        <h2 className="font-arcade text-white text-sm md:text-base leading-snug mb-4 uppercase">
          {sede.nombre}
        </h2>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-3 h-3 text-gym-logo mt-0.5 flex-shrink-0" />
            <p className="text-white/80 text-[10px] font-mono leading-relaxed">
              {sede.direccion}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 text-gym-logo flex-shrink-0" />
            <a
              href={`tel:${sede.telefono}`}
              className="text-white/80 text-[10px] font-mono hover:text-gym-logo hoverEffect"
            >
              {sede.telefono}
            </a>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-3 h-3 text-gym-logo mt-0.5 flex-shrink-0" />
            <p className="text-white/80 text-[10px] font-mono leading-relaxed">
              Lun–Vie: {horarioLV}
            </p>
          </div>
        </div>

        {/* Expandible */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between border-t border-white/10 pt-3 group"
        >
          <span className="text-white/40 text-[9px] font-arcade uppercase tracking-wider group-hover:text-gym-logo hoverEffect">
            {isExpanded ? 'Ver menos' : 'Ver más información'}
          </span>
          <ChevronDown
            className={`w-3 h-3 text-white/40 group-hover:text-gym-logo hoverEffect transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Panel expandido */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border border-white/10 p-3 bg-white/2 space-y-1.5">
            <p className="font-arcade text-gym-logo text-[8px] uppercase tracking-wider mb-3">
              Horarios
            </p>
            <div className="flex justify-between">
              <span className="text-white/40 text-[9px] font-mono">Lun – Vie</span>
              <span className="text-white/80 text-[9px] font-mono">{horarioLV}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40 text-[9px] font-mono">Sábado</span>
              <span className="text-white/80 text-[9px] font-mono">{horarioSab}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40 text-[9px] font-mono">Domingo</span>
              <span className="text-red-400/70 text-[9px] font-mono">Cerrado</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-4 pt-3 border-t border-white/10">
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex items-center justify-center gap-2 w-full border border-white/20 text-white/70 hover:border-gym-logo hover:text-gym-logo hoverEffect py-4 text-sm font-arcade uppercase tracking-wider"
            >
              <MapPin className="w-5 h-5" />
              Cómo llegar
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

const SedesClient = ({ sedes }: SedesClientProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handleToggle = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  if (sedes.length === 0) {
    return (
      <Container className="py-20">
        <div className="text-center">
          <Dumbbell className="w-16 h-16 text-gym-logo/20 mx-auto mb-4" />
          <p className="font-arcade text-white/40 text-xs uppercase tracking-wider">
            No hay sedes disponibles en este momento
          </p>
        </div>
      </Container>
    )
  }

  return (
    <>
      <section className="py-12 md:py-20">
        <Container>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-4xl mx-auto">
            {sedes.map(sede => (
              <SedeCard
                key={sede.id}
                sede={sede}
                isExpanded={expandedId === sede.id}
                onToggle={() => handleToggle(sede.id)}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t-2 border-gym-logo/20 bg-gym-logo/5 py-12">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-arcade text-gym-logo text-xs uppercase tracking-widest mb-2">
                ¿Aún no eres miembro?
              </p>
              <h3 className="font-arcade text-white text-sm md:text-base leading-relaxed">
                Una membresía,{' '}
                <span className="text-gym-logo">todas las sedes</span>
              </h3>
            </div>
            <Link
              href="/membresias"
              className="bg-gym-logo text-black font-arcade text-[9px] uppercase tracking-wider px-6 py-3 hover:bg-gym-logo-claro hoverEffect whitespace-nowrap"
            >
              Ver Membresías
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}

export default SedesClient
