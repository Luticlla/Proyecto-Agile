import Image from 'next/image'

const photos = [
  { before: '/images/before/Before_2.png', after: '/images/after/After_2.png' },
  { before: '/images/before/Before_3.png', after: '/images/after/After_3.png' },
  { before: '/images/before/Before_4.png', after: '/images/after/After_4.png' },
  { before: '/images/before/Before_5.png', after: '/images/after/After_5.png' },
]

const InfiniteScroll = () => {
  return (
    <section 
      className="w-full py-8 overflow-hidden max-w-[1200px] mx-auto rounded-2xl"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
      }}
    >
      <div className="flex animate-infinite-scroll gap-6 w-max">
        {[...photos, ...photos].map((pair, i) => (
          <div key={i} className="flex gap-2 flex-shrink-0">
            <div className="relative h-72 w-52 rounded-2xl overflow-hidden shadow-xl">
              <Image src={pair.before} alt={`antes ${i + 1}`} fill sizes="208px" className="object-cover" />
              <span className="absolute bottom-2 left-2 bg-black/70 text-white font-arcade text-[8px] px-2 py-1 rounded-lg">ANTES</span>
            </div>
            <div className="relative h-72 w-52 rounded-2xl overflow-hidden shadow-xl">
              <Image src={pair.after} alt={`despues ${i + 1}`} fill sizes="208px" className="object-cover" />
              <span className="absolute bottom-2 left-2 bg-gym-logo/80 text-black font-arcade text-[8px] px-2 py-1 rounded-lg">DESPUÉS</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default InfiniteScroll
