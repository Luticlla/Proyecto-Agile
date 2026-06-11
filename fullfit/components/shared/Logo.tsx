import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const Logo = ({ className, onClick }: { className?: string; onClick?: () => void }) => {
  return (
    <Link href={"/"} onClick={onClick}>
    <h2 className={cn("group text-1 font-arcade tracking-wide uppercase", className)}>
      <span className="text-gym-logo group-hover:text-white hoverEffect">FULL</span>
      <span className="text-white group-hover:text-gym-logo hoverEffect">FORMA</span>
    </h2>
    </Link>
  )
}
export default Logo