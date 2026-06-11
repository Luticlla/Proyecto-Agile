"use client"
import { headerData } from '@/constants/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import AuthButtons from '@/components/shared/AuthButtons';

const HeaderMenu = () => {
  const pathname = usePathname();
  return (
    <div className="hidden lg:inline-flex w-1/1.6 items-center gap-18 text-xs capitalize font-arcade text-white whitespace-nowrap">
      {headerData?.map((item) => (
        <Link key={item?.title} href={item?.href} className={`hover:text-gym-logo hoverEffect relative group ${pathname === item?.href && "text-gym-logo"}`}>
          {item.title}
          <span className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-gym-logo group-hover:w-1/2 hoverEffect group-hover:left-0 ${pathname === item?.href && "text-gym-logo"}`} />
          <span className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-gym-logo group-hover:w-1/2 hoverEffect group-hover:right-0 ${pathname === item?.href && "text-gym-logo"}`} />
        </Link>

      ))
      }
      <AuthButtons />

    </div>
  )
}
export default HeaderMenu