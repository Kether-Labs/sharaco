import Hero from '@/features/home/components/Hero'
import Testimonials from '@/features/home/components/Testimonials'
import PainPointsSection from '@/features/home/components/PainPointsSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 to-white dark:bg-slate-950">
      <Hero />
      <Testimonials />
      <PainPointsSection />
    </div>
  )
}
