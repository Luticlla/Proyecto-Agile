import React from "react";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import InfiniteScroll from '@/components/InfiniteScroll'

const Home = () => {
  return (
    <main>
      <HomeBanner />
      <section className="w-full py-2 flex justify-center px-2">
        <h2 className="font-arcade text-yellow-400 text-center text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed">
          Encuentra tu mejor <span className="text-white">versión</span> con nosotros
        </h2>
      </section>
      <InfiniteScroll />
      <Container>
      </Container>
    </main>
  )
}
export default Home;