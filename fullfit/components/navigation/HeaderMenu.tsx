"use client"
import { headerData } from '@/constants/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import AuthButtons from '@/components/shared/AuthButtons';
import { useAuth } from '@/hooks';
import { supabase } from '@/lib/supabase/client';

const HeaderMenu = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [membresiaActiva, setMembresiaActiva] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchEstado = async () => {
      const { data } = await supabase
        .from('suscripciones')
        .select('estado')
        .eq('usuario_id', user.id)
        .order('creado_en', { ascending: false })
        .limit(1)
        .maybeSingle<{ estado: string }>();
      if (data && (data.estado === 'suspendida' || data.estado === 'cancelada')) {
        setMembresiaActiva(false);
      }
    };
    fetchEstado();
  }, [user]);

  return (
    <div className="hidden lg:inline-flex w-1/1.6 items-center gap-18 text-xs capitalize font-arcade text-white whitespace-nowrap">
      {headerData?.filter(item => {
        if (!membresiaActiva && item.href === '/membresias') return false;
        return true;
      }).map((item) => (
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
