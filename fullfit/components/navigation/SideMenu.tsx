import React, { FC } from 'react';
import Logo from '@/components/shared/Logo';
import { X } from 'lucide-react';
import { headerData } from '@/constants/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SocialMedia from '@/components/shared/SocialMedia';
import { useOutsideClick } from '@/hooks';
import AuthButtons from '@/components/shared/AuthButtons';

interface SidebarProps{
    isOpen:boolean;
    onClose:() => void;
}

const SideMenu:FC<SidebarProps> = ({isOpen, onClose}) => {
  const pathname = usePathname();
  const sidebaRef=useOutsideClick<HTMLDivElement>(onClose); 
  return (
    <>
      {/* Fondo oscuro (Overlay) estático que solo cambia de opacidad */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Menú lateral fijado a la derecha que se desliza desde el borde derecho */}
      <div ref={sidebaRef}
        className={`fixed inset-0 z-50 w-full bg-zinc-900 p-10 flex flex-col text-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header: Close button only */}
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="hover:text-gym-logo-claro hoverEffect"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav links + Auth — misma columna */}
        <div className="flex-1 flex flex-col gap-8 font-arcade tracking-wide text-sm pt-6">
          {headerData?.map((item)=>(
          <Link href={item?.href} key={item?.title}
          onClick={onClose}
          className={`hover:text-gym-logo-claro hoverEffect ${pathname === item?.href && "text-gym-logo-claro"}`}>
          {item?.title}
          </Link>
          ))}
          <AuthButtons direction="column" />
        </div>

        {/* Bottom: Social + Logo */}
        <div className="flex flex-col gap-10 items-center pt-6">
          <SocialMedia 
            iconClassName="text-white border-white/40 hover:bg-gym-logo hover:text-black hover:border-gym-logo hoverEffect"
          />
          <Logo onClick={onClose} />
        </div>
      </div>
    </>
  );
};

export default SideMenu;
