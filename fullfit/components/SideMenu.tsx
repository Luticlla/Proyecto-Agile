import React, { FC } from 'react';
import Logo from './Logo';
import HamburgerIcon from 'hamburger-react';
import { headerData } from '@/constants/data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SocialMedia from './SocialMedia';
import { useOutsideClick } from '@/hooks';
import AuthButtons from './AuthButtons';

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
        className={`fixed inset-y-0 right-0 z-50 min-w-72 max-w-96 bg-black h-screen p-10 border-l-gym-logo-claro border-l flex flex-col gap-6 text-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-5">
          <Logo />
          <button 
            onClick={onClose}
            className="hover:text-gym-logo-claro hoverEffect"
          >
            {/* Usamos HamburgerIcon como botón de cierre */}
            <HamburgerIcon color="#fff" toggled={isOpen} toggle={onClose} />
          </button>
        </div>
        <div className='flex flex-col space-y-4 font-arcade tracking-wide'>
          {headerData?.map((item)=>(
          <Link href={item?.href} key={item?.title}
          onClick={onClose}
          className={`hover:text-gym-logo-claro hoverEffect ${pathname === item?.href && "text-gym-logo-claro"}`}>
          {item?.title}
          </Link>
          ))}
        </div>
        <div className='flex flex-col gap-3 text-xs font-arcade text-white w-full overflow-hidden'>
            <div className="flex flex-col gap-3 w-full [&>div]:flex-col [&>div]:items-start [&>div]:w-full [&_a]:w-full [&_a]:text-center">
            <AuthButtons />
            </div>
        </div>
        <SocialMedia />
      </div>
    </>
  );
};

export default SideMenu;
