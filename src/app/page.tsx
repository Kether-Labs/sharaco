import Hero from '@/features/home/components/Hero'
import FeaturesGrid from '@/features/home/components/FeaturesGrid'
import Testimonials from '@/features/home/components/Testimonials'
import PainPointsSection from '@/features/home/components/PainPointsSection'
import HowItWorksSection from '@/features/home/components/HowItWorksSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Hero />
      
      <FeaturesGrid />
      <HowItWorksSection />
      <PainPointsSection />
      
    </div>
  )
}
