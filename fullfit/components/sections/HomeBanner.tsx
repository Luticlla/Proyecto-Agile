import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const HomeBanner = () => {
  return (
    <section className="w-full py-4 md:py-8 flex justify-center px-2 md:px-4">
      <div className="relative w-full max-w-[1600px] h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[70vh]">
        <Image 
          src="/images/banner-home.png" 
          alt="Full Forma Banner"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1600px) 100vw, 1600px"
          className="object-cover rounded-2xl md:rounded-[2rem] shadow-xl"
          priority
        />  
        <Link 
          href="/sedes"
          className="absolute top-3 right-3 sm:top-6 sm:right-6 md:top-10 md:right-10 lg:top-12 lg:right-12 
                     bg-red-600 hover:bg-primary hover:text-black text-white font-arcade 
                     text-[8px] sm:text-xs md:text-base lg:text-lg uppercase tracking-wider
                     py-2 px-3 sm:py-3 sm:px-6 md:py-4 md:px-8 
                     rounded-lg shadow-lg hover:shadow-2xl hoverEffect"
        >
          ¡Inscríbete ya!
        </Link>
      </div>
    </section>
  )
}

export default HomeBanner
