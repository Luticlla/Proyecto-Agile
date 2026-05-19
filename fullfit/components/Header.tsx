import React from 'react'
import Container from './Container'
import Logo from './Logo'
import HeaderMenu from './HeaderMenu'
import MobileMenu from './MobileMenu'

const Header = () => {
  return (
    <header className="bg-black border-b-3 border-gym-logo-claro">
      <Container className='flex items-center justify-between h-[60px]'>
        <Logo />
        <HeaderMenu />
        <div className="flex items-center gap-5 justify-end">
        <MobileMenu />
        </div>
      </Container>
      
    </header>
  )
}
export default Header




















































































/*"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Navigation links config ───────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Planes", href: "/planes" },
  { label: "Sedes", href: "/sedes" },
  { label: "Tu espacio", href: "/blog" },
] as const;

// ───────────────────────────────────────────────────────────────────────────

export default function Header() {
  // Controls the mobile menu open/close state
  const [menuOpen, setMenuOpen] = useState(false);
  // Tracks whether the user has scrolled down to apply a shadow effect
  const [scrolled, setScrolled] = useState(false);

  // Add/remove scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when the window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={[
        // Sticky + backdrop blur for that frosted-glass feel
        "sticky top-0 z-50 w-full",
        "bg-zinc-950/90 backdrop-blur-md",
        // Subtle bottom border that intensifies on scroll
        scrolled
          ? "border-b border-yellow-400/20 shadow-[0_2px_24px_0_rgba(250,204,21,0.08)]"
          : "border-b border-white/5",
        "transition-all duration-300",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ─────────────────────────────────────────── }
          <Link
            href="/"
            className="group flex items-center gap-2 select-none"
            aria-label="FullForma – Ir al inicio"
          >
            {/* Decorative yellow bar accent }
            <span
              className="block h-7 w-1.5 rounded-sm bg-yellow-400 transition-all duration-300 group-hover:h-9"
              aria-hidden="true"
            />
            <span className="text-2xl font-black tracking-tighter text-white uppercase">
              Full
              <span className="text-yellow-400">Forma</span>
            </span>
          </Link>

          {/* ── Desktop Navigation ───────────────────────────── }
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Navegación principal"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "relative px-4 py-2 text-sm font-semibold uppercase tracking-wider",
                  "text-zinc-300 transition-colors duration-200 hover:text-yellow-400",
                  // Animated underline on hover
                  "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0",
                  "after:bg-yellow-400 after:transition-all after:duration-300 after:-translate-x-1/2",
                  "hover:after:w-4/5",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTA Buttons ───────────────────────────── }
          <div className="hidden md:flex items-center gap-3">
            {/* Secondary: Login }
            <Link
              href="/login"
              className={[
                "px-4 py-2 text-sm font-semibold uppercase tracking-wider rounded",
                "text-zinc-300 border border-zinc-700",
                "transition-all duration-200",
                "hover:border-yellow-400/60 hover:text-yellow-400",
              ].join(" ")}
            >
              Área de Clientes
            </Link>

            {/* Primary CTA: Sign up }
            <Link
              href="/inscribirse"
              className={[
                "px-5 py-2.5 text-sm font-black uppercase tracking-wider",
                "rounded bg-yellow-400 text-zinc-950",
                "transition-all duration-200",
                "hover:scale-105 hover:bg-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]",
                "active:scale-95",
              ].join(" ")}
            >
              ¡Inscríbete ya!
            </Link>
          </div>

          {/* ── Hamburger Button (mobile) ─────────────────────── }
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={[
              "md:hidden flex flex-col items-center justify-center gap-1.5 p-2 rounded",
              "text-zinc-300 transition-colors duration-200 hover:text-yellow-400",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400",
            ].join(" ")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {/* Three bars that animate into an X }
            <span
              className={[
                "block h-0.5 w-6 rounded-full bg-current transition-all duration-300 origin-center",
                menuOpen ? "translate-y-2 rotate-45" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block h-0.5 w-6 rounded-full bg-current transition-all duration-300",
                menuOpen ? "opacity-0 scale-x-0" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block h-0.5 w-6 rounded-full bg-current transition-all duration-300 origin-center",
                menuOpen ? "-translate-y-2 -rotate-45" : "",
              ].join(" ")}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ──────────────────────────────── }
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Menú móvil"
        className={[
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          "border-t border-white/5 bg-zinc-950",
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="flex flex-col px-4 pb-6 pt-4 gap-1">
          {/* Nav Links }
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={[
                "px-3 py-3 text-sm font-semibold uppercase tracking-wider rounded",
                "text-zinc-300 border-l-2 border-transparent",
                "transition-all duration-200",
                "hover:border-yellow-400 hover:text-yellow-400 hover:bg-yellow-400/5 hover:pl-5",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}

          {/* Divider }
          <div className="my-3 h-px bg-white/10" />

          {/* Mobile: Login }
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className={[
              "px-3 py-3 text-sm font-semibold uppercase tracking-wider rounded text-center",
              "text-zinc-300 border border-zinc-700",
              "transition-all duration-200 hover:border-yellow-400/60 hover:text-yellow-400",
            ].join(" ")}
          >
            Área de Clientes
          </Link>

          {/* Mobile: CTA }
          <Link
            href="/inscribirse"
            onClick={() => setMenuOpen(false)}
            className={[
              "mt-1 px-5 py-3.5 text-sm font-black uppercase tracking-wider text-center rounded",
              "bg-yellow-400 text-zinc-950",
              "transition-all duration-200 hover:bg-yellow-300 active:scale-95",
            ].join(" ")}
          >
            ¡Inscríbete ya!
          </Link>
        </div>
      </div>
    </header>
  );
}
*/