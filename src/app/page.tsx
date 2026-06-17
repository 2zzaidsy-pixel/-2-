import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Fields } from "@/components/sections/Fields"
import { Philosophy } from "@/components/sections/Philosophy"
import { FeaturedProjects } from "@/components/sections/FeaturedProjects"
import { Contact } from "@/components/sections/Contact"

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Fields />
      <Philosophy />
      <FeaturedProjects />
      <Contact />
    </>
  )
}
