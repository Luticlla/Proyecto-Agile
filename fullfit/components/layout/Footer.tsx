import React from 'react'
import Container from './Container'
import Logo from '@/components/shared/Logo'
import SocialMedia from '@/components/shared/SocialMedia'

const Footer = () => {
  return (
    <footer className="bg-black border-t-2 border-white/20 mt-10">
      <Container className="py-10 flex flex-col items-center gap-6">

        {/* Redes sociales */}
        <div className="flex flex-col items-center gap-4">
          <p className="font-arcade text-white text-xs tracking-wider uppercase">
            Nuestras <span className="text-gym-logo">Redes</span>
          </p>
          <SocialMedia 
            iconClassName="text-white border-white/40 hover:bg-gym-logo hover:text-black hover:border-gym-logo hoverEffect"
          />
        </div>

        {/* Línea divisoria */}
        <div className="w-full h-[1px] bg-white/20" />

        {/* Logo centrado */}
        <Logo className="text-lg" />

        {/* Copyright */}
        <p className="font-arcade text-white/40 text-[8px] tracking-wider text-center">
          © {new Date().getFullYear()} FULLFORMA. Todos los derechos reservados.
        </p>

      </Container>
    </footer>
  )
}

export default Footer