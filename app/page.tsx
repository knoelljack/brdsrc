import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/ui/HeroSection';
import FilterBar from './components/ui/FilterBar';
import SurfboardGrid from './components/ui/SurfboardGrid';
import NearMeSection from './components/ui/NearMeSection';
import { surfboards } from './data/surfboards';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <NearMeSection />
        <div>
          <FilterBar />
          <SurfboardGrid boards={surfboards} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
