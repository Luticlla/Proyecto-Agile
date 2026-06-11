'use client'

import React from 'react'
import Container from './Container'
import Logo from '@/components/shared/Logo'
import HeaderMenu from '@/components/navigation/HeaderMenu'
import MobileMenu from '@/components/navigation/MobileMenu'

const Header = () => {
  return (
    <header className="bg-black border-b-3 border-gym-logo-claro">
      <Container className='flex items-center justify-between h-[60px]'>
        <Logo />
        <HeaderMenu />
        <div className="flex items-center gap-5 justify-end lg:hidden">
          <MobileMenu />
        </div>
      </Container>
    </header>
  )
}
export default Header
